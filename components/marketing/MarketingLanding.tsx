'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Rocket, 
  Zap, 
  Shield, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Bot,
  LayoutGrid,
  TrendingUp,
  Target
} from 'lucide-react';
import HomepageServices from './HomepageServices';
import LeadCaptureModal from './LeadCaptureModal';

const MarketingLanding: React.FC = () => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-sm tracking-tight uppercase leading-none">SetMyBizz</span>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">Founders OS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Services</a>
            <a href="#platform" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Platform</a>
            <a href="#pricing" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/os" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">Login</Link>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20"
            >
              Start Your OS
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 border border-blue-100"
          >
            <Sparkles size={12} className="animate-pulse" />
            The World's First OS for Founders
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
          >
            Don't just build a startup. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Install it.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            SetMyBizz is the complete SaaS platform to launch, manage, and scale your business. From incorporation to AI-powered operations — everything is pre-installed.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group"
            >
              Get Started for Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/os"
              className="w-full md:w-auto px-10 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg hover:border-blue-600 transition-all flex items-center justify-center gap-3"
            >
              Explore BizOS
              <LayoutGrid size={20} className="text-blue-600" />
            </Link>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-12"
          >
            {[
              { label: 'Startups Launched', value: '2,400+' },
              { label: 'Global Entities', value: '180+' },
              { label: 'AI Tasks Daily', value: '50k+' },
              { label: 'Founder Rating', value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES GRID (Marketing Style) ─── */}
      <section id="services" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Every service, automated.</h2>
            <p className="text-slate-600 font-medium">One platform to handle all your business needs.</p>
          </div>
          <HomepageServices />
        </div>
      </section>

      {/* ─── PLATFORM OVERVIEW (The "SaaS" Experience) ─── */}
      <section id="platform" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <Bot size={14} />
                Neural Operations
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-8">
                Your AI Co-Founder <br />
                is pre-installed.
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'BizDesk Dashboard', desc: 'Manage your entire company—legal, finance, and growth—from one central desk.', icon: LayoutGrid },
                  { title: 'LaunchPad AI', desc: 'Build your website, brand, and apps through simple conversation with Arkle.', icon: Rocket },
                  { title: 'Marketplace Access', desc: 'Instant integration with global banks, cloud providers, and expert CAs.', icon: Globe }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                      <feature.icon className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">{feature.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/os" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg group">
                  Enter the BizOS
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-white border border-slate-100 rounded-[40px] shadow-2xl p-4 overflow-hidden group">
                 {/* Mockup of the BizOS Shell */}
                 <div className="bg-slate-50 rounded-[32px] h-[500px] overflow-hidden border border-slate-200">
                    <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="p-8">
                       <div className="w-20 h-2 bg-blue-600/20 rounded-full mb-8"></div>
                       <div className="grid grid-cols-2 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                               <div className="w-8 h-8 rounded-lg bg-slate-50 mb-3"></div>
                               <div className="w-full h-2 bg-slate-100 rounded-full mb-2"></div>
                               <div className="w-2/3 h-2 bg-slate-50 rounded-full"></div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce transition-all">
                    <TrendingUp className="text-emerald-500 mb-2" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue Growth</p>
                    <p className="text-lg font-black text-slate-900">+42%</p>
                 </div>
                 <div className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-pulse">
                    <CheckCircle2 className="text-blue-500 mb-2" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliances</p>
                    <p className="text-lg font-black text-slate-900">Active</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEAD CAPTURE STRIP ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6">Ready to lead your startup?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto font-medium">Join 2,400+ founders who have pre-installed their success with SetMyBizz.</p>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-xl"
            >
              Launch Your Business Now
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap size={16} fill="currentColor" />
              </div>
              <span className="font-black text-slate-900 tracking-tight uppercase">SetMyBizz</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mb-6">
              The neural operating system for modern founders. Start, build, and scale without friction.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <div className="w-8 h-8 rounded-full bg-slate-100"></div>
               <div className="w-8 h-8 rounded-full bg-slate-100"></div>
               <div className="w-8 h-8 rounded-full bg-slate-100"></div>
            </div>
          </div>

          <div>
            <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] mb-6">SaaS OS</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/os" className="hover:text-blue-600 transition-colors">BizDesk</Link></li>
              <li><Link href="/os" className="hover:text-blue-600 transition-colors">LaunchPad</Link></li>
              <li><Link href="/os" className="hover:text-blue-600 transition-colors">AI Workspace</Link></li>
              <li><Link href="/os" className="hover:text-blue-600 transition-colors">Arkle AI</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] mb-6">Services</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/services/company-registration" className="hover:text-blue-600 transition-colors">Incorporation</Link></li>
              <li><Link href="/services/gst-registration" className="hover:text-blue-600 transition-colors">Tax & Compliance</Link></li>
              <li><Link href="/services/website-design" className="hover:text-blue-600 transition-colors">Brand Building</Link></li>
              <li><Link href="/services/project-report" className="hover:text-blue-600 transition-colors">Funding</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] mb-6">Legal</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 SetMyBizz Technologies. All Rights Reserved.</p>
        </div>
      </footer>

      {/* ─── LEAD CAPTURE MODAL ─── */}
      <LeadCaptureModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onComplete={(data) => {
          console.log('Lead captured:', data);
          setIsLeadModalOpen(false);
          // Redirect to onboarding or dashboard
          window.location.href = '/onboarding';
        }}
        source="marketing_landing_root"
      />
    </div>
  );
};

export default MarketingLanding;
