'use client';
import React, { useState } from 'react';

export default function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkToggle, setDarkToggle] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">OS Settings</h1>
         <p className="text-slate-500 font-medium mt-1">Manage everything across your SetMyBizz Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         <div className="md:col-span-1 space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white shadow-sm border-l-4 border-blue-600 font-bold text-slate-900 text-sm">OS Experiences</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 font-medium text-slate-600 text-sm transition-all">Billing & Subscriptions</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 font-medium text-slate-600 text-sm transition-all">Team Access</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 font-medium text-slate-600 text-sm transition-all">API Integration</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 font-medium text-red-600 text-sm transition-all mt-4">Danger Zone</button>
         </div>

         <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                 ⚙️ Dashboard Preferences
               </h3>

               <div className="space-y-6">
                 {/* Toggle 1 */}
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-slate-800">Push Notifications</p>
                       <p className="text-[11px] text-slate-500 mt-0.5">Receive legal and tax compliance alerts directly on your device.</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${notifications ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                    </button>
                 </div>

                 {/* Toggle 2 */}
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-slate-800">Auto-sync Arkle Memory</p>
                       <p className="text-[11px] text-slate-500 mt-0.5">Save all Arkle AI conversations to global context for better tracking.</p>
                    </div>
                    <button 
                      onClick={() => setAutoSync(!autoSync)}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${autoSync ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                    </button>
                 </div>

                 {/* Toggle 3 */}
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-slate-800">Experimental Dark Mode</p>
                       <p className="text-[11px] text-slate-500 mt-0.5">Force OS interface into beta night-time view.</p>
                    </div>
                    <button 
                      onClick={() => setDarkToggle(!darkToggle)}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${darkToggle ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                    </button>
                 </div>
               </div>

               <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3 mt-8 mb-5 flex items-center gap-2">
                 🌐 Language & Region
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-xs font-bold text-slate-500 mb-2">Primary OS Language</p>
                   <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                     <option>English</option>
                     <option>Telugu</option>
                     <option>Hindi</option>
                   </select>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-500 mb-2">Time Zone</p>
                   <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                     <option>(GMT+05:30) India Standard Time</option>
                     <option>(GMT-04:00) Eastern Time</option>
                   </select>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
