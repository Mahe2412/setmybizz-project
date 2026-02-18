import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user, businessData } = body;

        // CRM Webhook URL (Google Apps Script)
        // In production, this should be in .env.local
        const WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;

        if (!WEBHOOK_URL) {
            console.warn("CRM_WEBHOOK_URL is not defined. Skipping CRM submission.");
            return NextResponse.json({ success: false, message: "Webhook URL missing" });
        }

        // Prepare payload for Google Sheets
        // Assuming the Google Script expects a flattened object or specific structure
        const payload = {
            timestamp: new Date().toISOString(),
            // User Details
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || 'Guest',
            userPhone: user.phoneNumber || '',

            // Business Details
            businessName: businessData.name,
            industry: businessData.industry,
            sector: businessData.sector,
            size: businessData.size,
            stage: businessData.stage,
            offeringType: businessData.offeringType,
            description: businessData.description,
            motivation: businessData.motivation,

            // Arrays to string
            focusAreas: businessData.focusAreas?.join(', ') || '',
            existingAssets: businessData.existingAssets?.join(', ') || '',

            source: 'SetMyBizz_Onboarding'
        };

        // Send to Google Sheets
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Google Sheets responded with ${response.status}`);
        }

        return NextResponse.json({ success: true, message: "Data synced to CRM" });

    } catch (error) {
        console.error("Error submitting to CRM:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
