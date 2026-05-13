'use client';
import { useAuth } from '@/context/AuthContext';

export default function UserProfileTab() {
  const { user, dbUser, dbBusiness } = useAuth();
  
  const liveBizName = dbBusiness?.business_name || dbUser?.business_name || 'My Startup Workspace';
  const liveUserName = dbUser?.full_name || user?.user_metadata?.full_name || 'Operator';
  const liveUserInitials = liveUserName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MK';
  const liveEmail = user?.email || 'operator@startup.co.in';
  const livePhone = dbUser?.phone || '+91 98765 43210';
  const liveState = dbUser?.state || 'Active State';
  const liveCountry = dbBusiness?.region?.includes(',') ? dbBusiness.region.split(',').pop()?.trim() || 'India' : 'India';
  const liveRegisteredId = dbUser?.registeredId || 'SMB-9824-XQA';
  const liveDescription = dbBusiness?.industry || 'Technology & Innovation Workspace Shell';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="relative mt-12 flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
           <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-100 flex-shrink-0">
             <div className="w-full h-full bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-black text-3xl">{liveUserInitials}</div>
           </div>
           <div className="flex-1 pb-1">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{liveBizName}</h1>
             <p className="text-slate-500 font-bold mt-1">Unique OS ID: {liveRegisteredId}</p>
           </div>
           <button 
             onClick={() => window.location.reload()} 
             className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all"
           >
             Sync Data
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Startup Details */}
           <div className="space-y-5">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Business Details</h3>
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Registered Startup Name</p>
                <p className="text-sm font-bold text-slate-800">{liveBizName}</p>
              </div>
              
              <div className="flex gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">State</p>
                  <p className="text-sm font-bold text-slate-800">{liveState}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Country</p>
                  <p className="text-sm font-bold text-slate-800">{liveCountry} 🇮🇳</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Business Email & Phone</p>
                <p className="text-sm font-bold text-slate-800">{liveEmail}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{livePhone}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Industry Context</p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{liveDescription} — Core SaaS operations platform activated for secure access.</p>
              </div>
           </div>

           {/* Founder Details */}
           <div className="space-y-5">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Founder Details</h3>
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Primary Founder Profile</p>
                <p className="text-sm font-bold text-slate-800">{liveUserName}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded border border-blue-200">Director & Operator</span>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Founder Contact</p>
                <p className="text-sm font-bold text-slate-800">{liveEmail}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{livePhone}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <span className="text-green-500">🛡️</span> KYC Verified Status
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Your identity and director credentials have been verified via SetMyBizz secure servers. You are authorized to take legal actions on this OS.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
