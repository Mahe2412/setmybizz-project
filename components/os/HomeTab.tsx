'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WhiteboardPanel from './WhiteboardPanel';
import BizboardSpotlight from './launchpad/LaunchPadSpotlight';
import { useBizStore } from '../../lib/useBizStore';
import RightQuickTray from './RightQuickTray';
import { useAuth } from '@/context/AuthContext';
import MarketHookStep from '../steps/MarketHookStep';
import VapiButton from '../VapiButton';

type Message = {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   timestamp: Date;
};

type Conversation = {
   id: string;
   title: string;
   messages: Message[];
   timestamp: Date;
};

type GeneratedDoc = {
   id: string;
   name: string;
   type: 'doc' | 'sheet' | 'pdf';
   date: string;
   content?: string;
};

const HUB_APPS = [
   { id: 'biz', icon: 'business_center', label: 'BizDesk' },
   { id: 'vault', icon: 'account_balance_wallet', label: 'Vault' },
   { id: 'legal', icon: 'gavel', label: 'Legal' },
   { id: 'market', icon: 'storefront', label: 'Market' },
];

const NEURAL_NOTIFICATIONS = [
   { id: 1, text: "GST Filing due in 2 days. Arkle has prepared the draft.", type: "alert" },
   { id: 2, text: "New funding scheme detected: NITI Aayog Seed Fund ₹50L.", type: "opportunity" },
   { id: 3, text: "Business health score increased to 84%.", type: "info" }
];

const AVAILABLE_SHORTCUTS = [
  // CRM
  { id: 'crm_dash', label: 'CRM Dashboard', icon: 'dashboard', color: 'text-blue-600', bg: 'bg-blue-50', app: 'crm', category: 'CRM', subtab: 'dashboard' },
  { id: 'crm_leads', label: 'Lead Sheet', icon: 'group', color: 'text-indigo-600', bg: 'bg-indigo-50', app: 'crm', category: 'CRM', subtab: 'leads' },
  { id: 'crm_pipeline', label: 'Sales Pipeline', icon: 'view_kanban', color: 'text-violet-600', bg: 'bg-violet-50', app: 'crm', category: 'CRM', subtab: 'pipeline' },
  { id: 'crm_whatsapp', label: 'WhatsApp Inbox', icon: 'chat', color: 'text-green-600', bg: 'bg-green-50', app: 'crm', category: 'CRM', subtab: 'inbox' },
  { id: 'crm_ai', label: 'Arkle AI Agent', icon: 'smart_toy', color: 'text-sky-600', bg: 'bg-sky-50', app: 'crm', category: 'CRM', subtab: 'ai' },
  
  // BizBook / FinLedger
  { id: 'bizbook_dash', label: 'Ledger Dash', icon: 'insights', color: 'text-amber-600', bg: 'bg-amber-50', app: 'billbook', category: 'Finance', subtab: 'home' },
  { id: 'invoice_create', label: 'GST Invoices', icon: 'receipt_long', color: 'text-emerald-600', bg: 'bg-emerald-50', app: 'billbook', category: 'Finance', subtab: 'invoice' },
  { id: 'invoice_products', label: 'Inventory / Stock', icon: 'inventory_2', color: 'text-orange-600', bg: 'bg-orange-50', app: 'billbook', category: 'Finance', subtab: 'items' },
  { id: 'invoice_parties', label: 'Parties Ledger', icon: 'recent_actors', color: 'text-teal-600', bg: 'bg-teal-50', app: 'billbook', category: 'Finance', subtab: 'parties' },
  { id: 'invoice_expenses', label: 'Expenses', icon: 'payments', color: 'text-rose-600', bg: 'bg-rose-50', app: 'billbook', category: 'Finance', subtab: 'expenses' },
  { id: 'bizbook_reports', label: 'Financial Reports', icon: 'summarize', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', app: 'billbook', category: 'Finance', subtab: 'reports' },
  
  // Third-Party Connectors
  { id: 'google_sheets', label: 'Google Sheets', icon: 'table_view', color: 'text-emerald-700', bg: 'bg-emerald-50', app: 'google', category: 'Workspace', subtab: 'sheets' },
  { id: 'google_docs', label: 'Google Docs', icon: 'description', color: 'text-blue-700', bg: 'bg-blue-50', app: 'google', category: 'Workspace', subtab: 'docs' },
  { id: 'gmail', label: 'Gmail Inbox', icon: 'mail', color: 'text-red-600', bg: 'bg-red-50', app: 'google', category: 'Workspace', subtab: 'gmail' },
  
  // Others
  { id: 'order_desk', label: 'Order Desk', icon: 'shopping_cart_checkout', color: 'text-pink-600', bg: 'bg-pink-50', app: 'orderdesk', category: 'Operations', subtab: 'home' },
];

export default function HomeTab({
   data,
   onOpenBillBook,
   onOpenBillEase,
   onOpenOrderDesk,
   onGmailClick,
}: {
   data: any;
   onOpenBillBook?: () => void;
   onOpenBillEase?: () => void;
   onOpenOrderDesk?: () => void;
   onGmailClick?: () => void;
}) {
   const { dbUser, dbBusiness } = useAuth();
   const { whiteboardOpen: isWhiteboardOpen, setWhiteboardOpen: setIsWhiteboardOpen, conversationMode, setConversationMode, setSidebarOpen, performanceGaps } = useBizStore();
   
   // Expanded tabs for Arkle Command Center
   const [activeChatTab, setActiveChatTab] = useState<'ask' | 'work_agents' | 'voice_agents'>('ask');
   const [voiceAgents, setVoiceAgents] = useState<any[]>([]);
   const [workAgents, setWorkAgents] = useState<any[]>([
      { id: 'w1', name: 'WhatsApp Bot', type: 'whatsapp', status: 'active', tasksCompleted: 143, lastRun: '2 min ago', description: 'Sends catalogs after every call' },
      { id: 'w2', name: 'Daily Report', type: 'report', status: 'idle', tasksCompleted: 31, lastRun: '8 hrs ago', description: 'Morning business summary' },
      { id: 'w3', name: 'Email Assistant', type: 'email', status: 'active', tasksCompleted: 87, lastRun: '1 hr ago', description: 'Follows up with customers via email' }
   ]);
   const [isLoadingVoice, setIsLoadingVoice] = useState(false);

   useEffect(() => {
      if (activeChatTab === 'voice_agents') {
         setIsLoadingVoice(true);
         fetch('/api/voice-agent')
            .then(res => res.json())
            .then(data => {
               setVoiceAgents(data.agents || []);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoadingVoice(false));
      }
   }, [activeChatTab]);

   const [msgs, setMsgs] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [loading, setLoading] = useState(false);
   const [isSidebarOpen, setIsSidebarOpenLocal] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const checkMobile = () => {
         const mobile = window.innerWidth < 768;
         setIsMobile(mobile);
         // Auto close sidebar by default on mobile, keep it closed
         if (mobile) setIsSidebarOpenLocal(false);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
   }, []);

   const [isNeuralMenuOpen, setIsNeuralMenuOpen] = useState(false);
   const [isBrainMenuOpen, setIsBrainMenuOpen] = useState(false);
   const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
   const [selectedContext, setSelectedContext] = useState("Arkle Brain");
   const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");
   const [tileIndex, setTileIndex] = useState(0);
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const [activeSidebarTab, setActiveSidebarTab] = useState<'chats' | 'docs'>('chats');
    const [selectedDoc, setSelectedDoc] = useState<GeneratedDoc | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([
       {
          id: 'c-1',
          title: 'Amazon Product Launch',
          messages: [
             { id: 'm1', role: 'user', content: 'What are the steps for launching on Amazon?', timestamp: new Date() },
             { id: 'm2', role: 'assistant', content: 'Here is the Amazon onboarding plan: 1. Setup seller account, 2. Optimize Product SEO keywords, 3. Upload catalog.', timestamp: new Date() }
          ],
          timestamp: new Date(Date.now() - 3600000)
       },
       {
          id: 'c-2',
          title: 'GSTR-1 Tax Strategy',
          messages: [
             { id: 'm3', role: 'user', content: 'What is the penalty for filing late?', timestamp: new Date() },
             { id: 'm4', role: 'assistant', content: 'Late filing penalty is ₹50/day. Let\'s file it today to avoid penalty accumulation.', timestamp: new Date() }
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

    const [shortcuts, setShortcuts] = useState<string[]>(['crm_dash', 'invoice_create', 'invoice_products', 'google_sheets', 'crm_whatsapp']);
    const [isAddToolOpen, setIsAddToolOpen] = useState(false);

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const savedShortcuts = localStorage.getItem('setmybizz_quick_shortcuts');
         if (savedShortcuts) {
            try {
               setShortcuts(JSON.parse(savedShortcuts));
            } catch (e) {
               console.error("Failed to load quick shortcuts", e);
            }
         }
      }
   }, []);

   const toggleShortcut = (shortcutId: string) => {
      setShortcuts(prev => {
         const updated = prev.includes(shortcutId) 
            ? prev.filter(id => id !== shortcutId) 
            : [...prev, shortcutId];
         localStorage.setItem('setmybizz_quick_shortcuts', JSON.stringify(updated));
         return updated;
      });
   };

   const handleLaunchShortcut = (shortcutId: string) => {
      const shortcut = AVAILABLE_SHORTCUTS.find(s => s.id === shortcutId);
      if (!shortcut) return;

      if (shortcut.app === 'crm') {
         window.dispatchEvent(new CustomEvent('open-os-tab', { detail: 'crm' }));
         setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-crm-subtab', { detail: shortcut.subtab }));
         }, 100);
      } else if (shortcut.app === 'billbook') {
         if (shortcut.subtab === 'invoice') {
            onOpenBillEase?.(); // Billease handles raw/GST invoices
         } else {
            onOpenBillBook?.(); // Biz book handles others
         }
         setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-bizbook-subtab', { detail: shortcut.subtab }));
         }, 100);
      } else if (shortcut.app === 'google') {
         onGmailClick?.();
      }
   };

   const [showReport, setShowReport] = useState(() => {
      if (typeof window !== 'undefined') {
         const show = sessionStorage.getItem('show_onboarding_briefing') === 'true';
         sessionStorage.removeItem('show_onboarding_briefing');
         return show;
      }
      return false;
   });

   const scrollRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const [showSuggestions, setShowSuggestions] = useState(false);
   const [suggestions] = useState(['BizDesk', 'Marketing', 'LaunchPad', 'Workspace', 'Agents', 'Legal', 'Vault', 'Market']);
   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

   const QUICK_TILES = [
      { title: 'BIZ BRIEFING', desc: 'AI Setup Roadmap', icon: 'psychology', action: () => setShowReport(true) },
      { title: 'BILL BOOK', desc: 'Local Billing App', icon: 'menu_book', tab: 'billease' as const },
      { title: 'BIZ BOOK', desc: 'BizBook AI Ledgers', icon: 'receipt_long', tab: 'billbook' as const },
      { title: 'ORDER DESK', desc: 'WA / IG orders', icon: 'chat', tab: 'orderdesk' as const },
      { title: 'CREATE TASK', desc: 'Add new task', icon: 'auto_awesome_motion' },
      { title: 'BRAINSTORM IDEAS', desc: 'Neural ideation engine', icon: 'psychology' },
      { title: 'GST EXPERT', desc: 'Tax & Compliance audit', icon: 'account_balance' },
      { title: 'US INCORPORATION', desc: 'Expand to USA', icon: 'flag' },
      { title: 'MARKET TRENDS', desc: 'AI Market Analysis', icon: 'trending_up' },
      { title: 'LEGAL BOT', desc: 'Agreements & Docs', icon: 'gavel' },
      { title: 'SALES PITCH', desc: 'Convert more leads', icon: 'leaderboard' },
   ];

   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setInput(val);

      // Suggestion Logic
      const lastWord = val.split(/\s/).pop() || '';
      if (lastWord.startsWith('@')) {
         const query = lastWord.slice(1).toLowerCase();
         const filtered = suggestions.filter(s => s.toLowerCase().includes(query));
         setFilteredSuggestions(filtered);
         setShowSuggestions(filtered.length > 0);
      } else {
         setShowSuggestions(false);
      }

      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
         textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
   };

   const selectSuggestion = (s: string) => {
      const words = input.split(/\s/);
      words.pop(); // Remove the @query
      const newVal = [...words, `@${s.toLowerCase()}`].join(' ').trim() + ' ';
      setInput(newVal);
      setShowSuggestions(false);
      setSelectedContext(s === 'BizDesk' ? 'BizBook' : s === 'Marketing' ? 'Global Market' : s);
      textareaRef.current?.focus();
   };

   const nextTiles = () => { if (tileIndex + 4 < QUICK_TILES.length) setTileIndex(tileIndex + 1); };
   const prevTiles = () => { if (tileIndex > 0) setTileIndex(tileIndex - 1); };

   const handleNewChat = useCallback(() => {
       const newId = 'c-' + Date.now().toString();
       const newConv: Conversation = {
          id: newId,
          title: `New Session ${conversations.length + 1}`,
          messages: [],
          timestamp: new Date()
       };
       setConversations(prev => [newConv, ...prev]);
       setActiveConversationId(newId);
       setMsgs([]);
       setConversationMode(true);
       setSidebarOpen(false);
    }, [conversations, setConversationMode, setSidebarOpen]);

    const handleSelectConversation = useCallback((id: string) => {
       setActiveConversationId(id);
       const conv = conversations.find(c => c.id === id);
       if (conv) {
          setMsgs(conv.messages);
          setConversationMode(true);
          setSidebarOpen(false);
       }
    }, [conversations, setConversationMode, setSidebarOpen]);

    const handleDeleteConversation = useCallback((id: string, e: React.MouseEvent) => {
       e.stopPropagation();
       setConversations(prev => prev.filter(c => c.id !== id));
       if (activeConversationId === id) {
          setActiveConversationId(null);
          setMsgs([]);
       }
    }, [activeConversationId]);

    const sendMessage = useCallback(async (text = input) => {
       const q = text.trim();
       if (!q || loading) return;

       let finalPrompt = q;
       const mentionMatch = q.match(/@(\w+)/);
       if (mentionMatch) {
          const mention = mentionMatch[1].toLowerCase();
          const contextMap: { [key: string]: string } = {
             'bizdesk': 'BizBook',
             'marketing': 'Global Market',
             'launchpad': 'Launch Pad',
             'workspace': 'Workspace',
             'agents': 'Agent Mode',
             'brain': 'Arkle Brain'
          };

          if (contextMap[mention]) {
             setSelectedContext(contextMap[mention]);
             finalPrompt = q.replace(`@${mention}`, '').trim();
          }
       }

       setConversationMode(true);
       setSidebarOpen(false);
       setInput('');

       const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() };
       let currentConvId = activeConversationId;
       let updatedConversations = [...conversations];

       if (!currentConvId || conversations.length === 0) {
          currentConvId = 'c-' + Date.now().toString();
          const newConv: Conversation = {
             id: currentConvId,
             title: q.length > 25 ? q.substring(0, 25) + '...' : q,
             messages: [newUserMsg],
             timestamp: new Date()
          };
          updatedConversations = [newConv, ...updatedConversations];
          setConversations(updatedConversations);
          setActiveConversationId(currentConvId);
          setMsgs([newUserMsg]);
       } else {
          updatedConversations = conversations.map(c => {
             if (c.id === currentConvId) {
                const updatedMsgs = [...c.messages, newUserMsg];
                setMsgs(updatedMsgs);
                return { 
                   ...c, 
                   title: c.messages.length === 0 ? (q.length > 25 ? q.substring(0, 25) + '...' : q) : c.title,
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
          const resp = await fetch('/api/gemini', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                prompt: finalPrompt,
                context: selectedContext,
                businessProfile: {
                    registeredId: dbUser?.registeredId || 'Pending',
                    businessName: dbBusiness?.business_name || data?.name || 'My Startup',
                    industry: dbBusiness?.industry || data?.sector || 'General Business',
                    performanceGaps: performanceGaps
                },
                messages: msgs.map(m => ({ role: m.role, content: m.content }))
             })
          });
          const resData = await resp.json();
          const rawText: string = resData.text || '';
           
          // Parse directives from raw response to execute + clean them
          const directiveExecRegex = /\[DIRECTIVE:\s*(\w+)\s*({.*?})\]/g;
          const directiveCleanRegex = /\[DIRECTIVE:\s*(\w+)\s*({.*?})\]/g;
          let dirMatch;
          while ((dirMatch = directiveExecRegex.exec(rawText)) !== null) {
            const action = dirMatch[1];
            try {
              const payload = JSON.parse(dirMatch[2]);
              if (action === 'CREATE_INVOICE_DRAFT' || action === 'ADD_LINE_ITEM' || action === 'SET_PARTY') {
                window.dispatchEvent(new CustomEvent('open-billease'));
                const sendToIframe = () => {
                  const iframe = document.querySelector('iframe[title="BillEase"]') as HTMLIFrameElement;
                  if (iframe && iframe.contentWindow) { iframe.contentWindow.postMessage({ action, data: payload }, "*"); return true; }
                  return false;
                };
                if (!sendToIframe()) { setTimeout(sendToIframe, 500); setTimeout(sendToIframe, 1500); }
                const iName = payload.partyName ? `Invoice_${payload.partyName.replace(/\s+/g, '_')}.pdf` : 'Invoice_Draft.pdf';
                setGeneratedDocs(prev => [{ id: 'd-' + Date.now().toString(), name: iName, type: 'pdf', date: 'Just now' }, ...prev]);
              } else if (action === 'ADD_CRM_LEAD') {
                fetch('/api/crm/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: payload.name, phone: payload.phone, note: payload.note, source: 'Arkle OS', category: 'Unknown', stage: 'New', priority: 'Medium' }) }).then(() => window.dispatchEvent(new CustomEvent('crm-leads-updated')));
              } else if (action === 'CREATE_GOOGLE_DOC') {
                fetch('/api/integrations/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) });
                const dName = payload.title ? `${payload.title.replace(/\s+/g, '_')}.docx` : 'AI_Document.docx';
                setGeneratedDocs(prev => [{ id: 'd-' + Date.now().toString(), name: dName, type: 'doc', date: 'Just now' }, ...prev]);
              } else if (action === 'CREATE_GOOGLE_SHEET') {
                fetch('/api/integrations/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) });
                const sName = payload.title ? `${payload.title.replace(/\s+/g, '_')}.xlsx` : 'AI_Sheet.xlsx';
                setGeneratedDocs(prev => [{ id: 'd-' + Date.now().toString(), name: sName, type: 'sheet', date: 'Just now' }, ...prev]);
              } else if (action === 'SEND_EMAIL' || action === 'CREATE_CALENDAR_EVENT') {
                fetch('/api/integrations/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) });
              }
            } catch {}
          }
          
          // Clean directives from visible chat text
          const cleanText = rawText.replace(directiveCleanRegex, '').trim();
          const newAiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: cleanText, timestamp: new Date() };
          
          setConversations(prev => prev.map(c => {
             if (c.id === currentConvId) {
                const updatedMsgs = [...c.messages, newAiMsg];
                setMsgs(updatedMsgs);
                return { ...c, messages: updatedMsgs, timestamp: new Date() };
             }
             return c;
          }));
       } catch (e) { 
          console.error(e); 
       } finally { 
          setLoading(false); 
       }
    }, [input, loading, msgs, setConversationMode, setSidebarOpen, selectedContext, dbUser, dbBusiness, performanceGaps, data, activeConversationId, conversations]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

    useEffect(() => {
       if (conversationMode) {
          setSidebarOpen(false);
       }
    }, [conversationMode, setSidebarOpen]);

   return (
      <div className="flex h-full bg-[#f8fafc] overflow-hidden relative no-scrollbar font-sans w-full">
         {/* MOBILE BACKDROP OVERLAY */}
         <AnimatePresence>
            {isMobile && isSidebarOpen && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpenLocal(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[105]"
               />
            )}
         </AnimatePresence>

         {/* UNIFIED LIGHT-THEMED SIDEBAR (ChatGPT Style, Hover Open/Close on Desktop, Slide-over Drawer on Mobile) */}
         <motion.div 
            onMouseEnter={() => !isMobile && setIsSidebarOpenLocal(true)}
            onMouseLeave={() => !isMobile && setIsSidebarOpenLocal(false)}
            animate={{ 
               x: isMobile ? (isSidebarOpen ? 0 : -240) : 0, 
               width: isMobile ? 240 : (isSidebarOpen ? 240 : 64) 
            }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className={`h-full bg-white border-r border-slate-150 flex flex-col shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.01)] overflow-hidden ${
               isMobile ? 'fixed inset-y-0 left-0 z-[110]' : 'relative z-[100]'
            }`}
         >
            <div className="flex flex-col h-full py-8">
               {/* Sidebar Header / Brand */}
               <div className="px-4 mb-6 flex items-center justify-between min-h-8">
                  {isSidebarOpen ? (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                     >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                           <span className="material-symbols-rounded text-white text-[18px]">auto_awesome</span>
                        </div>
                        <span className="font-black text-slate-900 text-[13px] uppercase tracking-wider whitespace-nowrap">Arkle Brain</span>
                     </motion.div>
                  ) : (
                     <div className="w-full flex justify-center">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                           <span className="material-symbols-rounded text-white text-[18px]">auto_awesome</span>
                        </div>
                     </div>
                  )}
                  {isSidebarOpen && (
                     <button 
                        onClick={handleNewChat}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                        title="New Chat"
                     >
                        <span className="material-symbols-rounded text-[18px]">add</span>
                     </button>
                  )}
               </div>

               {/* New Chat Button */}
               <div className="px-3 mb-4">
                  {isSidebarOpen ? (
                     <button 
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-slate-600 hover:text-slate-900 text-xs font-black uppercase tracking-wider whitespace-nowrap"
                     >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        New Session
                     </button>
                  ) : (
                     <button 
                        onClick={handleNewChat}
                        className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-slate-600 hover:text-slate-900"
                        title="New Session"
                     >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                     </button>
                  )}
               </div>

               {/* Tab Switcher */}
               {isSidebarOpen && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="px-3 mb-4"
                  >
                     <div className="grid grid-cols-2 bg-slate-50 p-1 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-wider">
                        <button 
                           onClick={() => setActiveSidebarTab('chats')}
                           className={`py-2 rounded-lg transition-all ${activeSidebarTab === 'chats' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           Chats
                        </button>
                        <button 
                           onClick={() => setActiveSidebarTab('docs')}
                           className={`py-2 rounded-lg transition-all ${activeSidebarTab === 'docs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           Docs
                        </button>
                     </div>
                  </motion.div>
               )}

               {/* Tab Contents */}
               <div className="flex-1 overflow-y-auto no-scrollbar px-2.5 space-y-1">
                  {activeSidebarTab === 'chats' ? (
                     <div className="space-y-1">
                        {conversations.map(conv => {
                           const isActive = activeConversationId === conv.id && conversationMode;
                           return (
                              <div 
                                 key={conv.id}
                                 onClick={() => {
                                    handleSelectConversation(conv.id);
                                    if (isMobile) setIsSidebarOpenLocal(false);
                                 }}
                                 className={`group flex items-center p-2.5 rounded-2xl cursor-pointer transition-all ${
                                    isActive 
                                       ? 'bg-blue-50/60 border border-blue-100 text-blue-600' 
                                       : 'hover:bg-slate-50 border border-transparent text-slate-600'
                                 } ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}
                              >
                                 <div className="flex items-center gap-2.5 min-w-0">
                                    <span className={`material-symbols-rounded text-[16px] ${isActive ? 'text-blue-500' : 'text-slate-400'} shrink-0`}>chat_bubble</span>
                                    {isSidebarOpen && (
                                       <span className={`text-[12px] font-bold truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{conv.title}</span>
                                    )}
                                 </div>
                                 {isSidebarOpen && (
                                    <button 
                                       onClick={(e) => handleDeleteConversation(conv.id, e)}
                                       className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-1 rounded-md transition-all text-slate-400"
                                       title="Delete Chat"
                                    >
                                       <span className="material-symbols-rounded text-sm">delete</span>
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
                              onClick={() => {
                                 setSelectedDoc(doc);
                                 if (isMobile) setIsSidebarOpenLocal(false);
                              }}
                              className={`flex items-center p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent ${
                                 isSidebarOpen ? 'gap-3' : 'justify-center'
                              }`}
                           >
                              <span className={`material-symbols-rounded text-[18px] ${
                                 doc.type === 'pdf' ? 'text-rose-500' : doc.type === 'sheet' ? 'text-emerald-500' : 'text-blue-500'
                              } shrink-0`}>
                                 {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type === 'sheet' ? 'table_view' : 'description'}
                              </span>
                              {isSidebarOpen && (
                                 <div className="min-w-0">
                                    <span className="text-[12px] font-bold text-slate-700 block truncate">{doc.name}</span>
                                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider mt-0.5">{doc.type} • {doc.date}</span>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Exit segment */}
               {conversationMode && (
                  <div className="px-3 border-t border-slate-100 pt-4">
                     {isSidebarOpen ? (
                        <button 
                           onClick={() => { setConversationMode(false); setSidebarOpen(true); }}
                           className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all text-xs font-black uppercase tracking-wider whitespace-nowrap"
                        >
                           <span className="material-symbols-rounded text-sm">arrow_back</span>
                           Exit Chat
                        </button>
                     ) : (
                        <button 
                           onClick={() => { setConversationMode(false); setSidebarOpen(true); }}
                           className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                           title="Exit Chat"
                        >
                           <span className="material-symbols-rounded text-[18px]">arrow_back</span>
                        </button>
                     )}
                  </div>
               )}
            </div>
         </motion.div>

         {/* MAIN CONTENT */}
         <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto scrollbar-hide relative pb-40 w-full">
            <div className="h-16 border-b border-slate-100 px-4 md:px-10 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
               <div className="flex items-center gap-2">
                  {isMobile && (
                     <button 
                        onClick={() => setIsSidebarOpenLocal(true)} 
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 mr-1"
                        title="Open History"
                     >
                        <span className="material-symbols-rounded text-[20px]">menu</span>
                     </button>
                  )}
                  <span className="text-[10px] font-black text-slate-350 uppercase tracking-[0.3em] whitespace-nowrap">Neural Core Active</span>
               </div>
               {conversationMode && (
                  <button
                     onClick={() => { setConversationMode(false); setSidebarOpen(true); }}
                     className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                     title="Exit Conversation"
                  >
                     <span className="material-symbols-rounded text-[20px]">close</span>
                  </button>
               )}
            </div>

            <div className={`px-4 md:px-20 ${conversationMode ? 'py-4' : 'pt-4 pb-12 md:pt-6 md:pb-16'} flex flex-col items-center flex-1 relative w-full`}>
               {!conversationMode && (
                  <div className="flex flex-col items-center mb-6 text-center">
                     <h3 className="text-[38px] md:text-[68px] font-black text-slate-900 tracking-tighter leading-none mb-4">
                        Arkle <span className="text-blue-600">Brain</span>
                     </h3>
                     <p className="text-slate-450 font-black text-[9px] uppercase tracking-[0.4em] opacity-60">Autonomous AI Business Operating System</p>
                  </div>
               )}

               {conversationMode && (
                  <div className="w-full max-w-[950px] mx-auto space-y-8 mt-8 mb-40 overflow-y-auto pr-4 no-scrollbar flex-1">
                     <AnimatePresence mode="popLayout">
                        {msgs.map(m => (
                           <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-6 md:p-8 rounded-[36px] text-[16px] md:text-[18px] leading-relaxed max-w-[85%] font-medium shadow-sm border ${m.role === 'user' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-transparent text-slate-900 border-none'}`}>
                                 {m.content}
                              </div>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                     <div ref={scrollRef} className="h-20" />
                  </div>
               )}

                <div className={`w-full transition-all duration-500 z-50 ${conversationMode ? 'fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[788px] px-4' : 'max-w-[705px] mx-auto relative translate-y-2'}`}>

                  {/* Suggestions Menu */}
                  <AnimatePresence>
                     {showSuggestions && (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="absolute bottom-full mb-4 left-0 w-64 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-2 z-[100]"
                        >
                           <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Mention Topic</div>
                           {filteredSuggestions.map(s => (
                              <button
                                 key={s}
                                 onClick={() => selectSuggestion(s)}
                                 className="w-full text-left p-3 rounded-2xl hover:bg-blue-600 hover:text-white text-[11px] font-bold transition-all flex items-center gap-3 group"
                              >
                                 <span className="material-symbols-rounded text-[18px] opacity-50 group-hover:opacity-100">alternate_email</span>
                                 {s}
                              </button>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="flex items-center ml-0 gap-0 mb-[-4px] relative z-20">
                     <button onClick={() => setActiveChatTab('ask')} className={`w-[100px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'ask' ? 'rounded-tr-[15px] rounded-tl-none rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)] font-bold text-xs' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600 text-xs font-semibold'}`}><span className="relative z-10 uppercase tracking-[0.1em] text-[9px]">Ask</span></button>
                     <button onClick={() => setActiveChatTab('work_agents')} className={`w-[120px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'work_agents' ? 'rounded-t-[15px] rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)] font-bold text-xs' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600 text-xs font-semibold'}`}><span className="relative z-10 uppercase tracking-[0.1em] text-[9px]">Work Agents</span></button>
                     <button onClick={() => setActiveChatTab('voice_agents')} className={`w-[120px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'voice_agents' ? 'rounded-t-[15px] rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)] font-bold text-xs' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600 text-xs font-semibold'}`}><span className="relative z-10 uppercase tracking-[0.1em] text-[9px]">Voice Agents</span></button>
                  </div>
                  <div className="relative p-[2px] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[40px] rounded-tl-none bg-gradient-to-r from-purple-600 via-rose-500 to-indigo-600 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.25)] z-10">
                     <div className="bg-white rounded-tr-[38px] rounded-br-[38px] rounded-bl-[38px] rounded-tl-none flex flex-col overflow-visible">
                        <textarea ref={textareaRef} value={input} onChange={handleInput} rows={1} className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-400 text-[15px] md:text-[21px] font-normal px-6 md:px-12 pt-6 pb-2 resize-none no-scrollbar placeholder:text-slate-300 placeholder:font-light min-h-[60px]" placeholder="Ask Arkle or type @topic for deep research..." />
                        <div className="flex items-center justify-between px-4 md:px-10 pb-4 md:pb-6 pt-4 bg-white border-none rounded-b-[39px]">
                           <div className="flex items-center gap-1.5 md:flex-row flex-col items-start gap-y-2 mt-2 w-full md:w-auto">
                              <div className="flex items-center gap-2">
                                 <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-slate-100"><span className="material-symbols-rounded text-[20px]">add</span></button>
                                 <div className="flex items-center gap-1.5 bg-slate-50/50 p-1 rounded-full border border-slate-100">
                                    <div className="relative">
                                       <button onClick={() => setIsBrainMenuOpen(!isBrainMenuOpen)} className="px-2 md:px-4 h-8 rounded-full bg-white border border-slate-100 flex items-center gap-1.5 text-[8.5px] md:text-[10px] font-black text-slate-800 hover:border-blue-400 transition-all shadow-xs relative z-30"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{selectedContext} <span className={`material-symbols-rounded text-[16px] text-slate-300 transition-transform ${isBrainMenuOpen ? 'rotate-180' : ''}`}>expand_more</span></button>
                                       <AnimatePresence>{isBrainMenuOpen && <motion.div initial={{ opacity: 0, y: conversationMode ? 10 : -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: conversationMode ? 10 : -10 }} className={`absolute ${conversationMode ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 w-64 bg-white rounded-[24px] border border-slate-100 shadow-2xl p-2 z-[999]`}>{['Arkle Brain', 'Biz Book', 'Workspace', 'Launch Pad', 'Agent Mode', 'Global Market'].map(opt => (<button key={opt} onClick={() => { setSelectedContext(opt); setIsBrainMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase text-slate-800 transition-all flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{opt}</button>))}</motion.div>}</AnimatePresence>
                                    </div>
                                    <div className="relative">
                                       <button onClick={() => setIsModelMenuOpen(!isModelMenuOpen)} className="px-2 md:px-4 h-8 rounded-full bg-white border border-slate-100 flex items-center gap-1.5 text-[8.5px] md:text-[10px] font-black text-slate-800 hover:border-blue-400 transition-all shadow-xs relative z-30">{selectedModel} <span className={`material-symbols-rounded text-[16px] text-slate-300 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`}>expand_more</span></button>
                                       <AnimatePresence>{isModelMenuOpen && <motion.div initial={{ opacity: 0, y: conversationMode ? 10 : -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: conversationMode ? 10 : -10 }} className={`absolute ${conversationMode ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 w-64 bg-white rounded-[24px] border border-slate-100 shadow-2xl p-2 z-[999]`}>{['Gemini 1.5 Pro', 'GPT-4o (Premium)', 'Claude 3.5 Sonnet', 'Arkle Test Model'].map(m => (<button key={m} onClick={() => { setSelectedModel(m); setIsModelMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase text-slate-800 transition-all">{m}</button>))}</motion.div>}</AnimatePresence>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <button onClick={() => sendMessage()} disabled={!input.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs mt-2 ${input.trim() ? 'bg-slate-900 text-white hover:scale-105' : 'bg-slate-50 text-slate-300'}`}><span className="material-symbols-rounded text-[22px]">arrow_forward</span></button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ELEMENTS TO HIDE IN CONVERSATION MODE */}
               {!conversationMode && (
                  <>
                     {/* TAB 1: ASK VIEW (DEFAULT DASHBOARD) */}
                     {activeChatTab === 'ask' && (
                        <>
                           <div className="mt-14 w-full max-w-4xl mx-auto flex items-center gap-3 group">
                              <button onClick={prevTiles} disabled={tileIndex === 0} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${tileIndex === 0 ? 'opacity-0' : 'bg-white shadow-md text-slate-400 hover:text-blue-600 hover:scale-105'}`}><span className="material-symbols-rounded text-[18px]">chevron_left</span></button>
                              <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
                                 <AnimatePresence mode="popLayout">
                                    {QUICK_TILES.slice(tileIndex, tileIndex + 4).map((tile) => (
                                       <motion.button
                                          key={tile.title}
                                          type="button"
                                          onClick={() => {
                                             if ('action' in tile && typeof tile.action === 'function') {
                                                tile.action();
                                             }
                                             if ('tab' in tile && tile.tab === 'billbook') {
                                                onOpenBillBook?.();
                                             }
                                             if ('tab' in tile && tile.tab === 'billease') {
                                                onOpenBillEase?.();
                                             }
                                             if ('tab' in tile && tile.tab === 'orderdesk') {
                                                onOpenOrderDesk?.();
                                             }
                                          }}
                                          initial={{ opacity: 0, x: 15 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -15 }}
                                          className="bg-white p-3.5 rounded-[22px] border border-slate-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group min-h-[108px] flex flex-col justify-between"
                                       >
                                          <div className="mb-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                                             <span className="material-symbols-rounded text-[21px]">{tile.icon}</span>
                                          </div>
                                          <div>
                                             <h4 className="text-[10px] font-extrabold text-slate-900 mb-0.5 leading-tight uppercase tracking-tight">{tile.title}</h4>
                                             <p className="text-[8px] font-semibold text-slate-400 leading-tight uppercase tracking-wide opacity-70">{tile.desc}</p>
                                          </div>
                                       </motion.button>
                                    ))}
                                 </AnimatePresence>
                              </div>
                              <button onClick={nextTiles} disabled={tileIndex + 4 >= QUICK_TILES.length} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${tileIndex + 4 >= QUICK_TILES.length ? 'opacity-0' : 'bg-white shadow-md text-slate-400 hover:text-blue-600 hover:scale-105'}`}><span className="material-symbols-rounded text-[18px]">chevron_right</span></button>
                           </div>

                           <div className="w-full max-w-[850px] mx-auto mt-16 px-4 md:px-0">
                               <div className="flex items-center gap-3 mb-8">
                                  <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Quick Workspace Hub</h3>
                               </div>
                               <div className="grid grid-cols-6 gap-2 md:gap-4">
                                  {shortcuts.map(shortcutId => {
                                     const item = AVAILABLE_SHORTCUTS.find(s => s.id === shortcutId);
                                     if (!item) return null;
                                     return (
                                        <button
                                           key={item.id}
                                           type="button"
                                           onClick={() => handleLaunchShortcut(item.id)}
                                           className="flex flex-col items-center gap-4 group cursor-pointer border-0 bg-transparent p-0"
                                        >
                                           <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
                                              <span className={`material-symbols-rounded text-[28px] ${item.color}`}>{item.icon}</span>
                                           </div>
                                           <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest text-center">{item.label}</span>
                                        </button>
                                     );
                                  })}
                                  <button
                                     type="button"
                                     onClick={() => setIsAddToolOpen(true)}
                                     className="flex flex-col items-center gap-4 group cursor-pointer border-0 bg-transparent p-0"
                                  >
                                     <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50/30 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all duration-300">
                                        <span className="material-symbols-rounded text-blue-600 text-[28px]">add</span>
                                     </div>
                                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest text-center">ADD TOOL</span>
                                  </button>
                               </div>
                            </div>

                            {/* ADD TOOL POPUP MODAL */}
                            <AnimatePresence>
                              {isAddToolOpen && (
                                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
                                  <motion.div 
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-6 border border-slate-100 max-h-[80vh] flex flex-col"
                                  >
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
                                      <div className="flex items-center gap-2">
                                        <span className="material-symbols-rounded text-blue-600">settings</span>
                                        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Configure Workspace Hub</h3>
                                      </div>
                                      <button 
                                        onClick={() => setIsAddToolOpen(false)}
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                                      >
                                        <span className="material-symbols-rounded text-sm">close</span>
                                      </button>
                                    </div>

                                    <div className="overflow-y-auto no-scrollbar flex-1 space-y-4 pr-1">
                                      <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                        Select the tools and specific sub-features you want to display on your quick-access dashboard.
                                      </p>
                                      
                                      <div className="space-y-6">
                                        {Array.from(new Set(AVAILABLE_SHORTCUTS.map(s => s.category))).map(category => (
                                          <div key={category}>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">{category}</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                              {AVAILABLE_SHORTCUTS.filter(item => item.category === category).map(item => {
                                                const isAdded = shortcuts.includes(item.id);
                                                return (
                                                  <button
                                                    key={item.id}
                                                    onClick={() => toggleShortcut(item.id)}
                                                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                                                      isAdded 
                                                        ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20' 
                                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                                                    }`}
                                                  >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bg}`}>
                                                      <span className={`material-symbols-rounded text-lg ${item.color}`}>{item.icon}</span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                      <span className="text-[10px] font-black text-slate-900 block truncate">{item.label}</span>
                                                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{item.app}</span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                                      isAdded ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white text-transparent'
                                                    }`}>
                                                      <span className="material-symbols-rounded text-[12px] font-bold">check</span>
                                                    </div>
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              )}
                            </AnimatePresence>

                           <div className="w-full max-w-[850px] mx-auto mt-16 px-4 md:px-0">
                              <div onClick={() => setIsNeuralMenuOpen(!isNeuralMenuOpen)} className="bg-slate-50/50 backdrop-blur-xl border border-slate-100 p-5 rounded-[28px] flex items-center justify-between cursor-pointer group hover:bg-white hover:shadow-2xl transition-all">
                                 <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                       <span className="material-symbols-rounded text-white text-[22px] animate-pulse">psychology</span>
                                    </div>
                                    <div>
                                       <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] block">Neural Notifications</span>
                                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 active business directives</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-blue-600 transition-colors">Operational Intelligence</span>
                                    <span className={`material-symbols-rounded text-slate-300 group-hover:text-blue-600 transition-transform ${isNeuralMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                 </div>
                              </div>
                              <AnimatePresence>
                                 {isNeuralMenuOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 space-y-3">
                                       {NEURAL_NOTIFICATIONS.map(notif => (
                                          <div key={notif.id} className="bg-white border border-slate-50 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                                             <div className={`w-2 h-2 rounded-full ${notif.type === 'alert' ? 'bg-rose-500' : notif.type === 'opportunity' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                             <p className="text-[12px] font-bold text-slate-600">{notif.text}</p>
                                          </div>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>

                           <div className="w-full max-w-[850px] mx-auto mt-6 px-4 md:px-0">
                              <div onClick={() => setIsSpotlightOpen(!isSpotlightOpen)} className="bg-white/40 backdrop-blur-xl border border-slate-100 p-5 rounded-[28px] flex items-center justify-between cursor-pointer group hover:bg-white hover:shadow-2xl transition-all">
                                 <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-fuchsia-600 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                       <span className="material-symbols-rounded text-white text-[22px]">auto_awesome_motion</span>
                                    </div>
                                    <div>
                                       <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] block">Bizboard Spotlight</span>
                                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ecosystem Hub & Media Space</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2 mr-2">
                                       {[1, 2, 3].map(i => (
                                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                             <img src={`https://i.pravatar.cc/100?u=spot${i}`} alt="user" />
                                          </div>
                                       ))}
                                    </div>
                                    <span className={`material-symbols-rounded text-slate-300 group-hover:text-rose-600 transition-transform ${isSpotlightOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                 </div>
                              </div>
                              <AnimatePresence>
                                 {isSpotlightOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4">
                                       <BizboardSpotlight />
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </>
                     )}

                     {/* TAB 2: WORK AGENTS VIEW */}
                     {activeChatTab === 'work_agents' && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-14 space-y-6 px-4 md:px-0">
                           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <div>
                                 <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Background Work Agents</h3>
                                 <p className="text-xs text-slate-450 font-bold mt-0.5">Autonomous bots executing workflows in the background</p>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {workAgents.map(agent => {
                                 const icons: Record<string, string> = { email: '📧', whatsapp: '💬', report: '📊', calendar: '🗓️', marketing: '📣' };
                                 const statusColor: Record<string, string> = {
                                   active: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
                                   idle: 'bg-slate-400',
                                   building: 'bg-amber-400'
                                 };
                                 return (
                                    <div key={agent.id} className="p-5 bg-white border border-slate-150 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col justify-between min-h-[140px] group">
                                       <div>
                                          <div className="flex items-center justify-between mb-3">
                                             <span className="text-3xl">{icons[agent.type] || '🤖'}</span>
                                             <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${statusColor[agent.status]} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-450">{agent.status}</span>
                                             </div>
                                          </div>
                                          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-1">{agent.name}</h4>
                                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed line-clamp-2">{agent.description}</p>
                                       </div>
                                       <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4 text-[9px] font-bold text-slate-400">
                                          <span>{agent.tasksCompleted} tasks done</span>
                                          <span>Last active: {agent.lastRun || 'N/A'}</span>
                                       </div>
                                    </div>
                                 );
                              })}
                              
                              <button onClick={() => window.dispatchEvent(new CustomEvent('open-os-tab', { detail: 'workforce' }))} className="p-5 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all text-center group min-h-[140px]">
                                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <span className="material-symbols-rounded text-lg">add</span>
                                 </div>
                                 <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider group-hover:text-blue-600">Deploy New Agent</span>
                              </button>
                           </div>
                        </motion.div>
                     )}

                     {/* TAB 3: VOICE AGENTS VIEW */}
                     {activeChatTab === 'voice_agents' && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-14 space-y-6 px-4 md:px-0">
                           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <div>
                                 <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Voice Calling Employees</h3>
                                 <p className="text-xs text-slate-450 font-bold mt-0.5">High-speed voice calling agents backed by Arkle universal memory</p>
                              </div>
                           </div>
                           
                           {isLoadingVoice ? (
                              <div className="flex items-center justify-center py-10">
                                 <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              </div>
                           ) : voiceAgents.length === 0 ? (
                              <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6">
                                 <span className="material-symbols-rounded text-3xl text-slate-300 block mb-2">call</span>
                                 <p className="text-xs font-bold text-slate-500">No active voice employees hired yet.</p>
                                 <button onClick={() => window.dispatchEvent(new CustomEvent('open-os-tab', { detail: 'workforce' }))} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10">Hire Voice Employee</button>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {voiceAgents.map(agent => (
                                    <div key={agent.id} className="p-5 bg-white border border-slate-150 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                                       <div>
                                          <div className="flex items-start justify-between mb-4">
                                             <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-md text-white font-bold">
                                                   {agent.role === 'sales' || agent.role === 'sales_caller' ? '🎯' : agent.role === 'support' ? '💬' : '📞'}
                                                </div>
                                                <div>
                                                   <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">{agent.name}</h4>
                                                   <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider capitalize mt-0.5">{agent.role.replace('_', ' ')} · {agent.language}</p>
                                                </div>
                                             </div>
                                             <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-full px-2.5 border border-slate-100/50">
                                                <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{agent.status}</span>
                                             </div>
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed line-clamp-3 mb-4">{agent.businessDescription || 'Configured with custom business memory.'}</p>
                                       </div>
                                       
                                       <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                                          <div className="flex gap-4">
                                             <div className="text-center">
                                                <div className="text-xs font-black text-slate-800">{agent.totalCalls || 0}</div>
                                                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Calls</div>
                                             </div>
                                             <div className="text-center">
                                                <div className="text-xs font-black text-slate-800">{agent.totalMinutes || 0}m</div>
                                                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Minutes</div>
                                             </div>
                                          </div>
                                          <VapiButton assistantId={agent.id || "d9f38a6e-e6d7-4608-abfe-65c392577e4d"} className="text-[10px] font-black uppercase py-2 px-4 shadow-sm" />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     )}
                  </>
               )}
            </div>
         </div>

         {/* RIGHT QUICK TRAY - ALWAYS VISIBLE */}
         <RightQuickTray onAppClick={(appId) => {
            if (appId === 'mail') {
               onGmailClick?.();
            } else if (appId === 'billbook') {
               onOpenBillEase?.();
            } else if (appId === 'bizbook') {
               onOpenBillBook?.();
            }
         }} />

         <WhiteboardPanel isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />

         {/* Arkle AI Report Popup Overlay (70% - 75% screen width, centered) */}
         <AnimatePresence>
            {showReport && (
               <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 z-[9999] animate-in fade-in duration-300">
                  <motion.div 
                     initial={{ scale: 0.95, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.95, opacity: 0 }}
                     className="bg-white rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] w-full max-w-5xl h-[85vh] overflow-y-auto relative border border-slate-100 no-scrollbar"
                  >
                     <MarketHookStep 
                        data={data} 
                        onBack={() => {}} 
                        onDashboard={() => setShowReport(false)} 
                     />
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Document Preview Overlay */}
         <AnimatePresence>
            {selectedDoc && (
               <>
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300]" onClick={() => setSelectedDoc(null)} />
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="fixed inset-10 md:inset-20 z-[310] bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
                  >
                     <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-3">
                           <span className={`material-symbols-rounded text-2xl ${
                              selectedDoc.type === 'pdf' ? 'text-rose-500' : selectedDoc.type === 'sheet' ? 'text-emerald-500' : 'text-blue-500'
                           }`}>
                              {selectedDoc.type === 'pdf' ? 'picture_as_pdf' : selectedDoc.type === 'sheet' ? 'table_view' : 'description'}
                           </span>
                           <div>
                              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{selectedDoc.name}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Generated by Arkle AI</p>
                           </div>
                        </div>
                        <button onClick={() => setSelectedDoc(null)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                           <span className="material-symbols-rounded text-sm">close</span>
                        </button>
                     </div>
                     <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-slate-50/30">
                        {/* Mock doc details */}
                        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-slate-150 rounded-2xl shadow-xs space-y-6">
                           <div className="flex justify-between border-b border-slate-100 pb-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Registry</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedDoc.date}</span>
                           </div>
                           <h1 className="text-xl font-bold text-slate-900">{selectedDoc.name.replace(/\.[^/.]+$/, "")}</h1>
                           <div className="text-xs text-slate-600 leading-relaxed space-y-4">
                              <p>This document was compiled and formatted autonomously by Arkle AI Core based on operational directives.</p>
                              <p className="font-bold text-slate-800">Operational Summary:</p>
                              <ul className="list-disc pl-5 space-y-2">
                                 <li>Verified business entities and compliance frameworks.</li>
                                 <li>Analyzed revenue flows and generated accounting projections.</li>
                                 <li>Drafted and finalized legal clauses for party review.</li>
                              </ul>
                              <p>Status: <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold text-[9px] border border-green-100 ml-1">SECURE & ARCHIVED</span></p>
                           </div>
                           <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-[11px] font-bold text-slate-600 uppercase transition-all">Download</button>
                              <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">Close Preview</button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   );
}
