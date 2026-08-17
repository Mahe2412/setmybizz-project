'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, PhoneIncoming, PhoneOutgoing, 
  Zap, ListChecks, Database, MessageSquare, 
  GraduationCap, Phone, BarChart2, CreditCard, Settings,
  PhoneCall, UploadCloud, PlayCircle, Plus, Sparkles, MicOff, Mic,
  CheckCircle2, AlertCircle, TrendingUp, Clock, Building2, Brain,
  ChevronRight, Package, Star, Target, ShoppingBag, Globe, X, Edit3
} from 'lucide-react';
import VapiButton from '../VapiButton';

type TabId = 'dashboard' | 'my_employees' | 'new_employee' | 'instant_leads' | 'bulk_campaigns' | 'inbound_calls' | 'leads_results' | 'conversations' | 'train_employees' | 'phone_numbers' | 'billing' | 'settings';

interface VoiceAgent {
  id: string;
  name: string;
  role: string;
  ownerName?: string;
  ownerPhone?: string;
  businessDescription?: string;
  faqKnowledge?: string;
  systemPrompt?: string;
  language: string;
  voiceId: string;
  status: string;
  totalCalls: number;
  totalMinutes: number;
  createdAt: string;
  calls?: any[];
}

interface CallMessage { sender: 'agent' | 'user'; text: string; }

interface BusinessProfile {
  id: string;
  name: string;
  legalName?: string;
  industryType: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
}

interface AgentSkill {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const AGENT_ROLES = [
  { id: 'sales', label: 'Sales Agent', desc: 'Call leads, pitch products, close deals', icon: '🎯', color: 'indigo' },
  { id: 'support', label: 'Customer Support', desc: 'Handle queries, complaints, returns', icon: '💬', color: 'blue' },
  { id: 'reception', label: 'Front Desk / Reception', desc: 'Answer inbound calls, route to right person', icon: '📞', color: 'purple' },
  { id: 'collections', label: 'Payment Collections', desc: 'Follow up on dues, send payment links', icon: '💰', color: 'amber' },
  { id: 'orders', label: 'Order Management', desc: 'Take orders, confirm delivery, track status', icon: '📦', color: 'emerald' },
];

const INDUSTRY_TEMPLATES: Record<string, { description: string; faqs: string }> = {
  'ecommerce': {
    description: 'We are an e-commerce business selling products online via website and social media. Customers can order through our website, WhatsApp, or phone.',
    faqs: 'Q: How do I place an order?\nA: You can order through our website, WhatsApp us at our number, or call us directly.\n\nQ: What is the delivery time?\nA: We deliver within 3-5 business days across India.\n\nQ: Can I return the product?\nA: Yes, we have a 7-day return policy for all products.'
  },
  'manufacturing': {
    description: 'We are a manufacturing company producing quality products. We supply to retailers, wholesalers, and direct customers.',
    faqs: 'Q: What is the minimum order quantity?\nA: Minimum order quantity varies by product. Please contact us for bulk pricing.\n\nQ: Do you do custom orders?\nA: Yes, we accept custom orders with 15-day lead time.\n\nQ: What are your payment terms?\nA: 50% advance, 50% on delivery for new customers.'
  },
  'service': {
    description: 'We provide professional services to businesses and individuals. Our team of experts delivers high-quality service with quick turnaround.',
    faqs: 'Q: How do I book an appointment?\nA: Call us, WhatsApp, or book through our website. We confirm within 2 hours.\n\nQ: What are your service charges?\nA: Charges vary by service type. We provide a free estimate before starting.\n\nQ: Do you provide home service?\nA: Yes, we provide doorstep service in select areas.'
  },
  'restaurant': {
    description: 'We are a restaurant offering fresh, delicious food for dine-in, takeaway, and home delivery.',
    faqs: 'Q: Do you take advance reservations?\nA: Yes, we take table reservations for groups of 4 or more.\n\nQ: Do you do home delivery?\nA: Yes, we deliver within 5km radius. Minimum order ₹300.\n\nQ: Do you have vegetarian options?\nA: Yes, we have a full vegetarian menu available.'
  },
  'hospital': {
    description: 'We are a healthcare facility providing medical consultations, diagnostics, and treatment.',
    faqs: 'Q: How do I book an appointment?\nA: Call us or visit our website to book with any of our doctors.\n\nQ: What documents do I need to bring?\nA: Please bring a valid ID, previous medical records if any, and insurance card.\n\nQ: What are the consultation charges?\nA: Consultation fees vary by doctor. OPD starts from ₹200.'
  },
};

export default function WorkforceTab() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [wizardStep, setWizardStep] = useState(1);
  const [agentRole, setAgentRole] = useState('sales');
  const [agentName, setAgentName] = useState('Swara');
  const [agentLanguage, setAgentLanguage] = useState('tenglish');
  const [businessDescription, setBusinessDescription] = useState('');
  const [faq, setFaq] = useState('');
  const [agentSkills, setAgentSkills] = useState<string[]>(['sales', 'crm_update', 'whatsapp']);

  // Business Profile (auto-loaded from BizDesk)
  const [bizProfile, setBizProfile] = useState<BusinessProfile | null>(null);
  const [bizProducts, setBizProducts] = useState<any[]>([]);
  const [bizLeadsSummary, setBizLeadsSummary] = useState<any>(null);
  const [isLoadingBiz, setIsLoadingBiz] = useState(false);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [aiProfile, setAiProfile] = useState<any>(null);

  // Arkle Brain Chat State
  const [brainMode, setBrainMode] = useState<'import'|'chat'|'speak'|'description'>('import');
  const [brainChat, setBrainChat] = useState<{sender: 'arkle'|'user', text: string}[]>([]);
  const [brainInput, setBrainInput] = useState('');
  const [isBrainListening, setIsBrainListening] = useState(false);
  const brainChatEndRef = useRef<HTMLDivElement>(null);

  // Real agents from DB
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<VoiceAgent | null>(null);

  // Live call state
  const [activeAgent, setActiveAgent] = useState<VoiceAgent | null>(null);
  const [isBrowserCalling, setIsBrowserCalling] = useState(false);
  const [callTranscript, setCallTranscript] = useState<CallMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callSummary, setCallSummary] = useState<any>(null);
  const [callStartTime, setCallStartTime] = useState<number>(0);
  const [selectedCallAgent, setSelectedCallAgent] = useState<VoiceAgent | null>(null);

  // Agentic tools state (shows live tool execution during calls)
  const [agentTools, setAgentTools] = useState<{tool: string; success: boolean; message: string}[]>([]);
  const [callSuggestedActions, setCallSuggestedActions] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);
  const durationTimerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // ── Load agents from DB on mount ────────────────────────────────────────────
  useEffect(() => {
    loadAgents();
  }, []);

  // ── Auto-scroll transcript ───────────────────────────────────────────────────
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callTranscript]);

  useEffect(() => {
    brainChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [brainChat]);

  const loadAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const res = await fetch('/api/voice-agent');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (e) {
      console.error('Failed to load agents', e);
    } finally {
      setIsLoadingAgents(false);
    }
  };


  // ── Load Business Profile from BizDesk (auto-populate wizard) ──────────────
  const loadBizProfile = async () => {
    setIsLoadingBiz(true);
    try {
      const res = await fetch('/api/voice-agent/profile');
      const data = await res.json();
      if (data.business) {
        setBizProfile(data.business);
        setBizProducts(data.products || []);
        setBizLeadsSummary(data.crmSummary || null);
        // Auto-fill industry template if available
        const industry = data.business.industryType;
        const template = INDUSTRY_TEMPLATES[industry];
        
        // Generate a highly detailed Arkle Brain Import text
        const productList = (data.products || []).map((p: any) => `- ${p.name} (₹${p.salePrice})`).join('\n');
        
        const generatedDescription = `[BUSINESS IDENTITY]
Name: ${data.business.name}
Sector: ${industry || 'General Business'}
Founder/Owner: ${data.business.ownerName || 'Business Owner'}
Contact Email: ${data.business.email || 'N/A'}
Contact Phone: ${data.business.phone || 'N/A'}

[ABOUT THE BUSINESS]
${template?.description || 'We are a growing business providing excellent products and services to our customers.'}

[PRODUCTS & PRICING]
We offer the following items:
${productList || 'Standard products and services.'}

[BUSINESS RULES & OPERATIONS]
- We ensure high-quality service and customer satisfaction.
- Deliveries and order processing follow standard business timelines.

[FREQUENTLY ASKED QUESTIONS]
${template?.faqs || 'Q: How to contact us?\nA: Call our primary phone number.'}
`;

        if (!businessDescription) {
          setBusinessDescription(generatedDescription);
          setFaq(template?.faqs || '');
        }
        
        // Initialize Arkle Brain Chat
        setBrainChat([
          { 
            sender: 'arkle', 
            text: `Hi Ramesh! I've connected to BizDesk. I see ${data.business.name} is in the ${industry} sector, with ${data.products?.length || 0} products and ${data.crmSummary?.totalLeads || 0} leads. What is the primary goal for ${agentName}? (e.g., booking appointments, qualifying leads)` 
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to load business profile', e);
    } finally {
      setIsLoadingBiz(false);
    }
  };

  // ── Arkle Brain Builder Chat ────────────────────────────────────────────────
  const handleBrainChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!brainInput.trim()) return;

    const userMsg = brainInput;
    setBrainInput('');
    setBrainChat(prev => [...prev, { sender: 'user', text: userMsg }]);

    setIsGeneratingProfile(true);
    try {
      // Send the whole chat history to get Arkle's next question OR the final profile
      const res = await fetch('/api/voice-agent/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: bizProfile?.name || 'our business',
          industryType: bizProfile?.industryType || 'service',
          products: bizProducts.map(p => p.name).join(', '),
          additionalContext: brainChat.map(c => `${c.sender}: ${c.text}`).join('\\n') + `\\nuser: ${userMsg}`,
        }),
      });
      const data = await res.json();
      if (data.profile) {
        setAiProfile(data.profile);
        setBusinessDescription(data.profile.businessDescription || '');
        if (data.profile.suggestedFaqs?.length) {
          const faqText = data.profile.suggestedFaqs
            .map((f: any) => `Q: ${f.question}\\nA: ${f.answer}`)
            .join('\\n\\n');
          setFaq(faqText);
        }
        setBrainChat(prev => [...prev, { sender: 'arkle', text: "Got it! I've built the business brain. Review the Pitch and FAQs, and let's move to the next step." }]);
      } else if (data.arkleReply) {
        setBrainChat(prev => [...prev, { sender: 'arkle', text: data.arkleReply }]);
      }
    } catch (e) {
      console.error('Failed to update brain', e);
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const startBrainListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.lang = 'en-IN';
    recog.onstart = () => setIsBrainListening(true);
    recog.onend = () => setIsBrainListening(false);
    recog.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setBrainInput(text);
    };
    recog.start();
  };

  // ── Create Agent (Wizard Final Step) ─────────────────────────────────────────
  const handleHireAgent = async () => {
    setIsCreatingAgent(true);
    try {
      const res = await fetch('/api/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: bizProfile?.id,
          businessName: bizProfile?.name || 'My Business',
          agentName,
          role: agentRole,
          businessDescription,
          faqKnowledge: faq,
          language: agentLanguage,
          voiceId: 'N2lVS1w4EtoT3dr4eOWO',
        }),
      });
      const data = await res.json();
      if (data.agent) {
        setCreatedAgent(data.agent);
        setAgents(prev => [data.agent, ...prev]);
        setWizardStep(5);
      }
    } catch (e) {
      console.error('Failed to create agent', e);
    } finally {
      setIsCreatingAgent(false);
    }
  };


  // ─── REAL CALL ENGINE ──────────────────────────────────────────────────────
  const startBrowserCall = async (agent: VoiceAgent) => {
    setActiveAgent(agent);
    setIsBrowserCalling(true);
    setCallTranscript([]);
    setCallId(null);
    setCallDuration(0);
    setCallSummary(null);
    setCallStartTime(Date.now());
    setAgentTools([]);

    // Start timer
    durationTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Fetch greeting from new unified agent API
    try {
      const res = await fetch(`/api/agent/turn?agentId=${agent.id}`, {
        method: 'GET',
      }).catch(() => null);

      let greetingText = `Hello! I'm ${agent.name} from ${bizProfile?.name || 'our business'}. How can I help you today?`;
      let audioBase64: string | null = null;

      if (res?.ok) {
        const data = await res.json();
        greetingText = data.greeting || greetingText;
        audioBase64 = data.audioBase64;
      }

      setCallTranscript([{ sender: 'agent', text: greetingText }]);

      if (audioBase64) {
        await playAudio(audioBase64);
      } else {
        // FREE: Use browser TTS (no API cost)
        speakText(greetingText, () => startListening());
        return;
      }
      startListening();
    } catch {
      const greeting = `Hello! I'm ${agent.name}. How can I help you?`;
      setCallTranscript([{ sender: 'agent', text: greeting }]);
      speakText(greeting, () => startListening());
    }
  };

  const playAudio = (base64: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsAgentSpeaking(true);
      const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
      audioRef.current = audio;
      audio.onended = () => {
        setIsAgentSpeaking(false);
        resolve();
      };
      audio.onerror = () => {
        setIsAgentSpeaking(false);
        resolve();
      };
      audio.play().catch(() => {
        setIsAgentSpeaking(false);
        resolve();
      });
    });
  };

  const speakText = (text: string, onDone?: () => void) => {
    if (typeof window === 'undefined') return;
    setIsAgentSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => {
      setIsAgentSpeaking(false);
      onDone?.();
    };
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = 'en-IN';
    recog.continuous = false;
    recog.interimResults = false;

    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);

    recog.onresult = async (event: any) => {
      const userText = event.results[0][0].transcript;
      setCallTranscript(prev => [...prev, { sender: 'user', text: userText }]);

      // Build history for context
      const currentHistory = callTranscript.map(m => ({
        role: m.sender === 'agent' ? 'agent' : 'user',
        content: m.text,
        timestamp: Date.now(),
      }));

      try {
        // NEW: Use unified /api/agent/turn endpoint
        const res = await fetch('/api/agent/turn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: activeAgent?.id,
            userInput: userText,
            channel: 'voice_inbound',
            callId,
            history: currentHistory,
          }),
        });

        const data = await res.json();

        if (data.reply) {
          if (data.callId) setCallId(data.callId);

          // Show tools that executed (agentic actions)
          if (data.toolsExecuted?.length > 0) {
            setAgentTools(prev => [...prev, ...data.toolsExecuted]);
          }

          // Show suggested actions in UI
          if (data.suggestedActions?.length > 0) {
            setCallSuggestedActions(data.suggestedActions);
          }

          setCallTranscript(prev => [...prev, { sender: 'agent', text: data.reply }]);

          if (data.audioBase64) {
            await playAudio(data.audioBase64);
          } else {
            // FREE: Browser TTS fallback
            await new Promise<void>((res) => speakText(data.reply, res));
          }

          // Auto-end call if agent says goodbye
          if (data.shouldEndCall) {
            if (data.callSummary) setCallSummary(data.callSummary);
            setTimeout(() => stopBrowserCall(), 2000);
            return;
          }

          startListening(); // Continue the conversation loop
        }
      } catch (e) {
        speakText('Sorry, there was a connection issue. Please try again.', () => startListening());
      }
    };

    recog.onerror = () => {
      setIsListening(false);
      // Auto-retry after 1s on error
      setTimeout(() => {
        if (isBrowserCalling) startListening();
      }, 1000);
    };

    recog.start();
    recognitionRef.current = recog;
  };

  const stopBrowserCall = async () => {
    // Stop recognition and audio
    if (recognitionRef.current) recognitionRef.current.abort();
    if (audioRef.current) audioRef.current.pause();
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    clearInterval(durationTimerRef.current);

    setIsBrowserCalling(false);
    setIsListening(false);
    setIsAgentSpeaking(false);

    // End call & get summary from API
    if (callId) {
      try {
        const res = await fetch('/api/voice-agent/end-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callId,
            agentId: activeAgent?.id,
            durationSecs: callDuration,
          }),
        });
        const data = await res.json();
        setCallSummary(data);
        // Refresh agents to update call count
        loadAgents();
      } catch (e) {
        console.error('Failed to end call', e);
      }
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };



  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
        { id: 'my_employees', label: 'My Employees', icon: Users },
        { id: 'new_employee', label: 'New employee', icon: UserPlus },
      ]
    },
    {
      title: 'CALLING',
      items: [
        { id: 'instant_leads', label: 'Instant Leads', icon: Zap },
        { id: 'bulk_campaigns', label: 'Bulk Campaigns', icon: PhoneOutgoing },
        { id: 'inbound_calls', label: 'Inbound Calls', icon: PhoneIncoming },
      ]
    },
    {
      title: 'RESULTS & SETUP',
      items: [
        { id: 'leads_results', label: 'Leads & Results', icon: ListChecks },
        { id: 'conversations', label: 'All Conversations', icon: MessageSquare },
        { id: 'train_employees', label: 'Train Employees', icon: GraduationCap },
        { id: 'phone_numbers', label: 'Phone Numbers', icon: Phone },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-slate-50 font-sans text-slate-900 border-t border-slate-200">
      
      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">BizOS Agents</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Native Voice Employees</p>
        </div>

        <div className="flex-1 py-4">
          {navGroups.map((group, i) => (
            <div key={i} className="mb-6">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{group.title}</p>
              <div className="space-y-0.5 px-2">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabId)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all
                        ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-600" /> Talk
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              ₹ 2,500.00 <span className="text-amber-500 font-medium">| 240 mins</span>
              <button className="ml-1 w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-5xl mx-auto">
          
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              
              {/* ════ VIRTUAL OFFICE DASHBOARD ════ */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* CENTRAL ARKLE COMMAND */}
                  <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 rotate-12 hover:rotate-0 transition-all duration-300">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      
                      <h1 className="text-3xl font-black text-white mb-2">Speak with Arkle</h1>
                      <p className="text-indigo-200 text-sm mb-8">Manage your entire AI workforce, assign tasks, or ask about your business metrics.</p>
                      
                      <div className="relative flex items-center">
                        <button className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                          <Mic className="w-4 h-4" />
                        </button>
                        <input 
                          type="text" 
                          placeholder="e.g., Hire a new sales agent to call today's leads..." 
                          className="w-full bg-black/40 border border-white/20 rounded-2xl py-4 pl-16 pr-32 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 backdrop-blur-md shadow-inner"
                        />
                        <button className="absolute right-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-md">
                          <Sparkles className="w-4 h-4" /> Ask Arkle
                        </button>
                      </div>
                      
                      <div className="flex justify-center gap-3 mt-6">
                        {['"Call all pending leads"', '"What is Swara doing?"', '"Set up WhatsApp sync"'].map((chip, i) => (
                          <button key={i} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] text-indigo-200 transition-colors">
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* TWO COLUMN LAYOUT: My Office & Suggested */}
                  <div className="grid grid-cols-3 gap-6">
                    
                    {/* LEFT: MY EMPLOYEES (OFFICE) */}
                    <div className="col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600"/> Active Office</h2>
                        <button onClick={() => { setWizardStep(1); setActiveTab('my_employees'); }} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">Manage all →</button>
                      </div>

                      {isLoadingAgents ? (
                         <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                           <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                         </div>
                      ) : agents.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {agents.map((emp) => (
                            <div key={emp.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4">
                                <span className="flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                              </div>
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-black text-xl shadow-inner border border-white">
                                  {emp.name[0]}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                                  <p className="text-[10px] text-indigo-600 font-semibold capitalize">{emp.role} Agent • {emp.totalCalls} calls</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => startBrowserCall(emp)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all">
                                  <PhoneCall className="w-3 h-3" /> Test Call
                                </button>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Active</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm text-center mb-3">
                          <p className="text-[13px] text-slate-500">No employees yet. <span onClick={() => setActiveTab('new_employee')} className="font-semibold text-indigo-600 cursor-pointer hover:underline">Build your first</span></p>
                        </div>
                      )}
                      
                      <button onClick={() => setActiveTab('new_employee')} className="w-full bg-white border border-dashed border-slate-300 p-4 rounded-xl hover:bg-slate-50 text-indigo-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-3">
                        <UserPlus className="w-4 h-4" /> Add another employee
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ MY EMPLOYEES ════ */}
              {activeTab === 'my_employees' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">MY TEAM</p>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">My Employees</h1>
                      <p className="text-sm text-slate-500">{agents.length} voice agents ready</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={loadAgents} className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-all"><BarChart2 className="w-4 h-4 text-slate-600" /></button>
                      <button onClick={() => setActiveTab('new_employee')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
                        + New employee
                      </button>
                    </div>
                  </div>

                  {agents.length > 0 ? (
                    <div className="grid grid-cols-3 gap-6">
                      {agents.map((emp) => (
                        <div key={emp.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                              {emp.name[0]}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{emp.status}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">{emp.name}</h3>
                          <p className="text-xs font-semibold text-indigo-600 mb-1 capitalize">{emp.role} Agent</p>
                          <div className="flex gap-4 text-[10px] text-slate-500 mb-4">
                            <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" />{emp.totalCalls} calls</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.round(emp.totalMinutes)}m</span>
                          </div>
                          <div className="border-t border-slate-100 pt-3 flex gap-2">
                            <button onClick={() => startBrowserCall(emp)} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1">
                              <PhoneCall className="w-3.5 h-3.5" /> Test Call
                            </button>
                            <button onClick={() => setActiveTab('train_employees')} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-4xl mx-auto mt-12">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Hire your first AI employee</h3>
                      <p className="text-[13px] text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                        It answers calls and chases leads while you sleep — no salary, no sick days. Build and test one free before you hire.
                      </p>
                      <button onClick={() => setActiveTab('new_employee')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-sm">
                        + New employee
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ════ NEW EMPLOYEE (SETUP WIZARD) ════ */}
              {activeTab === 'new_employee' && (
                <div className="max-w-6xl mx-auto flex gap-12">
                  
                  {/* ── Left Sidebar Stepper ── */}
                  <div className="w-72 flex-shrink-0 pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">SETUP WIZARD</p>
                    
                    <div className="space-y-6 relative">
                      {[
                        { step: 1, title: 'Role & Identity', desc: 'Who they are' },
                        { step: 2, title: 'Business Brain', desc: 'What they know' },
                        { step: 3, title: 'Agent Skills', desc: 'What they can do' },
                        { step: 4, title: 'Hear & Refine', desc: 'Test in real-time' },
                        { step: 5, title: 'Hire & Deploy', desc: 'Make them live' },
                      ].map(s => (
                        <div key={s.step} className={`relative flex items-center justify-start gap-4 ${wizardStep >= s.step ? 'opacity-100' : 'opacity-40'}`}>
                          <div className={`h-8 w-8 rounded-full border-2 ${wizardStep === s.step ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : wizardStep > s.step ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-slate-50 text-slate-400'} z-10 flex items-center justify-center text-[12px] font-bold`}>
                            {wizardStep > s.step ? '✓' : s.step}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                            <p className="text-[10px] text-slate-500">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5"/> CONNECTED WORKSPACE</p>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{bizProfile?.name || 'Loading...'}</h4>
                      <p className="text-xs text-slate-500 mb-3 capitalize">{bizProfile?.industryType || 'Business'} Sector</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 flex items-center gap-1"><Package className="w-3 h-3"/> {bizProducts.length} Items</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 flex items-center gap-1"><Users className="w-3 h-3"/> {bizLeadsSummary?.totalLeads || 0} Leads</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Right Content Area ── */}
                  <div className="flex-1 max-w-2xl pt-4">
                    
                    {/* WIZARD STEP 1: Role & Identity */}
                    {wizardStep === 1 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-black text-slate-900">Define your new employee</h2>
                            <p className="text-sm text-slate-500 mt-1">What role will they play in your business?</p>
                          </div>
                          <button onClick={loadBizProfile} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                            Sync BizDesk Data
                          </button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 space-y-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-3">Select their role</label>
                            <div className="grid grid-cols-2 gap-3">
                              {AGENT_ROLES.map(role => (
                                <button key={role.id} onClick={() => setAgentRole(role.id)} 
                                  className={`p-4 rounded-xl border text-left transition-all ${agentRole === role.id ? `border-${role.color}-500 bg-${role.color}-50 shadow-sm ring-1 ring-${role.color}-500` : 'border-slate-200 hover:border-slate-300'}`}>
                                  <span className="text-2xl block mb-2">{role.icon}</span>
                                  <h4 className={`text-sm font-bold ${agentRole === role.id ? `text-${role.color}-900` : 'text-slate-900'}`}>{role.label}</h4>
                                  <p className="text-[10px] text-slate-500 mt-1">{role.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">Agent Name</label>
                              <input type="text" value={agentName} onChange={e => setAgentName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">Primary Language</label>
                              <select value={agentLanguage} onChange={e => setAgentLanguage(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                                <option value="tenglish">Telugu + English (Tenglish)</option>
                                <option value="hindi">Hindi</option>
                                <option value="english">English (Indian Accent)</option>
                                <option value="tamil">Tamil</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button onClick={() => setWizardStep(2)} className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
                            Next: Business Brain →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* WIZARD STEP 2: Business Brain */}
                    {wizardStep === 2 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-black text-slate-900">Build their Business Brain</h2>
                            <p className="text-sm text-slate-500 mt-1">Teach {agentName} everything about your business.</p>
                          </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 w-fit border border-slate-200">
                          {[
                            { id: 'import', label: 'Import from Arkle' },
                            { id: 'chat', label: 'Chat' },
                            { id: 'speak', label: 'Speak' },
                            { id: 'description', label: 'Manual Description' }
                          ].map((mode) => (
                            <button key={mode.id} onClick={() => {
                               setBrainMode(mode.id as any);
                               if (mode.id === 'speak') startBrainListening();
                            }} 
                              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${brainMode === mode.id ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
                              {mode.id === 'import' && <Database className="w-3.5 h-3.5"/>}
                              {mode.id === 'chat' && <MessageSquare className="w-3.5 h-3.5"/>}
                              {mode.id === 'speak' && <Mic className="w-3.5 h-3.5"/>}
                              {mode.id === 'description' && <Edit3 className="w-3.5 h-3.5"/>}
                              {mode.label}
                            </button>
                          ))}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 flex flex-col min-h-[400px] overflow-hidden relative">
                          
                          {/* MODE: IMPORT FROM ARKLE or MANUAL DESCRIPTION */}
                          {(brainMode === 'import' || brainMode === 'description') && (
                            <div className="flex flex-col h-full bg-slate-50">
                              <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-indigo-600"/> 
                                    {brainMode === 'import' ? 'Arkle Business Knowledge' : 'Business Description'}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    {brainMode === 'import' 
                                      ? 'This data is automatically imported from your BizDesk database. Review, edit, or add more details below.' 
                                      : 'Write down exactly what your agent should know and how it should behave.'}
                                  </p>
                                </div>
                                {brainMode === 'import' && (
                                  <button onClick={loadBizProfile} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-100">
                                    <Zap className="w-3 h-3"/> Re-sync Arkle
                                  </button>
                                )}
                              </div>
                              
                              <textarea 
                                value={businessDescription} 
                                onChange={(e) => setBusinessDescription(e.target.value)}
                                className="flex-1 w-full p-6 text-sm text-slate-700 font-mono bg-slate-50 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                                placeholder="Describe your business, products, pricing, and rules here..."
                              />
                            </div>
                          )}

                          {/* MODE: CHAT & SPEAK */}
                          {(brainMode === 'chat' || brainMode === 'speak') && (
                            <div className="flex flex-col h-full">
                              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[330px]">
                                {brainChat.length === 0 && (
                                  <div className="text-center text-slate-400 mt-16">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                      {brainMode === 'speak' ? <Mic className="w-8 h-8 text-indigo-500" /> : <MessageSquare className="w-8 h-8 text-indigo-500" />}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">
                                      {brainMode === 'speak' ? 'Speak with Arkle' : 'Chat with Arkle'}
                                    </h3>
                                    <p className="text-xs max-w-xs mx-auto mb-4">
                                      {brainMode === 'speak' 
                                        ? 'Your mic is on. Tell Arkle about your business, products, and what this agent should do.' 
                                        : 'Type your business details and rules here. Arkle will process them into agent knowledge.'}
                                    </p>
                                    <button onClick={() => setBrainChat([{ sender: 'arkle', text: `Hi! I'm Arkle. Let's setup ${agentName}. What should be the main goal of their calls?` }])} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md">
                                      Start {brainMode === 'speak' ? 'Speaking' : 'Chatting'}
                                    </button>
                                  </div>
                                )}
                                {brainChat.map((msg, i) => (
                                  <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender === 'arkle' && (
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Zap className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-slate-900 text-white rounded-tr-sm shadow-md' : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200'}`}>
                                      {msg.text}
                                    </div>
                                  </div>
                                ))}
                                {isGeneratingProfile && (
                                  <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                      <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-500 rounded-tl-sm flex items-center gap-1.5 border border-slate-200">
                                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                  </div>
                                )}
                                <div ref={brainChatEndRef} />
                              </div>

                              {/* Chat Input */}
                              <div className="p-4 border-t border-slate-100 bg-white mt-auto">
                                <form onSubmit={handleBrainChatSubmit} className="flex items-center gap-3 relative">
                                  <button type="button" onClick={startBrainListening} className={`w-11 h-11 flex items-center justify-center rounded-full transition-all flex-shrink-0 ${isBrainListening || brainMode === 'speak' ? 'bg-red-50 text-red-500 ring-2 ring-red-200 animate-pulse shadow-inner' : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200'}`}>
                                    <Mic className="w-5 h-5" />
                                  </button>
                                  <input type="text" placeholder={brainMode === 'speak' ? 'Listening... Or type here.' : "Type your business details here..."} value={brainInput} onChange={e => setBrainInput(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
                                  <button type="submit" disabled={!brainInput.trim() || isGeneratingProfile} className="w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 shadow-md transition-transform active:scale-95 flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                  </button>
                                </form>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 justify-end">
                          <button onClick={() => setWizardStep(1)} className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all">Back</button>
                          <button onClick={() => setWizardStep(3)} className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">Next: Agent Skills →</button>
                        </div>
                      </motion.div>
                    )}

                    {/* WIZARD STEP 3: Agent Skills */}
                    {wizardStep === 3 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="mb-6">
                          <h2 className="text-2xl font-black text-slate-900">Equip Agent Skills</h2>
                          <p className="text-sm text-slate-500 mt-1">What tools should {agentName} have access to during a call?</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm mb-6">
                          {[
                            { id: 'crm_update', label: 'CRM Sync', desc: 'Automatically log calls, update lead status, and take notes in BizDesk CRM', icon: Database, color: 'blue' },
                            { id: 'whatsapp', label: 'Send WhatsApp', desc: 'Can send brochures, payment links, and summaries via WhatsApp after call', icon: MessageSquare, color: 'emerald' },
                            { id: 'sales', label: 'Product Catalog Access', desc: 'Can search and quote live prices from your BizDesk inventory', icon: ShoppingBag, color: 'indigo' },
                            { id: 'calendar', label: 'Book Meetings', desc: 'Can check your availability and schedule appointments', icon: Clock, color: 'purple' },
                          ].map((skill, idx) => {
                            const isEnabled = agentSkills.includes(skill.id);
                            const Icon = skill.icon;
                            return (
                              <div key={skill.id} onClick={() => {
                                setAgentSkills(prev => isEnabled ? prev.filter(s => s !== skill.id) : [...prev, skill.id])
                              }} className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${idx !== 0 ? 'border-t border-slate-100' : ''} ${isEnabled ? `bg-${skill.color}-50/50` : 'hover:bg-slate-50'}`}>
                                <div className={`mt-1 p-2 rounded-lg ${isEnabled ? `bg-${skill.color}-100 text-${skill.color}-600` : 'bg-slate-100 text-slate-400'}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className={`text-sm font-bold ${isEnabled ? 'text-slate-900' : 'text-slate-600'}`}>{skill.label}</h4>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{skill.desc}</p>
                                </div>
                                <div>
                                  <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${isEnabled ? `bg-${skill.color}-500` : 'bg-slate-200'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-3 justify-end">
                          <button onClick={() => setWizardStep(2)} className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all">Back</button>
                          <button onClick={() => setWizardStep(4)} className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">Next: Hear & Refine →</button>
                        </div>
                      </motion.div>
                    )}

                    {/* WIZARD STEP 4: Hear & Refine */}
                    {wizardStep === 4 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="mb-6">
                          <h2 className="text-2xl font-black text-slate-900">Hear & Refine</h2>
                          <p className="text-sm text-slate-500 mt-1">Mock test {agentName} in real-time. Speak to them right now to see if they understand.</p>
                        </div>

                        {isBrowserCalling ? (
                          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl text-center relative overflow-hidden mb-6">
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                              <span className="text-[10px] font-bold tracking-wider text-red-400">LIVE TEST</span>
                            </div>

                            <div className="w-24 h-24 bg-indigo-500/20 border-2 border-indigo-400 rounded-full flex items-center justify-center mx-auto my-8 relative">
                              <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-25"></div>
                              <PhoneCall className="w-10 h-10 text-indigo-300" />
                            </div>

                            <p className="text-sm font-bold mb-1">Talking with {agentName}</p>
                            <p className="text-[11px] text-slate-400 mb-6">{isListening ? 'Listening for your voice...' : 'Speaking...'}</p>

                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-left h-48 overflow-y-auto space-y-2 mb-6">
                              {callTranscript.map((t, i) => (
                                <div key={i} className={`p-2 rounded-lg max-w-[85%] text-xs ${t.sender === 'agent' ? 'bg-indigo-950 text-indigo-200 mr-auto' : 'bg-slate-800 text-white ml-auto'}`}>
                                  <span className="font-bold block text-[9px] text-white/40 mb-0.5">{t.sender === 'agent' ? `${agentName} (AI)` : 'You'}</span>
                                  {t.text}
                                </div>
                              ))}
                              <div ref={transcriptEndRef} />
                            </div>

                            <button onClick={stopBrowserCall} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all">
                              End Live Call
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center mb-6">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
                              <Mic className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Test Call in Browser</h3>
                            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Experience the ultra-low latency Vapi Voice Agent directly from your browser. No phone number required.</p>
                            <VapiButton className="mx-auto" />
                          </div>
                        )}

                        <div className="flex gap-3 justify-end">
                          <button onClick={() => setWizardStep(3)} className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all">Back</button>
                          <button onClick={() => setWizardStep(5)} className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">Next: Deploy →</button>
                        </div>
                      </motion.div>
                    )}

                    {/* WIZARD STEP 5: Train & Hire */}
                    {wizardStep === 5 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        {isCreatingAgent ? (
                          <div className="py-20 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Training {agentName}...</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">Deploying business knowledge and connecting agent skills. This takes a few seconds.</p>
                          </div>
                        ) : createdAgent ? (
                          <div className="py-12 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                              <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">{createdAgent.name} is Hired!</h2>
                            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Your new AI {createdAgent.role} agent is live and ready to take calls.</p>
                            
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-8 max-w-md mx-auto space-y-3">
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Agent Name:</span> <span className="text-sm font-bold text-slate-900">{createdAgent.name}</span></div>
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Role:</span> <span className="text-sm font-bold text-slate-900 capitalize">{createdAgent.role}</span></div>
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Language:</span> <span className="text-sm font-bold text-slate-900">{createdAgent.language}</span></div>
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Skills Enabled:</span> <span className="text-sm font-bold text-indigo-600">{agentSkills.length}</span></div>
                            </div>

                            <button onClick={() => { setWizardStep(1); setActiveTab('my_employees'); }} className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
                              Go to My Employees →
                            </button>
                          </div>
                        ) : (
                          <div className="py-12 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Target className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Ready to Deploy {agentName}?</h2>
                            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">Once hired, {agentName} will be available to take inbound calls or run automated outbound campaigns.</p>
                            
                            <div className="flex justify-center gap-4">
                              <button onClick={() => setWizardStep(4)} className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all">Back</button>
                              <button onClick={handleHireAgent} disabled={!businessDescription} className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Train &amp; Hire Agent
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                  </div>
                </div>
              )}

              {/* ════ INSTANT LEADS ════ */}
              {activeTab === 'instant_leads' && (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Instant Leads</h1>
                  <p className="text-sm text-slate-500 mb-12">A lead lands, the call is already dialing.</p>

                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-slate-600 mb-12">From your site, a form, an ad, your CRM — the instant a lead arrives, this employee calls. Here's exactly how:</p>
                    
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -z-10"></div>
                      
                      {/* Step 1 */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm w-64">
                        <span className="text-[10px] font-bold text-slate-400 absolute -top-3 left-6 bg-white px-2">01</span>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">R</div>
                          <div className="text-left">
                            <p className="text-sm font-bold">Ramesh - Hyderabad</p>
                            <p className="text-[10px] text-slate-500">via Meta Ads</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-4">New lead hits your webhook</p>
                        <p className="text-[10px] text-slate-500 mt-1">From any source you connect</p>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-white border-2 border-indigo-100 p-6 rounded-2xl shadow-md w-64 ring-4 ring-indigo-50">
                        <span className="text-[10px] font-bold text-indigo-400 absolute -top-3 left-6 bg-white px-2">02</span>
                        <div className="text-4xl font-black text-indigo-600 mb-4">0:06</div>
                        <p className="text-xs font-bold text-slate-900">Employee calls within seconds</p>
                        <p className="text-[10px] text-slate-500 mt-1">Before they've closed the tab</p>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm w-64">
                        <span className="text-[10px] font-bold text-slate-400 absolute -top-3 left-6 bg-white px-2">03</span>
                        <div className="flex gap-2 items-end h-10 mb-4">
                          <div className="w-4 bg-emerald-400 h-full rounded-t-sm"></div>
                          <div className="w-4 bg-emerald-200 h-2/3 rounded-t-sm"></div>
                          <div className="w-4 bg-emerald-200 h-1/2 rounded-t-sm"></div>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-4">Outcome logged in your funnel</p>
                        <p className="text-[10px] text-slate-500 mt-1">Searchable, filterable, exportable</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all">
                      Get your webhook URL →
                    </button>
                  </div>
                </div>
              )}

              {/* ════ BULK CAMPAIGNS ════ */}
              {activeTab === 'bulk_campaigns' && (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Bulk Campaigns</h1>
                  <p className="text-sm text-slate-500 mb-12">One list in, fully worked, while you're elsewhere.</p>

                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-slate-600 mb-12">Old leads, a customer base, a cold list — upload it once and this employee dials the whole thing, at a pace you set.</p>
                    
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -z-10"></div>
                      
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm w-64">
                        <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <p className="text-2xl font-black text-slate-900">247</p>
                        <p className="text-[10px] text-slate-500 mb-4">leads.csv</p>
                        <p className="text-xs font-bold text-slate-900">Upload your list</p>
                      </div>

                      <div className="bg-white border-2 border-indigo-100 p-6 rounded-2xl shadow-md w-64 ring-4 ring-indigo-50">
                        <div className="space-y-2 mb-4 text-left">
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-xs font-semibold">Lakshmi Devi</span></div>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span><span className="text-xs font-semibold">Anitha Reddy</span></div>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-300"></span><span className="text-xs font-semibold text-slate-400">Vijay Prasad</span></div>
                        </div>
                        <p className="text-xs font-bold text-slate-900">Employee dials automatically</p>
                      </div>

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm w-64">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-sm font-bold text-indigo-600">62%</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">Watch it dial — live</p>
                        <p className="text-[10px] text-slate-500 mt-1">Full analytics as it runs</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all">
                      Create your first campaign →
                    </button>
                  </div>
                </div>
              )}

              {/* ════ INBOUND CALLS ════ */}
              {activeTab === 'inbound_calls' && (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Inbound Desk</h1>
                  <p className="text-sm text-slate-500 mb-8">Calls to your number, answered by the assigned employee.</p>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center max-w-2xl mx-auto mt-12 shadow-sm">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PhoneIncoming className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Get your virtual phone number</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">Purchase a dedicated phone number. When customers call this number, your AI Receptionist will answer instantly 24/7.</p>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all">
                      Buy Number (₹250/mo)
                    </button>
                  </div>
                </div>
              )}

              {/* ════ LEADS & RESULTS ════ */}
              {activeTab === 'leads_results' && (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Leads & Results</h1>
                  <p className="text-sm text-slate-500 mb-8">Every contact your employees have spoken with — across inbound, instant and bulk.</p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'TOTAL LEADS', value: '0', sub: '0 shown' },
                      { label: 'QUALIFIED', value: '0', sub: 'positive outcome', color: 'text-emerald-600' },
                      { label: 'PENDING CALLBACK', value: '0', sub: 'need follow up', color: 'text-amber-600' },
                      { label: 'HOT LEADS', value: '0', sub: 'interested - last 7d', color: 'text-rose-600' }
                    ].map((s, i) => (
                      <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {s.label}</p>
                        <p className={`text-3xl font-black mb-1 ${s.color || 'text-slate-900'}`}>{s.value}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No leads yet</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">Everyone your employees call or answer lands here — with the outcome, the details they captured, and a full transcript.</p>
                    <button className="px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-all text-sm">
                      Go to my employees
                    </button>
                  </div>
                </div>
              )}

              {/* ════ ALL CONVERSATIONS ════ */}
              {activeTab === 'conversations' && (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Conversations</h1>
                  <p className="text-sm text-slate-500 mb-8">Every call your employees handled — filter, sort, and export.</p>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">No conversations yet</h3>
                    <p className="text-[13px] text-slate-500 mb-6 max-w-md mx-auto">Your call transcripts and recordings land here once your employees start talking to real people. Recordings are kept for 90 days; transcripts stay as long as your account is active.</p>
                    <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-sm">
                      Go to my employees
                    </button>
                  </div>
                </div>
              )}

              {/* ════ TRAIN EMPLOYEES ════ */}
              {activeTab === 'train_employees' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">TEACH</p>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">Teach your employee</h1>
                      <p className="text-sm text-slate-500">Tell it about your business in your own words — it learns the facts and the rules.</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Refresh
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">No employees yet</h3>
                    <p className="text-[13px] text-slate-500">Hire an employee first, then come back to teach them.</p>
                  </div>
                </div>
              )}

              {/* ════ PHONE NUMBERS ════ */}
              {activeTab === 'phone_numbers' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">PHONE NUMBERS</p>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">Phone Numbers</h1>
                      <p className="text-sm text-slate-500">Buy numbers, verify, and attach them to employees.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-700">₹20.00 credits</span>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2">
                        + Buy a new number
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-3xl mx-auto">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Give your employee a phone number</h3>
                    <p className="text-[13px] text-slate-500 mb-8 max-w-md mx-auto">A number is how your employee makes and takes real calls — it's the number your customers see when they ring, or get a call from. You need one to go live.</p>
                    
                    <div className="flex justify-center gap-4 mb-8">
                      <div className="p-4 border border-slate-200 rounded-xl text-center w-36">
                        <p className="text-xs font-bold text-slate-900 mb-1">Call your leads</p>
                        <p className="text-[10px] text-slate-500">Ring every new lead automatically</p>
                      </div>
                      <div className="p-4 border border-slate-200 rounded-xl text-center w-36">
                        <p className="text-xs font-bold text-slate-900 mb-1">Answer customers</p>
                        <p className="text-[10px] text-slate-500">Pick up every incoming call 24/7</p>
                      </div>
                      <div className="p-4 border border-slate-200 rounded-xl text-center w-36">
                        <p className="text-xs font-bold text-slate-900 mb-1">Your business ID</p>
                        <p className="text-[10px] text-slate-500">Customers see this as your number</p>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all text-sm">
                      Browse numbers
                    </button>
                  </div>
                </div>
              )}

              {/* ════ PERFORMANCE ════ */}
              {activeTab === 'performance' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">PERFORMANCE</p>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">Performance</h1>
                      <p className="text-sm text-slate-500">4 Jul 2026 - 3 Aug 2026 · 0 calls</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
                      Export leaderboard
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {['CALLS', 'CONNECT RATE', 'CONVERSION', 'AVG CALL LENGTH', 'LEADS', 'SUCCESS RATE', 'CREDITS USED'].map((k, i) => (
                      <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{k}</p>
                        <p className="text-2xl font-black text-slate-900 mb-1">{k === 'AVG CALL LENGTH' ? '0:00' : k === 'CREDITS USED' ? '₹0' : '0'}</p>
                        <p className="text-[10px] text-slate-500">{k === 'AVG CALL LENGTH' ? '0 min total' : 'no prior period'}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white border border-slate-200 p-6 rounded-2xl h-64 shadow-sm flex items-center justify-center">
                      <p className="text-sm font-semibold text-slate-400">Calls over time (Graph)</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl h-64 shadow-sm flex items-center justify-center">
                      <p className="text-sm font-semibold text-slate-400">Conversion funnel</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ BILLING ════ */}
              {activeTab === 'billing' && (
                <div>
                   <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">BILLING</p>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">Credits & billing</h1>
                      <p className="text-sm text-slate-500">Everything runs on credits. 1 credit = ₹1</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-amber-200 bg-amber-50/30 p-5 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">CREDIT BALANCE</p>
                      <p className="text-3xl font-black text-slate-900 mb-1">₹20.00</p>
                      <p className="text-[11px] text-amber-600 font-bold">Running low</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">SPENT THIS MONTH</p>
                      <p className="text-2xl font-black text-slate-900 mb-1">₹0</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">RUNWAY</p>
                      <p className="text-sm font-medium text-slate-400 mt-2">not enough recent usage yet</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">CALLS (LAST 30D)</p>
                      <p className="text-2xl font-black text-slate-900 mb-1">0</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-4">Special packages</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {[
                      { price: '₹199', cr: '199 credits' },
                      { price: '₹999', cr: '1,019 credits', free: '+20 free' },
                      { price: '₹2,999', cr: '3,149 credits', free: '+150 free', pop: true },
                      { price: '₹9,999', cr: '10,799 credits', free: '+800 free' },
                      { price: '₹24,999', cr: '27,499 credits', free: '+2,500 free' }
                    ].map((p, i) => (
                      <div key={i} className={`bg-white border p-5 rounded-2xl ${p.pop ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}>
                        {p.pop && <p className="text-[10px] font-bold text-indigo-600 mb-2 uppercase">MOST POPULAR</p>}
                        <p className="text-xl font-black text-slate-900 mb-1">{p.price}</p>
                        <p className="text-[11px] font-semibold text-slate-700">{p.cr}</p>
                        {p.free && <p className="text-[10px] font-bold text-emerald-600 mt-1">{p.free}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════ SETTINGS ════ */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">SETTINGS</p>
                  <h1 className="text-2xl font-bold text-slate-900 mb-8">Settings</h1>
                  
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                      <label className="block text-xs font-bold text-slate-700 mb-2">Business name</label>
                      <input type="text" defaultValue="mahan construction" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                      
                      <label className="block text-xs font-bold text-slate-700 mb-2 mt-6">Default language</label>
                      <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none">
                        <option>Telugu + English (default)</option>
                        <option>Hindi</option>
                        <option>English</option>
                      </select>

                      <div className="mt-8 flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Zap className="w-4 h-4 text-indigo-500"/> Smart follow-ups</p>
                          <p className="text-xs text-slate-500 max-w-sm">Two linked abilities, always on or off together: your agents remember callers they've spoken to and auto-reschedule callbacks.</p>
                        </div>
                        <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                        </div>
                      </div>

                      <button className="mt-8 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-sm">
                        Save changes
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Account</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-slate-500">Email</span>
                        <span className="text-sm font-semibold text-slate-900">kolli.m19@gmail.com</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Member since</span>
                        <span className="text-sm font-semibold text-slate-900">3 Aug 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>

    {/* ── LIVE CALL OVERLAY ──────────────────────────────────────────────── */}
    {isBrowserCalling && activeAgent && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-950 text-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/10">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase mb-1">Live Call</p>
              <h3 className="text-lg font-bold">{activeAgent.name}</h3>
              <p className="text-xs text-slate-400 capitalize">{activeAgent.role} Agent • {formatDuration(callDuration)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-bold text-red-400 tracking-wider">LIVE</span>
              </div>
              {isAgentSpeaking && (
                <div className="flex items-center gap-0.5 justify-end">
                  {[3,6,9,12,9,6,3].map((h, i) => (
                    <div key={i} className="w-0.5 bg-indigo-400 rounded-full animate-pulse" style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}></div>
                  ))}
                </div>
              )}
              {isListening && (
                <div className="flex items-center gap-1 justify-end">
                  <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400">Listening</span>
                </div>
              )}
            </div>
          </div>

          {/* Agent Avatar */}
          <div className="flex flex-col items-center py-6">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-black mb-2 ${isAgentSpeaking ? 'ring-4 ring-indigo-400/50 ring-offset-2 ring-offset-slate-950' : ''}`}>
                {activeAgent.name[0]}
              </div>
              {isListening && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Mic className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm font-bold mt-2">{isAgentSpeaking ? 'Speaking...' : isListening ? 'Listening to you...' : 'Connecting...'}</p>
          </div>

          {/* Transcript */}
          <div className="mx-4 mb-4 bg-black/30 border border-white/5 rounded-2xl p-4 h-52 overflow-y-auto space-y-2">
            {callTranscript.length === 0 && (
              <p className="text-center text-slate-500 text-xs mt-8">Conversation will appear here...</p>
            )}
            {callTranscript.map((t, i) => (
              <div key={i} className={`flex ${t.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-2.5 rounded-xl max-w-[80%] text-xs leading-relaxed ${t.sender === 'agent' ? 'bg-indigo-950 text-indigo-100' : 'bg-slate-700 text-white'}`}>
                  <span className={`font-bold block text-[9px] mb-0.5 ${t.sender === 'agent' ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {t.sender === 'agent' ? activeAgent.name : 'You'}
                  </span>
                  {t.text}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* ── AGENTIC ACTIONS PANEL (live tool execution) ── */}
          {agentTools.length > 0 && (
            <div className="mx-4 mb-3 bg-black/20 border border-white/5 rounded-xl p-3">
              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Agentic Actions
              </p>
              <div className="space-y-1.5">
                {agentTools.slice(-4).map((tool, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tool.success ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    <span className="text-[10px] text-slate-300 font-mono">{tool.tool.replace(/_/g, ' ')}</span>
                    <span className="text-[9px] text-slate-500 truncate">{tool.message?.slice(0, 40)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Actions */}
          {callSuggestedActions.length > 0 && (
            <div className="px-4 mb-3 flex flex-wrap gap-2">
              {callSuggestedActions.map((action, i) => (
                <button key={i} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-full transition-colors border border-white/10">
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* End Call */}
          <div className="p-4">
            <button onClick={stopBrowserCall} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg">
              <PhoneCall className="w-4 h-4" /> End Call
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── CALL SUMMARY MODAL ─────────────────────────────────────────────── */}
    {callSummary && !isBrowserCalling && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
          <div className="text-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              callSummary.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-500' :
              callSummary.sentiment === 'negative' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'
            }`}>
              {callSummary.sentiment === 'positive' ? <TrendingUp className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-black text-slate-900">Call Ended</h3>
            <p className="text-xs text-slate-500">{formatDuration(callDuration)} • {callSummary.sentiment} sentiment</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</p>
            <p className="text-sm text-slate-700 leading-relaxed">{callSummary.summary || 'Call completed.'}</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Outcome</p>
              <p className="text-sm font-bold text-slate-900 capitalize">{callSummary.outcome || 'unknown'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">CRM Lead</p>
              <p className="text-sm font-bold text-slate-900">{callSummary.crmLeadCreated ? '✅ Created' : 'Not created'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
              <p className="text-sm font-bold text-slate-900">{formatDuration(callDuration)}</p>
            </div>
          </div>

          <button onClick={() => setCallSummary(null)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
            Done
          </button>
        </div>
      </div>
    )}
    </>
  );
}
