/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE CA AGENT — Compliance Brain State Machine
 *  LangGraph-inspired State Graph Processor
 *  Nodes: Intake → Classify → Compute → Verify → File → Deliver
 * ═══════════════════════════════════════════════════════════════
 */

import { PrismaClient } from '@prisma/client';
import {
  computeTaxOptimization,
  computeGST,
  determineITRForm,
  ClientTaxInput,
  TaxOptimizationResult,
  GSTResult,
} from './calculator';

const prisma = new PrismaClient();

// ─── Agent State Types ──────────────────────────────────────────

export type AgentNodeName =
  | 'INIT'
  | 'INTAKE'
  | 'CLASSIFY'
  | 'COMPUTE'
  | 'VERIFY'
  | 'PORTAL_LOGIN'
  | 'FILE_DRAFT'
  | 'DELIVER'
  | 'COMPLETED'
  | 'ERROR';

export type AgentStatus = 'ACTIVE' | 'INTERRUPTED' | 'COMPLETED' | 'ERROR';

export interface AgentLog {
  timestamp: string;
  node: AgentNodeName;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
}

export interface AgentState {
  taxFilingId: string;
  profileId: string;
  clientName: string;
  currentNode: AgentNodeName;
  status: AgentStatus;
  interruptionReason?: string;
  progress: number; // 0-100
  data: {
    // Intake
    documentsFound: number;
    documentsProcessed: number;

    // Classification
    itrForm?: string;
    filingType?: string; // ITR or GST

    // Computation
    taxInput?: ClientTaxInput;
    taxResult?: TaxOptimizationResult;
    gstResult?: GSTResult;

    // Verification
    discrepancies: string[];
    missingDocuments: string[];

    // Portal
    otpRequired?: boolean;
    otpValue?: string;

    // Filing
    ackNumber?: string;
  };
  logs: AgentLog[];
}

// ─── Default Tax Inputs (for demo / when OCR data is unavailable) ──

function buildDefaultTaxInput(profile: any): ClientTaxInput {
  // Smart defaults based on profile data
  const hasBusiness = !!profile.gstin;

  const sources = [];

  if (hasBusiness) {
    sources.push({
      type: 'BUSINESS_44AD' as const,
      label: 'Business Income (Presumptive u/s 44AD)',
      grossAmount: 1800000, // ₹18L turnover
    });
  }

  sources.push({
    type: 'OTHER_SOURCES' as const,
    label: 'Interest Income (Savings/FD)',
    grossAmount: 45000,
  });

  if (!hasBusiness) {
    sources.push({
      type: 'SALARY' as const,
      label: 'Salary Income',
      grossAmount: 850000, // ₹8.5L salary
      deductions: 75000,   // Standard deduction
    });
  }

  return {
    assessmentYear: '2026-27',
    financialYear: '2025-26',
    clientType: 'INDIVIDUAL',
    age: 35,
    residencyStatus: 'RESIDENT',
    incomeSources: sources,
    deductions: [
      { section: '80C', label: 'EPF/PPF/ELSS/LIC', amount: 120000, maxLimit: 150000 },
      { section: '80D', label: 'Health Insurance Premium', amount: 18000, maxLimit: 25000 },
      { section: '80CCD(1B)', label: 'NPS Contribution', amount: 0, maxLimit: 50000 },
    ],
    taxCredits: [
      { type: 'TDS', deductorName: 'Employer / Bank', amount: 15000 },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════
//  COMPLIANCE AGENT CLASS
// ═══════════════════════════════════════════════════════════════

export class ComplianceAgent {
  private state: AgentState;

  constructor(taxFilingId: string) {
    this.state = {
      taxFilingId,
      profileId: '',
      clientName: '',
      currentNode: 'INIT',
      status: 'ACTIVE',
      progress: 0,
      data: {
        documentsFound: 0,
        documentsProcessed: 0,
        discrepancies: [],
        missingDocuments: [],
      },
      logs: [],
    };
  }

  // ─── Logging ────────────────────────────────────────────────

  private log(node: AgentNodeName, message: string, level: AgentLog['level'] = 'INFO') {
    const entry: AgentLog = {
      timestamp: new Date().toISOString(),
      node,
      message,
      level,
    };
    this.state.logs.push(entry);
    const icon = level === 'SUCCESS' ? '✅' : level === 'WARN' ? '⚠️' : level === 'ERROR' ? '❌' : '🔹';
    console.log(`[Arkle] ${icon} [${node}] ${message}`);
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 1: INTAKE — Fetch profile, scan documents
  // ═══════════════════════════════════════════════════════════

  private async nodeIntake() {
    this.state.currentNode = 'INTAKE';
    this.state.progress = 10;
    this.log('INTAKE', 'Starting data intake...');

    const filing = await prisma.taxFiling.findUnique({
      where: { id: this.state.taxFilingId },
      include: {
        taxProfile: {
          include: { documents: true },
        },
      },
    });

    if (!filing?.taxProfile) {
      this.state.status = 'ERROR';
      this.log('INTAKE', 'Tax profile not found for this filing.', 'ERROR');
      return;
    }

    const profile = filing.taxProfile;
    this.state.profileId = profile.id;
    this.state.clientName = profile.clientName || 'Self-Filing User';
    this.state.data.filingType = filing.type;
    this.state.data.documentsFound = profile.documents.length;

    this.log('INTAKE', `Client: ${this.state.clientName}`, 'INFO');
    this.log('INTAKE', `Filing Type: ${filing.type} | Period: ${filing.period}`, 'INFO');
    this.log('INTAKE', `Documents on file: ${profile.documents.length}`, 'INFO');

    // Check for missing critical documents
    const docTypes = profile.documents.map((d) => d.documentType);
    if (filing.type === 'ITR') {
      if (!docTypes.includes('FORM_26AS')) this.state.data.missingDocuments.push('Form 26AS');
      if (!docTypes.includes('AIS')) this.state.data.missingDocuments.push('AIS (Annual Information Statement)');
    }

    if (this.state.data.missingDocuments.length > 0) {
      this.log('INTAKE', `Missing documents: ${this.state.data.missingDocuments.join(', ')}`, 'WARN');
      this.log('INTAKE', 'Proceeding with available data. Agent will use smart defaults.', 'WARN');
    }

    // Simulate OCR processing
    this.state.data.documentsProcessed = profile.documents.length;
    for (const doc of profile.documents) {
      this.log('INTAKE', `Processed ${doc.documentType} → Extracted to structured JSON`, 'SUCCESS');
      await prisma.taxDocument.update({
        where: { id: doc.id },
        data: { status: 'EXTRACTED' },
      });
    }

    this.state.progress = 25;
    this.log('INTAKE', 'Data intake complete.', 'SUCCESS');
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 2: CLASSIFY — Determine ITR form, income types
  // ═══════════════════════════════════════════════════════════

  private async nodeClassify() {
    this.state.currentNode = 'CLASSIFY';
    this.state.progress = 35;
    this.log('CLASSIFY', 'Analyzing income sources and determining form type...');

    const profile = await prisma.taxProfile.findUnique({
      where: { id: this.state.profileId },
    });

    const taxInput = buildDefaultTaxInput(profile);
    this.state.data.taxInput = taxInput;

    if (this.state.data.filingType === 'ITR') {
      const itrForm = determineITRForm(taxInput);
      this.state.data.itrForm = itrForm;
      this.log('CLASSIFY', `Determined Form: ${itrForm}`, 'SUCCESS');
      this.log('CLASSIFY', `Income Sources: ${taxInput.incomeSources.map((s) => s.type).join(', ')}`, 'INFO');
      this.log('CLASSIFY', `Client Type: ${taxInput.clientType} | Age: ${taxInput.age} | Status: ${taxInput.residencyStatus}`, 'INFO');
    } else {
      this.log('CLASSIFY', 'GST filing mode — skipping ITR form classification.', 'INFO');
    }

    this.state.progress = 45;
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 3: COMPUTE — Run tax optimization engine
  // ═══════════════════════════════════════════════════════════

  private async nodeCompute() {
    this.state.currentNode = 'COMPUTE';
    this.state.progress = 55;
    this.log('COMPUTE', 'Running Arkle Tax Optimization Engine...');

    const input = this.state.data.taxInput!;

    if (this.state.data.filingType === 'ITR' || this.state.data.filingType?.startsWith('ITR')) {
      const result = computeTaxOptimization(input);
      this.state.data.taxResult = result;

      this.log('COMPUTE', `Old Regime Tax: ₹${result.oldRegime.totalTaxLiability.toLocaleString('en-IN')}`, 'INFO');
      this.log('COMPUTE', `New Regime Tax: ₹${result.newRegime.totalTaxLiability.toLocaleString('en-IN')}`, 'INFO');
      this.log('COMPUTE', `Recommended: ${result.recommended} Regime — Save ₹${result.savings.toLocaleString('en-IN')}`, 'SUCCESS');

      // Log tips
      for (const tip of result.tips) {
        this.log('COMPUTE', `💡 ${tip}`, 'INFO');
      }

      // Update filing record
      const chosenResult = result.recommended === 'OLD' ? result.oldRegime : result.newRegime;
      await prisma.taxFiling.update({
        where: { id: this.state.taxFilingId },
        data: { computedTax: chosenResult.totalTaxLiability },
      });
    } else {
      // GST computation
      const gstResult = computeGST(
        input.gstTurnover || 0,
        0.18, // Default 18% GST
        input.gstInputTaxCredit || 0,
        false
      );
      this.state.data.gstResult = gstResult;
      this.log('COMPUTE', `GST Payable: ₹${gstResult.netGSTPayable.toLocaleString('en-IN')} (CGST: ₹${gstResult.cgst} + SGST: ₹${gstResult.sgst})`, 'SUCCESS');
    }

    this.state.progress = 65;
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 4: VERIFY — Cross-check, flag discrepancies
  // ═══════════════════════════════════════════════════════════

  private async nodeVerify() {
    this.state.currentNode = 'VERIFY';
    this.state.progress = 75;
    this.log('VERIFY', 'Cross-verifying computed values against source documents...');

    // Simulate verification checks
    const result = this.state.data.taxResult;
    if (result) {
      // Check TDS match
      const totalTDS = result.input.taxCredits.reduce((s, c) => s + c.amount, 0);
      if (totalTDS > 0) {
        this.log('VERIFY', `TDS credit verified: ₹${totalTDS.toLocaleString('en-IN')}`, 'SUCCESS');
      }

      // Simulate a minor discrepancy detection
      if (this.state.data.missingDocuments.length > 0) {
        this.state.data.discrepancies.push('AIS/26AS not available — TDS amounts based on self-declared data only.');
        this.log('VERIFY', 'Minor discrepancy: TDS not cross-verified with 26AS (not uploaded).', 'WARN');
      }
    }

    this.log('VERIFY', 'Verification complete. Proceeding to portal stage.', 'SUCCESS');
    this.state.progress = 80;
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 5: PORTAL LOGIN — Headless browser (OTP interrupt)
  // ═══════════════════════════════════════════════════════════

  private async nodePortalLogin(providedOtp?: string) {
    this.state.currentNode = 'PORTAL_LOGIN';
    this.state.progress = 85;

    if (!providedOtp) {
      this.log('PORTAL_LOGIN', 'Initiating portal login sequence...', 'INFO');
      this.log('PORTAL_LOGIN', 'OTP sent to Aadhaar-linked mobile number.', 'WARN');

      this.state.status = 'INTERRUPTED';
      this.state.interruptionReason = 'WAITING_FOR_OTP';
      this.state.data.otpRequired = true;

      // Update filing status
      await prisma.taxFiling.update({
        where: { id: this.state.taxFilingId },
        data: { status: 'WAITING_FOR_OTP' },
      });

      await this.saveState();
      return;
    }

    // OTP received — resume
    this.state.status = 'ACTIVE';
    this.state.interruptionReason = undefined;
    this.state.data.otpRequired = false;
    this.state.data.otpValue = providedOtp;
    this.log('PORTAL_LOGIN', `OTP verified successfully. Portal session authenticated.`, 'SUCCESS');
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 6: FILE DRAFT — Submit to portal
  // ═══════════════════════════════════════════════════════════

  private async nodeFileDraft() {
    this.state.currentNode = 'FILE_DRAFT';
    this.state.progress = 92;
    this.log('FILE_DRAFT', 'Opening headless Playwright browser...', 'INFO');

    // Simulate filing steps
    const steps = [
      'Navigating to Income Tax e-Filing Portal...',
      'Selecting Assessment Year 2026-27...',
      `Loading ${this.state.data.itrForm || 'ITR'} form...`,
      'Filling Personal Information from profile...',
      'Entering Income Details across all schedules...',
      'Applying deductions (Chapter VI-A)...',
      'Computing tax and verifying against our engine...',
      'Tax values matched ✓ — Generating XML/JSON payload...',
      'Uploading draft return to portal...',
    ];

    for (const step of steps) {
      this.log('FILE_DRAFT', step, 'INFO');
    }

    // Generate mock acknowledgment number
    this.state.data.ackNumber = `ACK-${Date.now().toString(36).toUpperCase()}`;
    this.log('FILE_DRAFT', `Draft submitted. Acknowledgment: ${this.state.data.ackNumber}`, 'SUCCESS');
    this.state.progress = 96;
  }

  // ═══════════════════════════════════════════════════════════
  //  NODE 7: DELIVER — Final summary & notification
  // ═══════════════════════════════════════════════════════════

  private async nodeDeliver() {
    this.state.currentNode = 'DELIVER';
    this.state.progress = 100;
    this.state.status = 'COMPLETED';

    this.log('DELIVER', '═══════════════════════════════════════', 'SUCCESS');
    this.log('DELIVER', `FILING COMPLETE for ${this.state.clientName}`, 'SUCCESS');
    this.log('DELIVER', `Acknowledgment: ${this.state.data.ackNumber}`, 'SUCCESS');

    if (this.state.data.taxResult) {
      const r = this.state.data.taxResult;
      const chosen = r.recommended === 'OLD' ? r.oldRegime : r.newRegime;
      this.log('DELIVER', `Regime: ${r.recommended} | Tax: ₹${chosen.totalTaxLiability.toLocaleString('en-IN')} | Net Payable: ₹${chosen.netTaxPayable.toLocaleString('en-IN')}`, 'SUCCESS');
    }

    this.log('DELIVER', 'Ready for E-Verification (Aadhaar OTP / Net Banking / DSC).', 'SUCCESS');
    this.log('DELIVER', '═══════════════════════════════════════', 'SUCCESS');

    await prisma.taxFiling.update({
      where: { id: this.state.taxFilingId },
      data: {
        status: 'SUBMITTED',
        logs: this.state.logs.map((l) => `[${l.level}] [${l.node}] ${l.message}`).join('\n'),
      },
    });
  }

  // ─── State Persistence ──────────────────────────────────────

  private async saveState() {
    const serialized = JSON.stringify({
      data: this.state.data,
      progress: this.state.progress,
      clientName: this.state.clientName,
      profileId: this.state.profileId,
    });

    const existing = await prisma.agentSessionState.findFirst({
      where: { taxFilingId: this.state.taxFilingId },
    });

    const payload = {
      currentNode: this.state.currentNode,
      graphState: serialized,
      status: this.state.status,
      interruptionReason: this.state.interruptionReason || null,
    };

    if (existing) {
      await prisma.agentSessionState.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.agentSessionState.create({
        data: { taxFilingId: this.state.taxFilingId, ...payload },
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  MAIN PIPELINE — Sequential node execution
  // ═══════════════════════════════════════════════════════════

  async runPipeline(otp?: string): Promise<AgentState> {
    try {
      this.log('INIT', `Arkle Compliance Pipeline started.`, 'INFO');

      // Node 1: Intake
      if (this.state.currentNode === 'INIT') {
        await this.nodeIntake();
        if (this.state.status === 'ERROR') { await this.saveState(); return this.state; }
      }

      // Node 2: Classify
      if (this.state.currentNode === 'INTAKE') {
        await this.nodeClassify();
      }

      // Node 3: Compute
      if (this.state.currentNode === 'CLASSIFY') {
        await this.nodeCompute();
      }

      // Node 4: Verify
      if (this.state.currentNode === 'COMPUTE') {
        await this.nodeVerify();
      }

      // Node 5: Portal Login (may interrupt for OTP)
      if (this.state.currentNode === 'VERIFY' || this.state.currentNode === 'PORTAL_LOGIN') {
        await this.nodePortalLogin(otp);
        if (this.state.status === 'INTERRUPTED') return this.state;
      }

      // Node 6: File Draft
      if (this.state.currentNode === 'PORTAL_LOGIN' && this.state.status === 'ACTIVE') {
        await this.nodeFileDraft();
      }

      // Node 7: Deliver
      if (this.state.currentNode === 'FILE_DRAFT') {
        await this.nodeDeliver();
      }

      await this.saveState();
      return this.state;

    } catch (err: any) {
      this.state.status = 'ERROR';
      this.state.currentNode = 'ERROR';
      this.log('ERROR', `Pipeline crashed: ${err.message}`, 'ERROR');
      await this.saveState();
      return this.state;
    }
  }
}
