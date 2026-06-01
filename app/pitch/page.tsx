'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown, CheckCircle, BrainCircuit, Rocket, Target, Users } from 'lucide-react';

export default function PitchDeck() {
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">SB</span>
          </div>
          SetMyBizz <span className="text-indigo-400 font-light">BizOS</span>
        </div>
        <a href="#ask" className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium transition-all">
          Book 15-Min Demo
        </a>
      </nav>

      {/* Slide 1: Hero Hook */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden snap-start">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/pitch-assets/pitch_hero_1780158995668.png" 
            alt="Futuristic OS" 
            fill 
            className="object-cover opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50"></div>
        </div>
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="relative z-10 text-center max-w-4xl px-6"
        >
          <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
            AI-First Workspace for MSMEs
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Don't Just Start a Business.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Boot Up an OS.
            </span>
          </h1>
          
          {/* Core Clarity Statement */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-3xl mx-auto backdrop-blur-md">
            <p className="text-lg md:text-xl text-indigo-200 font-medium">
              SetMyBizz is an AI-first platform that helps MSMEs/Startups build, run, and manage their business using workflows, automation, and integrated tools. Powered by Arkle AI.
            </p>
          </div>

          <p className="text-lg text-gray-400 font-light mb-10 max-w-2xl mx-auto">
            Scale your company with AI-assisted operations and automated workflows.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <a href="#ask" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-full transition-all">
              Book 15-Min Demo
            </a>
            <a href="#problem" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 font-semibold rounded-full transition-all">
              View Product Demo
            </a>
          </div>
          <a href="#problem" className="animate-bounce inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
            <ArrowDown className="w-4 h-4 text-indigo-400" />
          </a>
        </motion.div>
      </section>

      {/* Slide 2: The Problem */}
      <section id="problem" className="relative min-h-screen flex items-center py-24 snap-start border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
              <h2 className="text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-4">The Tragedy of Startup Failure</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Brilliant ideas die daily simply because execution is too complex.</h3>
              <ul className="space-y-6 text-gray-300">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg"><Target className="w-6 h-6 text-red-400" /></div>
                  <div>
                    <strong className="text-white block text-lg mb-1">Decision & Skill Gaps</strong>
                    Founders fail because they lack specialized skills in finance, legal, tech, and marketing.
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg"><Users className="w-6 h-6 text-orange-400" /></div>
                  <div>
                    <strong className="text-white block text-lg mb-1">Affordability Crisis</strong>
                    Hiring agencies, developers, and CAs is financially impossible for early-stage founders.
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } } }} className="relative h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image src="/pitch-assets/pitch_chaos_1780159011280.png" alt="Fragmented Chaos" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Slide 3: Traction & Authority */}
      <section className="relative min-h-screen flex items-center bg-zinc-900/50 py-24 snap-start border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-4">Our Proven Traction</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Bootstrapped & Profitable Service Revenue</h3>
            <p className="text-xl text-gray-400 font-light">
              BizOS SaaS development is entirely funded by profitable service-led revenue (startup incorporations, virtual CFO packages, and GST/compliance setups) generated under SetMyBizz & BizDesk.
            </p>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
              <div className="text-6xl font-black text-white mb-2">600<span className="text-indigo-500">+</span></div>
              <h4 className="text-xl text-gray-200 mb-2">Clients Served</h4>
              <p className="text-gray-500">Service startups, MSMEs, and individual founders to date.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
              <div className="text-6xl font-black text-white mb-2">60<span className="text-indigo-500">+</span></div>
              <h4 className="text-xl text-gray-200 mb-2">Startups Built</h4>
              <p className="text-gray-500">Incorporated and tailor-made from the ground up.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
              <div className="text-6xl font-black text-white mb-2">30</div>
              <h4 className="text-xl text-gray-200 mb-2">Under Our Wings</h4>
              <p className="text-gray-500">Active startups guided with our year-round Virtual CFO advice.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Slide 4: Arkle AI Brain */}
      <section className="relative min-h-screen flex items-center py-24 snap-start border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image src="/pitch-assets/pitch_brain_1780159041154.png" alt="Arkle Brain" fill className="object-cover opacity-20" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-4">The Autonomous Co-Founder</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Not Just Dashboards.<br/>Active Solutions.</h3>
              
              {/* Killer outcome / Concrete use case */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5 mb-6 text-sm text-indigo-300">
                <strong className="block text-white mb-1">Standard Execution Flow:</strong>
                A founder can go from raw idea &rarr; GST registration &rarr; custom website &rarr; invoices &rarr; CRM in a single unified flow.
              </div>

              <p className="text-xl text-gray-300 mb-8 font-light">
                Arkle AI tracks your business, sales, and founder activities daily across 3 dashboards. It doesn't just suggest solutions — it helps you build, automate, and execute them faster.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  <span className="text-lg">Performance & Cashflow Analytics</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Target className="w-6 h-6 text-purple-400" />
                  <span className="text-lg">Bottleneck Detector (Finds where you're stuck)</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Rocket className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg">AI-Assisted Operations & Workflow Automation</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Slide 5: LaunchPad Voice Creation */}
      <section className="relative min-h-screen flex items-center py-24 snap-start border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }} className="relative h-[600px] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)]">
              <Image src="/pitch-assets/pitch_launchpad_1780159027414.png" alt="Voice LaunchPad" fill className="object-cover" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}>
              <h2 className="text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-4">LaunchPad</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Speak Your Way to a Live Business.</h3>
              <p className="text-xl text-gray-400 font-light mb-8">
                Founders can build everything their business needs on day one. Simply speak to Arkle AI in your native language to launch branding, web tools, and business assets.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> Instant Websites & Branding Kits</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> Custom Software & Workflow Tools</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> Native Language Voice Control</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> No technical or coding skills required</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Slide 6: The Competition & Market Moat */}
      <section className="relative min-h-screen flex items-center py-24 snap-start border-t border-white/5 bg-gradient-to-b from-transparent to-[#0A0A0A]">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto mb-16">
            <h2 className="text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-4">Competitive Edge</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Simpler. Smarter. Tailored for India.</h3>
            <p className="text-xl text-gray-400 font-light">
              Built for the 63 Million MSMEs and 1.5M+ new registrations who demand instant execution without the learning curve.
            </p>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-4 gap-6 text-left">
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-2">Zoho One</h4>
              <p className="text-sm text-gray-400">Too complex. Requires weeks of configuration and extensive training.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-2">Monday.com</h4>
              <p className="text-sm text-gray-400">Expensive project tracker. Lacks native AI creation and legal/CA integration.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-2">SuperAGI</h4>
              <p className="text-sm text-gray-400">Requires coding, prompt engineering, and developer setup.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"></div>
              <h4 className="text-xl font-bold text-indigo-300 mb-2 relative z-10">SetMyBizz BizOS</h4>
              <p className="text-sm text-gray-200 relative z-10">Native-language voice controlled. Action-oriented. Deep legal integration. <strong>No technical skills required.</strong></p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Slide 7: Business Model & Monetization */}
      <section className="relative min-h-screen flex items-center py-24 snap-start border-t border-white/5 bg-zinc-900/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-4">Business Model</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">Service-to-SaaS Onboarding</h3>
              <p className="text-lg text-gray-300 font-light mb-8">
                We deliver high-trust compliance and startup support packages that convert transactional setup clients into active monthly software subscribers.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <strong className="block text-indigo-400 text-sm mb-1">Low-Friction Setup Hook</strong>
                  <p className="text-sm text-gray-400">Idea-stage setups (incorporation, finance, marketing) onboards them into BizOS.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <strong className="block text-purple-400 text-sm mb-1">Modular Land-and-Expand SaaS</strong>
                  <p className="text-sm text-gray-400">SaaS plans start from **₹999/month** (excluding LaunchPad/WorkSpace) and scale modularly as they grow.</p>
                </div>
              </div>
            </motion.div>
            
            <div className="border border-white/10 rounded-3xl p-8 bg-black/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h4 className="text-2xl font-bold text-white mb-6">Our 10K Conversion Hook</h4>
              <div className="space-y-6 text-sm text-gray-300">
                <div className="p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                  <span className="text-xs text-indigo-300 uppercase tracking-widest font-bold block mb-1">The Offer</span>
                  <p className="font-semibold text-white">Purchase any incorporation or virtual CFO service worth &ge; ₹10,000 &rarr; Get 4 Months of BizDesk/BizOS free.</p>
                </div>
                <p>&bull; **Step 1:** Establish trust via high-quality compliance & CA setups.</p>
                <p>&bull; **Step 2:** Scale client engagement with 4 months of free workspace tools.</p>
                <p>&bull; **Step 3:** Convert to recurring subscriptions for LaunchPad & WorkSpace features.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 8: The Ask */}
      <section id="ask" className="relative min-h-[80vh] flex items-center py-24 snap-start border-t border-indigo-500/20 bg-indigo-950/20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">Join us in building the Business OS for India's MSMEs.</h2>
            <p className="text-2xl text-indigo-200 font-light mb-12">
              We are seeking strategic incubation and capital to scale Arkle AI's autonomous agent builder and expand our native-language support for ruralpreneurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/50">
                Book 15-Min Demo
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-lg transition-all">
                View Product Demo
              </button>
            </div>
            <div className="mt-16 text-gray-500 text-sm">
              Created by SetMyBizz Team (Powered by Arkle AI)
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
