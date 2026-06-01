'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Download, Sparkles, Sliders, Play, Check, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  layout: 'hero' | 'two-column' | 'traction' | 'matrix' | 'text';
  content: {
    heading: string;
    body?: string;
    bullets?: string[];
    metrics?: { val: string; label: string; desc?: string }[];
    competitors?: { name: string; easy: string; tech: string; price: string }[];
  };
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 'hero',
    title: 'Cover Slide',
    subtitle: 'Slide 1',
    layout: 'hero',
    content: {
      heading: 'Don\'t Just Start. Boot Up an OS.',
      body: 'Building the next-generation operating system for modern business execution.',
    }
  },
  {
    id: 'problem',
    title: 'The Problem',
    subtitle: 'Slide 2',
    layout: 'two-column',
    content: {
      heading: 'Fragmented execution breaks modern business ideas.',
      bullets: [
        'Navigating legal setup and GST compliance takes months of slow manual effort.',
        'Hiring developer agencies, CAs, and designers drains starting capital.',
        'Founders waste 70% of their time juggling 10+ disjointed software interfaces.'
      ]
    }
  },
  {
    id: 'traction',
    title: 'Traction',
    subtitle: 'Slide 3',
    layout: 'traction',
    content: {
      heading: 'Profitable & Service-Led Traction',
      metrics: [
        { val: '600+', label: 'Clients Served', desc: 'MSMEs and startups onboarded.' },
        { val: '60+', label: 'Startups Built', desc: 'Incorporated and fully operational.' },
        { val: '30', label: 'Under Advisement', desc: 'Active virtual CFO support.' }
      ]
    }
  },
  {
    id: 'competitors',
    title: 'Competition',
    subtitle: 'Slide 4',
    layout: 'matrix',
    content: {
      heading: 'Built to Execute. Easier Than the Rest.',
      competitors: [
        { name: 'Zoho One', easy: '❌ Complex Config', tech: '⚠️ Requires Training', price: '💰 Enterprise Cost' },
        { name: 'Monday.com', easy: '⚠️ Simple List Only', tech: '❌ No Legal/CA integration', price: '💸 High Subscription' },
        { name: 'SetMyBizz BizOS', easy: '✅ Instant Setup', tech: '✅ Native AI-Assisted', price: '💎 ₹999/mo Base' }
      ]
    }
  }
];

export default function PitchDeckMaker() {
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [activeIdx, setActiveIdx] = useState(0);
  const [theme, setTheme] = useState<'neon' | 'notion' | 'ocean'>('neon');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Auto trigger generation if prompt query param is present
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryPrompt = params.get('prompt');
      if (queryPrompt) {
        setPrompt(queryPrompt);
        setGenerating(true);
        fetch('/api/launchpad/generate-pitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: queryPrompt })
        })
          .then(res => res.json())
          .then(data => {
            if (data.slides) {
              setSlides(data.slides);
            }
          })
          .catch(err => console.error(err))
          .finally(() => setGenerating(false));
      }
    }
  }, []);

  const activeSlide = slides[activeIdx];

  const handleGenerateAI = async () => {
    if (!prompt) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/launchpad/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.slides) {
        setSlides(data.slides);
        setActiveIdx(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // 1920x1080 resolution
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
      });

      for (let i = 0; i < slides.length; i++) {
        const slideElement = document.getElementById(`pdf-slide-${i}`);
        if (!slideElement) continue;

        // Ensure the element is visible for html2canvas
        const canvas = await html2canvas(slideElement, {
          scale: 1, // 1 is enough since we render at 1920x1080 natively
          useCORS: true,
          logging: false,
          width: 1920,
          height: 1080,
          backgroundColor: theme === 'notion' ? '#ffffff' : theme === 'ocean' ? '#064e3b' : '#0a0a0a',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage([1920, 1080], 'landscape');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 1920, 1080);
      }

      pdf.save('Pitch_Deck.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Styles based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case 'notion':
        return {
          bg: 'bg-white text-zinc-900 border-zinc-200',
          card: 'bg-zinc-50 border border-zinc-200 text-zinc-800',
          accent: 'text-indigo-600',
          gradientText: 'text-zinc-900',
        };
      case 'ocean':
        return {
          bg: 'bg-gradient-to-br from-cyan-950 to-emerald-950 text-emerald-50 border-emerald-900',
          card: 'bg-emerald-900/20 border border-emerald-800/40 text-emerald-200',
          accent: 'text-cyan-400',
          gradientText: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400',
        };
      default: // neon
        return {
          bg: 'bg-[#0A0A0A] text-white border-zinc-900',
          card: 'bg-zinc-900/60 border border-zinc-800 text-zinc-300',
          accent: 'text-indigo-400',
          gradientText: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500',
        };
    }
  };

  const styles = getThemeStyles();

  // Unified component to render slide content for both preview and PDF
  const SlideContent = ({ slide, isPdf }: { slide: Slide, isPdf?: boolean }) => {
    // Scaling factors based on whether it's PDF rendering (1920x1080) or UI Preview
    const scalingClass = isPdf ? 'text-[24px]' : 'text-xs';
    
    return (
      <div className="flex flex-col h-full w-full">
        {/* Slide Header */}
        <div className={`flex justify-between items-center opacity-80 border-b pb-4 border-current/10 ${isPdf ? 'pt-8' : ''}`}>
          <span className={`${isPdf ? 'text-3xl' : 'text-xs'} font-bold uppercase tracking-widest`}>{slide.title}</span>
          <span className={`${isPdf ? 'text-2xl' : 'text-xs'} font-light`}>{slide.subtitle}</span>
        </div>

        {/* Slide Layout Switcher */}
        <div className="flex-1 flex flex-col justify-center my-6">
          
          {/* HERO LAYOUT */}
          {slide.layout === 'hero' && (
            <div className={`text-center max-w-4xl mx-auto space-y-6 ${isPdf ? 'max-w-7xl space-y-12' : ''}`}>
              <h2 className={`${isPdf ? 'text-7xl leading-tight' : 'text-4xl md:text-5xl leading-tight'} font-black tracking-tight ${styles.gradientText}`}>
                {slide.content.heading}
              </h2>
              {slide.content.body && (
                <p className={`${isPdf ? 'text-4xl' : 'text-lg'} opacity-75 font-light`}>{slide.content.body}</p>
              )}
            </div>
          )}

          {/* TWO-COLUMN LAYOUT */}
          {slide.layout === 'two-column' && (
            <div className={`grid md:grid-cols-5 gap-10 items-center ${isPdf ? 'gap-16' : ''}`}>
              <div className={`md:col-span-3 space-y-4 ${isPdf ? 'space-y-10' : ''}`}>
                <h2 className={`${isPdf ? 'text-6xl' : 'text-3xl'} font-extrabold tracking-tight leading-tight`}>
                  {slide.content.heading}
                </h2>
                {slide.content.body && (
                  <p className={`${isPdf ? 'text-3xl leading-relaxed' : 'text-sm leading-relaxed'} opacity-70`}>{slide.content.body}</p>
                )}
              </div>
              <div className={`md:col-span-2 space-y-3.5 ${isPdf ? 'space-y-6' : ''}`}>
                {slide.content.bullets?.map((b, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${styles.card} flex gap-3 items-start ${isPdf ? 'p-8 text-2xl gap-5 rounded-3xl' : 'text-xs'}`}>
                    <span className={`bg-indigo-500 rounded-full shrink-0 ${isPdf ? 'w-4 h-4 mt-2' : 'w-1.5 h-1.5 mt-1.5'}`} />
                    <span className={isPdf ? 'leading-normal' : ''}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRACTION LAYOUT */}
          {slide.layout === 'traction' && (
            <div className={`space-y-8 ${isPdf ? 'space-y-16' : ''}`}>
              <h2 className={`${isPdf ? 'text-6xl' : 'text-3xl'} font-extrabold text-center tracking-tight mb-4`}>{slide.content.heading}</h2>
              <div className={`grid grid-cols-3 gap-6 text-center ${isPdf ? 'gap-12' : ''}`}>
                {slide.content.metrics?.map((m, i) => (
                  <div key={i} className={`p-6 rounded-2xl ${styles.card} ${isPdf ? 'p-12 rounded-3xl' : 'hover:scale-105 transition-all'}`}>
                    <div className={`${isPdf ? 'text-8xl mb-4' : 'text-4xl mb-1.5'} font-black text-white`}>{m.val}</div>
                    <h4 className={`${isPdf ? 'text-4xl mb-3' : 'text-sm mb-1'} font-bold text-gray-200`}>{m.label}</h4>
                    {m.desc && <p className={`${isPdf ? 'text-2xl' : 'text-[10px]'} text-gray-500`}>{m.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATRIX LAYOUT */}
          {slide.layout === 'matrix' && (
            <div className={`space-y-6 ${isPdf ? 'space-y-12' : ''}`}>
              <h2 className={`${isPdf ? 'text-6xl mb-8' : 'text-2xl mb-2'} font-extrabold tracking-tight leading-tight text-center`}>
                {slide.content.heading}
              </h2>
              <div className={`grid grid-cols-4 gap-4 font-semibold text-center border-t border-current/10 pt-4 ${isPdf ? 'text-3xl gap-8 pt-10' : 'text-xs'}`}>
                <span className="text-left font-bold opacity-60">Competitor</span>
                <span className="opacity-60">Simplicity</span>
                <span className="opacity-60">AI Integration</span>
                <span className="opacity-60">Pricing</span>

                {slide.content.competitors?.map((c, i) => (
                  <React.Fragment key={i}>
                    <span className={`text-left font-bold text-white border-t border-current/5 py-3 ${isPdf ? 'py-8' : ''}`}>{c.name}</span>
                    <span className={`border-t border-current/5 py-3 text-zinc-400 ${isPdf ? 'py-8' : ''}`}>{c.easy}</span>
                    <span className={`border-t border-current/5 py-3 text-zinc-400 ${isPdf ? 'py-8' : ''}`}>{c.tech}</span>
                    <span className={`border-t border-current/5 py-3 text-indigo-400 font-bold ${isPdf ? 'py-8' : ''}`}>{c.price}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Slide Footer */}
        <div className={`flex justify-between items-center opacity-65 uppercase tracking-widest pt-4 border-t border-current/10 ${isPdf ? 'text-2xl pt-8 pb-8' : 'text-[10px]'}`}>
          <span>SetMyBizz BizOS Creator</span>
          <span>Powered by Arkle AI</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-white">
      
      {/* LEFT COLUMN: Controls & Slide Editor */}
      <aside className="w-[30%] h-full bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 relative z-10">
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/launchpad" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Launchpad
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => setTheme('neon')} 
                className={`w-4 h-4 rounded-full bg-purple-500 border ${theme === 'neon' ? 'border-white scale-125' : 'border-transparent'}`} 
              />
              <button 
                onClick={() => setTheme('notion')} 
                className={`w-4 h-4 rounded-full bg-zinc-400 border ${theme === 'notion' ? 'border-zinc-900 scale-125' : 'border-transparent'}`} 
              />
              <button 
                onClick={() => setTheme('ocean')} 
                className={`w-4 h-4 rounded-full bg-emerald-500 border ${theme === 'ocean' ? 'border-white scale-125' : 'border-transparent'}`} 
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">LaunchPad Tool</span>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Pitch Deck Maker <Sparkles className="w-5 h-5 text-indigo-400" />
            </h1>
          </div>

          {/* AI Generator Box */}
          <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Deck Builder
            </h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A rural agricultural platform delivering organic fertilizer via subscription model..."
              className="w-full text-xs p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-zinc-500 resize-none h-20"
            />
            <button
              onClick={handleGenerateAI}
              disabled={generating || !prompt}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {generating ? 'Structuring Deck...' : 'Generate Visual Deck'}
            </button>
          </div>

          {/* Slide Navigator List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Presentation Slides</h3>
            <div className="space-y-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                    activeIdx === idx 
                      ? 'bg-zinc-800 border-indigo-500/50 shadow-md text-white font-bold' 
                      : 'bg-zinc-950/30 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black">{s.title}</h4>
                    <span className="text-[9px] text-zinc-500">{s.subtitle}</span>
                  </div>
                  {activeIdx === idx && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/20 flex gap-2">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {isDownloading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF...</>
            ) : (
              <><Download className="w-4 h-4" /> Download PDF</>
            )}
          </button>
        </div>
      </aside>

      {/* RIGHT COLUMN: Active Slide Live Preview */}
      <main className="flex-1 h-full bg-[#050505] flex items-center justify-center p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none" />
        
        {/* Rendered Slide Area */}
        <div className={`w-full max-w-4xl aspect-[16/9] rounded-3xl p-16 shadow-2xl flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${styles.bg}`}>
          {/* Decorative Slide Light Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <SlideContent slide={activeSlide} isPdf={false} />
        </div>
      </main>

      {/* HIDDEN CONTAINER FOR PDF RENDERING */}
      {/* We render all slides at exact 1920x1080 resolution offscreen so html2canvas captures them beautifully */}
      <div 
        ref={pdfContainerRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1920px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            id={`pdf-slide-${idx}`} 
            style={{ width: '1920px', height: '1080px' }}
            className={`p-24 shadow-none flex flex-col justify-between relative overflow-hidden ${styles.bg}`}
          >
            {/* Same decorative glow as UI */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <SlideContent slide={slide} isPdf={true} />
          </div>
        ))}
      </div>

    </div>
  );
}
