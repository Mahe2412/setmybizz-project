"use client";
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, Info, Chrome, Mail, Phone, ArrowRight, X 
} from 'lucide-react';

function BlueprintContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bizName = searchParams.get('bizName') || "Mahaan.in";
  
  const [activeTab, setActiveTab] = useState("Setup");
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState(1); // 1: Select Method, 2: Collect Phone
  const [loginMethod, setLoginMethod] = useState(""); // "gmail", "email", "mobile"

  // Auto-Login Popup after 40 Seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 40000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = ["Setup", "Growth", "Simplify", "Reach", "Learn", "Operate"];

  const serviceData: any = {
    Setup: [
      { title: "Company Incorporation", desc: "Pvt Ltd, LLP, OPC registration options.", action: "Start" },
      { title: "Udyam Certification", desc: "MSME benefits and subsidies.", action: "Get Certified" },
      { title: "Startup India", desc: "Tax exemptions and govt recognition.", action: "Apply" },
      { title: "GST Registration", desc: "Indirect tax registration.", action: "Register" }
    ],
  };

  const handleActionClick = () => setShowLogin(true);

  return (
    <main className={`min-h-screen bg-[#F8FBFF] font-sans text-slate-900 pb-20 ${showLogin ? 'overflow-hidden' : ''}`}>
      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 overflow-x-auto">
        <div className="max-w-5xl mx-auto flex justify-between gap-4">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-black italic">Step-by-Step {activeTab} Guide</h1>
          <p className="text-slate-500 font-bold italic">Personalized for <span className="text-blue-600">{bizName}</span></p>
        </header>

        {/* Services List - Clicking any button triggers Login */}
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-6 before:h-full before:w-0.5 before:bg-slate-100">
          {(serviceData[activeTab] || serviceData["Setup"]).map((step: any, i: number) => (
            <div key={i} className="relative flex items-center group">
              <div className="absolute left-0 w-12 h-12 rounded-full border-4 border-[#F8FBFF] bg-white flex items-center justify-center shadow-sm group-hover:border-blue-600 transition-all">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              </div>
              <div className="ml-16 w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all">
                <div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="text-sm text-slate-400 font-bold">{step.desc}</p>
                </div>
                <button onClick={handleActionClick} className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-xs uppercase shadow-lg shadow-blue-100">
                  {step.action} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MULTI-OPTION LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-10 rounded-[48px] shadow-2xl relative text-center space-y-8">
            <button onClick={() => {setShowLogin(false); setLoginStep(1);}} className="absolute top-6 right-8 text-slate-300 hover:text-slate-900"><X /></button>
            
            {loginStep === 1 ? (
              <div className="space-y-6">
                <h2 className="text-3xl font-black italic">Sign in to Continue</h2>
                <p className="text-slate-400 font-bold text-sm">Save your progress for {bizName} and access Dashboard A.</p>
                
                <div className="space-y-3">
                  {/* Gmail Login */}
                  <button onClick={() => {setLoginMethod("gmail"); setLoginStep(2);}} className="w-full bg-white border-2 border-slate-100 py-4 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-slate-50 transition-all">
                    <Chrome size={20} className="text-blue-600" /> Login with Gmail
                  </button>
                  
                  {/* Email Login */}
                  <button onClick={() => {setLoginMethod("email"); setLoginStep(2);}} className="w-full bg-white border-2 border-slate-100 py-4 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-slate-50 transition-all">
                    <Mail size={20} className="text-slate-400" /> Login with Email
                  </button>
                  
                  {/* Mobile Login */}
                  <button onClick={() => {setLoginMethod("mobile"); setLoginStep(2);}} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-4 hover:scale-[1.02] transition-all">
                    <Phone size={20} /> Login with Mobile Number
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Mandatory Phone Collection */
              <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard-a?' + searchParams.toString()); }} className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="bg-blue-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-blue-600"><Phone size={32} /></div>
                <h2 className="text-2xl font-black italic">Final Verification</h2>
                <p className="text-slate-400 font-bold text-sm">Enter your phone number to proceed to Dashboard A.</p>
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 flex items-center gap-3">
                  <span className="font-black text-slate-400">+91</span>
                  <input type="tel" required placeholder="Mobile Number" className="bg-transparent w-full outline-none font-black text-lg" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:scale-105 transition-all">
                  ENTER DASHBOARD A <ArrowRight className="inline ml-2" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">SetMyBizz Secured</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading Roadmap...</div>}><BlueprintContent /></Suspense>; }