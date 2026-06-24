'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_BILLEASE_URL = '/billease';

export default function BilleaseTab() {
  const billeaseUrl = useMemo(
    () => `${DEFAULT_BILLEASE_URL}/dashboard`,
    []
  );
  const [loading, setLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasTimedOut(false);
  }, [billeaseUrl]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    setHasTimedOut(false);
  }, []);

  const handleBackToHome = () => {
    window.location.reload(); // Reload or dispatch event to focus back
  };

  return (
    <div className="-mx-3 -mt-3 md:-mx-5 md:-mt-5 flex h-[calc(100vh-6rem)] min-h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Fire custom event to switch OS activeTab to home
              const event = new CustomEvent('open-os-tab', { detail: 'home' });
              window.dispatchEvent(event);
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            ← Back to OS Home
          </button>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Bill Book</p>
            <p className="text-[10px] text-slate-500">
              Native internal billing engine (Prisma & SQLite).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && !hasTimedOut && (
            <span className="text-[10px] font-bold text-amber-600 animate-pulse">Loading…</span>
          )}
          <a
            href={billeaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
          >
            Open in new tab ↗
          </a>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-slate-50">
        {loading && !hasTimedOut && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6 text-center bg-slate-50/90">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p className="text-sm font-semibold text-slate-700">Starting Bill Book…</p>
            <p className="max-w-xs text-[11px] text-slate-500">
              Loading the unified database connection...
            </p>
          </div>
        )}



        <iframe
          title="Bill Book"
          src={billeaseUrl}
          className="h-full w-full border-0"
          loading="lazy"
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
