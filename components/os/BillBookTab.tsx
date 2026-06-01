'use client';

import BizBookDashboardEnhanced from '@/components/bizbook/BizBookDashboardEnhanced';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/**
 * Bill Book — GST billing inside BizOS (SetMyBizz).
 * Uses Supabase-backed BizBook engine (parties, items, invoices, expenses).
 */
export default function BillBookTab() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading Bill Book…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">📒</p>
        <h2 className="mt-3 text-xl font-black text-slate-900">Bill Book</h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to create GST invoices, track parties, items, and payments.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-3 -mt-3 md:-mx-5 md:-mt-5 h-[calc(100vh-8rem)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <BizBookDashboardEnhanced embedded productName="Bill Book" />
    </div>
  );
}
