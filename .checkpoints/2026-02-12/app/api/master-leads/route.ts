import { NextResponse } from 'next/server';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.email || !data.phone || !data.businessName) {
            return NextResponse.json(
                { error: 'Business name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Check if lead already exists
        const leadsRef = collection(db, 'master_leads');
        const q = query(leadsRef, where('email', '==', data.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Lead exists, update it
            const existingDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'master_leads', existingDoc.id), {
                ...data,
                updatedAt: serverTimestamp()
            });

            return NextResponse.json({
                success: true,
                leadId: existingDoc.id,
                message: 'Lead updated successfully',
                existing: true
            });
        }

        // Create new lead
        const leadData = {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: data.status || 'pending_registration'
        };

        const docRef = await addDoc(collection(db, 'master_leads'), leadData);

        // Sync to CRM if webhook is configured
        try {
            if (process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL) {
                await fetch(process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...leadData,
                        leadId: docRef.id,
                        type: 'master_lead'
                    })
                });
            }
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
        console.error('Error saving master lead:', error);
        return NextResponse.json(
            { error: 'Failed to save lead' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();

        if (!data.email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find lead by email
        const leadsRef = collection(db, 'master_leads');
        const q = query(leadsRef, where('email', '==', data.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        // Update the lead
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'master_leads', existingDoc.id), {
            ...data,
            updatedAt: serverTimestamp(),
            status: 'registered'
        });

        // Update CRM
        try {
            if (process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL) {
                await fetch(process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        leadId: existingDoc.id,
                        type: 'lead_converted',
                        action: 'account_created'
                    })
                });
            }
        } catch (crmError) {
            console.error('CRM sync failed:', crmError);
        }

        return NextResponse.json({
            success: true,
            leadId: existingDoc.id,
            message: 'Lead updated to registered status'
        });

    } catch (error) {
        console.error('Error updating master lead:', error);
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}
