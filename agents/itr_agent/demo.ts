/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE CA AGENT — End-to-End Demo Runner
 *  Tests the full 7-node compliance pipeline
 * ═══════════════════════════════════════════════════════════════
 */

import { PrismaClient } from '@prisma/client';
import { ComplianceAgent } from './agent';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || 'file:./prisma/dev.db' } },
});

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   🧠 ARKLE CA AGI AGENT — DEMO PIPELINE RUN          ║');
  console.log('║   SetMyBizz & Mahendra Associates                     ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // ─── Step 1: Create a demo client ─────────────────────────

  const profile = await prisma.taxProfile.upsert({
    where: { id: 'demo-arkle-v2' },
    update: {},
    create: {
      id: 'demo-arkle-v2',
      clientName: 'Sri Venkateswara Traders',
      clientPhone: '+91 94400 12345',
      clientEmail: 'svtraders@mahendra.co',
      pan: 'ABCDE1234F',
      gstin: '37ABCDE1234F1Z5',
      defaultRegime: 'NEW',
    },
  });
  console.log(`✅ Client Profile: ${profile.clientName} (${profile.pan})\n`);

  // Add mock documents
  await prisma.taxDocument.create({
    data: { taxProfileId: profile.id, documentType: 'FORM_16', status: 'PENDING' },
  });
  await prisma.taxDocument.create({
    data: { taxProfileId: profile.id, documentType: 'BANK_STATEMENT', status: 'PENDING' },
  });
  console.log('✅ Uploaded 2 mock documents (Form-16, Bank Statement)\n');

  // Create filing session
  const filing = await prisma.taxFiling.create({
    data: {
      taxProfileId: profile.id,
      type: 'ITR',
      period: 'FY-2025-26',
      status: 'DRAFT',
    },
  });
  console.log(`✅ Filing Session: ${filing.id} | Type: ${filing.type} | Period: ${filing.period}\n`);

  // ─── Step 2: Run Pipeline (will stop at OTP) ──────────────

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🔄 PHASE 1: Running pipeline (INIT → PORTAL_LOGIN)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const agent = new ComplianceAgent(filing.id);
  let state = await agent.runPipeline();

  console.log(`\n📊 Status: ${state.status}`);
  console.log(`📍 Node: ${state.currentNode}`);
  console.log(`📈 Progress: ${state.progress}%`);

  if (state.status === 'INTERRUPTED') {
    console.log(`⚠️  Reason: ${state.interruptionReason}`);
    console.log(`📲 In production → WhatsApp/Voice AI call to ${profile.clientPhone}\n`);
  }

  // ─── Step 3: Resume with OTP ──────────────────────────────

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🔑 PHASE 2: Client provides OTP → Resuming pipeline');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  state = await agent.runPipeline('739201');

  console.log(`\n📊 Final Status: ${state.status}`);
  console.log(`📍 Final Node: ${state.currentNode}`);
  console.log(`📈 Progress: ${state.progress}%`);

  if (state.data.ackNumber) {
    console.log(`🏆 Acknowledgment: ${state.data.ackNumber}`);
  }

  if (state.data.taxResult) {
    const r = state.data.taxResult;
    console.log(`\n╔═══ TAX COMPUTATION SUMMARY ══════════════════════════╗`);
    console.log(`║ Old Regime Tax:  ₹${r.oldRegime.totalTaxLiability.toLocaleString('en-IN').padStart(10)}`);
    console.log(`║ New Regime Tax:  ₹${r.newRegime.totalTaxLiability.toLocaleString('en-IN').padStart(10)}`);
    console.log(`║ Recommended:     ${r.recommended} Regime`);
    console.log(`║ Tax Savings:     ₹${r.savings.toLocaleString('en-IN').padStart(10)}`);
    console.log(`║ ITR Form:        ${state.data.itrForm}`);
    console.log(`╚══════════════════════════════════════════════════════╝`);

    if (r.tips?.length > 0) {
      console.log('\n💡 Smart Tax-Saving Tips:');
      r.tips.forEach((t: string, i: number) => console.log(`   ${i + 1}. ${t}`));
    }
  }

  console.log('\n✅ Demo completed successfully.\n');
}

main()
  .catch((e) => console.error('❌ Demo Error:', e))
  .finally(async () => await prisma.$disconnect());
