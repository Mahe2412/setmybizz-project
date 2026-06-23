import { NextRequest, NextResponse } from 'next/server';
import { BatchProcessor } from '@/agents/itr_agent/batch-processor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const processor = new BatchProcessor(3); // 3 concurrent

    if (action === 'queue_all') {
      const result = await processor.queueAllPending();
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'queue_specific') {
      const { profileIds } = body;
      const result = await processor.queueSpecific(profileIds);
      return NextResponse.json({ success: true, jobs: result });
    }

    if (action === 'resume_otps') {
      const { otpMap } = body; // { profileId: otp, ... }
      const result = await processor.resumeWithOTPs(otpMap);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const processor = new BatchProcessor(3);
    const status = processor.getStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
