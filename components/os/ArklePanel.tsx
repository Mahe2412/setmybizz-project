'use client';
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { useBizStore } from '@/lib/useBizStore';

type UploadedFile = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type Msg = { 
  role: 'user' | 'ai'; 
  text: string; 
  mode?: ArkleMode;
  files?: UploadedFile[];
};

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
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
  const isInlineBarMode = useBizStore((state) => state.isInlineBarMode);
  const setIsInlineBarMode = useBizStore((state) => state.setIsInlineBarMode);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [executionMode, setExecutionMode] = useState<'Brain' | 'Agent' | 'Builder'>('Brain');
  const [activeContextTool, setActiveContextTool] = useState<'Global' | 'Active Sheet' | 'Gmail' | 'WhatsApp' | 'Bill Book'>('Global');
  const [activeWorkflow, setActiveWorkflow] = useState<'None' | 'Sales Outreach' | 'Tax Filing' | 'Onboarding'>('None');
  const [activeDropdown, setActiveDropdown] = useState<'mode' | 'tool' | 'workflow' | 'settings' | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isAiTalking, setIsAiTalking]   = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const calculatedHeight = Math.max(40, Math.min(textareaRef.current.scrollHeight, 150));
      textareaRef.current.style.height = `${calculatedHeight}px`;
    }
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: UploadedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };
  
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
    if ((!q && uploadedFiles.length === 0) || loading) return;
    
    const mappedMode: ArkleMode = executionMode === 'Brain' ? 'Auditor' : executionMode === 'Agent' ? 'Autopilot' : 'Builder';
    const newUserMsg: Msg = { 
      role: 'user', 
      text: q || (uploadedFiles.length > 0 ? `Uploaded ${uploadedFiles.length} file(s)` : ''), 
      mode: mappedMode,
      files: uploadedFiles
    };
    
    let currentConvId = activeConversationId;
    let updatedConversations = [...conversations];

    // If files were uploaded, we can append their description to the prompt
    let promptText = q;
    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileDescriptions = uploadedFiles.map(f => `[Uploaded File: ${f.name} (type: ${f.type}, size: ${f.size} bytes)]`).join('\n');
      promptText = `${fileDescriptions}\n${promptText || 'Read the uploaded file(s).'}`;
    }

    setInput('');
    setUploadedFiles([]);
    setLiveTranscript('');
    
    if (!currentConvId || conversations.length === 0) {
       currentConvId = 'c-' + Date.now().toString();
       const newConv: Conversation = {
          id: currentConvId,
          title: q ? (q.length > 20 ? q.substring(0, 20) + '...' : q) : (uploadedFiles.length > 0 ? uploadedFiles[0].name : 'New Chat'),
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
          prompt: activeContextTool !== 'Global' ? `[Context Tool: ${activeContextTool}] ${promptText}` : promptText,
          messages: messages.map(m => ({ 
            role: m.role === 'ai' ? 'assistant' : 'user', 
            content: m.text 
          })),
          context: {
            currentDashboard: 'neural',
            activeMode: mappedMode,
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
      const newAiMsg: Msg = { role: 'ai', text: cleanResponse, mode: mappedMode };

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
        mode: mappedMode 
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

  const [panelWidth, setPanelWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarWidth = isSidebarCollapsed ? 0 : 240;
      const newTotalWidth = window.innerWidth - e.clientX;
      const newChatWidth = newTotalWidth - sidebarWidth;
      
      if (newChatWidth > 280 && newChatWidth < 800) {
        setPanelWidth(newChatWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, isSidebarCollapsed]);

  const modes: { id: ArkleMode, icon: string, color: string }[] = [
    { id: 'Voice', icon: 'record_voice_over', color: 'sky' },
    { id: 'Autopilot', icon: 'auto_mode', color: 'emerald' },
    { id: 'Builder', icon: 'architecture', color: 'indigo' },
    { id: 'Auditor', icon: 'analytics', color: 'amber' }
  ];

  return (
    <>
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isInlineBarMode ? 0 : (isSidebarCollapsed ? 0 : 240) + panelWidth, 
          opacity: isInlineBarMode ? 0 : 1 
        }}
        exit={{ width: 0, opacity: 0 }}
        transition={isResizing ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 220 }}
        className={`h-full border-l bg-white flex shrink min-w-0 relative overflow-hidden z-40 transition-[border] ${
          isInlineBarMode ? 'pointer-events-none border-transparent' : 'border-slate-200'
        }`}
      >
      {/* Left Resize Handle */}
      {!isInlineBarMode && (
        <div 
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          className={`absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 transition-colors ${
            isResizing ? 'bg-[#1a73e8]' : 'hover:bg-slate-350'
          }`}
        />
      )}
        <motion.div 
          animate={{ 
            width: isSidebarCollapsed ? 0 : 240,
            paddingLeft: isSidebarCollapsed ? 0 : 12,
            paddingRight: isSidebarCollapsed ? 0 : 12,
            paddingTop: isSidebarCollapsed ? 0 : 12,
            paddingBottom: isSidebarCollapsed ? 0 : 12,
            borderRightWidth: isSidebarCollapsed ? 0 : 1
          }}
          transition={isResizing ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 220 }}
          className="bg-slate-50/95 border-solid border-[#e9eef6] flex flex-col shrink-0 text-slate-800 select-none overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4 min-w-[208px] h-8">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                   <span className="material-symbols-rounded text-white text-[15px]">auto_awesome</span>
                </div>
                {!isSidebarCollapsed && (
                   <span className="font-black text-[12px] uppercase tracking-wider text-slate-800 animate-in fade-in duration-300">Arkle GPT</span>
                )}
             </div>
             {!isSidebarCollapsed && (
                <button 
                   onClick={handleNewChat}
                   className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors animate-in fade-in duration-300"
                   title="New Chat"
                >
                   <span className="material-symbols-rounded text-[16px]">add</span>
                </button>
             )}
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-2 bg-slate-200/50 p-1 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-wider mb-4 text-center min-w-[208px] transition-all duration-300" style={{ opacity: isSidebarCollapsed ? 0.3 : 1, pointerEvents: isSidebarCollapsed ? 'none' : 'auto' }}>
             <button 
                onClick={() => setActiveSidebarTab('chats')}
                className={`py-1.5 rounded-lg transition-all ${activeSidebarTab === 'chats' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Chats
             </button>
             <button 
                onClick={() => setActiveSidebarTab('docs')}
                className={`py-1.5 rounded-lg transition-all ${activeSidebarTab === 'docs' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Docs
             </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 min-w-[208px]">
             {activeSidebarTab === 'chats' ? (
                <div className="space-y-1">
                   {conversations.map(conv => {
                      const isActive = activeConversationId === conv.id;
                      return (
                         <div 
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv.id)}
                            className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                               isActive ? 'bg-white border border-slate-200 shadow-sm' : 'hover:bg-slate-200/50 border border-transparent'
                            }`}
                         >
                            <div className="flex items-center gap-2 min-w-0">
                               <span className="material-symbols-rounded text-[16px] text-slate-400 shrink-0">chat_bubble</span>
                               {!isSidebarCollapsed && (
                                  <span className="text-[11px] font-bold truncate text-slate-700 animate-in fade-in duration-200">{conv.title}</span>
                               )}
                            </div>
                            {!isSidebarCollapsed && (
                               <button 
                                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                                  className="opacity-0 group-hover:opacity-100 hover:text-red-550 p-1 rounded-md transition-all text-slate-400 animate-in fade-in duration-200"
                                  title="Delete Chat"
                               >
                                  <span className="material-symbols-rounded text-xs">delete</span>
                               </button>
                            )}
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
                         className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-200/50 cursor-pointer transition-all border border-transparent"
                      >
                         <span className={`material-symbols-rounded text-[16px] shrink-0 ${
                            doc.type === 'pdf' ? 'text-rose-500' : doc.type === 'sheet' ? 'text-emerald-500' : 'text-blue-500'
                         }`}>
                            {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type === 'sheet' ? 'table_view' : 'description'}
                         </span>
                         {!isSidebarCollapsed && (
                            <div className="min-w-0 animate-in fade-in duration-200">
                               <span className="text-[11px] font-bold text-slate-700 block truncate">{doc.name}</span>
                               <span className="text-[8px] text-slate-500 block uppercase tracking-wider mt-0.5">{doc.type} • {doc.date}</span>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             )}
          </div>
        </motion.div>

        {/* Right Chat Panel */}
        <div style={{ width: panelWidth }} className="flex flex-col bg-white overflow-hidden shrink-0">
          {/* Neural Header with Mode Selector */}
          <div className="arkle-drag-handle shrink-0 p-5 bg-slate-50/80 border-b border-slate-100 cursor-grab active:cursor-grabbing select-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all mr-1 ${
                    !isSidebarCollapsed 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
                      : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={isSidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
                >
                  <span className="material-symbols-outlined text-[20px]">menu</span>
                </button>
                <div className="w-8 h-8 bg-linear-to-tr from-sky-400 to-indigo-600 rounded-[10px] flex items-center justify-center shadow-md shrink-0">
                  <span className="material-symbols-outlined text-white text-[18px] animate-pulse">psychology</span>
                </div>
                <span className="font-semibold text-lg text-[#1f1f1f] tracking-tight">Arkle</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsInlineBarMode(true)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#444746] transition-all"
                    title="Switch to bottom bar"
                  >
                      <span className="material-symbols-outlined text-[15px]">dock_to_bottom</span>
                  </button>
                  <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:scale-105 active:scale-95 flex items-center justify-center text-[#444746] hover:text-red-650 transition-all">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
              </div>
            </div>
          </div>

          {/* Dynamic Context Stream */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 no-scrollbar relative bg-[#f8fafd]">
            {messages.length === 1 && messages[0].text.includes("Systems initialized") ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none bg-[#f8fafd]">
                <h1 className="text-[22px] font-medium text-[#1a73e8] mb-6 font-sans">
                  How can I help you today?
                </h1>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className="flex flex-col gap-1 max-w-[85%]">
                    {msg.role === 'user' ? (
                      <div className="flex flex-col items-end gap-1.5">
                        {msg.files && msg.files.length > 0 && (
                          <div className="flex flex-col gap-1.5 items-end">
                            {msg.files.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white border border-[#e0e0e0] px-3 py-1.5 rounded-2xl max-w-[240px] shadow-xs">
                                {file.type.startsWith('image/') ? (
                                  <img src={file.dataUrl} alt={file.name} className="w-8 h-8 rounded-md object-cover" />
                                ) : (
                                  <span className="material-symbols-outlined text-[18px] text-rose-500">picture_as_pdf</span>
                                )}
                                <span className="text-[11px] font-medium text-[#444746] truncate max-w-[150px]">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.text && (
                          <div className="px-4 py-2.5 rounded-[20px] text-[13px] leading-relaxed font-medium bg-[#e3e8ef] text-slate-800 shadow-xs">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2.5">
                        {/* Gemini sparkle icon on AI responses */}
                        <div className="w-6 h-6 rounded-full bg-linear-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <span className="material-symbols-outlined text-white text-[13px] animate-pulse">sparkles</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full max-w-full">
                          <div className="text-[13px] text-[#1f1f1f] leading-relaxed font-normal whitespace-pre-wrap break-words">
                            {msg.text}
                          </div>
                          
                          <div className="flex items-center gap-0 mt-1">
                             <button className="w-8 h-8 rounded-full hover:bg-[#f0f4f9] flex items-center justify-center text-[#444746] transition-colors" title="Copy">
                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                             </button>
                             <div className="relative">
                               <button 
                                 onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
                                 className="w-8 h-8 rounded-full hover:bg-[#f0f4f9] flex items-center justify-center text-[#444746] transition-colors" 
                                 title="More options"
                               >
                                  <span className="material-symbols-outlined text-[16px]">more_vert</span>
                               </button>
                               
                               {openMenuIndex === i && (
                                 <div className="absolute top-full mt-1 left-0 w-52 bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-[100] animate-in fade-in slide-in-from-top-2">
                                    <button className="w-full text-left px-3 py-2 text-[13px] text-[#1f1f1f] hover:bg-[#f0f4f9] rounded-xl flex items-center gap-3 transition-colors">
                                       <span className="material-symbols-outlined text-[18px] text-[#444746]">description</span>
                                       Export to Docs
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-[13px] text-[#1f1f1f] hover:bg-[#f0f4f9] rounded-xl flex items-center gap-3 transition-colors">
                                       <span className="material-symbols-outlined text-[18px] text-[#444746]">table_view</span>
                                       Export to Sheets
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-[13px] text-[#1f1f1f] hover:bg-[#f0f4f9] rounded-xl flex items-center gap-3 transition-colors">
                                       <span className="material-symbols-outlined text-[18px] text-[#444746]">share</span>
                                       Share (Web)
                                    </button>
                                    <div className="h-px bg-[#e0e0e0] my-1 mx-2" />
                                    <button className="w-full text-left px-3 py-2 text-[13px] text-[#1f1f1f] hover:bg-[#f0f4f9] rounded-xl flex items-center gap-3 transition-colors">
                                       <span className="material-symbols-outlined text-[18px] text-[#444746]">add_task</span>
                                       Add to Project
                                    </button>
                                 </div>
                               )}
                             </div>
                             
                             <div className="flex items-center gap-1.5 ml-2 opacity-50 px-2 py-0.5 bg-slate-100 rounded-md">
                               <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                               <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{msg.mode}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
               <div className="flex gap-2 items-center mt-2 pl-8">
                  <div className="flex gap-1.5 shrink-0">
                     <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                  </div>
                  <div className="text-sky-600 text-[9px] font-bold uppercase tracking-widest">Neural Strategizing...</div>
               </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Bottom input area matching Google Workspace Gemini exactly */}
          <div className="p-4 bg-[#f8fafd] shrink-0 border-t border-[#e9eef6]">
            <div className="bg-[#f0f4f9] rounded-[24px] p-3 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-all shadow-xs flex flex-col gap-2 relative">
              
              <input 
                type="file" 
                ref={fileRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                multiple 
                accept="image/*,.pdf" 
              />

              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1 p-1 max-h-24 overflow-y-auto">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="relative group flex items-center gap-2 bg-white border border-[#e0e0e0] px-3 py-1.5 rounded-2xl shadow-xs shrink-0 max-w-[200px]">
                      {file.type.startsWith('image/') ? (
                        <img src={file.dataUrl} alt={file.name} className="w-5 h-5 rounded-md object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[16px] text-rose-500">picture_as_pdf</span>
                      )}
                      <span className="text-[11px] font-medium text-[#444746] truncate max-w-[120px]">{file.name}</span>
                      <button 
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="w-4 h-4 rounded-full bg-slate-100 hover:bg-[#f0f4f9] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[10px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isVoiceActive && liveTranscriptGlobal ? (
                <div className="text-slate-800 text-[13px] font-bold py-2 min-h-[40px] animate-pulse">
                  {liveTranscriptGlobal}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className="w-full bg-transparent text-slate-800 text-[13px] outline-none placeholder-slate-400 resize-none font-medium min-h-[40px] max-h-[120px] leading-relaxed overflow-y-auto no-scrollbar"
                  placeholder={isVoiceActive ? "Listening..." : "Ask a question, upload a sheet or document..."}
                />
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Plus Upload Button */}
                  <button 
                    onClick={() => fileRef.current?.click()}
                    className="w-6 h-6 rounded-full hover:bg-[#e1e5ea] flex items-center justify-center text-[#444746] transition-colors shrink-0"
                    title="Upload image or PDF"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                  {/* Mode Selector Pill */}
                  <div className="relative shrink-0">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'mode' ? null : 'mode')}
                      className="px-2 py-0.5 bg-transparent hover:bg-[#e3e8ef] rounded-full flex items-center gap-1 text-[9px] font-medium text-[#444746] transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[12px] text-[#444746]">
                        {executionMode === 'Brain' ? 'psychology' : executionMode === 'Agent' ? 'smart_toy' : 'design_services'}
                      </span>
                      <span>{executionMode}</span>
                      <span className="material-symbols-outlined text-[12px] text-[#444746]">arrow_drop_down</span>
                    </button>
                    
                    {activeDropdown === 'mode' && (
                      <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        {[
                          { id: 'Brain' as const, label: 'Brain', desc: 'Standard AI chat assistance', icon: 'psychology' },
                          { id: 'Agent' as const, label: 'Agent', desc: 'Hands-on automated system steps', icon: 'smart_toy' },
                          { id: 'Builder' as const, label: 'Builder', desc: 'Generate templates & designs', icon: 'design_services' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setExecutionMode(opt.id);
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-left p-3 rounded-xl hover:bg-[#f0f4f9] transition-colors flex items-center gap-3 ${executionMode === opt.id ? 'bg-[#f4f7fc]' : ''}`}
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#444746]">{opt.icon}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-medium text-[#1f1f1f] block leading-tight">{opt.label}</span>
                              <span className="text-[10px] text-[#444746] truncate mt-0.5 block">{opt.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Context Selector Pill */}
                  <div className="relative shrink-0">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'tool' ? null : 'tool')}
                      className="px-2 py-0.5 bg-transparent hover:bg-[#e3e8ef] rounded-full flex items-center gap-1 text-[9px] font-medium text-[#444746] transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[12px] text-[#444746]">
                        {activeContextTool === 'Global' ? 'public' : activeContextTool === 'Active Sheet' ? 'table_view' : activeContextTool === 'Gmail' ? 'mail' : activeContextTool === 'WhatsApp' ? 'forum' : 'receipt_long'}
                      </span>
                      <span>{activeContextTool}</span>
                      <span className="material-symbols-outlined text-[12px] text-[#444746]">arrow_drop_down</span>
                    </button>
                    
                    {activeDropdown === 'tool' && (
                      <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        {[
                          { id: 'Global' as const, label: 'Global', desc: 'Broad general AI context', icon: 'public' },
                          { id: 'Active Sheet' as const, label: 'Active Sheet', desc: 'Read/write direct to Sheet', icon: 'table_view' },
                          { id: 'Gmail' as const, label: 'Gmail', desc: 'Workspace mail & calendar', icon: 'mail' },
                          { id: 'WhatsApp' as const, label: 'WhatsApp', desc: 'Qualify and message leads', icon: 'forum' },
                          { id: 'Bill Book' as const, label: 'Bill Book', desc: 'Invoices & MSME tracking', icon: 'receipt_long' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setActiveContextTool(opt.id);
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-left p-3 rounded-xl hover:bg-[#f0f4f9] transition-colors flex items-center gap-3 ${activeContextTool === opt.id ? 'bg-[#f4f7fc]' : ''}`}
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#444746]">{opt.icon}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-medium text-[#1f1f1f] block leading-tight">{opt.label}</span>
                              <span className="text-[10px] text-[#444746] truncate mt-0.5 block">{opt.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Workflow Selector Pill */}
                  <div className="relative shrink-0">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'workflow' ? null : 'workflow')}
                      className="px-2 py-0.5 bg-transparent hover:bg-[#e3e8ef] rounded-full flex items-center gap-1 text-[9px] font-medium text-[#444746] transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[12px] text-[#444746]">
                        {activeWorkflow === 'None' ? 'account_tree' : activeWorkflow === 'Sales Outreach' ? 'campaign' : activeWorkflow === 'Tax Filing' ? 'account_balance' : 'person_add'}
                      </span>
                      <span>{activeWorkflow === 'None' ? 'Workflow' : activeWorkflow}</span>
                      <span className="material-symbols-outlined text-[12px] text-[#444746]">arrow_drop_down</span>
                    </button>
                    
                    {activeDropdown === 'workflow' && (
                      <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        {[
                          { id: 'None' as const, label: 'No Workflow', desc: 'Standard single-step execution', icon: 'account_tree' },
                          { id: 'Sales Outreach' as const, label: 'Sales Outreach', desc: 'Multi-step lead generation', icon: 'campaign' },
                          { id: 'Tax Filing' as const, label: 'Tax Filing', desc: 'Automated GSTR processing', icon: 'account_balance' },
                          { id: 'Onboarding' as const, label: 'Onboarding', desc: 'Client setup & doc generation', icon: 'person_add' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setActiveWorkflow(opt.id);
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-left p-3 rounded-xl hover:bg-[#f0f4f9] transition-colors flex items-center gap-3 ${activeWorkflow === opt.id ? 'bg-[#f4f7fc]' : ''}`}
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#444746]">{opt.icon}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-medium text-[#1f1f1f] block leading-tight">{opt.label}</span>
                              <span className="text-[10px] text-[#444746] truncate mt-0.5 block">{opt.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md font-bold text-[9px] uppercase tracking-wider select-none">Beta</span>
                  <button 
                    onClick={() => send()}
                    disabled={!input.trim() && !liveTranscriptGlobal?.trim() && uploadedFiles.length === 0}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      input.trim() || liveTranscriptGlobal?.trim() || uploadedFiles.length > 0
                        ? 'bg-[#1f1f1f] text-white hover:bg-black shadow-md' 
                        : 'bg-[#1f1f1f]/10 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-center mt-3 text-[10.5px] text-[#444746] font-sans">
              Arkle in Workspace can make mistakes. <span className="underline cursor-pointer hover:text-slate-800">Learn more</span>
            </p>
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
      </motion.div>

      {/* Floating Bottom Bar (invoked when isInlineBarMode is true) */}
      <AnimatePresence>
        {isInlineBarMode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[250] w-full max-w-3xl px-6 pointer-events-auto flex flex-col items-center select-none font-sans">
            


            {/* Input capsule container */}
            <div className="w-full bg-white border border-[#c2e7ff] rounded-[32px] p-2 flex items-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.08)] focus-within:border-[#74b0ff] focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.12)] transition-all relative">
              
              {/* Settings Popover inside the container (anchored above) */}
              {activeDropdown === 'settings' && (
                <div className="absolute bottom-full mb-3 left-4 w-72 bg-white border border-[#c2e7ff] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4.5 z-50 flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150 text-[11px]">
                  <div className="font-semibold text-slate-700 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                    <span>Refine Arkle Options</span>
                    <span className="material-symbols-outlined text-[15px] text-[#444746]">tune</span>
                  </div>
                  
                  {/* Mode Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-[#444746]">Execution Mode</span>
                    <div className="flex gap-1.5">
                      {(['Brain', 'Agent', 'Builder'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setExecutionMode(mode)}
                          className={`flex-1 py-1 rounded-lg border text-center font-medium transition-colors ${
                            executionMode === mode 
                              ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]' 
                              : 'bg-[#f8fafd] border-[#e0e0e0] hover:bg-[#f0f4f9] text-[#444746]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-[#444746]">Context Tool</span>
                    <select
                      value={activeContextTool}
                      onChange={e => setActiveContextTool(e.target.value as any)}
                      className="w-full bg-[#f8fafd] border border-[#e0e0e0] rounded-lg p-1.5 outline-none font-medium text-[#444746] focus:border-[#1a73e8]"
                    >
                      {['Global', 'Active Sheet', 'Gmail', 'WhatsApp', 'Bill Book'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Workflow Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-[#444746]">Workflow</span>
                    <select
                      value={activeWorkflow}
                      onChange={e => setActiveWorkflow(e.target.value as any)}
                      className="w-full bg-[#f8fafd] border border-[#e0e0e0] rounded-lg p-1.5 outline-none font-medium text-[#444746] focus:border-[#1a73e8]"
                    >
                      {['None', 'Sales Outreach', 'Tax Filing', 'Onboarding'].map(opt => (
                        <option key={opt} value={opt}>{opt === 'None' ? 'No Workflow' : opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Plus Upload Button */}
              <button 
                onClick={() => fileRef.current?.click()}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#444746] transition-colors shrink-0"
                title="Upload image or PDF"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>

              {/* Refine / Settings Button */}
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'settings' ? null : 'settings')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  activeDropdown === 'settings' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'hover:bg-slate-100 text-[#444746]'
                }`}
                title="Refine settings"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-1 bg-transparent text-slate-855 text-[13.5px] outline-none placeholder-slate-400 resize-none font-medium min-h-[24px] max-h-[120px] leading-relaxed overflow-y-auto no-scrollbar pt-1.5"
                placeholder="Write with Arkle..."
              />

              {/* Dock Back to Side Panel Button */}
              <button 
                onClick={() => setIsInlineBarMode(false)}
                className="w-7 h-7 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-[#444746] transition-colors shrink-0"
                title="Dock back to side panel"
              >
                <span className="material-symbols-outlined text-[15px]">side_navigation</span>
              </button>

              {/* Send Button */}
              <button 
                onClick={() => send()}
                disabled={!input.trim() && !liveTranscriptGlobal?.trim() && uploadedFiles.length === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  input.trim() || liveTranscriptGlobal?.trim() || uploadedFiles.length > 0
                    ? 'bg-[#1a73e8] text-white hover:bg-blue-700 shadow-sm' 
                    : 'bg-slate-100 text-[#c4c7c5] cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
