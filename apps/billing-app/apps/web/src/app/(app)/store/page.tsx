"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Store,
  Search,
  Share2,
  Copy,
  CheckCircle,
  FileText,
  ShoppingBag,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  description?: string | null;
  unit: string;
  salePrice: number;
  gstRate: number;
  stockQty: number;
  trackStock: boolean;
};

export default function StoreCatalogPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://billbook.in/store/my-business-catalog");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Digital Store & Catalog</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish your items to a public catalog link for client browsing and orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Link Copied!" : "Share Store Link"}
          </button>
        </div>
      </div>

      {/* Public Store Preview Alert */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3">
        <Store className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-blue-800">Public Link Active</h3>
          <p className="text-[11px] text-blue-600/95 leading-relaxed mt-0.5">
            Your clients can view this catalog without logging in. All changes made in your **Products** page will sync automatically.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-3 py-2">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search products in catalog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-xs w-full focus:outline-none"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-10 text-center text-xs text-slate-400">Loading catalog items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 border border-slate-200 rounded-2xl bg-white">
          No products found in catalog. Add items in the Products section to publish them.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs font-black text-slate-800 leading-snug">{item.name}</h3>
                  <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-500 tracking-wider">
                    {item.unit}
                  </span>
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
                  <span className="text-sm font-black text-slate-800">{formatCurrency(item.salePrice)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">GST</span>
                  <span className="text-[10px] font-extrabold text-slate-600">{item.gstRate}% Included</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
