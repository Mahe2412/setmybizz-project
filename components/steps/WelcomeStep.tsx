import React from 'react';

interface WelcomeStepProps {
    onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path className="dark:fill-blue-900/30" d="M165.5 108.5C175.5 130 160 160 135 170C110 180 90 175 70 165C50 155 30 140 35 115C40 90 65 80 85 70C105 60 155.5 87 165.5 108.5Z" fill="#DBEAFE"></path>
                    <circle className="dark:fill-gray-300" cx="100" cy="90" fill="#1E293B" r="25"></circle>
                    <path className="dark:stroke-gray-300" d="M75 90C75 75 85 65 100 65C115 65 125 75 125 90" stroke="#1E293B" strokeLinecap="round" strokeWidth="4"></path>
                    <path className="dark:fill-rose-500" d="M60 120H140V150C140 161 131 170 120 170H80C69 170 60 161 60 150V120Z" fill="#F43F5E"></path>
                    <rect className="dark:fill-gray-200" fill="white" height="40" rx="2" width="30" x="85" y="115"></rect>
                    <path d="M85 115H115" stroke="#CBD5E1" strokeWidth="2"></path>
                    <path d="M90 125H110" stroke="#CBD5E1" strokeWidth="2"></path>
                    <path d="M90 135H110" stroke="#CBD5E1" strokeWidth="2"></path>
                    <path d="M90 145H105" stroke="#CBD5E1" strokeWidth="2"></path>
                    <path className="dark:stroke-rose-500" d="M60 130C50 130 40 110 50 100L60 90" stroke="#F43F5E" strokeLinecap="round" strokeWidth="8"></path>
                    <path d="M50 80C50 75 55 70 60 70C65 70 70 75 70 80" fill="none" stroke="#F59E0B" strokeLinecap="round" strokeWidth="2"></path>
                    <circle cx="60" cy="75" fill="#F59E0B" r="3"></circle>
                    <circle className="dark:fill-slate-500" cx="150" cy="80" fill="#64748B" r="4"></circle>
                    <circle className="dark:fill-slate-500" cx="40" cy="140" fill="#64748B" r="3"></circle>
                    <path className="dark:stroke-slate-500" d="M140 100L150 90M155 110L165 105" stroke="#64748B" strokeLinecap="round" strokeWidth="2"></path>
                </svg>
            </div>

            <div className="text-center max-w-lg mx-auto space-y-4 px-4">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                    Let's reach your business goals together!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
                    Tell us a bit about your business, and we'll tailor the perfect plan for you
                </p>

                <button
                    onClick={onNext}
                    className="mt-8 bg-primary hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 mx-auto"
                >
                    Get Started
                    <span className="material-icons-round">arrow_forward</span>
                </button>

                <div className="flex justify-center gap-2 pt-8">
                    <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>

            <footer className="mt-20 flex flex-col items-center gap-1 opacity-90">
                <span className="material-icons-round text-secondary dark:text-teal-400 text-5xl">verified_user</span>
                <span className="text-xs font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">
                    SetMyBizz.in
                </span>
            </footer>
        </div>
    );
};

export default WelcomeStep;
