'use client';
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { useBizStore } from '@/lib/useBizStore';

type Msg = { role: 'user' | 'ai'; text: string; mode?: ArkleMode };
type ArkleMode = 'Voice' | 'Autopilot' | 'Builder' | 'Auditor';

type Conversation = {
   id: string;
   title: string;
   messages: Msg[];
   timestamp: Date;
};

type GeneratedDoc = {
   id: string;
   name: string;
   type: 'doc' | 'sheet' | 'pdf';
   date: string;
   content?: string;
};

const MODE_PROMPTS: Record<ArkleMode, string> = {
  Voice: "You are in 'Live Voice Mode'. Focus on low-latency, conversational 'Talk to Build' interactions. Trigger commerce or technical setup if user expresses intent (e.g. 'Sell on Amazon'). Speak in Telugu/English.",
  Autopilot: "You are in 'Autopilot Mode'. Proactively monitor the dashboard for gaps. If GST is overdue or stock is low, notify user with a solution. Be concise and authoritative.",
  Builder: "You are in 'Builder Mode'. Connect to the code engine. When user speaks an idea, design logos, websites, and digital workers instantly without needing user prompts.",
  Auditor: "You are in 'Strategic Auditor Mode'. Analyze business health, financial weaknesses, and provide results-oriented advice (e.g. reducing burn rate)."
};

const ARKLE_SYSTEM_PROMPT = `You are Arkle, the World's First Super Human AI Co-Founder. 
Your goal is to build and manage the user's business. You are a 'Digital Employee' for non-tech rural-preneurs.
Context: You have full access to BizDesk, Launchpad, and Founders Brain. You are proactive, strategic, and result-oriented.
If the status is 'Autopilot', suggest solutions before user asks. If 'Builder', generate assets immediately.`;

export default function ArklePanel({ onClose, selectedLang = 'en-IN' }: { onClose?: () => void, selectedLang?: string }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: "Systems initialized. I am Arkle, your AI Co-Founder. Which mode shall we activate?", mode: 'Voice' }]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chats' | 'docs'>('chats');
  const [selectedDoc, setSelectedDoc] = useState<GeneratedDoc | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
     {
        id: 'c-1',
        title: 'Amazon Product Launch',
        messages: [
           { role: 'user', text: 'What are the steps for launching on Amazon?' },
           { role: 'ai', text: 'Here is the Amazon onboarding plan: 1. Setup seller account, 2. Optimize Product SEO keywords, 3. Upload catalog.', mode: 'Voice' }
        ],
        timestamp: new Date(Date.now() - 3600000)
     },
     {
        id: 'c-2',
        title: 'GSTR-1 Tax Strategy',
        messages: [
           { role: 'user', text: 'What is the penalty for filing late?' },
           { role: 'ai', text: 'Late filing penalty is ₹50/day. Let\'s file it today to avoid penalty accumulation.', mode: 'Voice' }
        ],
        timestamp: new Date(Date.now() - 7200000)
     }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('c-1');
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDoc[]>([
     { id: 'd1', name: 'Amazon_Onboarding_Audit.pdf', type: 'pdf', date: '2 hours ago' },
     { id: 'd2', name: 'GSTR-1_Filing_Summary.docx', type: 'doc', date: 'Yesterday' },
     { id: 'd3', name: 'Q2_Financial_Projections.xlsx', type: 'sheet', date: 'June 15, 2026' }
  ]);

  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const isVoiceActive = useBizStore((state) => state.isVoiceActive);
  const setIsVoiceActive = useBizStore((state) => state.setIsVoiceActive);
  const liveTranscriptGlobal = useBizStore((state) => state.liveTranscript);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [activeMode, setActiveMode] = useState<ArkleMode>('Voice');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isAiTalking, setIsAiTalking]   = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const draggableNodeRef = useRef<HTMLDivElement>(null);

  /* ── Voice Synthesis (Neural/Azure Style) ── */
  const speak = (text: string, lang = 'en-IN') => {
    if (!isSpeechEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === lang && v.name.includes('Neural')) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    
    utterance.onstart = () => { 
      setIsAiTalking(true);
      if (recognitionRef.current) recognitionRef.current.stop(); 
      setIsRecording(false); 
    };
    utterance.onend = () => { 
      setIsAiTalking(false);
      if (isVoiceActive) startRecognition(); 
    };
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); setIsRecording(true); } catch (e) {}
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false); }
  };

  useEffect(() => {
    document.body.classList.add('arkle-panel-open');
    return () => document.body.classList.remove('arkle-panel-open');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang;
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) { transcript += event.results[i][0].transcript; }
          setLiveTranscript(transcript);
          setInput(transcript);
          if (event.results[event.results.length - 1].isFinal) {
             const final = transcript;
             setTimeout(() => { if (final.length > 2) send(final); }, 1000);
          }
        };
        recognitionRef.current = recognition;
      }
    }
  }, [selectedLang]);

  const toggleVoiceMode = () => {
    setIsVoiceActive(true);
    setIsSpeechEnabled(true);
  };
  const handleNewChat = () => {
    const newId = 'c-' + Date.now().toString();
    const newConv: Conversation = {
       id: newId,
       title: `New Session ${conversations.length + 1}`,
       messages: [],
       timestamp: new Date()
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find(c => c.id === id);
    if (conv) {
       setMessages(conv.messages);
    }
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
       setActiveConversationId(null);
       setMessages([]);
    }
  };

  const send = async (textOverride?: string) => {
    const q = textOverride || input.trim();
    if (!q || loading) return;
    
    setInput('');
    setLiveTranscript('');
    
    const newUserMsg: Msg = { role: 'user', text: q, mode: activeMode };
    let currentConvId = activeConversationId;
    let updatedConversations = [...conversations];

    if (!currentConvId || conversations.length === 0) {
       currentConvId = 'c-' + Date.now().toString();
       const newConv: Conversation = {
          id: currentConvId,
          title: q.length > 20 ? q.substring(0, 20) + '...' : q,
          messages: [newUserMsg],
          timestamp: new Date()
       };
       updatedConversations = [newConv, ...updatedConversations];
       setConversations(updatedConversations);
       setActiveConversationId(currentConvId);
       setMessages([newUserMsg]);
    } else {
       updatedConversations = conversations.map(c => {
          if (c.id === currentConvId) {
             const updatedMsgs = [...c.messages, newUserMsg];
             setMessages(updatedMsgs);
             return { 
                ...c, 
                title: c.messages.length === 0 ? (q.length > 20 ? q.substring(0, 20) + '...' : q) : c.title,
                messages: updatedMsgs, 
                timestamp: new Date() 
             };
          }
          return c;
       });
       setConversations(updatedConversations);
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/gemini', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          prompt: q,
          messages: messages.map(m => ({ 
            role: m.role === 'ai' ? 'assistant' : 'user', 
            content: m.text 
          })),
          context: {
            currentDashboard: 'neural',
            activeMode,
            selectedLang
          }
        }) 
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      let aiResponse = data.text;
      
      // Bug fix: Use SEPARATE regex instances to avoid stateful /g flag issue.
      // One instance for the while-loop execution, one for the .replace() cleanup.
      const directiveExecRegex = /\[DIRECTIVE:\s*(\w+)\s*({.*?})\]/g;
      const directiveCleanRegex = /\[DIRECTIVE:\s*(\w+)\s*({.*?})\]/g;
      let match;
      let lastDocGenerated: { name: string; type: 'doc' | 'sheet' | 'pdf' } | null = null;

      while ((match = directiveExecRegex.exec(aiResponse)) !== null) {
        const action = match[1];
        try {
          const payload = JSON.parse(match[2]);
          
          if (action === 'NOTIFY') {
            // Future: Toast notification
          } else if (action === 'CREATE_INVOICE_DRAFT' || action === 'ADD_LINE_ITEM' || action === 'SET_PARTY') {
            window.dispatchEvent(new CustomEvent('open-billease'));
            const sendToIframe = () => {
              const iframe = document.querySelector('iframe[title="BillEase"]') as HTMLIFrameElement;
              if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ action, data: payload }, "*");
                return true;
              }
              return false;
            };
            if (!sendToIframe()) {
              setTimeout(sendToIframe, 500);
              setTimeout(sendToIframe, 1500);
            }
            // Track in docs sidebar using actual payload title
            const invoiceName = payload.partyName ? `Invoice_${payload.partyName.replace(/\s+/g, '_')}.pdf` : 'Invoice_Draft.pdf';
            lastDocGenerated = { name: invoiceName, type: 'pdf' };
          } else if (action === 'ADD_CRM_LEAD') {
            fetch('/api/crm/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: payload.name,
                phone: payload.phone,
                note: payload.note,
                source: 'Arkle OS',
                category: 'Unknown',
                stage: 'New',
                priority: 'Medium'
              })
            }).then(() => {
              window.dispatchEvent(new CustomEvent('crm-leads-updated'));
            });
          } else if (action === 'UPDATE_CRM_LEAD') {
            fetch('/api/crm/leads', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: payload.id,
                stage: payload.stage
              })
            }).then(() => {
              window.dispatchEvent(new CustomEvent('crm-leads-updated'));
            });
          } else if (action === 'CREATE_GOOGLE_DOC') {
            fetch('/api/integrations/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action, payload })
            }).then(() => window.dispatchEvent(new CustomEvent('crm-leads-updated')));
            const docTitle = payload.title ? `${payload.title.replace(/\s+/g, '_')}.docx` : 'AI_Document.docx';
            lastDocGenerated = { name: docTitle, type: 'doc' };
          } else if (action === 'CREATE_GOOGLE_SHEET') {
            fetch('/api/integrations/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action, payload })
            }).then(() => window.dispatchEvent(new CustomEvent('crm-leads-updated')));
            const sheetTitle = payload.title ? `${payload.title.replace(/\s+/g, '_')}.xlsx` : 'AI_Sheet.xlsx';
            lastDocGenerated = { name: sheetTitle, type: 'sheet' };
          } else if (action === 'SEND_EMAIL' || action === 'CREATE_CALENDAR_EVENT') {
            fetch('/api/integrations/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action, payload })
            }).then(() => window.dispatchEvent(new CustomEvent('crm-leads-updated')));
          }
        } catch (err) {
          console.error("Failed to parse directive payload:", err);
        }
      }

      // Use the separate clean regex instance (not consumed by the loop)
      const cleanResponse = aiResponse.replace(directiveCleanRegex, '').trim();
      const newAiMsg: Msg = { role: 'ai', text: cleanResponse, mode: activeMode };

      // Auto-register generated doc to the sidebar docs tab
      if (lastDocGenerated) {
         setGeneratedDocs(prev => [{ id: 'd-' + Date.now().toString(), name: lastDocGenerated!.name, type: lastDocGenerated!.type, date: 'Just now' }, ...prev]);
      }
      
      setConversations(prev => prev.map(c => {
         if (c.id === currentConvId) {
            const updatedMsgs = [...c.messages, newAiMsg];
            setMessages(updatedMsgs);
            return { ...c, messages: updatedMsgs, timestamp: new Date() };
         }
         return c;
      }));
      speak(cleanResponse, selectedLang);
    } catch (error: any) {
      console.error("Arkle Brain Sync Error:", error);
      const errAiMsg: Msg = { 
        role: 'ai', 
        text: `❌ Brain Sync Error: ${error.message}. Please check your connection.`, 
        mode: activeMode 
      };
      setConversations(prev => prev.map(c => {
         if (c.id === currentConvId) {
            const updatedMsgs = [...c.messages, errAiMsg];
            setMessages(updatedMsgs);
            return { ...c, messages: updatedMsgs, timestamp: new Date() };
         }
         return c;
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const modes: { id: ArkleMode, icon: string, color: string }[] = [
    { id: 'Voice', icon: 'record_voice_over', color: 'sky' },
    { id: 'Autopilot', icon: 'auto_mode', color: 'emerald' },
    { id: 'Builder', icon: 'architecture', color: 'indigo' },
    { id: 'Auditor', icon: 'analytics', color: 'amber' }
  ];

  return (
    // @ts-ignore
    <Draggable nodeRef={draggableNodeRef} handle=".arkle-drag-handle" bounds="parent">
      <div 
        ref={draggableNodeRef}
        className="fixed bottom-24 right-8 w-[720px] h-[72%] max-h-[760px] min-h-[520px] bg-slate-900/95 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] flex z-[200] overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500"
      >
        {/* Left Sidebar (ChatGPT Style) */}
        <div className="w-[240px] bg-slate-950/95 border-r border-white/5 flex flex-col p-4 shrink-0 text-slate-100 select-none">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                   <span className="material-symbols-rounded text-white text-[15px]">auto_awesome</span>
                </div>
                <span className="font-black text-[12px] uppercase tracking-wider">Arkle GPT</span>
             </div>
             <button 
                onClick={handleNewChat}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title="New Chat"
             >
                <span className="material-symbols-rounded text-[16px]">add</span>
             </button>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-2 bg-white/5 p-1 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-wider mb-4 text-center">
             <button 
                onClick={() => setActiveSidebarTab('chats')}
                className={`py-1.5 rounded-lg transition-all ${activeSidebarTab === 'chats' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
                Chats
             </button>
             <button 
                onClick={() => setActiveSidebarTab('docs')}
                className={`py-1.5 rounded-lg transition-all ${activeSidebarTab === 'docs' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
                Docs
             </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
             {activeSidebarTab === 'chats' ? (
                <div className="space-y-1">
                   {conversations.map(conv => {
                      const isActive = activeConversationId === conv.id;
                      return (
                         <div 
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv.id)}
                            className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                               isActive ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'
                            }`}
                         >
                            <div className="flex items-center gap-2 min-w-0">
                               <span className="material-symbols-rounded text-[14px] text-slate-400">chat_bubble</span>
                               <span className="text-[11px] font-bold truncate text-slate-200">{conv.title}</span>
                            </div>
                            <button 
                               onClick={(e) => handleDeleteConversation(conv.id, e)}
                               className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded-md transition-all text-slate-450"
                               title="Delete Chat"
                            >
                               <span className="material-symbols-rounded text-xs">delete</span>
                            </button>
                         </div>
                      );
                   })}
                </div>
             ) : (
                <div className="space-y-1">
                   {generatedDocs.map(doc => (
                      <div 
                         key={doc.id}
                         onClick={() => setSelectedDoc(doc)}
                         className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent"
                      >
                         <span className={`material-symbols-rounded text-[16px] ${
                            doc.type === 'pdf' ? 'text-rose-400' : doc.type === 'sheet' ? 'text-emerald-400' : 'text-blue-400'
                         }`}>
                            {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type === 'sheet' ? 'table_view' : 'description'}
                         </span>
                         <div className="min-w-0">
                            <span className="text-[11px] font-bold text-slate-200 block truncate">{doc.name}</span>
                            <span className="text-[8px] text-slate-500 block uppercase tracking-wider mt-0.5">{doc.type} • {doc.date}</span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col bg-slate-900/95 overflow-hidden">
          {/* Neural Header with Mode Selector */}
          <div className="arkle-drag-handle shrink-0 p-5 bg-white/5 border-b border-white/5 cursor-grab active:cursor-grabbing select-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-tr from-sky-400 to-indigo-600 rounded-[14px] flex items-center justify-center shadow-xl shadow-sky-500/20">
                  <span className="material-symbols-outlined text-white text-[22px] animate-pulse">psychology</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-[14px] uppercase tracking-widest leading-none">Arkle Agent</h3>
                  <p className="text-sky-400 text-[8px] font-black uppercase tracking-[0.3em] mt-1.5">Autonomous Co-Founder</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSpeechEnabled ? 'text-sky-400 bg-sky-500/10' : 'text-white/20 hover:text-white/40'}`}>
                    <span className="material-symbols-outlined text-[16px]">{isSpeechEnabled ? 'volume_up' : 'volume_off'}</span>
                 </button>
                 <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/80 hover:scale-105 active:scale-95 flex items-center justify-center text-white/50 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                 </button>
              </div>
            </div>

            {/* Mode Hub */}
            <div className="grid grid-cols-4 gap-2">
              {modes.map(m => {
                // Use static class maps to prevent Tailwind purge stripping dynamic class strings
                const activeClsMap: Record<string, string> = {
                  'Voice':    'bg-sky-500/20 border-sky-500/40 text-sky-400',
                  'Autopilot':'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
                  'Builder':  'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
                  'Auditor':  'bg-amber-500/20 border-amber-500/40 text-amber-400',
                };
                return (
                  <button 
                    key={m.id}
                    onClick={() => setActiveMode(m.id)}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                      activeMode === m.id
                        ? `${activeClsMap[m.id]} shadow-lg`
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">{m.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Context Stream */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 no-scrollbar relative">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div className={`px-4 py-3 rounded-[20px] text-[12px] leading-relaxed font-medium ${msg.role === 'user' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'bg-white/10 text-white border border-white/10'}`}>
                    {msg.text}
                  </div>
                  {msg.role === 'ai' && (
                     <div className="flex items-center gap-1 px-1.5">
                        <div className="w-1 h-1 rounded-full bg-sky-400/40" />
                        <span className="text-[6.5px] font-black text-sky-400/40 uppercase tracking-widest">{msg.mode} Engine</span>
                     </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                     <span className="w-1.2 h-1.2 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-1.2 h-1.2 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-1.2 h-1.2 rounded-full bg-sky-400 animate-bounce" />
                  </div>
                  <div className="text-sky-400 text-[8px] font-black uppercase tracking-widest">Neural Strategizing...</div>
               </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Neural Input Capsule */}
          <div className="p-5 pt-2 bg-transparent shrink-0 relative">
            {/* 🌀 Floating Neural Prompts */}
            <div className="absolute -top-8 inset-x-0 px-5 flex flex-wrap justify-center gap-1.5 pointer-events-none">
               {['Sell on Amazon', 'GST Audit', 'Export Loop', 'Logo Design'].map((text, i) => (
                  <motion.button
                    key={text}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ 
                      opacity: isVoiceActive ? 0 : 1, 
                      y: isVoiceActive ? 15 : [0, -6, 0],
                      transition: { 
                        delay: i * 0.1,
                        y: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" }
                      }
                    }}
                    onClick={() => send(text)}
                    className="pointer-events-auto px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black text-sky-400 uppercase tracking-widest hover:bg-sky-400 hover:text-white hover:border-sky-400 transition-all shadow-2xl"
                  >
                    {text}
                  </motion.button>
               ))}
            </div>

            <div className="relative group">
              <div className={`flex items-center gap-3 bg-sky-50 hover:bg-sky-100 transition-all p-1.5 pl-4 rounded-full border border-sky-200 shadow-2xl focus-within:ring-4 focus-within:ring-sky-500/10 ${isVoiceActive ? 'opacity-0 pointer-events-none translate-y-3' : 'opacity-100 translate-y-0'}`}>
                <button className="text-sky-400 hover:text-sky-600 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </button>

                <input 
                  value={isVoiceActive && liveTranscriptGlobal ? liveTranscriptGlobal : input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  className="flex-1 bg-transparent text-slate-800 text-[13px] font-bold outline-none placeholder-slate-400 py-2"
                  placeholder={isVoiceActive ? "Listening..." : `Ask Arkle (${activeMode})...`}
                />

                <button onClick={toggleVoiceMode} className="text-slate-400 hover:text-slate-900 w-8 h-8 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>

                <button onClick={() => send()} disabled={!input.trim() && !liveTranscript.trim()} className="w-9 h-9 bg-sky-400 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-400/20">
                  <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                </button>
              </div>
            </div>
            <p className="text-center mt-3 text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Arkle Autonomous v3.2 • {activeMode} Active</p>
          </div>
        </div>

        {/* Selected Doc Preview Modal */}
        <AnimatePresence>
           {selectedDoc && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[300] flex items-center justify-center p-6 select-none pointer-events-auto">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-2xl w-full max-w-lg h-[60vh]"
                 >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                       <div className="flex items-center gap-2">
                          <span className={`material-symbols-rounded text-lg ${
                             selectedDoc.type === 'pdf' ? 'text-rose-500' : selectedDoc.type === 'sheet' ? 'text-emerald-500' : 'text-blue-500'
                          }`}>
                             {selectedDoc.type === 'pdf' ? 'picture_as_pdf' : selectedDoc.type === 'sheet' ? 'table_view' : 'description'}
                          </span>
                          <div>
                             <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{selectedDoc.name}</h3>
                             <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Arkle Doc Engine</p>
                          </div>
                       </div>
                       <button onClick={() => setSelectedDoc(null)} className="w-7 h-7 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                          <span className="material-symbols-rounded text-xs">close</span>
                       </button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-slate-50/50">
                       <div className="bg-white p-5 border border-slate-150 rounded-xl space-y-4 text-[11px] text-slate-600 leading-relaxed">
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Document Registry</span>
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{selectedDoc.date}</span>
                          </div>
                          <h1 className="text-sm font-bold text-slate-900">{selectedDoc.name.replace(/\.[^/.]+$/, "")}</h1>
                          <p>This report or sheet was constructed autonomously by Arkle Co-Founder core based on context metrics.</p>
                          <ul className="list-disc pl-4 space-y-1 text-slate-700">
                             <li>Synced business profile metadata.</li>
                             <li>Analyzed performance gaps context.</li>
                             <li>Compiled secure output package.</li>
                          </ul>
                          <p>Security Status: <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold text-[8px] border border-green-100">VERIFIED</span></p>
                       </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 shrink-0">
                       <button className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-[10px] font-bold text-slate-600 uppercase transition-all">Download</button>
                       <button onClick={() => setSelectedDoc(null)} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">Close</button>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
      </div>
    </Draggable>
  );
}
