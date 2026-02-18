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
        <div className="font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <header className="fixed top-0 left-0 w-full p-4 md:p-6 z-50 flex justify-between items-center bg-transparent">
                <div className="flex items-center gap-2">
                    {/* <img src="/logo.png" alt="SetMyBizz" className="h-8 md:h-10" /> */}
                    <span className="font-serif font-black text-xl md:text-2xl text-slate-900 tracking-tighter">SetMyBizz<span className="text-blue-600">.</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">Help</button>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                        <span className="material-icons-round">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 w-full px-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;
