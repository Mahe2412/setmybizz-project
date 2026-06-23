/**
 * ═══════════════════════════════════════════════════════════════
 *  FILE UPLOAD API — Handles document uploads + triggers OCR
 *  POST: Upload file → Save to disk → Extract via Gemini OCR
 *  GET:  List uploaded documents for a profile
 * ═══════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getOCREngine, TaxDocType } from '@/agents/itr_agent/ocr-engine';

const prisma = new PrismaClient();

// Upload directory (inside project, gitignored)
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'tax-documents');

/**
 * POST — Upload a document file
 * FormData: file, profileId, documentType (optional, auto-detected)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const profileId = formData.get('profileId') as string;
    const docType = formData.get('documentType') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });
    }

    // Verify profile exists
    const profile = await prisma.taxProfile.findUnique({ where: { id: profileId } });
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    // Create upload directory if it doesn't exist
    const profileDir = path.join(UPLOAD_DIR, profileId);
    if (!existsSync(profileDir)) {
      await mkdir(profileDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name) || '.pdf';
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = path.join(profileDir, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Auto-detect or use provided document type
    const ocr = getOCREngine();
    let detectedType: TaxDocType = (docType as TaxDocType) || 'OTHER';

    if (!docType || docType === 'AUTO') {
      detectedType = await ocr.detectDocumentType(filePath);
    }

    // Run OCR extraction
    const extractionResult = await ocr.extractFromFile(filePath, detectedType);

    // Save document record to database
    const document = await prisma.taxDocument.create({
      data: {
        taxProfileId: profileId,
        documentType: detectedType,
        fileUrl: `/uploads/tax-documents/${profileId}/${fileName}`,
        extractedData: JSON.stringify(extractionResult.data),
        status: (extractionResult.data as any)?.parseError ? 'ERROR' : 'EXTRACTED',
      },
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        documentType: detectedType,
        fileName: file.name,
        fileSize: buffer.length,
        status: document.status,
        extractedData: extractionResult.data,
      },
    });
  } catch (error: any) {
    console.error('[Upload] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET — List documents for a profile
 * ?profileId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });
    }

    const documents = await prisma.taxDocument.findMany({
      where: { taxProfileId: profileId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        fileUrl: doc.fileUrl,
        status: doc.status,
        extractedData: doc.extractedData ? JSON.parse(doc.extractedData) : null,
        createdAt: doc.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
