import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const isAdmin = searchParams.get('admin') === 'true';

    const sb = getSupabase();
    let query = sb.from('gst_requests').select('*').order('created_at', { ascending: false });

    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, requests: data || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const sb = getSupabase();

    if (action === 'create_draft' || action === 'save') {
      const {
        id, user_id, gstin, business_name, month,
        total_sales, cgst, sgst, igst, status,
        ai_insights, ai_errors, amount
      } = body;

      const payload = {
        user_id, gstin, business_name, month,
        total_sales: total_sales || 0,
        cgst: cgst || 0,
        sgst: sgst || 0,
        igst: igst || 0,
        status: status || 'draft',
        amount: amount || 499,
        ai_insights: ai_insights || [],
        ai_errors: ai_errors || [],
        updated_at: new Date().toISOString()
      };

      let result;
      if (id) {
        result = await sb.from('gst_requests').update(payload).eq('id', id).select().single();
      } else {
        result = await sb.from('gst_requests').insert([payload]).select().single();
      }

      if (result.error) throw result.error;
      return NextResponse.json({ success: true, request: result.data });
    }

    if (action === 'update_status') {
      const { request_id, status, payment_id } = body;
      const updatePayload: any = { status, updated_at: new Date().toISOString() };
      if (payment_id) updatePayload.payment_id = payment_id;

      const { data, error } = await sb.from('gst_requests').update(updatePayload).eq('id', request_id).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, request: data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
