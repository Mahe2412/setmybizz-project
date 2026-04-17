'use client';
import React, { useState, useRef } from 'react';

/* ── Types ── */
type WorkflowStep = {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'notify';
  icon: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  runs: number;
  lastRun: string;
  steps: WorkflowStep[];
  category: string;
};

/* ── Workflow Templates (India-specific!) ── */
const WORKFLOW_TEMPLATES = [
  {
    id: 'gst-reminder',
    name: 'GST Filing Reminder',
    category: 'Legal',
    emoji: '⚖️',
    color: '#e2445c',
    bgColor: 'bg-red-50',
    desc: 'Auto-remind before GSTR deadlines and prefill data',
    prompt: 'When GST due date is 7 days away, remind me and prepare the filing data',
    steps: [
      { id: 's1', type: 'trigger', icon: 'schedule', title: 'Due Date Alert', desc: '7 days before GSTR deadline', color: '#e2445c', bgColor: 'bg-red-50' },
      { id: 's2', type: 'action', icon: 'calculate', title: 'Prefill GST Data', desc: 'Pull sales data from records', color: '#ff7b00', bgColor: 'bg-orange-50' },
      { id: 's3', type: 'notify', icon: 'notifications', title: 'Send Alert', desc: 'WhatsApp + Email notification', color: '#0073ea', bgColor: 'bg-blue-50' },
    ] as WorkflowStep[]
  },
  {
    id: 'lead-followup',
    name: 'Lead Auto Follow-up',
    category: 'Sales',
    emoji: '🎯',
    color: '#00c875',
    bgColor: 'bg-green-50',
    desc: 'When a new lead arrives, auto-qualify and send WhatsApp',
    prompt: 'When a new lead is added, score it and send WhatsApp follow-up automatically',
    steps: [
      { id: 's1', type: 'trigger', icon: 'person_add', title: 'New Lead Added', desc: 'CRM receives new contact', color: '#00c875', bgColor: 'bg-green-50' },
      { id: 's2', type: 'condition', icon: 'filter_alt', title: 'Score Lead', desc: 'AI rates lead 1-100', color: '#9d94ff', bgColor: 'bg-violet-50' },
      { id: 's3', type: 'action', icon: 'chat', title: 'Send WhatsApp', desc: 'Auto send intro message', color: '#25d366', bgColor: 'bg-green-50' },
      { id: 's4', type: 'notify', icon: 'notifications', title: 'Notify Sales Team', desc: 'Hot leads → Immediate alert', color: '#0073ea', bgColor: 'bg-blue-50' },
    ] as WorkflowStep[]
  },
  {
    id: 'invoice-reminder',
    name: 'Invoice Payment Follow-up',
    category: 'Finance',
    emoji: '💳',
    color: '#579bfc',
    bgColor: 'bg-blue-50',
    desc: 'Auto-remind clients about overdue invoices',
    prompt: 'When invoice is overdue by 3 days, send WhatsApp reminder to client',
    steps: [
      { id: 's1', type: 'trigger', icon: 'receipt', title: 'Invoice Overdue', desc: 'Payment pending 3+ days', color: '#579bfc', bgColor: 'bg-blue-50' },
      { id: 's2', type: 'action', icon: 'chat', title: 'WhatsApp Reminder', desc: 'Polite payment reminder', color: '#25d366', bgColor: 'bg-green-50' },
      { id: 's3', type: 'condition', icon: 'check_circle', title: 'Payment Received?', desc: 'Monitor payment status', color: '#00c875', bgColor: 'bg-emerald-50' },
      { id: 's4', type: 'notify', icon: 'notifications', title: 'Update Records', desc: 'Mark paid in accounts', color: '#ff7b00', bgColor: 'bg-orange-50' },
    ] as WorkflowStep[]
  },
  {
    id: 'employee-onboard',
    name: 'New Employee Onboarding',
    category: 'HR',
    emoji: '👥',
    color: '#ffcc00',
    bgColor: 'bg-yellow-50',
    desc: 'Auto-create tasks and send welcome kit when new hire joins',
    prompt: 'When a new employee joins, create onboarding tasks and send welcome documents',
    steps: [
      { id: 's1', type: 'trigger', icon: 'badge', title: 'New Employee Added', desc: 'HR adds staff member', color: '#ffcc00', bgColor: 'bg-yellow-50' },
      { id: 's2', type: 'action', icon: 'task_alt', title: 'Create Task List', desc: '15 onboarding tasks auto-created', color: '#0073ea', bgColor: 'bg-blue-50' },
      { id: 's3', type: 'action', icon: 'mail', title: 'Send Welcome Email', desc: 'Company docs + policies', color: '#e2445c', bgColor: 'bg-red-50' },
      { id: 's4', type: 'notify', icon: 'group', title: 'Notify Team', desc: 'Announcement to all staff', color: '#9d94ff', bgColor: 'bg-violet-50' },
    ] as WorkflowStep[]
  },
  {
    id: 'social-post',
    name: 'Weekly Social Media Posts',
    category: 'Marketing',
    emoji: '📱',
    color: '#e2445c',
    bgColor: 'bg-pink-50',
    desc: 'Every Monday, Arkle generates and schedules 7 posts',
    prompt: 'Every Monday, generate 7 social media posts for the week and schedule them',
    steps: [
      { id: 's1', type: 'trigger', icon: 'calendar_month', title: 'Every Monday 9AM', desc: 'Weekly content cycle starts', color: '#e2445c', bgColor: 'bg-red-50' },
      { id: 's2', type: 'action', icon: 'auto_awesome', title: 'AI Generates Posts', desc: '7 posts for Instagram/LinkedIn', color: '#9d94ff', bgColor: 'bg-violet-50' },
      { id: 's3', type: 'action', icon: 'schedule_send', title: 'Schedule Posts', desc: 'Optimal posting times', color: '#00c875', bgColor: 'bg-green-50' },
      { id: 's4', type: 'notify', icon: 'analytics', title: 'Weekly Report', desc: 'Engagement analytics sent', color: '#0073ea', bgColor: 'bg-blue-50' },
    ] as WorkflowStep[]
  },
  {
    id: 'competitor-watch',
    name: 'Competitor Monitor',
    category: 'Strategy',
    emoji: '🔍',
    color: '#9d94ff',
    bgColor: 'bg-violet-50',
    desc: 'Weekly AI scan of competitors and market trends',
    prompt: 'Every week, research my competitors and send me a market intelligence report',
    steps: [
      { id: 's1', type: 'trigger', icon: 'update', title: 'Every Sunday', desc: 'Weekly intelligence cycle', color: '#9d94ff', bgColor: 'bg-violet-50' },
      { id: 's2', type: 'action', icon: 'travel_explore', title: 'AI Market Scan', desc: 'Research 5 competitors online', color: '#0073ea', bgColor: 'bg-blue-50' },
      { id: 's3', type: 'action', icon: 'summarize', title: 'Generate Report', desc: 'Key insights + opportunities', color: '#00c875', bgColor: 'bg-green-50' },
      { id: 's4', type: 'notify', icon: 'mail', title: 'Email to Founder', desc: 'Intelligence report delivered', color: '#ff7b00', bgColor: 'bg-orange-50' },
    ] as WorkflowStep[]
  },
];

const CATEGORIES = ['All', 'Sales', 'Finance', 'Legal', 'Marketing', 'HR', 'Strategy'];

/* ── Live Workflows (mock saved) ── */
const SAVED_WORKFLOWS: Workflow[] = [
  {
    id: 'w1', name: 'GST Filing Reminder', category: 'Legal',
    description: 'Auto alerts before GSTR deadlines', status: 'active', runs: 14, lastRun: '2 days ago',
    steps: WORKFLOW_TEMPLATES[0].steps
  },
  {
    id: 'w2', name: 'Lead Auto Follow-up', category: 'Sales',
    description: 'WhatsApp messages sent to every new lead', status: 'active', runs: 87, lastRun: '1 hour ago',
    steps: WORKFLOW_TEMPLATES[1].steps
  },
];

const STEP_TYPE_LABELS: Record<string, string> = {
  trigger: 'TRIGGER',
  condition: 'IF / CONDITION',
  action: 'DO / ACTION',
  notify: 'NOTIFY',
};

export default function WorkflowBuilderTab() {
  const [view, setView] = useState<'home' | 'builder' | 'my-workflows'>('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowStep[] | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [savedWorkflows, setSavedWorkflows] = useState<Workflow[]>(SAVED_WORKFLOWS);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof WORKFLOW_TEMPLATES[0] | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recRef = useRef<any>(null);

  const filteredTemplates = selectedCategory === 'All'
    ? WORKFLOW_TEMPLATES
    : WORKFLOW_TEMPLATES.filter(t => t.category === selectedCategory);

  /* ── Voice Input ── */
  const toggleVoice = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert('Voice not supported in this browser');
    if (isListening) {
      recRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setPromptText(t);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  /* ── AI Workflow Generation ── */
  const generateWorkflow = async (templateOverride?: typeof WORKFLOW_TEMPLATES[0]) => {
    const template = templateOverride || null;
    if (template) {
      setGeneratedWorkflow(template.steps);
      setWorkflowName(template.name);
      setView('builder');
      return;
    }

    if (!promptText.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are an AI Workflow Builder for Indian businesses. The user described this process:
"${promptText}"

Generate a workflow with 3-5 steps. Return ONLY valid JSON array, no markdown, no explanation:
[
  { "id": "s1", "type": "trigger|condition|action|notify", "icon": "material_icon_name", "title": "Short Title", "desc": "Brief description", "color": "#hex", "bgColor": "bg-color-50" }
]
Types: trigger (start event), condition (if/check), action (do something), notify (alert/message)
Use Indian business context: GST, WhatsApp, Razorpay, UPI, compliance, etc.
For colors use: trigger=#e2445c, condition=#9d94ff, action=#0073ea, notify=#00c875
For bgColors use matching Tailwind classes.`,
          context: { currentDashboard: 'workflow-builder' }
        }),
      });
      const data = await res.json();
      const text = data.text || '';
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const steps = JSON.parse(jsonMatch[0]) as WorkflowStep[];
        setGeneratedWorkflow(steps);
        // Auto-name from prompt
        const words = promptText.split(' ').slice(0, 4).join(' ');
        setWorkflowName(words + ' Workflow');
        setView('builder');
      }
    } catch (e) {
      // Fallback: use a relevant template
      const fallback = WORKFLOW_TEMPLATES[Math.floor(Math.random() * WORKFLOW_TEMPLATES.length)];
      setGeneratedWorkflow(fallback.steps);
      setWorkflowName(fallback.name);
      setView('builder');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveWorkflow = () => {
    if (!generatedWorkflow) return;
    const newWf: Workflow = {
      id: `w${Date.now()}`,
      name: workflowName || 'New Workflow',
      category: 'Custom',
      description: promptText || 'Custom AI workflow',
      status: 'active',
      runs: 0,
      lastRun: 'Never',
      steps: generatedWorkflow,
    };
    setSavedWorkflows(prev => [newWf, ...prev]);
    setView('my-workflows');
  };

  /* ── HOME VIEW ── */
  if (view === 'home') return (
    <div className="h-full overflow-y-auto no-scrollbar bg-white">
      {/* Header Build Area */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Let's build your workflow</h1>
          <p className="text-slate-400 text-[13px]">Describe any work process and watch it become a workflow in seconds.</p>
        </div>

        {/* Main Prompt Box */}
        <div className={`relative rounded-[20px] border-2 transition-all duration-300 shadow-lg ${isListening ? 'border-blue-500 shadow-blue-200' : 'border-blue-200 focus-within:border-blue-500'}`}>
          {/* Voice listening animation */}
          {isListening && (
            <div className="absolute inset-0 rounded-[18px] overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
            </div>
          )}
          <textarea
            ref={textRef}
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateWorkflow(); } }}
            rows={3}
            className="w-full px-6 pt-5 pb-3 text-[14px] text-slate-800 font-medium outline-none resize-none bg-transparent placeholder-slate-300"
            placeholder={isListening ? '🎙️ Listening... speak your workflow...' : 'e.g. When a new GST invoice is uploaded, auto-categorize and alert my accountant...'}
          />
          <div className="flex items-center justify-between px-4 pb-4 pt-1">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>
              Try: "When lead added, send WhatsApp"
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${isListening ? 'bg-blue-600 text-white border-blue-600 animate-pulse' : 'text-slate-400 border-slate-200 hover:border-blue-400 hover:text-blue-600'}`}
                title="Voice input"
              >
                <span className="material-symbols-outlined text-[18px]">{isListening ? 'mic' : 'mic_none'}</span>
              </button>
              <button
                onClick={() => generateWorkflow()}
                disabled={!promptText.trim() || isGenerating}
                className={`px-5 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${promptText.trim() && !isGenerating ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Building...
                  </span>
                ) : 'Build Workflow'}
              </button>
            </div>
          </div>
        </div>

        {/* Or start from scratch */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-slate-400 text-[12px] font-medium">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <button
          onClick={() => { setGeneratedWorkflow([]); setWorkflowName('New Workflow'); setView('builder'); }}
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-[12px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Start from scratch
        </button>

        <div className="flex items-center justify-between mt-10 mb-5">
          <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-wide">Start with a template</h2>
          <button onClick={() => setView('my-workflows')} className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">account_tree</span>
            My Workflows ({savedWorkflows.length})
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-500 border-slate-200 hover:border-blue-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-3xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(tmpl => (
          <button
            key={tmpl.id}
            onClick={() => generateWorkflow(tmpl)}
            className="text-left p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 bg-white transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${tmpl.bgColor} flex items-center justify-center text-[20px] shrink-0 group-hover:scale-110 transition-transform`}>
                {tmpl.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] font-black text-slate-900">{tmpl.name}</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border`} style={{ color: tmpl.color, backgroundColor: tmpl.color + '15', borderColor: tmpl.color + '40' }}>
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{tmpl.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                  {tmpl.steps.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">{s.icon}</span>
                      {s.title}
                      {i < Math.min(tmpl.steps.length - 1, 2) && <span className="ml-1">→</span>}
                    </span>
                  ))}
                  {tmpl.steps.length > 3 && <span className="text-[9px] font-black text-slate-300">+{tmpl.steps.length - 3}</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── BUILDER VIEW ── */
  if (view === 'builder') return (
    <div className="h-full flex flex-col bg-white">
      {/* Builder Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => setView('home')} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
        <input
          value={workflowName}
          onChange={e => setWorkflowName(e.target.value)}
          className="flex-1 font-black text-[16px] text-slate-900 outline-none bg-transparent"
          placeholder="Workflow name..."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newStep: WorkflowStep = {
                id: `s${Date.now()}`,
                type: 'action',
                icon: 'add_task',
                title: 'New Step',
                desc: 'Click to configure',
                color: '#0073ea',
                bgColor: 'bg-blue-50',
              };
              setGeneratedWorkflow(prev => prev ? [...prev, newStep] : [newStep]);
            }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-black uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-1 text-slate-500"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            Add Step
          </button>
          <button
            onClick={saveWorkflow}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-1 shadow-lg shadow-blue-600/30"
          >
            <span className="material-symbols-outlined text-[14px]">check</span>
            Activate
          </button>
        </div>
      </div>

      {/* Workflow Visual Builder */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        {(!generatedWorkflow || generatedWorkflow.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-slate-300">account_tree</span>
            </div>
            <p className="text-slate-400 text-[13px] font-medium">Add steps to build your workflow</p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {generatedWorkflow.map((step, idx) => (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div className="flex items-start gap-4 group">
                  {/* Left: Type Label */}
                  <div className="shrink-0 w-24 text-right pt-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                      {STEP_TYPE_LABELS[step.type]}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 ${step.bgColor} border border-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group-hover:scale-[1.01]`}
                    style={{ borderColor: step.color + '20' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0" style={{ boxShadow: `0 2px 8px ${step.color}30` }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: step.color }}>{step.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-black text-slate-900">{step.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setGeneratedWorkflow(prev => prev?.filter(s => s.id !== step.id) || [])}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < generatedWorkflow.length - 1 && (
                  <div className="flex items-center ml-24 pl-4 my-1">
                    <div className="w-px h-6 bg-slate-200 ml-5" />
                    <span className="material-symbols-outlined text-[16px] text-slate-300 -mt-1 ml-[-7px]">arrow_drop_down</span>
                  </div>
                )}
              </div>
            ))}

            {/* Add Step Button */}
            <div className="flex items-center ml-24 pl-4 mt-4">
              <button
                onClick={() => {
                  const newStep: WorkflowStep = {
                    id: `s${Date.now()}`,
                    type: 'action',
                    icon: 'add_task',
                    title: 'New Action',
                    desc: 'Configure this step',
                    color: '#0073ea',
                    bgColor: 'bg-blue-50',
                  };
                  setGeneratedWorkflow(prev => prev ? [...prev, newStep] : [newStep]);
                }}
                className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 border border-dashed border-blue-200 px-4 py-2 rounded-xl transition-all hover:bg-blue-50"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Add Step
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ── MY WORKFLOWS VIEW ── */
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-black text-slate-900">My Workflows</h1>
            <p className="text-slate-400 text-[12px] mt-0.5">{savedWorkflows.filter(w => w.status === 'active').length} active automations running</p>
          </div>
          <button onClick={() => setView('home')} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
            <span className="material-symbols-outlined text-[14px]">add</span>
            New Workflow
          </button>
        </div>

        {/* Workflow Cards */}
        <div className="space-y-3">
          {savedWorkflows.map(wf => (
            <div key={wf.id} className="p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${wf.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(0,200,117,0.5)]' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-[13px] font-black text-slate-900">{wf.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{wf.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-[18px] font-black text-slate-900">{wf.runs}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Runs</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">{wf.lastRun}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Run</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSavedWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w)); }}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${wf.status === 'active' ? 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{wf.status === 'active' ? 'pause' : 'play_arrow'}</span>
                  </button>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {wf.steps.map((step, i) => (
                  <span key={i} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    <span className="material-symbols-outlined text-[11px]">{step.icon}</span>
                    {step.title}
                    {i < wf.steps.length - 1 && <span className="ml-1 text-slate-200">→</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
