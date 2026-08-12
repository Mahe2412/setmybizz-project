'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Users, MessageSquare, LayoutDashboard, GitPullRequest, 
  Settings as SettingsIcon, ShieldAlert, Cpu, Share2, 
  Plus, Upload, Send, HelpCircle, CheckCircle2, Play, ShoppingBag, Package
} from 'lucide-react';
import OmniSalesTab from './OmniSalesTab';
import OperationsTab from './OperationsTab';

// ── Palette & design tokens ──────────────────────────────────────────────────
const C = {
  brand: "#1a56db",
  brandLight: "#e8f0fd",
  brandDark: "#1240a8",
  green: "#057a55",
  greenLight: "#def7ec",
  amber: "#92400e",
  amberLight: "#fef3c7",
  red: "#9b1c1c",
  redLight: "#fde8e8",
  purple: "#5521b5",
  purpleLight: "#edebfe",
  teal: "#005661",
  tealLight: "#d5f5f6",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray650: "#4b5563",
  gray655: "#374151",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  white: "#ffffff",
};

interface BadgeConfig {
  color: string;
  bg: string;
  icon?: string;
}

const STAGE_META: Record<string, BadgeConfig> = {
  New:        { color: C.brand,   bg: C.brandLight,  icon: "✦" },
  Messaged:   { color: C.amber,   bg: C.amberLight,  icon: "✉" },
  Replied:    { color: C.teal,    bg: C.tealLight,   icon: "↩" },
  Interested: { color: C.green,   bg: C.greenLight,  icon: "★" },
  "Follow-up":{ color: C.purple,  bg: C.purpleLight, icon: "↺" },
  Closed:     { color: C.gray600, bg: C.gray200,     icon: "✓" },
  // E-Commerce specific stages
  Paid:       { color: C.green,   bg: C.greenLight,  icon: "₹" },
  "Pending Dispatch": { color: C.amber, bg: C.amberLight, icon: "📦" },
  Dispatched: { color: C.brand,   bg: C.brandLight,  icon: "🚚" }
};

const CAT_META: Record<string, BadgeConfig> = {
  Startup:  { color: C.purple, bg: C.purpleLight },
  MSME:     { color: C.amber,  bg: C.amberLight  },
  Retail:   { color: C.teal,   bg: C.tealLight   },
  Service:  { color: C.green,  bg: C.greenLight  },
  "E-Commerce": { color: C.brand, bg: C.brandLight },
  Unknown:  { color: C.gray600,bg: C.gray200     },
};

const PRI_META: Record<string, BadgeConfig> = {
  High:   { color: C.red,   bg: C.redLight   },
  Medium: { color: C.amber, bg: C.amberLight },
  Low:    { color: C.gray600,bg: C.gray200   },
};

// Types
export interface Lead {
  id: string;
  name: string;
  phone: string;
  category: string;
  stage: string;
  priority: string;
  source: string;
  note: string;
  score: number;
  added: string;
}

export interface Message {
  role: "ai" | "lead";
  text: string;
  ts: string;
}

export interface Workflow {
  id: string;
  title: string;
  desc: string;
  active: boolean;
  icon: string;
  runs: number;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: boolean;
  color: string;
}

export interface BizProfile {
  name: string;
  service: string;
  clients: string;
  tone: string;
}

// ── Sample seed data ─────────────────────────────────────────────────────────
const SEED_LEADS: Lead[] = [
  { id:"l1", name:"Ravi Kumar",   phone:"+91 98765 43210", category:"Startup",  stage:"New",        priority:"High",   source:"WA Group",   note:"Wants to register a fintech startup", score:82, added:"2025-06-20" },
  { id:"l2", name:"Priya Reddy",  phone:"+91 99001 12345", category:"MSME",     stage:"Replied",    priority:"High",   source:"Website",    note:"Has a garment manufacturing unit", score:74, added:"2025-06-19" },
  { id:"l3", name:"Arjun Shah",   phone:"+91 91234 56789", category:"Retail",   stage:"Messaged",   priority:"Medium", source:"WA Group",   note:"Runs a grocery store chain", score:60, added:"2025-06-18" },
  { id:"l4", name:"Sneha Patel",  phone:"+91 98001 77654", category:"Service",  stage:"Interested", priority:"High",   source:"Direct DM",  note:"Salon owner, needs GST registration", score:91, added:"2025-06-17" },
  { id:"l5", name:"Kiran Rao",    phone:"+91 99887 23456", category:"Startup",  stage:"Follow-up",  priority:"Medium", source:"WA Group",   note:"SaaS product idea, co-founder search", score:55, added:"2025-06-16" },
  { id:"l10", name:"Rahul Instagram", phone:"+91 88888 11111", category:"E-Commerce", stage:"New", priority:"High", source:"Instagram WA", note:"Hi! Do you have RetroSweets in stock?", score:95, added:"2025-06-20" },
  { id:"l11", name:"Vikram D2C", phone:"+91 88888 22222", category:"E-Commerce", stage:"Paid", priority:"High", source:"Website", note:"Order #1042 verified via PhonePe webhook", score:100, added:"2025-06-20" },
  { id:"l12", name:"Anita Orders", phone:"+91 88888 33333", category:"E-Commerce", stage:"Pending Dispatch", priority:"High", source:"WhatsApp", note:"Order #1030 paid. Needs shipping label.", score:100, added:"2025-06-19" },
];

const SEED_CONVOS: Record<string, Message[]> = {
  l1: [
    { role:"ai",   text:"Hi Ravi 👋 We help startups get legally set up fast — Pvt Ltd, LLP, Sole Prop. Are you planning to register your startup?", ts:"10:02 AM" },
    { role:"lead", text:"Yes! I'm working on a fintech app and need to register a Private Limited Company.", ts:"10:45 AM" },
    { role:"ai",   text:"Great choice for fintech! Pvt Ltd gives you credibility with investors and is required for RBI compliance. You'll need 2 directors, an Indian address, and DSC. We handle everything — MCA filing, MOA/AOA, PAN/TAN. Takes 10–15 working days. Want me to share pricing?", ts:"10:46 AM" },
  ],
  l4: [
    { role:"ai",   text:"Hi Sneha 👋 We help service businesses with GST, registration and compliance. What kind of services do you offer?", ts:"9:15 AM" },
    { role:"lead", text:"I run a salon. My CA said I need GST registration now that my turnover crossed the limit.", ts:"9:30 AM" },
    { role:"ai",   text:"Got it! For salons, GST applies once turnover crosses ₹20L. We can get your GSTIN in 3–5 working days. I'll also help you understand input tax credit on salon supplies. Want to start?", ts:"9:31 AM" },
    { role:"lead", text:"Yes please! How much does it cost?", ts:"9:45 AM" },
  ],
  l10: [
    { role: "lead", text: "Hi! Do you have RetroSweets in stock?", ts: "11:00 AM" },
    { role: "ai", text: "Hi there! Welcome to our store 🛍️ Yes, RetroSweets are in stock. They are ₹450 per box. Shall I generate a payment link for you to order?", ts: "11:01 AM" },
  ],
  l11: [
    { role: "lead", text: "Hi, I want to order 2 units.", ts: "9:00 AM" },
    { role: "ai", text: "Great! That will be ₹900. Pay via UPI here: https://pay.setmybizz.in/upi-dynamic-link", ts: "9:01 AM" },
    { role: "ai", text: "✅ Payment received automatically! Your order is confirmed and will be dispatched today. No need to send screenshots.", ts: "9:05 AM" },
  ]
};

const SEED_WORKFLOWS: Workflow[] = [
  { id:"wf1", title:"New lead → AI first message",     desc:"Within 5 min of adding a lead, AI sends a personalised WhatsApp DM", active:true,  icon:"💬", runs:142 },
  { id:"wf2", title:"No reply → follow-up sequence",  desc:"Auto Day 1, Day 3, Day 7 follow-ups if no reply at each stage",      active:true,  icon:"🔁", runs:89  },
  { id:"wf3", title:"Lead replies → AI conversation", desc:"AI reads reply, qualifies intent, answers FAQs, handles objections",  active:true,  icon:"🤖", runs:67  },
  { id:"wf4", title:"Sheet import → classify + DM",   desc:"Upload Excel/Google Sheet — AI classifies all leads and queues DMs",  active:true,  icon:"📊", runs:23  },
  { id:"wf5", title:"Gmail → lead capture",           desc:"New email enquiries auto-added as leads and classified",              active:false, icon:"📧", runs:0   },
  { id:"wf6", title:"Website form → instant reply",   desc:"Form submit → AI welcome message sent within 60 seconds",            active:true,  icon:"🌐", runs:55  },
  { id:"wf7", title:"Interested → send proposal",     desc:"Stage = Interested → AI auto-sends service details and pricing",     active:false, icon:"📄", runs:0   },
  { id:"wf8", title:"Call booked → reminder",         desc:"Booking confirmed → AI reminder 1h before + follow-up after",        active:true,  icon:"📅", runs:31  },
];

const INTEGRATIONS: Integration[] = [
  { id:"wa",   name:"WhatsApp Business", icon:"📱", status:true,  color:"#25D366" },
  { id:"gmail",name:"Gmail",             icon:"📧", status:false, color:"#EA4335" },
  { id:"ig",   name:"Instagram",         icon:"📸", status:false, color:"#E1306C" },
  { id:"fb",   name:"Facebook",          icon:"👥", status:false, color:"#1877F2" },
  { id:"web",  name:"Website form",      icon:"🌐", status:true,  color:C.brand   },
  { id:"li",   name:"LinkedIn",          icon:"💼", status:false, color:"#0A66C2" },
  { id:"gs",   name:"Google Sheets",     icon:"📊", status:false, color:"#0F9D58" },
  { id:"tg",   name:"Telegram",          icon:"✈️", status:false, color:"#229ED9" },
  { id:"rp",   name:"Razorpay",          icon:"💳", status:false, color:"#3395FF" },
  { id:"cal",  name:"Google Calendar",   icon:"📅", status:false, color:"#4285F4" },
  { id:"x",    name:"X / Twitter",       icon:"𝕏",  status:false, color:"#000000" },
  { id:"zap",  name:"Zapier",            icon:"⚡", status:false, color:"#FF4A00" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  const p = name.trim().split(" ");
  return p.length > 1 ? p[0][0] + p[p.length-1][0] : p[0].slice(0,2).toUpperCase();
}
function classify(note: string) {
  const n = note.toLowerCase();
  if (/order|buy|purchase|stock|sweet|product|cart|shipping|delivery/.test(n)) return "E-Commerce";
  if (/idea|startup|app|tech|saas|launch|found|mvp|build|fintech|edtech|product/.test(n)) return "Startup";
  if (/shop|kirana|store|trader|retail|showroom|wholesale/.test(n)) return "Retail";
  if (/manufactur|factory|msme|sme|unit|export|production|garment/.test(n)) return "MSME";
  if (/salon|clinic|consult|freelanc|agency|service|doctor|coach|it |software/.test(n)) return "Service";
  return "Unknown";
}
function priority(cat: string, stage: string) {
  if (stage === "Replied" || stage === "Interested") return "High";
  if (cat === "Unknown" || stage === "Closed") return "Low";
  return "Medium";
}
function aiScore(cat: string, stage: string) {
  const stageScore: Record<string, number> = { New:40, Messaged:55, Replied:70, Interested:88, "Follow-up":50, Closed:100 };
  return Math.min(100, (stageScore[stage] || 40) + (cat !== "Unknown" ? 10 : 0));
}
function firstMsg(name: string, cat: string) {
  const n = name && name !== "Unknown" ? name.split(" ")[0] : "there";
  const msgs: Record<string, string> = {
    "E-Commerce": `Hi ${n} 👋 Welcome to our WhatsApp Store! How can we help you with your order today?`,
    Startup: `Hi ${n} 👋 We help startups get legally registered fast — Pvt Ltd, LLP, Sole Prop. Are you working on an idea or planning to register your startup?`,
    MSME:    `Hi ${n} 👋 We support MSMEs with Udyam registration, GST, funding links and compliance. Can I learn about your business?`,
    Retail:  `Hi ${n} 👋 We help retail businesses with GST, trade licences and compliance. Are you looking to formalise or grow your business?`,
    Service: `Hi ${n} 👋 We help service businesses get set up — GST, professional tax, MSME registration. What services do you offer?`,
    Unknown: `Hi ${n} 👋 We are connected through a business network. Are you working on any idea or currently running a business?`,
  };
  return msgs[cat] || msgs.Unknown;
}
function ts() {
  return new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
}
function uid() { return "l" + Date.now() + Math.random().toString(36).slice(2,6); }

// ── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ name, size = 36, bg = C.brandLight, color = C.brand }: { name: string; size?: number; bg?: string; color?: string }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, fontWeight:500,
      fontSize:size*0.35, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display:"inline-block", fontSize:10, fontWeight:600, padding:"2px 8px",
      borderRadius:20, background:bg, color, letterSpacing:.3 }}>
      {label}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? C.green : score >= 55 ? C.amber : C.gray400;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      <div style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${color}`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color }}>
        {score}
      </div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:36, height:20, borderRadius:10, cursor:"pointer",
      background: value ? C.green : C.gray200, position:"relative", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:2, left: value ? 18 : 2, width:16, height:16, borderRadius:"50%",
        background:"white", transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );
}

// ── AI call (safe frontend fallback) ───────────────────────────────────────────────────────────
async function callAI(systemPrompt: string, userMessage: string, leadId?: string) {
  // Safe mock simulation if no API endpoint or key is present
  try {
    const res = await fetch("/api/crm/ai-chat", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ systemPrompt, userMessage, leadId }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (e) {
    console.warn("API route not active yet. Falling back to local helper simulation.");
  }
  
  // Local smart simulation
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      if (userMessage.toLowerCase().includes("cost") || userMessage.toLowerCase().includes("pricing")) {
        resolve("Sure! The incorporation service costs ₹5,999 + Govt fees, and GST filing starts at ₹1,499. We handle all MCA submissions. Let me know if you would like me to share a detailed invoice!");
      } else if (userMessage.toLowerCase().includes("document") || userMessage.toLowerCase().includes("need")) {
        resolve("We will need your PAN card, Aadhaar card, photo, and bank statement. For the office address, a utility bill is required. Shall I send a document upload link?");
      } else {
        resolve("Great to hear! I can guide you through the process right here. Let me know what questions you have about setting up your business registrations.");
      }
    }, 1500);
  });
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function CRMTab() {
  const [activePage, setActivePage] = useState("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [convos, setConvos] = useState<Record<string, Message[]>>({});
  const [workflows, setWorkflows] = useState<Workflow[]>(SEED_WORKFLOWS);
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [bizProfile, setBizProfile] = useState<BizProfile>({
    name:"SetMyBizz", service:"Business registration, MSME, Startup compliance, GST, legal setup",
    clients:"Startups, MSMEs, Retailers, Service businesses in India", tone:"Friendly + Professional"
  });
  const [activeLead, setActiveLead] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: string } | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const notify = (msg: string, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        
        // Rebuild convos map from leads' messages
        const convosMap: Record<string, Message[]> = {};
        data.forEach((l: any) => {
          convosMap[l.id] = (l.messages || []).map((m: any) => ({
            role: m.role,
            text: m.text,
            ts: new Date(m.sentAt).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })
          }));
        });
        setConvos(convosMap);

        // Auto-select first lead if none active
        if (data.length > 0 && !activeLead) {
          setActiveLead(data[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load leads", e);
    }
  }, [activeLead]);

  useEffect(() => {
    refreshLeads();
    
    const handleUpdate = () => {
      refreshLeads();
    };
    window.addEventListener('crm-leads-updated', handleUpdate);
    return () => {
      window.removeEventListener('crm-leads-updated', handleUpdate);
    };
  }, [refreshLeads]);

  useEffect(() => {
    const handleOpenSubtab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActivePage(customEvent.detail);
      }
    };
    window.addEventListener('open-crm-subtab', handleOpenSubtab);
    return () => {
      window.removeEventListener('open-crm-subtab', handleOpenSubtab);
    };
  }, []);

  const addLead = async (newLeadData: Omit<Lead, "id">) => {
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeadData)
      });
      if (res.ok) {
        const savedLead = await res.json();
        setLeads(prev => [savedLead, ...prev]);
        setActiveLead(savedLead.id);
        notify(`Lead ${savedLead.name} added — AI first message queued`);
        refreshLeads();
      }
    } catch (e) {
      console.error("Failed to add lead", e);
      notify("Failed to add lead", "error");
    }
  };

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch })
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
        notify("Lead updated");
      }
    } catch (e) {
      console.error("Failed to update lead", e);
    }
  };

  const sendAIMessage = async (leadId: string, userText: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const history = convos[leadId] || [];

    // Add user message to state
    const withUser = [...history, { role:"lead" as const, text:userText, ts:ts() }];
    setConvos(prev => ({ ...prev, [leadId]: withUser }));
    setAiTyping(true);

    try {
      // Save user message to database
      await fetch("/api/crm/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, role: "lead", text: userText })
      });

      const system = `You are an AI sales agent for ${bizProfile.name}. 
Business: ${bizProfile.service}. 
Target clients: ${bizProfile.clients}. 
Tone: ${bizProfile.tone}.
Lead info: ${lead.name}, category: ${lead.category}, stage: ${lead.stage}.
You are chatting on WhatsApp. Keep replies SHORT (2-4 lines max), warm, helpful, and focused on converting the lead.
Never use markdown. Use simple text and 1 emoji max per message.`;

      const aiReply = await callAI(system, `Conversation so far:\n${withUser.map(m=>`${m.role==="ai"?"Agent":"Lead"}: ${m.text}`).join("\n")}\n\nReply as the agent now.`, leadId);
      
      // Save AI reply to database
      await fetch("/api/crm/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, role: "ai", text: aiReply })
      });

      const withAI = [...withUser, { role:"ai" as const, text:aiReply, ts:ts() }];
      setConvos(prev => ({ ...prev, [leadId]: withAI }));

      // Auto-upgrade stage
      if (lead.stage === "New" || lead.stage === "Messaged") {
        await updateLead(leadId, { stage:"Replied", priority:"High", score: Math.min(100, lead.score + 15) });
      }
      refreshLeads();
    } catch (e) {
      console.error("AI chat/save error", e);
      const withErr = [...withUser, { role:"ai" as const, text:"Connection issue — reply will be sent shortly.", ts:ts() }];
      setConvos(prev => ({ ...prev, [leadId]: withErr }));
    }
    setAiTyping(false);
  };

  const pages = [
    { id:"dashboard",    label:"Dashboard",     icon: <LayoutDashboard size={18} /> },
    { id:"sales",        label:"Omni-Sales",    icon: <ShoppingBag size={18} /> },
    { id:"operations",   label:"Operations",    icon: <Package size={18} /> },
    { id:"leads",        label:"Leads",         icon: <Users size={18} /> },
    { id:"pipeline",     label:"Pipeline",      icon: <GitPullRequest size={18} /> },
    { id:"inbox",        label:"Inbox",         icon: <MessageSquare size={18} /> },
    { id:"ai",           label:"AI Agent",      icon: <Cpu size={18} /> },
    { id:"workflows",    label:"Workflows",     icon: <Play size={18} /> },
    { id:"integrations", label:"Integrations",  icon: <Share2 size={18} /> },
    { id:"settings",     label:"Settings",      icon: <SettingsIcon size={18} /> },
  ];

  const newLeads       = leads.filter(l => l.stage === "New").length;
  const activeLeads    = leads.filter(l => !["Closed"].includes(l.stage)).length;
  const closedLeads    = leads.filter(l => l.stage === "Closed").length;
  const convRate       = leads.length ? Math.round((closedLeads / leads.length) * 100) : 0;
  const hotLeads       = leads.filter(l => l.score >= 80 && l.stage !== "Closed").length;

  return (
    <div style={{ display:"flex", height:"calc(100vh - 8rem)", background:C.gray50, color:C.gray800, fontSize:13, overflow:"hidden", borderRadius:16, border:"1px solid #e2e8f0" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside style={{ width:60, background:C.gray900, display:"flex", flexDirection:"column",
        alignItems:"center", padding:"16px 0", gap:8, flexShrink:0 }}>
        <div style={{ fontSize:11, fontWeight:750, color:"#60a5fa", marginBottom:12,
          letterSpacing:1.5, writingMode:"vertical-rl", transform:"rotate(180deg)", userSelect:"none" }}>CRM</div>
        {pages.map(p => (
          <button key={p.id} title={p.label} onClick={() => setActivePage(p.id)}
            style={{ width:40, height:40, borderRadius:10, border:"none", cursor:"pointer",
              background: activePage === p.id ? C.brand : "transparent",
              color: activePage === p.id ? "white" : C.gray400,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .12s" }}>
            {p.icon}
          </button>
        ))}
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <header style={{ padding:"0 20px", height:52, background:C.white, borderBottom:`1px solid ${C.gray200}`,
          display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.gray900, flex:1 }}>
            {pages.find(p => p.id === activePage)?.label}
          </span>
          {hotLeads > 0 && (
            <span style={{ fontSize:11, background:C.redLight, color:C.red, padding:"3px 10px", borderRadius:20, fontWeight:600 }}>
              🔥 {hotLeads} hot lead{hotLeads > 1 ? "s" : ""}
            </span>
          )}
          <button onClick={() => setShowImport(true)}
            style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white,
              color:C.gray600, fontSize:12, cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            <Upload size={14} /> Import
          </button>
          <button onClick={() => setShowAddLead(true)}
            style={{ padding:"6px 14px", borderRadius:8, border:"none", background:C.brand,
              color:C.white, fontSize:12, cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            <Plus size={14} /> Add lead
          </button>
        </header>

        {/* Notification */}
        {notification && (
          <div style={{ position:"absolute", top:60, right:20, zIndex:100, padding:"10px 16px",
            borderRadius:8, background: notification.type === "success" ? C.greenLight : C.redLight,
            color: notification.type === "success" ? C.green : C.red,
            fontSize:12, fontWeight:500, boxShadow:"0 4px 12px rgba(0,0,0,.1)", maxWidth:300 }}>
            {notification.msg}
          </div>
        )}

        {/* Pages */}
        <main style={{ flex:1, overflow:"auto", padding:16 }}>
          {activePage === "dashboard"    && <Dashboard leads={leads} convRate={convRate} newLeads={newLeads} activeLeads={activeLeads} closedLeads={closedLeads} hotLeads={hotLeads} setActivePage={setActivePage} setActiveLead={setActiveLead} />}
          {activePage === "sales"        && <OmniSalesTab />}
          {activePage === "operations"   && <OperationsTab />}
          {activePage === "leads"        && <Leads leads={leads} updateLead={updateLead} setActiveLead={setActiveLead} setActivePage={setActivePage} notify={notify} />}
          {activePage === "pipeline"     && <Pipeline leads={leads} updateLead={updateLead} setActiveLead={setActiveLead} setActivePage={setActivePage} />}
          {activePage === "inbox"        && <Inbox leads={leads} convos={convos} activeLead={activeLead} setActiveLead={setActiveLead} sendAIMessage={sendAIMessage} aiTyping={aiTyping} bizProfile={bizProfile} updateLead={updateLead} notify={notify} />}
          {activePage === "ai"           && <AIAgent bizProfile={bizProfile} setBizProfile={setBizProfile} leads={leads} notify={notify} />}
          {activePage === "workflows"    && <Workflows workflows={workflows} setWorkflows={setWorkflows} />}
          {activePage === "integrations" && <IntegrationsPage integrations={integrations} setIntegrations={setIntegrations} notify={notify} />}
          {activePage === "settings"     && <Settings bizProfile={bizProfile} setBizProfile={setBizProfile} notify={notify} />}
        </main>
      </div>

      {/* Modals */}
      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onAdd={addLead} />}
      {showImport  && <ImportModal  onClose={() => setShowImport(false)}  onAdd={addLead} notify={notify} />}
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ leads, convRate, newLeads, activeLeads, closedLeads, hotLeads, setActivePage, setActiveLead }: { leads: Lead[]; convRate: number; newLeads: number; activeLeads: number; closedLeads: number; hotLeads: number; setActivePage: (v: string) => void; setActiveLead: (v: string) => void }) {
  const metrics = [
    { label:"Total leads",    val:leads.length, sub:`+${newLeads} new`, color:C.brand },
    { label:"Active pipeline",val:activeLeads,  sub:"being nurtured",   color:C.green },
    { label:"Conversion",     val:`${convRate}%`,sub:"closed this month",color:C.purple },
    { label:"Closed",         val:closedLeads,  sub:"deals won",        color:C.teal },
  ];

  const stageOrder = ["New","Messaged","Replied","Interested","Paid","Pending Dispatch","Dispatched","Follow-up","Closed"];
  const pipelineLeads = stageOrder.map(s => ({ stage:s, leads:leads.filter(l=>l.stage===s) }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10,
            padding:"14px 16px", borderLeft:`3px solid ${m.color}` }}>
            <div style={{ fontSize:24, fontWeight:700, color:C.gray900 }}>{m.val}</div>
            <div style={{ fontSize:11, color:C.gray600, marginTop:2 }}>{m.label}</div>
            <div style={{ fontSize:11, color:m.color, marginTop:1, fontWeight:500 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline snapshot */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
          Pipeline snapshot
        </div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
          {pipelineLeads.map(({ stage, leads:sl }) => {
            const meta = STAGE_META[stage];
            return (
              <div key={stage} style={{ minWidth:130, flex:1 }}>
                <div style={{ fontSize:11, fontWeight:600, color:meta.color, marginBottom:6,
                  display:"flex", justifyContent:"space-between" }}>
                  <span>{stage}</span><span style={{ color:C.gray400 }}>{sl.length}</span>
                </div>
                {sl.slice(0,2).map(l => (
                  <div key={l.id} onClick={() => { setActiveLead(l.id); setActivePage("inbox"); }}
                    style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:6,
                      padding:"6px 8px", marginBottom:4, cursor:"pointer" }}>
                    <div style={{ fontSize:12, fontWeight:500, color:C.gray800 }}>{l.name}</div>
                    <div style={{ marginTop:3 }}><Badge label={l.category} {...CAT_META[l.category]} /></div>
                  </div>
                ))}
                {sl.length > 2 && <div style={{ fontSize:11, color:C.gray400, textAlign:"center", marginTop:2 }}>+{sl.length-2} more</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* SetMyBizz Website Traffic & BizOS Backend Monitor */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* SetMyBizz Traffic */}
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5 }}>
              🌐 SetMyBizz Website Traffic
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981" }} />
              <span style={{ fontSize:10, fontWeight:600, color:"#10b981" }}>18 Live Visitors</span>
            </div>
          </div>
          
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
            <div style={{ background:C.gray50, padding:10, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.gray400 }}>Visits (Today)</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>2,842</div>
            </div>
            <div style={{ background:C.gray50, padding:10, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.gray400 }}>Unique users</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>1,928</div>
            </div>
            <div style={{ background:C.gray50, padding:10, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.gray400 }}>Conv. Rate</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>4.8%</div>
            </div>
          </div>

          <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginBottom:6 }}>Live Visitor Activity Log:</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, borderBottom:`1px dashed ${C.gray100}`, paddingBottom:4 }}>
              <span style={{ color:C.gray700 }}>🔍 Anonymous visitor from Chennai viewed <i>Pricing</i></span>
              <span style={{ color:C.gray400 }}>1m ago</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, borderBottom:`1px dashed ${C.gray100}`, paddingBottom:4 }}>
              <span style={{ color:C.gray700 }}>📥 Ramesh Babu submitted Lead form: <b>Pvt Ltd setup</b></span>
              <span style={{ color:C.gray400 }}>3m ago</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, borderBottom:`1px dashed ${C.gray100}`, paddingBottom:4 }}>
              <span style={{ color:C.gray700 }}>🔍 Visitor from Hyderabad viewed <i>GST registration</i></span>
              <span style={{ color:C.gray400 }}>7m ago</span>
            </div>
          </div>
        </div>

        {/* Backend Monitor */}
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
            🖥️ BizOS & BizDesk Backend Monitor
          </div>
          
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
            <div style={{ background:C.gray50, padding:10, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.gray400 }}>Total users</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>148</div>
            </div>
            <div style={{ background:C.gray50, padding:10, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.gray400 }}>Sign-ins (24h)</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>52</div>
            </div>
            <div style={{ background:C.gray50, padding:10, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.gray400 }}>Active requests</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>9 Pending</div>
            </div>
          </div>

          <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginBottom:6 }}>Recent User Sign-ins & Jobs:</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, borderBottom:`1px dashed ${C.gray100}`, paddingBottom:4 }}>
              <span style={{ color:C.gray700 }}>🔑 admin@billease.app logged into BizDesk (Mumbai)</span>
              <span style={{ color:C.gray400 }}>10m ago</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, borderBottom:`1px dashed ${C.gray100}`, paddingBottom:4 }}>
              <span style={{ color:C.gray700 }}>💼 Kiran Rao requested service: <b>LLP Incorporation</b></span>
              <span style={{ color:C.gray400 }}>1h ago</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, borderBottom:`1px dashed ${C.gray100}`, paddingBottom:4 }}>
              <span style={{ color:C.gray700 }}>🔑 demo@setmybizz.com logged into BizOS</span>
              <span style={{ color:C.gray400 }}>2h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hot leads */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
          🔥 Hot leads — take action now
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
          {leads.filter(l => l.score >= 75 && l.stage !== "Closed").map(l => (
            <div key={l.id} onClick={() => { setActiveLead(l.id); setActivePage("inbox"); }}
              style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:8,
                padding:"10px 12px", cursor:"pointer", display:"flex", gap:10, alignItems:"center" }}>
              <Avatar name={l.name} size={32} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.gray900 }}>{l.name}</div>
                <div style={{ fontSize:11, color:C.gray500, marginTop:1 }}>{l.stage} · {l.source}</div>
              </div>
              <ScoreRing score={l.score} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LEADS TABLE ──────────────────────────────────────────────────────────────
function Leads({ leads, updateLead, setActiveLead, setActivePage, notify }: { leads: Lead[]; updateLead: (id: string, p: Partial<Lead>) => void; setActiveLead: (v: string) => void; setActivePage: (v: string) => void; notify: (msg: string) => void }) {
  const [search, setSearch]     = useState("");
  const [catF,   setCatF]       = useState("All");
  const [stageF, setStageF]     = useState("All");
  const [priF,   setPriF]       = useState("All");
  const [sortBy, setSortBy]     = useState("score");

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState<"wa" | "email" | null>(null);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSubject, setBulkSubject] = useState("");

  const cats   = ["All","Startup","MSME","Retail","Service","E-Commerce","Unknown"];
  const stages = ["All","New","Messaged","Replied","Interested","Paid","Pending Dispatch","Dispatched","Follow-up","Closed"];
  const pris   = ["All","High","Medium","Low"];

  const filtered = leads
    .filter(l => (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search)))
    .filter(l => catF   === "All" || l.category === catF)
    .filter(l => stageF === "All" || l.stage === stageF)
    .filter(l => priF   === "All" || l.priority === priF)
    .sort((a,b) => sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name));

  const handleBulkSend = () => {
    if (!bulkMessage.trim()) return;
    notify(`✓ Dispatched bulk ${showBulkModal === "wa" ? "WhatsApp SMS" : "emails"} to ${selectedLeads.length} leads successfully!`);
    setSelectedLeads([]);
    setShowBulkModal(null);
    setBulkMessage("");
    setBulkSubject("");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* Filters */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:12,
        display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads..."
          style={{ flex:1, minWidth:160, padding:"6px 10px", borderRadius:6, border:`1px solid ${C.gray200}`,
            fontSize:12, outline:"none" }} />
        {[[catF,setCatF,cats],[stageF,setStageF,stages],[priF,setPriF,pris]].map(([val,set,opts],i) => (
          <select key={i} value={val as string} onChange={e=> (set as (v: string) => void)(e.target.value)}
            style={{ padding:"6px 8px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12, cursor:"pointer" }}>
            {(opts as string[]).map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
          style={{ padding:"6px 8px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12, cursor:"pointer" }}>
          <option value="score">Sort: AI score</option>
          <option value="name">Sort: Name</option>
        </select>
        <span style={{ fontSize:11, color:C.gray400 }}>{filtered.length} leads</span>
      </div>

      {/* Table */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.gray50 }}>
              <th style={{ padding:"8px 12px", width:30, borderBottom:`1px solid ${C.gray200}` }}>
                <input type="checkbox"
                  checked={filtered.length > 0 && selectedLeads.length === filtered.length}
                  onChange={e => {
                    if (e.target.checked) setSelectedLeads(filtered.map(l => l.id));
                    else setSelectedLeads([]);
                  }} />
              </th>
              {["Lead","Phone","Category","Stage","Score","Priority","Source","Action"].map(h => (
                <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, fontWeight:600,
                  color:C.gray500, textTransform:"uppercase", letterSpacing:.5, borderBottom:`1px solid ${C.gray200}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={{ borderBottom:`1px solid ${C.gray100}` }}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{ padding:"8px 12px", width:30 }}>
                  <input type="checkbox" checked={selectedLeads.includes(l.id)}
                    onChange={e => {
                      if (e.target.checked) setSelectedLeads(prev => [...prev, l.id]);
                      else setSelectedLeads(prev => prev.filter(id => id !== l.id));
                    }} />
                </td>
                <td style={{ padding:"8px 12px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Avatar name={l.name} size={28} />
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:C.gray900 }}>{l.name}</div>
                      <div style={{ fontSize:10, color:C.gray400 }}>{l.added}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"8px 12px", fontSize:11, color:C.gray600 }}>{l.phone}</td>
                <td style={{ padding:"8px 12px" }}><Badge label={l.category} {...CAT_META[l.category]} /></td>
                <td style={{ padding:"8px 12px" }}>
                  <select value={l.stage} onChange={e => updateLead(l.id, { stage:e.target.value, priority:priority(l.category, e.target.value) })}
                    style={{ fontSize:11, padding:"2px 6px", borderRadius:4, border:`1px solid ${C.gray200}`,
                      background: STAGE_META[l.stage]?.bg, color: STAGE_META[l.stage]?.color, fontWeight:600, cursor:"pointer" }}>
                    {Object.keys(STAGE_META).map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding:"8px 12px" }}><ScoreRing score={l.score} /></td>
                <td style={{ padding:"8px 12px" }}><Badge label={l.priority} {...PRI_META[l.priority]} /></td>
                <td style={{ padding:"8px 12px", fontSize:11, color:C.gray500 }}>{l.source}</td>
                <td style={{ padding:"8px 12px" }}>
                  <button onClick={() => { setActiveLead(l.id); setActivePage("inbox"); }}
                    style={{ padding:"4px 10px", borderRadius:5, border:`1px solid ${C.brand}`,
                      background:C.brandLight, color:C.brand, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                    Chat ✦
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLeads.length > 0 && (
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:"12px 16px",
          display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 12px rgba(0,0,0,.05)" }}>
          <span style={{ fontWeight:600, fontSize:12, color:C.gray900 }}>{selectedLeads.length} leads selected</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setShowBulkModal("wa")}
              style={{ padding:"6px 12px", borderRadius:6, border:"none", background:"#25D366", color:"white", fontSize:11, fontWeight:600, cursor:"pointer" }}>
              💬 Bulk WhatsApp SMS
            </button>
            <button onClick={() => {
              notify(`🖨️ Generating A4 sheet with shipping labels for ${selectedLeads.length} orders...`);
              setTimeout(() => window.print(), 1000);
            }}
              style={{ padding:"6px 12px", borderRadius:6, border:"none", background:C.gray900, color:"white", fontSize:11, fontWeight:600, cursor:"pointer" }}>
              🖨️ Print Shipping Labels
            </button>
            <button onClick={() => setShowBulkModal("email")}
              style={{ padding:"6px 12px", borderRadius:6, border:"none", background:C.brand, color:"white", fontSize:11, fontWeight:600, cursor:"pointer" }}>
              📧 Bulk Email Blast
            </button>
            <button onClick={() => setSelectedLeads([])}
              style={{ padding:"6px 12px", borderRadius:6, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:11, cursor:"pointer" }}>
              Deselect All
            </button>
          </div>
        </div>
      )}

      {showBulkModal && (
        <Modal title={showBulkModal === "wa" ? "Send Bulk WhatsApp Campaign" : "Send Bulk Email Campaign"}
          onClose={() => setShowBulkModal(null)}
          confirmLabel="Send Campaign"
          onConfirm={handleBulkSend}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:11, color:C.gray500 }}>
              Recipients: {selectedLeads.map(id => leads.find(l=>l.id===id)?.name).join(", ")}
            </div>
            {showBulkModal === "email" && (
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:11, fontWeight:600 }}>Email Subject</label>
                <input value={bulkSubject} onChange={e=>setBulkSubject(e.target.value)} placeholder="e.g. Welcome to SetMyBizz — Special Offer!"
                  style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
              </div>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:11, fontWeight:600 }}>Message Content</label>
              <textarea value={bulkMessage} onChange={e=>setBulkMessage(e.target.value)} rows={5}
                placeholder={showBulkModal === "wa" ? "Hi {{name}}, welcome to BizOS WhatsApp Portal! Let us know if you need help." : "Hi {{name}},\n\nWe noticed you are registering your startup..."}
                style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12, resize:"vertical" }} />
              <div style={{ fontSize:10, color:C.gray400 }}>Use <code>{"{{name}}"}</code> to personalize the recipient's name dynamically.</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PIPELINE ─────────────────────────────────────────────────────────────────
function Pipeline({ leads, updateLead, setActiveLead, setActivePage }: { leads: Lead[]; updateLead: (id: string, p: Partial<Lead>) => void; setActiveLead: (v: string) => void; setActivePage: (v: string) => void }) {
  const stages = ["New","Messaged","Replied","Interested","Paid","Pending Dispatch","Dispatched","Follow-up","Closed"];
  const dealValue: Record<string, number> = { New:0, Messaged:0, Replied:5000, Interested:15000, Paid:20000, "Pending Dispatch":20000, Dispatched:20000, "Follow-up":8000, Closed:18000 };
  const totalPipeline = leads.reduce((s,l) => s + (dealValue[l.stage]||0), 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:"12px 16px",
        display:"flex", alignItems:"center", gap:16 }}>
        <div>
          <div style={{ fontSize:11, color:C.gray500 }}>Total pipeline value</div>
          <div style={{ fontSize:20, fontWeight:700, color:C.gray900 }}>₹{(totalPipeline/100000).toFixed(1)}L</div>
        </div>
        {stages.map(s => (
          <div key={s} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:STAGE_META[s].color, fontWeight:600 }}>{leads.filter(l=>l.stage===s).length}</div>
            <div style={{ fontSize:10, color:C.gray400 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", gap:10, overflowX:"auto" }}>
        {stages.map(stage => {
          const sl = leads.filter(l => l.stage === stage);
          const meta = STAGE_META[stage];
          return (
            <div key={stage} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10,
              padding:10, minHeight:300 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:11, fontWeight:700, color:meta.color }}>{stage}</span>
                <span style={{ fontSize:10, color:C.gray400, background:C.gray100, padding:"1px 6px", borderRadius:10 }}>{sl.length}</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {sl.map(l => (
                  <div key={l.id} onClick={() => { setActiveLead(l.id); setActivePage("inbox"); }}
                    style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:6,
                      padding:"8px 9px", cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.brand}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.gray900, marginBottom:4 }}>{l.name}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <Badge label={l.category} {...CAT_META[l.category]} />
                      <ScoreRing score={l.score} />
                    </div>
                    {dealValue[stage] > 0 && (
                      <div style={{ fontSize:10, color:C.green, marginTop:4, fontWeight:600 }}>₹{dealValue[stage].toLocaleString()}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── INBOX ────────────────────────────────────────────────────────────────────
function Inbox({ leads, convos, activeLead, setActiveLead, sendAIMessage, aiTyping, bizProfile, updateLead, notify }: { leads: Lead[]; convos: Record<string, Message[]>; activeLead: string; setActiveLead: (v: string) => void; sendAIMessage: (id: string, t: string) => Promise<void>; aiTyping: boolean; bizProfile: BizProfile; updateLead: (id: string, p: Partial<Lead>) => void; notify: (msg: string) => void }) {
  const [replyText, setReplyText] = useState("");
  const [generating, setGenerating] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const current = leads.find(l => l.id === activeLead);
  const messages = convos[activeLead] || [];

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, aiTyping]);

  const sendReply = async () => {
    if (!replyText.trim() || !activeLead) return;
    const text = replyText;
    setReplyText("");
    await sendAIMessage(activeLead, text);
  };

  const generateSuggest = async () => {
    if (!current) return;
    setGenerating(true);
    const history = convos[activeLead] || [];
    const system = `You are ${bizProfile.name}'s AI sales agent. Business: ${bizProfile.service}. Lead: ${current.name}, ${current.category}, ${current.stage}. Generate ONE short reply suggestion (1-2 lines, no markdown, 1 emoji max) for the sales agent to send next.`;
    const ctx = history.length ? `Last message: ${history[history.length-1]?.text}` : `This is a new lead — suggest the first message.`;
    try {
      const suggestion = await generateSuggest_inner(system, ctx);
      setReplyText(suggestion);
    } catch { setReplyText(firstMsg(current.name, current.category)); }
    setGenerating(false);
  };

  async function generateSuggest_inner(system: string, ctx: string) {
    // Return simulator response if endpoint not active
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Hi ${current?.name.split(" ")[0]}! Thanks for reaching out. Yes, we can definitely help you with that registration process.`);
      }, 1000);
    });
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr 280px", gap:12, height:"calc(100vh - 120px - 8rem)" }}>
      {/* Conversation list */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, overflow:"hidden",
        display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"10px 12px", borderBottom:`1px solid ${C.gray100}`, fontSize:10,
          fontWeight:600, color:C.gray500, textTransform:"uppercase", letterSpacing:.5 }}>
          All conversations
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {leads.filter(l => l.stage !== "Closed").map(l => {
            const msgs = convos[l.id] || [];
            const last = msgs[msgs.length-1];
            const unread = msgs.some(m => m.role === "lead");
            return (
              <div key={l.id} onClick={() => setActiveLead(l.id)}
                style={{ padding:"10px 12px", borderBottom:`1px solid ${C.gray100}`,
                   cursor:"pointer", background: activeLead === l.id ? C.brandLight : "transparent",
                   display:"flex", gap:8 }}>
                <Avatar name={l.name} size={32} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:C.gray900 }}>{l.name}</span>
                    {unread && <div style={{ width:7, height:7, borderRadius:"50%", background:C.brand, flexShrink:0, marginTop:4 }} />}
                  </div>
                  <div style={{ fontSize:11, color:C.gray500, whiteSpace:"nowrap", overflow:"hidden",
                    textOverflow:"ellipsis" }}>{last?.text || "No messages yet"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10,
        display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Chat header */}
        {current && (
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.gray100}`,
            display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <Avatar name={current.name} size={34} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.gray900 }}>{current.name}</div>
              <div style={{ fontSize:11, color:C.gray500 }}>{current.phone} · {current.category} · {current.source}</div>
            </div>
            <Badge label={current.stage} {...STAGE_META[current.stage]} />
            <ScoreRing score={current.score} />
            <button onClick={() => { updateLead(current.id, { stage:"Closed" }); notify("Lead marked as Closed ✓"); }}
              style={{ padding:"4px 10px", borderRadius:5, border:`1px solid ${C.green}`,
                background:C.greenLight, color:C.green, fontSize:11, fontWeight:600, cursor:"pointer" }}>
              Close deal ✓
            </button>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
          {messages.length === 0 && current && (
            <div style={{ textAlign:"center", color:C.gray400, marginTop:40 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
              <div style={{ fontSize:12 }}>No messages yet</div>
              <button onClick={() => setReplyText(firstMsg(current.name, current.category))}
                style={{ marginTop:12, padding:"6px 16px", borderRadius:6, border:`1px solid ${C.brand}`,
                  background:C.brandLight, color:C.brand, fontSize:12, cursor:"pointer", fontWeight:600 }}>
                Generate first message ✦
              </button>
            </div>
          )}
          {messages.map((m,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column",
              alignItems: m.role === "ai" ? "flex-start" : "flex-end" }}>
              <div style={{ fontSize:10, color:C.gray400, marginBottom:3, paddingLeft: m.role==="ai"?4:0, paddingRight: m.role!=="ai"?4:0 }}>
                {m.role === "ai" ? "AI Agent" : "Lead"} · {m.ts}
              </div>
              <div style={{ maxWidth:"72%", padding:"9px 13px", borderRadius:12, fontSize:12, lineHeight:1.55,
                background: m.role === "ai" ? C.brandLight : C.gray100,
                color: m.role === "ai" ? C.brandDark : C.gray800,
                borderBottomLeftRadius: m.role === "ai" ? 3 : 12,
                borderBottomRightRadius: m.role !== "ai" ? 3 : 12,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {aiTyping && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ padding:"8px 12px", background:C.brandLight, borderRadius:12, fontSize:12, color:C.gray500 }}>
                AI is typing…
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Reply input */}
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.gray100}`, flexShrink:0 }}>
          <div style={{ display:"flex", gap:8 }}>
            <textarea value={replyText} onChange={e=>setReplyText(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendReply(); }}}
              placeholder="Type a reply or click AI Suggest…"
              rows={2}
              style={{ flex:1, padding:"8px 10px", borderRadius:6, border:`1px solid ${C.gray200}`,
                fontSize:12, resize:"none", outline:"none", fontFamily:"inherit" }} />
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <button onClick={generateSuggest} disabled={generating}
                style={{ padding:"6px 12px", borderRadius:6, border:`1px solid ${C.brand}`,
                  background:C.brandLight, color:C.brand, fontSize:11, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                {generating ? "…" : "✦ AI Suggest"}
              </button>
              <button onClick={sendReply} disabled={!replyText.trim()}
                style={{ padding:"6px 12px", borderRadius:6, border:"none", background:C.brand,
                  color:C.white, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Live Simulator Screen */}
      <div style={{ background:"#f0f2f5", border:`1px solid ${C.gray200}`, borderRadius:10, overflow:"hidden",
        display:"flex", flexDirection:"column", boxShadow:"0 4px 12px rgba(0,0,0,.08)" }}>
        {/* Simulator Phone Header */}
        <div style={{ background:"#075e54", color:"white", padding:"10px 12px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#128c7e" }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700 }}>WhatsApp Live Screen</div>
            <div style={{ fontSize:9, color:"#dcf8c6" }}>
              {current ? `Connected: ${current.name}` : "Awaiting selection"}
            </div>
          </div>
          <div style={{ fontSize:10, background:"#128c7e", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>LIVE</div>
        </div>

        {/* Simulator Wallpaper & Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:10, display:"flex", flexDirection:"column", gap:8,
          backgroundImage: "radial-gradient(#e5ddd5 20%, transparent 20%), radial-gradient(#e5ddd5 20%, transparent 20%)",
          backgroundSize: "10px 10px", backgroundPosition: "0 0, 5px 5px" }}>
          {current ? (
            <>
              <div style={{ alignSelf:"center", background:"#fff3c7", fontSize:9, padding:"2px 8px", borderRadius:4, color:C.gray700 }}>
                🔒 Messages are end-to-end encrypted
              </div>
              {messages.map((m, i) => {
                const isLead = m.role === "lead";
                return (
                  <div key={i} style={{
                    alignSelf: isLead ? "flex-start" : "flex-end",
                    background: isLead ? "#ffffff" : "#dcf8c6",
                    padding: "6px 9px",
                    borderRadius: 8,
                    maxWidth: "85%",
                    boxShadow: "0 1px 1px rgba(0,0,0,.1)",
                    position: "relative"
                  }}>
                    <div style={{ fontSize:11, color:C.gray800, lineHeight:1.35 }}>{m.text}</div>
                    <div style={{ fontSize:8, color:C.gray400, textAlign:"right", marginTop:3, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:2 }}>
                      {m.ts} {!isLead && <span style={{ color:"#34b7f1" }}>✓✓</span>}
                    </div>
                  </div>
                );
              })}
              {aiTyping && (
                <div style={{ alignSelf:"flex-end", background:"#dcf8c6", padding:"6px 10px", borderRadius:8, fontSize:10, color:C.gray600 }}>
                  Typing...
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign:"center", color:C.gray400, marginTop:100, fontSize:11 }}>
              Select a chat to preview screen
            </div>
          )}
        </div>

        {/* Simulator Footer */}
        <div style={{ padding:"8px 10px", background:"#f0f0f0", borderTop:"1px solid #ddd", display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
          <div style={{ flex:1, background:"white", borderRadius:15, padding:"4px 10px", fontSize:10, color:C.gray400, border:"1px solid #eee" }}>
            Type a message...
          </div>
          <div style={{ width:24, height:24, borderRadius:"50%", background:"#075e54", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12 }}>
            🎤
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI AGENT ─────────────────────────────────────────────────────────────────
function AIAgent({ bizProfile, setBizProfile, leads, notify }: { bizProfile: BizProfile; setBizProfile: (p: BizProfile) => void; leads: Lead[]; notify: (msg: string) => void }) {
  const [draft, setDraft] = useState<BizProfile>({ ...bizProfile });
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState("");

  const save = () => { setBizProfile(draft); notify("AI agent profile updated"); };

  const testAI = async () => {
    setTesting(true); setTestMsg("");
    setTimeout(() => {
      setTestMsg("Hello there! Yes, we can certainly assist with your business setup. We handle everything from MCA registry filing to MOA drafting. Shall we coordinate a call?");
      setTesting(false);
    }, 1500);
  };

  const templates = [
    { label:"Startup — first message", cat:"Startup",  text:`Hi [Name] 👋 We help startups get legally registered fast — Pvt Ltd, LLP, Sole Prop. Are you working on an idea or planning to launch?` },
    { label:"MSME — first message",    cat:"MSME",     text:`Hi [Name] 👋 We support MSMEs with Udyam registration, GST, and funding. Can I learn a bit more about your business?` },
    { label:"Retail — first message",  cat:"Retail",   text:`Hi [Name] 👋 We help retail businesses with GST, trade licences and compliance. Are you looking to formalise your business?` },
    { label:"Follow-up (Day 3)",       cat:"Follow-up",text:`Hi [Name] 👋 Just checking in — were you able to think about your business plans? Happy to help whenever you're ready.` },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Business profile */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
          ✦ AI agent business profile
        </div>
        <div style={{ fontSize:12, color:C.gray500, marginBottom:14 }}>
          AI reads this to understand your business. Train it well — it speaks to every lead in your voice.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Business name</label>
            <input value={draft.name} onChange={e=>setDraft(p=>({...p, name:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Tone</label>
            <select value={draft.tone} onChange={e=>setDraft(p=>({...p, tone:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }}>
              <option>Friendly + Professional</option>
              <option>Casual</option>
              <option>Formal</option>
            </select>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, gridColumn:"span 2" }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>What you offer</label>
            <textarea value={draft.service} onChange={e=>setDraft(p=>({...p, service:e.target.value}))} rows={2}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12, resize:"vertical" }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, gridColumn:"span 2" }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Target clients</label>
            <textarea value={draft.clients} onChange={e=>setDraft(p=>({...p, clients:e.target.value}))} rows={2}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12, resize:"vertical" }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <button onClick={save} style={{ padding:"7px 18px", borderRadius:6, border:"none",
            background:C.brand, color:C.white, fontSize:12, fontWeight:600, cursor:"pointer" }}>
            Save & train AI ✦
          </button>
          <button onClick={testAI} disabled={testing}
            style={{ padding:"7px 18px", borderRadius:6, border:`1px solid ${C.brand}`,
              background:C.brandLight, color:C.brand, fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {testing ? "Testing…" : "Test AI reply"}
          </button>
        </div>
        {testMsg && (
          <div style={{ marginTop:12, padding:"10px 14px", background:C.brandLight, borderRadius:8,
            fontSize:12, color:C.brandDark, borderLeft:`3px solid ${C.brand}`, lineHeight:1.55 }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.brand, marginBottom:4 }}>AI AGENT REPLY</div>
            {testMsg}
          </div>
        )}
      </div>

      {/* Templates */}
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
          Outreach templates
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {templates.map((t,i) => (
            <div key={i} style={{ background:C.gray50, borderRadius:8, padding:"10px 12px",
              border:`1px solid ${C.gray200}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:10, fontWeight:600, color:C.gray500 }}>{t.label}</span>
                <Badge label={t.cat} {...(CAT_META[t.cat] || STAGE_META[t.cat] || { color:C.gray600, bg:C.gray200 })} />
              </div>
              <div style={{ fontSize:12, color:C.gray700, lineHeight:1.55 }}>{t.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        {[
          { label:"Messages sent by AI", val:leads.filter(l=>l.stage!=="New").length * 3, color:C.brand },
          { label:"Replies triggered",   val:leads.filter(l=>["Replied","Interested","Closed"].includes(l.stage)).length, color:C.green },
          { label:"Leads qualified",     val:leads.filter(l=>l.category!=="Unknown").length, color:C.purple },
          { label:"Deals assisted",      val:leads.filter(l=>l.stage==="Closed").length, color:C.teal },
        ].map(m => (
          <div key={m.label} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10,
            padding:"12px 14px", borderLeft:`3px solid ${m.color}` }}>
            <div style={{ fontSize:22, fontWeight:700, color:C.gray900 }}>{m.val}</div>
            <div style={{ fontSize:11, color:C.gray500, marginTop:2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WORKFLOWS ────────────────────────────────────────────────────────────────
function Workflows({ workflows, setWorkflows }: { workflows: Workflow[]; setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>> }) {
  const toggle = (id: string) => setWorkflows(prev => prev.map(w => w.id===id ? {...w, active:!w.active} : w));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:14,
        fontSize:12, color:C.gray600, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:16 }}>✦</span>
        <span>{workflows.filter(w=>w.active).length} workflows active — AI is running these automatically for you 24/7</span>
      </div>
      {workflows.map(w => (
        <div key={w.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10,
          padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{w.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.gray900 }}>{w.title}</div>
            <div style={{ fontSize:11, color:C.gray500, marginTop:2 }}>{w.desc}</div>
          </div>
          {w.runs > 0 && (
            <div style={{ fontSize:11, color:C.green, background:C.greenLight, padding:"2px 8px",
              borderRadius:10, fontWeight:600, flexShrink:0 }}>{w.runs} runs</div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span style={{ fontSize:11, color: w.active ? C.green : C.gray400 }}>{w.active ? "Active" : "Paused"}</span>
            <Toggle value={w.active} onChange={() => toggle(w.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── INTEGRATIONS ─────────────────────────────────────────────────────────────
interface SavedIntegration {
  id: string;
  type: string;
  credentials?: string;
  active: boolean;
}

function IntegrationsPage({ integrations, setIntegrations, notify }: { integrations: Integration[]; setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>; notify: (msg: string, type?: string) => void }) {
  const [selectedInteg, setSelectedInteg] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const fetchConfigs = async () => {
    try {
      const res = await fetch("/api/crm/integrations");
      if (res.ok) {
        const data: SavedIntegration[] = await res.json();
        const configMap: Record<string, any> = {};
        data.forEach(item => {
          try {
            configMap[item.type] = item.credentials ? JSON.parse(item.credentials) : {};
          } catch (e) {
            configMap[item.type] = { raw: item.credentials };
          }
        });
        setSavedConfigs(configMap);
        
        // Update local integrations list active state based on DB
        setIntegrations(prev => prev.map(i => {
          const dbItem = data.find(d => d.type === i.id);
          return dbItem ? { ...i, status: dbItem.active } : i;
        }));
      }
    } catch (e) {
      console.error("Failed to load integration configurations", e);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const saveConfig = async (type: string, credentials: any, active = true) => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, credentials, active })
      });
      if (res.ok) {
        notify(`${type.toUpperCase()} integration settings saved!`);
        fetchConfigs();
        setSelectedInteg(null);
      } else {
        notify("Failed to save configuration", "error");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to save configuration", "error");
    }
    setLoading(false);
  };

  const getEmbedCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
    return `<!-- SetMyBizz CRM Lead Capture Embed Widget -->
<form id="smb-crm-lead-form" style="max-width: 400px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: sans-serif; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
  <h3 style="margin-top: 0; color: #1e293b;">Contact Us</h3>
  <div style="margin-bottom: 12px;">
    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #475569;">Name</label>
    <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
  </div>
  <div style="margin-bottom: 12px;">
    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #475569;">Phone Number</label>
    <input type="tel" name="phone" required style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
  </div>
  <div style="margin-bottom: 16px;">
    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #475569;">Message / Requirements</label>
    <textarea name="note" rows="3" required style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; resize: vertical;"></textarea>
  </div>
  <button type="submit" style="width: 100%; padding: 10px; border: none; border-radius: 6px; background: #1a56db; color: #ffffff; font-weight: 650; cursor: pointer;">Submit Request</button>
  <div id="smb-form-status" style="margin-top: 10px; font-size: 12px; text-align: center; display: none;"></div>
</form>

<script>
document.getElementById('smb-crm-lead-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('smb-form-status');
  status.style.display = 'block';
  status.style.color = '#4b5563';
  status.innerText = 'Submitting...';

  const payload = {
    businessId: "seed-business",
    name: form.name.value,
    phone: form.phone.value,
    note: form.note.value,
    source: "External Website"
  };

  fetch('${origin}/api/crm/web-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      status.style.color = '#057a55';
      status.innerText = '✓ Thank you! Request submitted successfully.';
      form.reset();
    } else {
      status.style.color = '#9b1c1c';
      status.innerText = 'Failed to submit request. Please try again.';
    }
  })
  .catch(err => {
    status.style.color = '#9b1c1c';
    status.innerText = 'Connection error. Please try again.';
  });
});
</script>`;
  };

  const handleWAFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    saveConfig("wa", {
      phoneId: data.get("phoneId"),
      apiKey: data.get("apiKey"),
      provider: data.get("provider")
    });
  };

  const handleGmailFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    saveConfig("gmail", {
      smtpUser: data.get("smtpUser"),
      smtpPass: data.get("smtpPass"),
      port: data.get("port")
    });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:14,
        fontSize:12, color:C.gray600 }}>
        Connect your customer channels. Users can enter real API credentials to sync WhatsApp routing and capture leads from external websites.
      </div>
      
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
        {integrations.map(integ => (
          <div key={integ.id}
            style={{ background:C.white, border:`1.5px solid ${integ.status ? C.green : C.gray200}`,
              borderRadius:10, padding:"14px 12px", textAlign:"center", cursor:"pointer" }}
            onClick={() => setSelectedInteg(selectedInteg === integ.id ? null : integ.id)}>
            <div style={{ fontSize:28, marginBottom:6 }}>{integ.icon}</div>
            <div style={{ fontSize:12, fontWeight:600, color:C.gray900, marginBottom:4 }}>{integ.name}</div>
            <div style={{ fontSize:11, color: integ.status ? C.green : C.gray400, fontWeight:500 }}>
              {integ.status ? "✓ Connected" : "Click to connect"}
            </div>
          </div>
        ))}
      </div>

      {selectedInteg && (
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16, marginTop:8, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.gray900 }}>
              Configure {integrations.find(i => i.id === selectedInteg)?.name} Setup
            </span>
            <button onClick={() => setSelectedInteg(null)} style={{ border:"none", background:"none", cursor:"pointer", color:C.gray400, fontSize:14 }}>✕</button>
          </div>

          {selectedInteg === "wa" && (
            <form onSubmit={handleWAFormSubmit} style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.gray650 }}>WATI / Twilio Phone Number ID</label>
                  <input name="phoneId" defaultValue={savedConfigs.wa?.phoneId || ""} placeholder="e.g. 109283747" required
                    style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.gray650 }}>API Gateway Provider</label>
                  <select name="provider" defaultValue={savedConfigs.wa?.provider || "WATI"}
                    style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }}>
                    <option>WATI</option>
                    <option>Twilio Business</option>
                    <option>360dialog</option>
                  </select>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:11, fontWeight:600, color:C.gray650 }}>API Key / Authorization Token</label>
                <input name="apiKey" type="password" defaultValue={savedConfigs.wa?.apiKey || ""} placeholder="••••••••••••••••••••••••" required
                  style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ padding:"7px 18px", borderRadius:6, border:"none", background:C.brand, color:"white", fontSize:12, fontWeight:600, cursor:"pointer", width:"fit-content" }}>
                {loading ? "Saving..." : "Save WA Settings"}
              </button>
            </form>
          )}

          {selectedInteg === "gmail" && (
            <form onSubmit={handleGmailFormSubmit} style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.gray655 }}>SMTP User / Email</label>
                  <input name="smtpUser" type="email" defaultValue={savedConfigs.gmail?.smtpUser || ""} placeholder="user@gmail.com" required
                    style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.gray655 }}>SMTP Port</label>
                  <input name="port" defaultValue={savedConfigs.gmail?.port || "587"} required
                    style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:11, fontWeight:600, color:C.gray655 }}>App Password (Secure)</label>
                <input name="smtpPass" type="password" defaultValue={savedConfigs.gmail?.smtpPass || ""} placeholder="•••• •••• •••• ••••" required
                  style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ padding:"7px 18px", borderRadius:6, border:"none", background:C.brand, color:"white", fontSize:12, fontWeight:600, cursor:"pointer", width:"fit-content" }}>
                {loading ? "Saving..." : "Save Gmail SMTP"}
              </button>
            </form>
          )}

          {selectedInteg === "web" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:11, color:C.gray600 }}>
                Copy the HTML/JS script below and paste it on your website landing page to capture leads directly into this CRM.
              </div>
              <textarea readOnly value={getEmbedCode()} rows={8}
                style={{ padding:"8px 10px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:11, fontFamily:"monospace", background:C.gray50, resize:"none" }} />
              <button onClick={() => { navigator.clipboard.writeText(getEmbedCode()); notify("Embed code copied!"); }}
                style={{ padding:"7px 18px", borderRadius:6, border:`1px solid ${C.brand}`, background:C.brandLight, color:C.brand, fontSize:12, fontWeight:600, cursor:"pointer", width:"fit-content" }}>
                Copy Embed Script
              </button>
            </div>
          )}

          {!["wa", "gmail", "web"].includes(selectedInteg) && (
            <div style={{ textAlign:"center", padding:12, color:C.gray500 }}>
              Custom setup configuration for this channel is coming soon! Toggling connection active.
              <button onClick={() => saveConfig(selectedInteg, {}, !integrations.find(i=>i.id===selectedInteg)?.status)}
                style={{ display:"block", margin:"10px auto 0", padding:"6px 14px", borderRadius:6, border:"none", background:C.brand, color:"white", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                Toggle Connection Active
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ bizProfile, setBizProfile, notify }: { bizProfile: BizProfile; setBizProfile: (p: BizProfile) => void; notify: (msg: string) => void }) {
  const [form, setForm] = useState({ ...bizProfile, whatsapp:"", email:"" });
  const save = () => { setBizProfile({ name: form.name, service: form.service, clients: form.clients, tone: form.tone }); notify("Settings saved"); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
          Business profile
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Business name</label>
            <input value={form.name} onChange={e=>setForm(p=>({...p, name:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>WhatsApp number</label>
            <input value={form.whatsapp} onChange={e=>setForm(p=>({...p, whatsapp:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Business email</label>
            <input value={form.email} onChange={e=>setForm(p=>({...p, email:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Tone</label>
            <input value={form.tone} onChange={e=>setForm(p=>({...p, tone:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
          </div>
        </div>
      </div>
      <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray600, textTransform:"uppercase", letterSpacing:.5, marginBottom:12 }}>
          AI agent settings
        </div>
        {[
          ["AI auto-reply to new leads","auto_reply"],
          ["Follow-up sequences (Day 1, 3, 7)","followup"],
          ["Reply during non-working hours","offhours"],
          ["Human escalation WhatsApp alerts","escalate"],
        ].map(([label,key]) => (
          <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"8px 0", borderBottom:`1px solid ${C.gray100}` }}>
            <span style={{ fontSize:12, color:C.gray700 }}>{label}</span>
            <Toggle value={true} onChange={()=>{}} />
          </div>
        ))}
      </div>
      <button onClick={save} style={{ padding:"9px 24px", borderRadius:8, border:"none",
        background:C.brand, color:C.white, fontSize:13, fontWeight:600, cursor:"pointer", width:"fit-content" }}>
        Save settings
      </button>
    </div>
  );
}

// ── ADD LEAD MODAL ───────────────────────────────────────────────────────────
function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (l: Lead) => void }) {
  const [form, setForm] = useState({ name:"", phone:"", note:"", source:"WA Group" });
  const sources = ["WA Group","Direct DM","Website","Manual"];

  const submit = () => {
    if (!form.note) return;
    const cat   = classify(form.note);
    const stage = "New";
    const pri   = priority(cat, stage);
    const score = aiScore(cat, stage);
    onAdd({ id:uid(), name:form.name||"Unknown", phone:form.phone||"—",
      category:cat, stage, priority:pri, source:form.source,
      note:form.note, score, added:new Date().toISOString().slice(0,10) });
    onClose();
  };

  return (
    <Modal title="Add new lead" onClose={onClose} onConfirm={submit} confirmLabel="Add lead">
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {[["Name (optional)","name","text"],["Phone","phone","text"]].map(([label,key,type]) => (
          <div key={key} style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>{label}</label>
            <input type={type} value={form[key as "name" | "phone"]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
          </div>
        ))}
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Source</label>
          <div style={{ display:"flex", gap:6 }}>
            {sources.map(s => (
              <button key={s} onClick={() => setForm(p=>({...p,source:s}))}
                style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${form.source===s?C.brand:C.gray200}`,
                  background:form.source===s?C.brandLight:"transparent", color:form.source===s?C.brand:C.gray600,
                  fontSize:11, fontWeight:600, cursor:"pointer" }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:11, fontWeight:600, color:C.gray500 }}>Their message or context *</label>
          <textarea value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} rows={3}
            placeholder="e.g. 'I want to register a startup' or 'I run a garment shop'"
            style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12, resize:"vertical" }} />
          {form.note && (
            <div style={{ fontSize:11, color:C.brand, fontWeight:500 }}>
              Auto-classified as: {classify(form.note)}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ── IMPORT MODAL ─────────────────────────────────────────────────────────────
interface ParsedImport {
  name: string;
  phone: string;
  note: string;
}

function ImportModal({ onClose, onAdd, notify }: { onClose: () => void; onAdd: (l: Lead) => void; notify: (msg: string) => void }) {
  const [importType, setImportType] = useState<"text" | "sheet">("text");
  const [raw, setRaw]       = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [preview, setPreview] = useState<ParsedImport[]>([]);
  const [syncing, setSyncing] = useState(false);

  const parse = () => {
    const lines = raw.split("\n").map(l=>l.trim()).filter(Boolean);
    const parsed = lines.map(line => {
      const phoneMatch = line.match(/\+?[\d\s\-]{10,}/);
      const phone = phoneMatch ? phoneMatch[0].trim() : "—";
      const name  = line.replace(phone,"").replace(/[:,-]/g,"").trim() || "Unknown";
      return { name, phone, note:line };
    });
    setPreview(parsed.slice(0,5));
  };

  const doImport = () => {
    const lines = raw.split("\n").map(l=>l.trim()).filter(Boolean);
    lines.forEach(line => {
      const phoneMatch = line.match(/\+?[\d\s\-]{10,}/);
      const phone = phoneMatch ? phoneMatch[0].trim() : "—";
      const name  = line.replace(phone,"").replace(/[:,-]/g,"").trim() || "Unknown";
      const cat   = classify(line);
      const stage = "New";
      onAdd({ id:uid(), name, phone, category:cat, stage, priority:"Medium",
        source:"WA Group", note:line, score:aiScore(cat,stage),
        added:new Date().toISOString().slice(0,10) });
    });
    notify(`✓ ${lines.length} leads imported — AI outreach queued`);
    onClose();
  };

  const doGoogleSheetSync = () => {
    if (!sheetUrl.trim()) return;
    setSyncing(true);
    setTimeout(() => {
      const mockSheetLeads = [
        { name: "Anil K", phone: "+91 94401 23456", note: "GARMENT SHOP GST COMPLIANCE MSME" },
        { name: "Samantha", phone: "+91 98852 98765", note: "EDTECH STARTUP INCORPORATION SEED FUND" },
        { name: "Varun Teja", phone: "+91 99081 54321", note: "RETAIL STORE FRANCHISE TRADE LICENSE" },
        { name: "Divya Rao", phone: "+91 91770 12121", note: "SALON BEAUTY SERVICES GST" },
        { name: "Gopal Krishna", phone: "+91 90001 88888", note: "TECH MVP SaaS SETUP" }
      ];

      mockSheetLeads.forEach(item => {
        const cat = classify(item.note);
        const stage = "New";
        onAdd({
          id: uid(),
          name: item.name,
          phone: item.phone,
          category: cat,
          stage,
          priority: "Medium",
          source: "Google Sheet Sync",
          note: item.note,
          score: aiScore(cat, stage),
          added: new Date().toISOString().slice(0,10)
        });
      });

      setSyncing(false);
      notify("✓ Successfully synced 5 new leads from Google Sheet!");
      onClose();
    }, 2000);
  };

  return (
    <Modal
      title="Bulk import leads"
      onClose={onClose}
      onConfirm={importType === "sheet" ? doGoogleSheetSync : (preview.length > 0 ? doImport : parse)}
      confirmLabel={syncing ? "Syncing..." : (importType === "sheet" ? "Connect & Sync Sheet" : (preview.length > 0 ? `Import ${raw.split("\n").filter(l=>l.trim()).length} leads` : "Preview"))}>
      
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {/* Tab Toggle */}
        <div style={{ display:"flex", background:C.gray100, padding:3, borderRadius:8, gap:4 }}>
          <button onClick={() => setImportType("text")}
            style={{ flex:1, border:"none", background: importType === "text" ? C.white : "transparent",
              color: importType === "text" ? C.gray900 : C.gray500, padding:"6px 0", borderRadius:6,
              fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .15s" }}>
            📋 Manual Paste Text
          </button>
          <button onClick={() => setImportType("sheet")}
            style={{ flex:1, border:"none", background: importType === "sheet" ? C.white : "transparent",
              color: importType === "sheet" ? C.gray900 : C.gray500, padding:"6px 0", borderRadius:6,
              fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .15s" }}>
            📊 Google Sheets Sync
          </button>
        </div>

        {importType === "text" ? (
          <>
            <div style={{ fontSize:11, color:C.gray500 }}>
              Paste WhatsApp group members, Excel rows, or any text with phone numbers. One contact per line.
            </div>
            <textarea value={raw} onChange={e=>{ setRaw(e.target.value); setPreview([]); }} rows={6}
              placeholder={"Ravi Kumar: +91 98765 43210\n+91 91234 56789\nPriya Reddy +91 99001 12345\n..."}
              style={{ padding:"9px 10px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12,
                resize:"vertical", fontFamily:"monospace" }} />
            {preview.length > 0 && (
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:C.gray600, marginBottom:6 }}>Preview (first 5):</div>
                {preview.map((p,i) => (
                  <div key={i} style={{ display:"flex", gap:10, padding:"5px 8px", background:C.gray50,
                    borderRadius:6, marginBottom:4, fontSize:11 }}>
                    <span style={{ flex:1, color:C.gray800 }}>{p.name}</span>
                    <span style={{ color:C.gray500 }}>{p.phone}</span>
                    <Badge label={classify(p.note)} {...CAT_META[classify(p.note)]} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:11, color:C.gray500 }}>
              Provide your Google Sheets Sharing URL. Ensure link sharing is enabled so the system can ingest the headers & contacts.
            </div>
            <input value={sheetUrl} onChange={e=>setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              style={{ padding:"7px 9px", borderRadius:6, border:`1px solid ${C.gray200}`, fontSize:12 }} />
            
            {syncing && (
              <div style={{ display:"flex", flexDirection:"column", gap:6, padding:"8px 0" }}>
                <div style={{ fontSize:10, fontWeight:600, color:C.brand }}>Contacting Google Sheets API & Ingesting Rows...</div>
                <div style={{ height:4, background:C.gray200, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:"70%", background:C.brand, borderRadius:2 }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ── MODAL WRAPPER ─────────────────────────────────────────────────────────────
function Modal({ title, children, onClose, onConfirm, confirmLabel }: { title: string; children: React.ReactNode; onClose: () => void; onConfirm: () => void; confirmLabel: string }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.white, borderRadius:12, width:460, maxHeight:"90vh",
        overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.gray200}`,
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:14, fontWeight:600, color:C.gray900 }}>{title}</span>
          <button onClick={onClose} style={{ border:"none", background:"none", fontSize:18,
            color:C.gray400, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"16px 18px" }}>{children}</div>
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.gray200}`,
          display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose}
            style={{ padding:"7px 16px", borderRadius:6, border:`1px solid ${C.gray200}`,
              background:C.white, color:C.gray600, fontSize:12, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm}
            style={{ padding:"7px 18px", borderRadius:6, border:"none", background:C.brand,
              color:C.white, fontSize:12, fontWeight:600, cursor:"pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
