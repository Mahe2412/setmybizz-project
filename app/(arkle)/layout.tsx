import React from 'react';

export const metadata = {
  title: 'Arkle AI | Business Intelligence & Automation',
  description: 'The elite AI companion for modern founders. Arkle for Business.',
};

export default function ArkleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05050a] text-white selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>
      
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
