'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_BILLEASE_URL = process.env.NEXT_PUBLIC_BILLEASE_URL || 'http://localhost:3000';

export default function BilleaseTab() {
  const billeaseUrl = useMemo(
    () => `${DEFAULT_BILLEASE_URL.replace(/\/$/, '')}/?embed=1`,
    []
  );
  const [loading, setLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasTimedOut(false);
    const timeout = window.setTimeout(() => setHasTimedOut(true), 20000);
    return () => window.clearTimeout(timeout);
  }, [billeaseUrl]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    setHasTimedOut(false);
  }, []);

  return (
    <div className="-mx-3 -mt-3 md:-mx-5 md:-mt-5 flex h-[calc(100vh-8rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-emerald-700">BillEase</p>
          <p className="text-[10px] text-slate-500">
            Standalone billing app from your local `billing-app` project.
          </p>
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
            <p className="text-sm font-semibold text-slate-700">Starting BillEase…</p>
            <p className="max-w-xs text-[11px] text-slate-500">
              Make sure your local billing app is running at <span className="font-medium">{DEFAULT_BILLEASE_URL}</span>.
            </p>
          </div>
        )}

        {hasTimedOut && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6 text-center bg-slate-50/95">
            <p className="text-sm font-bold text-slate-700">BillEase did not respond</p>
            <p className="max-w-sm text-xs text-slate-500">
              The standalone BillEase app is not available at the configured URL. Run the billing app and refresh, or open it directly in a new tab.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setHasTimedOut(false);
                }}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
              >
                Retry
              </button>
              <a
                href={billeaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Open BillEase in new tab
              </a>
            </div>
          </div>
        )}

        <iframe
          title="BillEase"
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
