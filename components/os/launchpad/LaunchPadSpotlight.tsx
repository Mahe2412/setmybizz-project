'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPOTLIGHT_CATEGORIES = [
  { id: 'networking', label: 'Networking', icon: 'hub', color: 'from-blue-500 to-indigo-600' },
  { id: 'promos', label: 'Promotions', icon: 'campaign', color: 'from-rose-500 to-pink-600' },
  { id: 'offers', label: 'Offers', icon: 'local_offer', color: 'from-amber-500 to-orange-600' },
  { id: 'incubators', label: 'Incubators', icon: 'rocket_launch', color: 'from-emerald-500 to-teal-600' },
  { id: 'events', label: 'Events', icon: 'event', color: 'from-purple-500 to-violet-600' },
  { id: 'learn', label: 'Learn', icon: 'school', color: 'from-sky-500 to-blue-600' },
  { id: 'social', label: 'Social Media', icon: 'share', color: 'from-fuchsia-500 to-purple-600' },
  { id: 'instagram', label: 'Instagram', icon: 'photo_camera', color: 'from-pink-500 to-rose-600' },
];

const MOCK_DATA = {
  networking: [
    { id: 1, title: 'Founders Mixer Hyderabad', company: 'Networking Hub', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80', tag: 'Limited Slots' },
    { id: 2, title: 'B2B Sales Mastermind', company: 'Global Connect', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80', tag: 'Virtual' }
  ],
  promos: [
    { id: 1, title: 'Cloud Infrastructure Credits', company: 'AWS Startup', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', tag: '₹5L Value' },
    { id: 2, title: 'CRM Automation Suite', company: 'Salesforce', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80', tag: 'Exclusive' }
  ],
  offers: [
    { id: 1, title: '90% Off Legal Audit', company: 'BizLegal', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80', tag: 'Flash Sale' },
    { id: 2, title: 'Free Domain for 3 Years', company: 'SetMyBizz', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80', tag: 'Onboarding Bonus' }
  ],
  incubators: [
    { id: 1, title: 'T-Hub Cohort 2026', company: 'Govt of TS', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80', tag: 'Apply Now' },
    { id: 2, title: 'Neural AI Accelerator', company: 'Antigravity VC', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80', tag: 'Equity Free' }
  ],
  events: [
    { id: 1, title: 'Digital India Summit', company: 'MeitY', image: 'https://images.unsplash.com/photo-1540575861501-7ad0582371f1?auto=format&fit=crop&w=400&q=80', tag: 'Delhi Expo' },
    { id: 2, title: 'Product Hunt Launchpad', company: 'TechCrunch', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=400&q=80', tag: 'Global Stream' }
  ],
  learn: [
    { id: 1, title: 'Scaling to $1M ARR', company: 'SaaS School', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80', tag: 'Course' },
    { id: 2, title: 'Tax Compliance for Startups', company: 'ICAI Experts', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80', tag: 'Workshop' }
  ],
  social: [
    { id: 1, title: 'Viral Campaign Strategy', company: 'SocialPulse', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80', tag: 'E-Book' },
    { id: 2, title: 'Multi-Channel Scheduler', company: 'Buffer AI', image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=400&q=80', tag: 'Tool' }
  ],
  instagram: [
    { id: 1, title: 'Instagram Reel Mastery', company: 'Creator Academy', image: 'https://images.unsplash.com/photo-161127252454b-3b9c7175d5cd?auto=format&fit=crop&w=400&q=80', tag: 'Masterclass' },
    { id: 2, title: 'Bio Optimization Guide', company: 'InstaBiz', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80', tag: 'Checklist' }
  ]
};

export default function BizboardSpotlight() {
  const [activeCategory, setActiveCategory] = useState('networking');

  return (
    <div className="w-full max-w-[850px] mx-auto px-4 md:px-0 mb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.4em] mb-2 border-l-4 border-blue-600 pl-4 leading-none">Bizboard Spotlight</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-5">Virtual Commercials & Ecosystem Hub</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Feed from Admin Panel</span>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mb-8">
        {SPOTLIGHT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border ${
              activeCategory === cat.id 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
            }`}
          >
            <span className={`material-symbols-rounded text-[18px] ${activeCategory === cat.id ? 'text-white' : 'text-slate-400'}`}>
              {cat.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {MOCK_DATA[activeCategory as keyof typeof MOCK_DATA].map((item: any) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-[380px]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 right-5">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                      {item.tag}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{item.company}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Featured</span>
                  </div>
                  
                  <h4 className="text-[16px] font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {item.title}
                  </h4>
                  
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2 group/btn">
                      View Details 
                      <span className="material-symbols-rounded text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${i + item.id}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">
                        +12
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Social & Instagram Intelligence Section */}
      {(activeCategory === 'social' || activeCategory === 'instagram') && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Reach</p>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">1.2M <span className="text-[10px] text-emerald-500 font-black">+14%</span></h4>
                <div className="mt-6 h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-blue-600 to-indigo-600 w-[65%]" />
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Engagement Rate</p>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">8.4% <span className="text-[10px] text-emerald-500 font-black">+2.1%</span></h4>
                <div className="mt-6 h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-fuchsia-600 to-rose-600 w-[42%]" />
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Scheduled Posts</p>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">12 <span className="text-[10px] text-slate-300 font-black">Pending</span></h4>
                <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest">Manage Calendar</button>
            </div>
        </motion.div>
      )}

      {/* Promo Banner Style Zone */}
      <div className="mt-12 bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-black uppercase tracking-widest">Government Protocol</span>
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">Active Verification</span>
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter mb-2">Promote your business on BizOS Spotlight</h3>
            <p className="text-[10px] font-medium opacity-70 uppercase tracking-[0.2em]">Unlock reach to 10k+ verified startups and enterprises</p>
          </div>
          <button className="bg-white text-indigo-700 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
            Create Promo Slot
          </button>
        </div>
      </div>
    </div>
  );
}
