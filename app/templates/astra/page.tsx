import React from 'react';
import Link from 'next/link';

export default function AstraTemplate() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#0a0a0a] rounded-sm -rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Astra.</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <button className="px-5 py-2.5 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
              Let's Talk
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8">
              We build digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">experiences</span> that matter.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              Astra is a creative studio at the intersection of design, technology, and strategy. We help ambitious brands shape the future.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                View Our Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 border-t border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Expertise</h2>
            <p className="text-gray-400 max-w-md">We offer a full suite of digital services designed to elevate your brand and drive results.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Brand Strategy', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Positioning, messaging, and visual identity systems that stand out.' },
              { title: 'Digital Design', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', desc: 'Beautiful, intuitive user interfaces and engaging web experiences.' },
              { title: 'Development', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', desc: 'Robust, scalable, and high-performance front-end & back-end solutions.' }
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-indigo-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-sm -rotate-45"></div>
            </div>
            <span className="text-lg font-bold tracking-tight">Astra.</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 Astra Digital Agency. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">in</a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">tw</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
