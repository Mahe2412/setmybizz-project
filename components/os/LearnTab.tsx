"use client";
import React from 'react';

interface LearnTabProps {
    onServiceClick?: (serviceName: string, badge?: string) => void;
}

const LearnTab: React.FC<LearnTabProps> = ({ onServiceClick }) => {
    const learnerStudioServices = [
        { label: 'Skill Upgradation', icon: 'school', desc: 'Master new industry standards.', bg: 'bg-blue-50', color: 'text-blue-600', badge: 'Coming Soon' },
        { label: 'Tech Adoption', icon: 'biotech', desc: 'Implement latest AI and automation.', bg: 'bg-purple-50', color: 'text-purple-600', badge: 'Coming Soon' },
        { label: 'Learn Business', icon: 'auto_stories', desc: 'Mini-MBA for startup founders.', bg: 'bg-green-50', color: 'text-green-600', badge: 'Coming Soon' },
        { label: 'Growth Strategies', icon: 'trending_up', desc: 'Scale your operations effectively.', bg: 'bg-orange-50', color: 'text-orange-600', badge: 'Coming Soon' },
        { label: 'Financial Literacy', icon: 'payments', desc: 'Understand tax, GST and funding.', bg: 'bg-teal-50', color: 'text-teal-600', badge: 'Coming Soon' },
        { label: 'Leadership', icon: 'groups', desc: 'Build and manage your first team.', bg: 'bg-pink-50', color: 'text-pink-600', badge: 'Coming Soon' }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 pt-4">
            <div className="text-center mb-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-3">LEARNER <span className="not-italic text-indigo-600">STUDIO</span></h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Universal Skill Upgradation • Tech Adoption Hub</p>
            </div>

            {/* Academy Coming Soon Overlay */}
            <div className="fixed bottom-12 right-12 z-40 max-w-sm w-full animate-in slide-in-from-bottom-10 duration-1000 delay-300">
                <div className="backdrop-blur-xl bg-white/80 border border-white/50 shadow-2xl rounded-3xl p-6 relative overflow-hidden group hover:bg-white/90 transition-all cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500"></div>
                    <div className="flex items-start gap-4">
                        <div className="bg-teal-100 text-teal-600 p-3 rounded-2xl shrink-0 group-hover:rotate-12 transition-transform shadow-sm">
                            <span className="material-symbols-outlined text-3xl font-black">school</span>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-widest">Academy Opening Soon</h3>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider opacity-80">
                                Detailed courses on GST, Funding, and Growth are in production.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                <span>Join Waitlist</span>
                                <span className="material-symbols-outlined text-sm animate-pulse">notifications_active</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learnerStudioServices.map((service, i) => (
                    <div
                        key={i}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-6 group cursor-pointer active:scale-95 relative overflow-hidden"
                    >
                        <div className="absolute top-4 right-6 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                            {service.badge}
                        </div>
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${service.bg} ${service.color} group-hover:scale-110 shadow-sm`}>
                            <span className="material-symbols-outlined text-3xl font-black">{service.icon}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-sm text-slate-900 uppercase tracking-tighter mb-2 italic group-hover:text-indigo-600 transition-colors">{service.label}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-80">{service.desc}</p>
                        </div>
                        <button className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            Initialize Engine
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnTab;
