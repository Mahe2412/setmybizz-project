import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.email || !data.phone) {
            return NextResponse.json(
                { error: 'Email and phone are required' },
                { status: 400 }
            );
        }

        // Save to Firestore
        const leadData = {
            ...data,
            timestamp: serverTimestamp(),
            status: 'new',
            source: 'global_incorporation'
        };

        const docRef = await addDoc(collection(db, 'global_leads'), leadData);

        // Also sync to CRM if needed
        try {
            await fetch(process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL || '', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...leadData,
                    leadId: docRef.id,
                    type: 'global_incorporation'
                })
            });
        } catch (crmError) {
            console.error('CRM sync failed:', crmError);
            // Don't fail the request if CRM sync fails
        }

        return NextResponse.json({
            success: true,
            leadId: docRef.id,
            message: 'Lead captured successfully'
        });

    } catch (error) {
        console.error('Error saving global lead:', error);
        return NextResponse.json(
            { error: 'Failed to save lead' },
            { status: 500 }
        );
    }
}
