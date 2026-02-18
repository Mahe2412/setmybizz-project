import React from 'react';
import { BusinessData } from '../../types';

interface SummaryStepProps {
    data: BusinessData;
    onBack: () => void;
    onDashboard: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ data, onBack, onDashboard }) => {
    const steps = [
        {
            category: 'Set up your brand',
            title: 'Create a logo',
            desc: 'Design a professional logo to represent your identity.',
            action: 'Create',
            icon: 'palette',
            completed: false
        },
        {
            category: 'Establish your brand',
            title: 'Secure your domain name',
            desc: 'Claim your digital address before someone else does.',
            action: 'Search Domain',
            icon: 'language',
            completed: false
        },
        {
            category: 'Establish your brand',
            title: 'Set up your business email',
            desc: 'Look professional with an email matching your domain.',
            action: 'Get Email',
            icon: 'mail',
            completed: false
        },
        {
            category: 'Legality',
            title: 'Register your business with an LLC',
            desc: 'Protect your personal assets and gain credibility.',
            action: 'Start Registration',
            icon: 'gavel',
            completed: false
        },
        {
            category: 'Establish your brand',
            title: 'Build your own branded website',
            desc: 'Create a stunning online presence to showcase your work.',
            action: 'Start Building',
            icon: 'web',
            completed: false
        },
    ];

    const addOns = [
        { id: 'ecommerce', title: 'E-commerce Store', desc: 'Sell products online efficiently.', icon: 'shopping_cart', color: 'orange' },
        { id: 'trademark', title: 'Trademark (TM)', desc: 'Secure your brand identity legally.', icon: 'verified', color: 'purple' },
        { id: 'udyam', title: 'Udyam Registration', desc: 'MSME benefits & subsidies.', icon: 'assignment_turned_in', color: 'green' },
        { id: 'startup_india', title: 'Startup India', desc: 'Govt recognition & tax benefits.', icon: 'rocket_launch', color: 'rose' },
    ];

    const progressPercent = 15;

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-16">
                <h1 className="font-playfair text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                    Take your first step towards your dream business<br className="hidden md:block" /> to unlock the rest of your journey
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl max-w-3xl mx-auto">
                    Here is your personalized business blueprint based on your inputs. We've outlined the essential steps to get <span className="font-bold text-primary">{data.name}</span> up and running.
                </p>
            </div>

            <div className="relative space-y-6">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-6 group">
                        <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full border-4 border-white dark:border-background-dark flex items-center justify-center shadow-lg bg-primary text-white">
                                <span className="material-icons-outlined text-base">{step.icon}</span>
                            </div>
                            {idx !== steps.length - 1 && (
                                <div className="w-1 h-full bg-slate-200 dark:bg-slate-800 absolute top-10"></div>
                            )}
                        </div>

                        <div className={`flex-grow bg-card-light dark:bg-card-dark rounded-xl p-4 md:p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700">
                                        <span className="material-icons-outlined text-slate-300 text-2xl">{step.icon}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest mb-0.5 block text-primary">{step.category}</span>
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">{step.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs md:text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <button className="w-full md:w-auto px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white shadow-md">
                                        {step.action}
                                        <span className="material-icons-outlined text-xs">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 flex flex-col items-center gap-6">
                <button
                    onClick={onDashboard}
                    className="w-full md:w-auto px-16 py-5 bg-primary hover:bg-blue-700 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                    Go to Dashboard
                    <span className="material-icons-outlined">dashboard</span>
                </button>

                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                    <span className="material-icons-outlined">chevron_left</span> Back to edit details
                </button>
            </div>

            <footer className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-secondary text-4xl">verified_user</span>
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Powered by</span>
                        <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">SETMYBIZZ<span className="text-sm font-normal text-slate-400">.IN</span></span>
                    </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-600 mb-8">© 2024 SetMyBizz.in. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SummaryStep;
