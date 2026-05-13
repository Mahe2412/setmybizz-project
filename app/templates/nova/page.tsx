import React from 'react';
import Link from 'next/link';

export default function NovaTemplate() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Nova.</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Customers</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-slate-600 hover:text-slate-900 hidden md:block">Log in</button>
            <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-md">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nova 2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            The intelligent operating system for modern teams.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unify your workflow, automate repetitive tasks, and scale your operations with the most powerful enterprise platform built for speed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20 text-lg">
              Get Started for Free
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors text-lg flex items-center justify-center gap-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-4">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* Dashboard Preview UI */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10"></div>
          <div className="rounded-2xl border border-slate-200/60 bg-white shadow-2xl overflow-hidden flex flex-col relative z-0">
            {/* Header */}
            <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Dashboard Content */}
            <div className="p-8 flex flex-col md:flex-row gap-8 bg-slate-50/30">
              <div className="w-full md:w-64 space-y-4">
                <div className="h-8 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-full bg-white border border-slate-100 rounded-md flex items-center px-3">
                      <div className="h-4 w-4 rounded-full bg-slate-200 mr-3"></div>
                      <div className="h-3 w-1/2 bg-slate-200 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                      <div className="h-4 w-1/3 bg-slate-100 rounded mb-4"></div>
                      <div className="h-8 w-1/2 bg-slate-200 rounded mb-2"></div>
                      <div className="h-2 w-full bg-slate-50 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-64 bg-white border border-slate-100 rounded-xl shadow-sm p-4">
                   <div className="h-4 w-1/4 bg-slate-100 rounded mb-6"></div>
                   <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 to-transparent flex items-end pb-4 px-4 gap-2">
                      {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Simple, transparent pricing.</h2>
            <p className="text-lg text-slate-500">Start free, upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for individuals and small projects.</p>
              <div className="mb-6"><span className="text-4xl font-black">$0</span><span className="text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Up to 3 users</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Basic Analytics</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Community Support</li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold hover:border-slate-300 transition-colors">Start Free</button>
            </div>
            
            {/* Pro */}
            <div className="p-8 rounded-3xl border-2 border-blue-500 bg-blue-50/30 relative shadow-xl shadow-blue-500/10 transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-slate-500 text-sm mb-6">For growing teams that need more power.</p>
              <div className="mb-6"><span className="text-4xl font-black">$49</span><span className="text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-slate-900">
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Unlimited users</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Advanced Analytics</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Priority 24/7 Support</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Custom Integrations</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Get Pro</button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">For large scale organizations and security.</p>
              <div className="mb-6"><span className="text-4xl font-black">Custom</span></div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Everything in Pro</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>SSO & SAML</li>
                <li className="flex items-center gap-3"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Dedicated Success Manager</li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold hover:border-slate-300 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
