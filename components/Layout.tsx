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
        <div className="font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 min-h-screen flex flex-col relative overflow-hidden">
            {/* Background elements are handled by globals.css radial gradients */}
            
            <header className="fixed top-0 left-0 w-full p-4 md:px-8 md:py-5 z-50 flex justify-between items-center glass-panel border-b border-white/40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg animate-glow">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="font-serif font-black text-xl md:text-2xl text-slate-900 tracking-tight">
                        SetMyBizz<span className="text-blue-600">.</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Help</button>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full glass-card hover:bg-white text-slate-600 transition-colors"
                    >
                        <span className="material-icons-round text-sm">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center pt-28 pb-20 w-full px-4 relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
