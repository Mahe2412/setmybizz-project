import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const documentId = resolvedParams.id;
    if (!documentId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    if (doc.type !== 'quotation') {
      return NextResponse.json({ error: 'Document is not a quotation' }, { status: 400 });
    }

    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: {
        type: 'invoice',
        status: 'draft',
        convertedFromId: doc.id,
      }
    });

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error('Error converting quotation:', error);
    return NextResponse.json({ error: 'Failed to convert quotation' }, { status: 500 });
  }
}
