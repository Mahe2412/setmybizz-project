import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, toggleDarkMode }) => {
    return (
        <div className="font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
            {/* Premium Neural Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            <header className="fixed top-0 left-0 w-full p-4 md:px-12 md:py-6 z-50 flex justify-between items-center backdrop-blur-xl bg-white/40 border-b border-white/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                        <span className="text-white font-black text-xl">S</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl md:text-2xl text-slate-900 tracking-tighter leading-none">
                            SetMyBizz<span className="text-blue-600">.</span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">AI Operating System</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="hidden md:block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Documentation</button>
                    <button
                        onClick={toggleDarkMode}
                        className="w-10 h-10 rounded-xl bg-white/80 border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all hover:scale-110"
                    >
                        <span className="material-icons-round text-lg">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 w-full px-4 relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;

