'use client';
import React, { useState } from 'react';

const PLATFORMS = [
  { id: 'amazon', name: 'Amazon India', icon: '🛒', color: 'border-orange-200 bg-orange-50 text-orange-600', active: true },
  { id: 'flipkart', name: 'Flipkart', icon: '🛍️', color: 'border-blue-200 bg-blue-50 text-blue-600', active: true },
  { id: 'meesho', name: 'Meesho', icon: '👗', color: 'border-pink-200 bg-pink-50 text-pink-600', active: true },
  { id: 'custom', name: 'Add Custom / API', icon: '➕', color: 'border-slate-200 bg-slate-50 text-slate-600', active: false },
];

export default function SellCommerceTab() {
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [showChecklist, setShowChecklist] = useState(false);

  // Mock checking what the user already has
  const checklist = [
    { label: 'Pvt Ltd Registration', owned: true },
    { label: 'GST Number', owned: true },
    { label: 'Current Bank Account', owned: true },
    { label: 'FSSAI / Appropriate License', owned: false },
    { label: 'Product Imaging & Branding', owned: false },
    { label: 'Tech & API Integration', owned: false },
  ];

  if (selectedPlatform && showChecklist) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
         <button onClick={() => setShowChecklist(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">← Back to Info</button>
         
         <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h1 className="text-2xl font-black text-slate-900 mb-2">Readiness Checklist for {selectedPlatform.name}</h1>
            <p className="text-sm text-slate-500 mb-8 font-medium">We analyzed your SetMyBizz profile. Here's what you need to go live today.</p>

            <div className="space-y-4">
               {checklist.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 w-full">
                    <div className="flex items-center gap-3">
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${item.owned ? 'bg-green-500' : 'bg-red-400'}`}>
                         {item.owned ? '✓' : '✕'}
                       </div>
                       <p className={`text-sm font-bold ${item.owned ? 'text-slate-900' : 'text-slate-700'}`}>{item.label}</p>
                    </div>
                    {item.owned ? (
                      <span className="text-xs font-black text-green-600 bg-green-100 px-3 py-1 rounded-md">Owned</span>
                    ) : (
                      <button className="text-xs font-black text-white bg-slate-900 hover:bg-slate-800 px-4 py-1.5 rounded-lg shadow-sm">Buy Now</button>
                    )}
                 </div>
               ))}
            </div>

            <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h3 className="font-black text-blue-900 text-lg mb-1">No time to build this?</h3>
                  <p className="text-[13px] text-blue-700 font-medium">We can set up your complete seller account, catalog, and APIs organically.</p>
               </div>
               <button className="shrink-0 font-black text-sm text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl shadow-md transition-all active:scale-95">
                 Hire Expert
               </button>
            </div>
         </div>
      </div>
    );
  }

  if (selectedPlatform && !showChecklist) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
         <button onClick={() => setSelectedPlatform(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">← Back to Platforms</button>
         
         <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${selectedPlatform.color}`}>
                 {selectedPlatform.icon}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Sell on {selectedPlatform.name}</h1>
                <p className="text-slate-500 font-medium mt-1">Detailed Explaining Information</p>
              </div>
            </div>

            <div className="prose prose-sm text-slate-600 max-w-none leading-relaxed mb-8">
               <p>Selling your products on {selectedPlatform.name} provides you access to millions of daily active users across India. To get started, you must register as a seller.</p>
               <h3>How it works:</h3>
               <ul>
                 <li>Verify your identity and business structure.</li>
                 <li>Upload your GSTIN and verify your current bank account.</li>
                 <li>Ensure your products meet FSSAI or required regulatory limits.</li>
                 <li>List products with A+ cataloging metrics for maximum visibility.</li>
               </ul>
            </div>

            <div className="flex gap-4 border-t border-slate-100 pt-6">
               <button 
                 onClick={() => setShowChecklist(true)}
                 className="px-6 py-3 font-black text-xs text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
               >
                 Skip to Checklist →
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sell on Commerce</h1>
         <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">Instantly launch your products across top marketplaces. We check your readiness, prepare missing documents, and connect your catalog APIs directly from this OS.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
         {PLATFORMS.map(p => (
           <div 
             key={p.id}
             onClick={() => p.active && setSelectedPlatform(p)}
             className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden transition-all ${p.active ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer group' : 'opacity-60 grayscale'}`}
           >
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 border ${p.color} ${p.active ? 'group-hover:scale-110' : ''} transition-transform`}>
               {p.icon}
             </div>
             <h3 className="font-black text-slate-900 mb-1">{p.name}</h3>
             {!p.active && <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Coming Soon</span>}
           </div>
         ))}
      </div>
    </div>
  );
}
