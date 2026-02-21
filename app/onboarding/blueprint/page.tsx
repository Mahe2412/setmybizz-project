"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, Info, Chrome, Mail, Phone, ArrowRight, X, LayoutDashboard, 
  Rocket, Lightbulb, Target, Users, Settings, ChevronRight
} from 'lucide-react';

function BlueprintContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bizName = searchParams.get('bizName') || "My Business";
  
  const [activeTab, setActiveTab] = useState("Setup");
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [loginMethod, setLoginMethod] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 45000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "Setup", icon: <Settings className="w-4 h-4" /> },
    { id: "Growth", icon: <TrendingUpIcon className="w-4 h-4" /> },
    { id: "Reach", icon: <Target className="w-4 h-4" /> },
    { id: "Team", icon: <Users className="w-4 h-4" /> }
  ];

  const serviceData: any = {
    Setup: [
      { title: "Company Incorporation", desc: "Pvt Ltd, LLP, or OPC registration based on your needs.", action: "Start Setup" },
      { title: "Udyam Certification", desc: "Get MSME benefits and government subsidies.", action: "Claim Benefits" },
      { title: "GST Registration", desc: "Mandatory indirect tax registration for compliance.", action: "Register Now" }
    ],
    Growth: [
        { title: "Business Strategy", desc: "AI-driven roadmap for your specific industry.", action: "View Plan" },
        { title: "Funding Readiness", desc: "Evaluate if you are ready for angel or VC funding.", action: "Check Status" }
    ],
    Reach: [
        { title: "Domain & Email", desc: "Securing your professional online identity.", action: "Reserve" },
        { title: "Social Presence", desc: "Setting up your brand across high-impact channels.", action: "Connect" }
    ],
    Team: [
        { title: "Hiring Strategy", desc: "Finding the first few critical hires for your startup.", action: "Plan Team" }
    ]
  };

  const handleActionClick = () => setShowLogin(true);

  return (
    <main className={`min-h-screen bg-[#f0f4ff] font-sans text-slate-900 pb-20 pt-8 ${showLogin ? 'overflow-hidden' : ''}`}>
      <div className="max-w-4xl mx-auto px-6 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        <header className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4 border border-[#8daaff]/10">
                <LayoutDashboard className="w-4 h-4 text-[#8daaff]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1a2b4b]">Custom AI Blueprint</span>
            </div>
            <h1 className="text-5xl font-serif font-black text-[#1a2b4b]">
                Success Roadmap
            </h1>
            <p className="text-slate-500 font-medium">
                Personalized steps to launch and scale <span className="text-[#8daaff] font-bold">{bizName}</span>
            </p>
        </header>

        {/* Custom Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3">
            {Object.keys(serviceData).map((tabId) => (
                <button 
                    key={tabId} 
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        activeTab === tabId 
                        ? 'bg-[#1a2b4b] text-white shadow-xl shadow-[#1a2b4b]/20 scale-105' 
                        : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {tabId}
                </button>
            ))}
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {(serviceData[activeTab] || serviceData["Setup"]).map((step: any, i: number) => (
            <div 
                key={i} 
                className="group bg-white p-8 rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-center gap-8 border border-transparent hover:border-[#8daaff]/20 transition-all hover:shadow-xl animate-in fade-in slide-in-from-right-4 duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                <div className="w-14 h-14 bg-[#f0f4ff] rounded-2xl flex items-center justify-center text-[#8daaff] font-black text-xl shadow-inner">
                    {i + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-black text-[#1a2b4b] mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400 font-medium">{step.desc}</p>
                </div>
              </div>
              <button 
                onClick={handleActionClick} 
                className="w-full md:w-auto px-10 py-5 bg-[#8daaff] hover:bg-[#7a99ff] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#8daaff]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                {step.action}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1a2b4b]/40 backdrop-blur-md animate-in fade-in duration-500 overflow-y-auto">
          <div className="bg-white w-full max-w-md p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative text-center space-y-10 my-auto">
            <button 
                onClick={() => {setShowLogin(false); setLoginStep(1);}} 
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
                <X className="w-5 h-5" />
            </button>
            
            {loginStep === 1 ? (
              <div className="space-y-8">
                <div className="w-20 h-20 bg-[#f0f4ff] rounded-3xl flex items-center justify-center mx-auto shadow-inner text-[#8daaff]">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-serif font-black text-[#1a2b4b]">Secure Access</h2>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">
                        Save your progress for <span className="text-[#8daaff] font-bold">{bizName}</span> to unlock your personalized Dashboard.
                    </p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {setLoginMethod("gmail"); setLoginStep(2);}} 
                    className="w-full bg-white border border-slate-100 py-5 rounded-2xl font-black text-sm text-[#1a2b4b] flex items-center justify-center gap-4 hover:shadow-lg hover:border-[#8daaff]/30 transition-all"
                  >
                    <Chrome size={20} className="text-blue-500" /> Continue with Google
                  </button>
                  
                  <button 
                    onClick={() => {setLoginMethod("mobile"); setLoginStep(2);}} 
                    className="w-full bg-[#1a2b4b] text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-[#1a2b4b]/20"
                  >
                    <Phone size={20} className="text-white" /> Continue with Phone
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    router.push('/dashboard-a?' + searchParams.toString()); 
                }} 
                className="space-y-8 animate-in slide-in-from-bottom-8 duration-500"
              >
                <div className="w-20 h-20 bg-[#f0f4ff] rounded-3xl flex items-center justify-center mx-auto shadow-inner text-[#8daaff]">
                    <Phone className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-serif font-black text-[#1a2b4b]">Verification</h2>
                    <p className="text-slate-400 font-medium text-sm px-4">
                        Just one final step to secure your roadmap and enter your dashboard.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-3 group focus-within:ring-2 focus-within:ring-[#8daaff]/20 transition-all">
                  <span className="font-black text-[#1a2b4b] opacity-40">+91</span>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Mobile Number" 
                    className="bg-transparent w-full outline-none font-black text-lg text-[#1a2b4b]" 
                  />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-[#8daaff] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#8daaff]/20 hover:bg-[#7a99ff] transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  Verify & Enter Dashboard
                </button>
              </form>
            )}
            <div className="flex items-center justify-center gap-2 opacity-30 pt-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <p className="text-[10px] text-[#1a2b4b] font-black uppercase tracking-widest">SetMyBizz Secure Login</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]"></div>
    </main>
  );
}

// Simple Icon Fallback since Lucide might differ or be missing TrendingUp in some versions
function TrendingUpIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}

export default function Page() { 
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center font-black text-[#8daaff] animate-pulse">GENERATING BLUEPRINT</div>}>
        <BlueprintContent />
    </Suspense>
  ); 
}