import React, { useState } from 'react';
import GlobalAssistantPanel from '@/components/os/GlobalAssistantPanel';

export default function GlobalWorkspaceDashboard({ onClose }: { onClose: () => void }) {
  const [activeCountry, setActiveCountry] = useState<'USA' | 'UK' | 'Export'>('USA');
  const [showAssistant, setShowAssistant] = useState(false);

  const navItems = [
    { id: 'USA', label: '🇺🇸 USA', badge: 'Incorporated', bg: 'bg-blue-100 text-blue-700' },
    { id: 'UK', label: '🇬🇧 UK', badge: 'Market Access', bg: 'bg-indigo-100 text-indigo-700' },
    { id: 'Export', label: '📦 Direct Export', badge: 'Active', bg: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center rounded-xl shadow-md text-white text-xl">
            🌍
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Global Workspace Dashboard</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">TechNova Solutions Pvt Ltd • 3 Active Global Regions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all">
            <span className="material-icons text-sm">notifications</span>
             Updates
          </button>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl flex items-center justify-center transition-all"
            title="Close Dashboard"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Regions */}
        <div className="w-72 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col gap-2 overflow-y-auto">
           <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-2">Active Regions</h2>
           
           {navItems.map((nav) => (
             <button
               key={nav.id}
               onClick={() => setActiveCountry(nav.id as any)}
               className={`w-full flex flex-col items-start p-3 rounded-2xl transition-all border-2 text-left ${
                 activeCountry === nav.id 
                 ? 'bg-blue-50 border-blue-500 shadow-sm' 
                 : 'bg-white border-transparent hover:bg-slate-50 border-slate-100'
               }`}
             >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-black text-slate-900 text-[15px]">{nav.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${nav.bg}`}>
                    {nav.badge}
                  </span>
                </div>
                {nav.id === 'USA' && <p className="text-xs text-slate-500 font-medium">TechNova LLC • Delaware</p>}
                {nav.id === 'UK' && <p className="text-xs text-slate-500 font-medium">Amazon UK & Etsy Store</p>}
                {nav.id === 'Export' && <p className="text-xs text-slate-500 font-medium">IEC: XXXXXXXXXX</p>}
             </button>
           ))}

           <div className="mt-6 px-2">
             <button className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition-all bg-slate-50/50 hover:bg-blue-50/50 flex items-center justify-center gap-2">
               <span>+</span> Expand to New Region
             </button>
           </div>
        </div>

        {/* Right Dashboard Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          
          {/* USA DASHBOARD */}
          {activeCountry === 'USA' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
               
               {/* USA Header Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner">💵</div>
                     <p className="text-sm font-bold text-slate-500 mb-1">USA Revenue (YTD)</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">$42,500<span className="text-sm text-green-500 ml-2">↑ 12%</span></p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner">🏦</div>
                     <p className="text-sm font-bold text-slate-500 mb-1">Mercury Bank Balance</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">$18,240<span className="text-sm text-slate-400 ml-2">.00</span></p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner">🤝</div>
                     <p className="text-sm font-bold text-slate-500 mb-1">Active US Clients</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">14</p>
                  </div>
               </div>

               {/* USA Operating Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 
                 {/* Compliance & Legal */}
                 <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                     <h3 className="font-black text-slate-900 text-base">Legal & Compliance Tracking</h3>
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">State of Delaware</span>
                   </div>
                   <div className="p-6 space-y-5">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-inner">⚠️</div>
                            <div>
                               <p className="text-sm font-black text-slate-900">Delaware Franchise Tax</p>
                               <p className="text-xs font-medium text-slate-500 mt-0.5">Due: March 1, 2026</p>
                            </div>
                         </div>
                         <button className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-sm">Pay $400</button>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center justify-between opacity-60">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">✓</div>
                            <div>
                               <p className="text-sm font-black text-slate-900">Registered Agent Renewal</p>
                               <p className="text-xs font-medium text-slate-500 mt-0.5">Completed (Valid till 2027)</p>
                            </div>
                         </div>
                         <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Active</span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center justify-between opacity-60">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">✓</div>
                            <div>
                               <p className="text-sm font-black text-slate-900">IRS Form 1120 (Corporate Tax)</p>
                               <p className="text-xs font-medium text-slate-500 mt-0.5">Filed successfully by our CPA</p>
                            </div>
                         </div>
                         <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Filed</span>
                      </div>
                   </div>
                 </div>

                 {/* Business Profile & Documents */}
                 <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                     <h3 className="font-black text-slate-900 text-base">Corporate Documents</h3>
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Secure Vault</span>
                   </div>
                   <div className="p-6">
                     <div className="grid grid-cols-2 gap-3">
                       <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group bg-slate-50">
                         <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                         <p className="text-sm font-black text-slate-900 mb-1">EIN Letter (IRS)</p>
                         <p className="text-[10px] text-slate-500 font-bold">Issued: Oct 2025</p>
                       </div>
                       <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group bg-slate-50">
                         <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📜</div>
                         <p className="text-sm font-black text-slate-900 mb-1">Articles of Inc.</p>
                         <p className="text-[10px] text-slate-500 font-bold">Delaware State</p>
                       </div>
                       <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group bg-slate-50">
                         <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                         <p className="text-sm font-black text-slate-900 mb-1">Cap Table</p>
                         <p className="text-[10px] text-slate-500 font-bold">10,000,000 Shares</p>
                       </div>
                       <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group bg-slate-50">
                         <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💼</div>
                         <p className="text-sm font-black text-slate-900 mb-1">Mercury Bank Details</p>
                         <p className="text-[10px] text-slate-500 font-bold">Routing & Acct</p>
                       </div>
                     </div>
                   </div>
                 </div>

               </div>
            </div>
          )}

          {/* UK DASHBOARD */}
          {activeCountry === 'UK' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
               {/* UK Header Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner">💷</div>
                     <p className="text-sm font-bold text-slate-500 mb-1">UK Revenue (YTD)</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">£14,200<span className="text-sm text-green-500 ml-2">↑ 5%</span></p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner">🛒</div>
                     <p className="text-sm font-bold text-slate-500 mb-1">Orders Shipped (Amazon UK)</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">342</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner">🛡️</div>
                     <p className="text-sm font-bold text-slate-500 mb-1">UK VAT Status</p>
                     <p className="text-3xl font-black text-emerald-600 tracking-tight text-lg mt-1">Active & Compliant</p>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 text-center mt-8">
                  <div className="text-6xl mb-4">🇬🇧</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Market Access Tracking</h3>
                  <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                     Your products are currently live in the United Kingdom via Amazon Global Selling. We handle cross-border payments directly to your Indian account via Stripe/Payoneer.
                  </p>
               </div>
            </div>
          )}

          {/* EXPORT DASHBOARD */}
          {activeCountry === 'Export' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
               {/* Export Header Stats */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div>
                       <p className="text-sm font-bold text-slate-500 mb-1">IEC (Import Export Code)</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tight break-all">AABCU1234E</p>
                     </div>
                     <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-inner">✅</div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div>
                       <p className="text-sm font-bold text-slate-500 mb-1">Active Shipments</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tight">2 In Transit</p>
                     </div>
                     <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-inner">🚢</div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 mt-8">
                  <h3 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-4">Recent Export Shipments</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black">🇦🇪</div>
                         <div>
                           <p className="font-black text-slate-900">100 Handcrafted Units to Dubai</p>
                           <p className="text-xs font-bold text-slate-500 mt-0.5">AWB: 9845321092 • DHL Express</p>
                         </div>
                       </div>
                       <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-lg border border-amber-200">In Transit (Customs)</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all opacity-70">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black">🇦🇺</div>
                         <div>
                           <p className="font-black text-slate-900">Custom SaaS Code (Service Export)</p>
                           <p className="text-xs font-bold text-slate-500 mt-0.5">Invoice: INV-25-091 • FIBRC</p>
                         </div>
                       </div>
                       <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200">Payment Received</span>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Floating Global Assistant Button */}
      <div className="fixed bottom-8 right-8 z-[110]">
        <button
          onClick={() => setShowAssistant(true)}
          className="flex items-center gap-3 bg-white pr-6 pl-2 py-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200/60 hover:bg-emerald-50 hover:border-emerald-200 group transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
            🌍
          </div>
          <div className="text-left">
             <p className="text-sm font-black text-slate-800">Global Assistant</p>
             <p className="text-[10px] font-bold text-slate-500">Arkle AI is online</p>
          </div>
        </button>
      </div>

      {/* Render the Global Assistant Panel */}
      {showAssistant && (
        <div className="fixed inset-0 z-[120] pointer-events-none">
          <div className="pointer-events-auto h-full w-full relative">
            <GlobalAssistantPanel onClose={() => setShowAssistant(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
