/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE BATCH PROCESSOR — Parallel Pipeline Executor
 *  Manages: Queue, parallel execution, progress tracking,
 *           priority sorting, deadline awareness
 * ═══════════════════════════════════════════════════════════════
 */

import { PrismaClient } from '@prisma/client';
import { ComplianceAgent } from './agent';

const prisma = new PrismaClient();

// ─── Types ──────────────────────────────────────────────────────

export type BatchStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PARTIAL' | 'FAILED';

export interface BatchJob {
  id: string;
  filingId: string;
  profileId: string;
  clientName: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'OTP_WAITING' | 'ERROR';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  ackNumber?: string;
}

export interface BatchRunResult {
  batchId: string;
  status: BatchStatus;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  otpWaitingJobs: number;
  pendingJobs: number;
  jobs: BatchJob[];
  startedAt: Date;
  completedAt?: Date;
  duration?: number;       // in seconds
}

// ═══════════════════════════════════════════════════════════════
//  BATCH PROCESSOR CLASS
// ═══════════════════════════════════════════════════════════════

export class BatchProcessor {
  private concurrency: number;
  private batchId: string;
  private jobs: BatchJob[] = [];
  private running = false;

  constructor(concurrency = 3) {
    this.concurrency = concurrency;
    this.batchId = `BATCH-${Date.now().toString(36).toUpperCase()}`;
  }

  /**
   * Queue all DRAFT filings for processing
   */
  async queueAllPending(filingType?: string): Promise<BatchJob[]> {
    const where: any = { status: 'DRAFT' };
    if (filingType) where.type = filingType;

    const filings = await prisma.taxFiling.findMany({
      where,
      include: { taxProfile: true },
      orderBy: { createdAt: 'asc' },
    });

    this.jobs = filings.map((f) => ({
      id: `JOB-${f.id.slice(-6)}`,
      filingId: f.id,
      profileId: f.taxProfileId,
      clientName: f.taxProfile?.clientName || 'Unknown',
      status: 'PENDING' as const,
      progress: 0,
    }));

    console.log(`[Batch] Queued ${this.jobs.length} filings for processing.`);
    return this.jobs;
  }

  /**
   * Queue specific filing IDs
   */
  async queueSpecific(filingIds: string[]): Promise<BatchJob[]> {
    const filings = await prisma.taxFiling.findMany({
      where: { id: { in: filingIds } },
      include: { taxProfile: true },
    });

    this.jobs = filings.map((f) => ({
      id: `JOB-${f.id.slice(-6)}`,
      filingId: f.id,
      profileId: f.taxProfileId,
      clientName: f.taxProfile?.clientName || 'Unknown',
      status: 'PENDING' as const,
      progress: 0,
    }));

    return this.jobs;
  }

  /**
   * Execute batch with controlled concurrency
   */
  async executeBatch(
    onProgress?: (result: BatchRunResult) => void
  ): Promise<BatchRunResult> {
    this.running = true;
    const startedAt = new Date();

    console.log(`[Batch] ═══ Starting batch ${this.batchId} with ${this.jobs.length} jobs, concurrency=${this.concurrency} ═══`);

    // Process in chunks of `concurrency` size
    const chunks = this.chunkArray(this.jobs, this.concurrency);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`[Batch] Processing chunk ${i + 1}/${chunks.length} (${chunk.length} jobs)...`);

      // Execute chunk in parallel
      await Promise.all(
        chunk.map((job) => this.executeJob(job))
      );

      // Report progress
      if (onProgress) {
        onProgress(this.getResult(startedAt));
      }
    }

    this.running = false;
    const result = this.getResult(startedAt);
    result.completedAt = new Date();
    result.duration = Math.round((result.completedAt.getTime() - startedAt.getTime()) / 1000);

    console.log(`[Batch] ═══ Batch ${this.batchId} complete. ${result.completedJobs}/${result.totalJobs} succeeded. Duration: ${result.duration}s ═══`);

    return result;
  }

  /**
   * Execute a single job
   */
  private async executeJob(job: BatchJob): Promise<void> {
    job.status = 'RUNNING';
    job.startedAt = new Date();

    try {
      console.log(`[Batch] [${job.id}] Starting pipeline for ${job.clientName}...`);

      const agent = new ComplianceAgent(job.filingId);
      const state = await agent.runPipeline();

      job.progress = state.progress;

      if (state.status === 'COMPLETED') {
        job.status = 'COMPLETED';
        job.ackNumber = state.data.ackNumber;
        job.completedAt = new Date();
        console.log(`[Batch] [${job.id}] ✅ ${job.clientName} — Filed. ACK: ${job.ackNumber}`);
      } else if (state.status === 'INTERRUPTED') {
        job.status = 'OTP_WAITING';
        console.log(`[Batch] [${job.id}] ⏸️ ${job.clientName} — Waiting for OTP`);
      } else if (state.status === 'ERROR') {
        job.status = 'ERROR';
        job.error = state.logs[state.logs.length - 1]?.message || 'Unknown error';
        console.log(`[Batch] [${job.id}] ❌ ${job.clientName} — Error: ${job.error}`);
      }
    } catch (error: any) {
      job.status = 'ERROR';
      job.error = error.message;
      console.error(`[Batch] [${job.id}] ❌ ${job.clientName} — Crashed: ${error.message}`);
    }
  }

  /**
   * Resume OTP-waiting jobs with provided OTPs
   */
  async resumeWithOTPs(otpMap: Record<string, string>): Promise<BatchRunResult> {
    const startedAt = new Date();
    const otpJobs = this.jobs.filter((j) => j.status === 'OTP_WAITING' && otpMap[j.filingId]);

    for (const job of otpJobs) {
      job.status = 'RUNNING';
      try {
        const agent = new ComplianceAgent(job.filingId);
        const state = await agent.runPipeline(otpMap[job.filingId]);

        if (state.status === 'COMPLETED') {
          job.status = 'COMPLETED';
          job.ackNumber = state.data.ackNumber;
          job.completedAt = new Date();
        } else {
          job.status = 'ERROR';
          job.error = 'Failed after OTP';
        }
      } catch (error: any) {
        job.status = 'ERROR';
        job.error = error.message;
      }
    }

    return this.getResult(startedAt);
  }

  /**
   * Get current batch result
   */
  public getResult(startedAt: Date): BatchRunResult {
    return {
      batchId: this.batchId,
      status: this.getBatchStatus(),
      totalJobs: this.jobs.length,
      completedJobs: this.jobs.filter((j) => j.status === 'COMPLETED').length,
      failedJobs: this.jobs.filter((j) => j.status === 'ERROR').length,
      otpWaitingJobs: this.jobs.filter((j) => j.status === 'OTP_WAITING').length,
      pendingJobs: this.jobs.filter((j) => j.status === 'PENDING').length,
      jobs: [...this.jobs],
      startedAt,
    };
  }

  getStatus(): BatchRunResult {
    return this.getResult(new Date());
  }

  private getBatchStatus(): BatchStatus {
    if (this.jobs.every((j) => j.status === 'COMPLETED')) return 'COMPLETED';
    if (this.jobs.some((j) => j.status === 'COMPLETED')) return 'PARTIAL';
    if (this.jobs.every((j) => j.status === 'ERROR')) return 'FAILED';
    if (this.running) return 'RUNNING';
    return 'QUEUED';
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
}
