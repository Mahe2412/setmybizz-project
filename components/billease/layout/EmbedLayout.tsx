"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "./AppShell";

function EmbedLayoutInner({
  children,
  businessName,
}: {
  children: React.ReactNode;
  businessName?: string | null;
}) {
  const searchParams = useSearchParams();
  const isEmbedQuery = searchParams?.get("embed") === "1";
  const inIframe = typeof window !== "undefined" && window.self !== window.top;
  const embed = isEmbedQuery || inIframe;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("localhost") && !event.origin.includes("vercel.app") && !event.origin.includes("setmybizz")) {
        return;
      }
      const payload = event.data;
      if (!payload || typeof payload !== "object") return;
      const { action, data } = payload;
      
      if (action === "CREATE_INVOICE_DRAFT" || action === "ADD_LINE_ITEM" || action === "SET_PARTY") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/invoices/new") {
          sessionStorage.setItem("pending_invoice_command", JSON.stringify(payload));
          window.location.href = "/invoices/new?embed=1";
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (embed) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
          <span className="text-sm font-bold text-blue-600">Bill Book</span>
          <span className="max-w-[50%] truncate text-[10px] text-slate-500">
            {businessName ?? "Your business"}
          </span>
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-4">{children}</main>
      </div>
    );
  }

  return <AppShell businessName={businessName}>{children}</AppShell>;
}

export function EmbedLayout({
  children,
  businessName,
}: {
  children: React.ReactNode;
  businessName?: string | null;
}) {
  return (
    <Suspense
      fallback={
        <AppShell businessName={businessName}>{children}</AppShell>
      }
    >
      <EmbedLayoutInner businessName={businessName}>{children}</EmbedLayoutInner>
    </Suspense>
  );
}

