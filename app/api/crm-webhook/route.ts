import { NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const { user, businessData, guestId } = await req.json();

    if (!user && !guestId) {
        return NextResponse.json({ error: "Missing identity" }, { status: 400 });
    }

    console.log('[CRM] Received lead update:', user?.uid || guestId);
    
    // 1. Google Sheets Sync
    // Format: [Date, Lead ID, Name, Phone, Email, Business Name, Industry, Status]
    const row = [
        new Date().toISOString(),
        user?.uid || guestId || 'Unknown',
        user?.displayName || 'Guest',
        businessData.contact?.phone || '',
        user?.email || '',
        businessData.name || '',
        businessData.industry || '',
        'New'
    ];

    const result = await appendToSheet(row);

    if (result) {
        return NextResponse.json({ success: true, message: 'CRM Sync Successful' });
    } else {
        return NextResponse.json({ success: false, error: 'Google Sheet Sync Failed' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[CRM] Sync Error:', error.message || error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
