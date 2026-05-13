import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const supabase = getSupabase();

        // Validate required fields
        if (!data.email || !data.phone || !data.businessName) {
            return NextResponse.json(
                { error: 'Business name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Check if lead already exists
        const { data: existingLead, error: fetchError } = await supabase
            .from('leads')
            .select('id')
            .eq('email', data.email)
            .single();

        if (existingLead) {
            // Lead exists, update it
            const { error: updateError } = await supabase
                .from('leads')
                .update({
                    ...data,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingLead.id);

            if (updateError) throw updateError;

            return NextResponse.json({
                success: true,
                leadId: existingLead.id,
                message: 'Lead updated successfully',
                existing: true
            });
        }

        // Create new lead
        const leadData = {
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: data.status || 'pending_registration'
        };

        const { data: newLead, error: insertError } = await supabase
            .from('leads')
            .insert(leadData)
            .select()
            .single();

        if (insertError) throw insertError;

        // Sync to CRM if webhook is configured
        try {
            if (process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL) {
                await fetch(process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...leadData,
                        leadId: newLead.id,
                        type: 'master_lead'
                    })
                });
            }
        } catch (crmError) {
            console.error('CRM sync failed:', crmError);
        }

        return NextResponse.json({
            success: true,
            leadId: newLead.id,
            message: 'Lead captured successfully'
        });

    } catch (error: any) {
        console.error('Error saving master lead to Supabase:', error);
        return NextResponse.json(
            { error: 'Failed to save lead', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const supabase = getSupabase();

        if (!data.email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find lead by email
        const { data: existingLead, error: fetchError } = await supabase
            .from('leads')
            .select('id')
            .eq('email', data.email)
            .single();

        if (!existingLead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        // Update the lead
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
                status: 'registered'
            })
            .eq('id', existingLead.id);

        if (updateError) throw updateError;

        // Update CRM
        try {
            if (process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL) {
                await fetch(process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        leadId: existingLead.id,
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
            leadId: existingLead.id,
            message: 'Lead updated to registered status'
        });

    } catch (error: any) {
        console.error('Error updating master lead in Supabase:', error);
        return NextResponse.json(
            { error: 'Failed to update lead', details: error.message },
            { status: 500 }
        );
    }
}

