"use client";
/**
 * Arkle AI OS - LaunchPadTab Component
 * Version: 2.2.0 (Minimalist Launcher & Refined UI)
 * Last Updated: 2026-04-21
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BuildingModal, WelcomeModal, DiscoveryModal, ProjectLibraryModal } from './launchpad/LaunchPadModals';
import { useBizStore } from '@/lib/useBizStore';
import { ArkleVoiceRecognizer, ArkleVolumeMeter, parseVoiceCommand, voiceCommandToForgeRequest } from '@/lib/ArkleVoiceBridge';
import { BusinessData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArkleVoiceIcon } from '../shared/ArkleVoiceIcon';
import { ArkleBrainStatus } from './ArkleBrainStatus';
import ArkleStrategyMode from './ArkleStrategyMode';
import { QAOverlay } from '@/components/shared/QAOverlay';
import { useRouter } from 'next/navigation';
import GoogleIntegrationModal from '../dashboard/GoogleIntegrationModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

import {
    SERVICES,
    LAUNCHER_CATEGORIES,
    TOOL_CATEGORIES,
    TOOL_BLUEPRINTS,
    SOLUTION_IDEAS,
    DIGITAL_EMPLOYEES,
    ECOM_REAL_TEMPLATES,
    ECOM_TEMPLATES,
    WEB_TEMPLATES,
    LOGO_TEMPLATES
} from '@/lib/launchpad-data';

interface LaunchPadTabProps {
    data: BusinessData;
    externalLang?: string;
    onLangChange?: (l: string) => void;
}

/* ── Types ─────────────────────────────────────────────── */
type TopTab = 'arkle' | 'launcher' | 'tool-lab' | 'agents';
type AppState = 'home' | 'discuss' | 'building' | 'ready' | 'forge' | 'agent-workspace' | 'solutions-chat';

interface ChatMsg { role: 'ai' | 'user'; text: string; ts: number; }
interface BuiltAsset { id: string; label: string; icon: string; status: 'pending' | 'building' | 'done' | 'failed'; color: string; result?: string; }
interface BusinessContext {
    businessName: string;
    idea: string;
    stage: string;
    type: string; // Service or Product
    industry: string;
    techLevel: string;
    brandVoice: string;
    designTaste: string;
    struggles: string;
    colors: string[];
    fonts: string;
    audience: string;
    model: string;
    usp: string;
    commitment: string;
    services: string[];
    [key: string]: any;
}

/* ── Arkle Quick Chat Tiles ──────────────────────────── */
const ARKLE_QUICK_TILES = [
    { label: 'Growth Gaps', icon: 'psychology_alt', prompt: 'Arkle, scan my business context and identify the biggest growth gaps and bottlenecks I should fix right now.' },
    { label: 'AI Automation', icon: 'smart_toy', prompt: 'Identify manual tasks in my current business model that can be automated using AI and suggest a roadmap.' },
    { label: 'Tech Solutions', icon: 'construction', prompt: 'Suggest a modern tech stack and digital solutions to scale my operations effectively.' },
    { label: 'Social Plan', icon: 'campaign', prompt: 'Draft a 30-day viral social media content strategy for my business to drive organic engagement.' },
    { label: 'Lead Engine', icon: 'hub', prompt: 'Suggest an automated lead generation engine and funnel for my startup.' },
    { label: 'Sales Pitch', icon: 'record_voice_over', prompt: 'Help me refine my sales pitch and USP to increase conversion rates.' },
    { label: 'Product Roadmap', icon: 'timeline', prompt: 'Create a 3-month product development roadmap based on my vision.' },
];

/* ── Co-Founder Discovery & Strategy Flow ──────────────── */
const DISCUSSION_FLOW = [
    {
        key: 'language',
        q: "In which language should we build your empire?",
        type: 'choice',
        options: [
            { id: 'en-IN', label: 'English', icon: 'language_us_ce', desc: 'Standard business English' },
            { id: 'te-IN', label: 'తెలుగు (Telugu)', icon: 'language_pinyin', desc: 'మీ మాతృభాషలో చర్చించండి' },
            { id: 'hi-IN', label: 'हिन्दी (Hindi)', icon: 'translate', desc: 'राष्ट्रभाषा में संवाद करें' },
        ]
    },
    {
        key: 'businessName',
        q: "What's the name of your venture?",
        type: 'text',
        placeholder: "e.g., Organic Oasis (Or say 'help me name it')"
    },
    {
        key: 'idea',
        q: "Describe your core idea in a few words.",
        type: 'text',
        placeholder: "e.g., A farm-to-table organic delivery app..."
    },
    {
        key: 'commitment',
        q: "What's your level of commitment?",
        type: 'choice',
        options: [
            { id: 'fulltime', label: 'Full-Time Founder', icon: 'person_filled', desc: '100% focused on this' },
            { id: 'sidehustle', label: 'Side Hustle', icon: 'work_history', desc: 'Working part-time currently' },
            { id: 'student', label: 'Student Project', icon: 'school', desc: 'Building as a student' },
        ]
    },
    {
        key: 'stage',
        q: "What's your current business stage?",
        type: 'choice',
        options: [
            { id: 'idea', label: 'Idea Phase', icon: 'lightbulb', desc: 'Just a vision currently' },
            { id: 'mvp', label: 'MVP Stage', icon: 'deployed_code', desc: 'Building prototype' },
            { id: 'launched', label: 'Launched', icon: 'rocket_launch', desc: 'Live with customers' },
            { id: 'scaling', label: 'Scaling', icon: 'trending_up', desc: 'Focused on growth' },
        ]
    },
    {
        key: 'audience',
        q: "Who are your target customers?",
        type: 'choice',
        options: [
            { id: 'b2c', label: 'Consumer (B2C)', icon: 'person_search', desc: 'Regular individuals' },
            { id: 'b2b', label: 'Business (B2B)', icon: 'apartment', desc: 'Other companies/startups' },
            { id: 'enterprise', label: 'Enterprise', icon: 'account_balance', desc: 'Large corporations' },
            { id: 'micro', label: 'Local Community', icon: 'location_on', desc: 'Specific neighborhood' },
        ]
    },
    {
        key: 'model',
        q: "How will you make money?",
        type: 'choice',
        options: [
            { id: 'sub', label: 'Subscription', icon: 'rebase', desc: 'Monthly/Yearly recurring' },
            { id: 'once', label: 'One-time Sale', icon: 'shopping_cart', desc: 'Direct product purchase' },
            { id: 'comm', label: 'Commission', icon: 'percent', desc: 'Fees from transactions' },
            { id: 'freemium', label: 'Freemium', icon: 'card_giftcard', desc: 'Basic free, Pro upgrade' },
        ]
    },
    {
        key: 'usp',
        q: "What's your Unique Selling Point (USP)?",
        type: 'choice',
        options: [
            { id: 'price', label: 'Lowest Price', icon: 'sell', desc: 'Best value for money' },
            { id: 'speed', label: 'Fastest Delivery', icon: 'bolt', desc: 'Speed is our soul' },
            { id: 'premium', label: 'Premium Quality', icon: 'verified', desc: 'Luxury & high standards' },
            { id: 'innovation', label: 'Unique Solution', icon: 'emergency_heat', desc: 'First of its kind' },
        ]
    },
    {
        key: 'industry',
        q: "Which industry are we Disrupting?",
        type: 'choice',
        options: [
            { id: 'tech', label: 'Technology', icon: 'memory', desc: 'AI, Software, Hardware' },
            { id: 'organic', label: 'Organic/Healthy', icon: 'nature', desc: 'Wellness, Food, Eco' },
            { id: 'retail', label: 'Retail/D2C', icon: 'shopping_bag', desc: 'Consumer brands' },
            { id: 'finance', label: 'FinTech', icon: 'payments', desc: 'Banking, Crypto, Tax' },
            { id: 'pharma', label: 'Healthcare/Pharma', icon: 'vaccines', desc: 'Medical & Wellness' },
        ]
    },
    {
        key: 'designTaste',
        q: "Pick your brand's aesthetic vibe.",
        type: 'choice',
        options: [
            { id: 'minimal', label: 'Sleek Minimal', icon: 'ink_eraser', desc: 'Apple-style clean' },
            { id: 'tech', label: 'High-Tech Dark', icon: 'dark_mode', desc: 'Futuristic dynamic' },
            { id: 'creative', label: 'Playful/Vibrant', icon: 'palette', desc: 'Friendly & colorful' },
            { id: 'corporate', label: 'Trust & Elite', icon: 'business_center', desc: 'Authority & scale' },
        ]
    },
];

const QUICK_MESSAGES = [
    "Suggest color palette", "Marketing gaps?", "Competitor analysis", "Suggest taglines"
];

const BRAND_TEMPLATES: Record<string, any> = {
    'organic': { colors: ['#2d5a27', '#f4fff1', '#88a07c'], fonts: 'Outfit, Playfair Display', vibe: 'Natural & Trustworthy' },
    'tech': { colors: ['#0073ea', '#f4f7fe', '#1c1f3b'], fonts: 'Inter, Roboto', vibe: 'Modern & Dynamic' },
    'minimal': { colors: ['#000000', '#ffffff', '#676879'], fonts: 'Montserrat, Helvetica', vibe: 'Clean & Elite' },
    'creative': { colors: ['#ff7b00', '#fff0e5', '#ff3d00'], fonts: 'Poppins, Fredoka', vibe: 'Playful & Vibrant' },
};

/* ── Solutions Question Flow ──────────────────────────── */
const SOLUTIONS_FLOW = [
    { key: 'problem', q: "What specific problem or bottleneck are you facing in your business right now?" },
    { key: 'goal', q: "What's the ideal outcome? What would solving this look like?" },
    { key: 'current', q: "What tools or processes are you currently using to handle this?" },
    { key: 'gaps', q: "Where are the biggest gaps or frustrations with your current approach?" },
    { key: 'build', q: "Got it. Based on everything you've told me, here's what I recommend building:" },
];

const LaunchPadTab: React.FC<LaunchPadTabProps> = ({ data, externalLang, onLangChange }) => {
    const { user } = useAuth();
    const { tasks, setIsVoiceActive, liveTranscript, setLiveTranscript } = useBizStore();
    const router = useRouter();
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || data?.name?.split(' ')[0] || 'Founder';

    const DEFAULT_SLIDES = [
      {
        id: 'hero',
        title: 'Cover Slide',
        subtitle: 'Slide 1',
        layout: 'hero',
        content: {
          heading: "Don't Just Start. Boot Up an OS.",
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

    const [deckSlides, setDeckSlides] = useState<any[]>(DEFAULT_SLIDES);
    const [activeDeckIdx, setActiveDeckIdx] = useState(0);
    const [deckTheme, setDeckTheme] = useState<'neon' | 'notion' | 'ocean'>('neon');
    const [isDeckGenerating, setIsDeckGenerating] = useState(false);
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [pitchDeckAsideWidth, setPitchDeckAsideWidth] = useState(350);
    const [isResizingPitchDeck, setIsResizingPitchDeck] = useState(false);
    const [showSlideTray, setShowSlideTray] = useState(false);
    const [showRightHistoryTray, setShowRightHistoryTray] = useState(false);
    const [pitchDeckType, setPitchDeckType] = useState<'investor' | 'sales' | 'partnership'>('investor');
    const [wizardLang, setWizardLang] = useState(externalLang || 'en-IN');
    const [isWizardActive, setIsWizardActive] = useState(true);
    const [wizardStep, setWizardStep] = useState<number>(1);
    const [wizardMode, setWizardMode] = useState<'form' | 'chat'>('form');
    const [pitchChat, setPitchChat] = useState<{ role: 'user' | 'assistant', text: string }[]>([
        { role: 'assistant', text: "Hi! I'm Arkle, your co-founder. Let's build your pitch deck together. Tell me about your business name and what you're building!" }
    ]);
    const [isChatResponding, setIsChatResponding] = useState(false);
    const [wizardInputs, setWizardInputs] = useState({
        businessName: '',
        idea: '',
        targetAudience: '',
        problem: '',
        solution: '',
        revenueModel: '',
        growthPlan: ''
    });

    const handlePrintDeck = async () => {
        if (!deckSlides || !deckSlides.length) return;

        setIsDeckGenerating(true);

        try {
            // Ensure all fonts are fully loaded before rendering
            await document.fonts.ready;

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'in',
                format: 'letter'
            });

            // Set up theme colors
            let bg = '#0A0A0A';
            let textColor = '#FFFFFF';
            let borderColor = 'rgba(255,255,255,0.1)';
            let accentColor = '#818cf8';
            let cardBg = 'rgba(255,255,255,0.03)';
            let cardBorder = 'rgba(255,255,255,0.08)';
            let bulletColor = '#818cf8';

            if (deckTheme === 'notion') {
                bg = '#FFFFFF';
                textColor = '#18181B';
                borderColor = 'rgba(24,24,27,0.1)';
                accentColor = '#4F46E5';
                cardBg = '#F4F4F5';
                cardBorder = 'rgba(24,24,27,0.08)';
                bulletColor = '#4F46E5';
            } else if (deckTheme === 'ocean') {
                bg = '#022c22';
                textColor = '#ECFDF5';
                borderColor = 'rgba(236,253,245,0.1)';
                accentColor = '#2dd4bf';
                cardBg = 'rgba(236,253,245,0.03)';
                cardBorder = 'rgba(236,253,245,0.08)';
                bulletColor = '#2dd4bf';
            }

            // Create temporary container directly in document.body to avoid inheritance issues
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'fixed';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            tempDiv.style.width = '1000px';
            tempDiv.style.height = '562.5px';
            document.body.appendChild(tempDiv);

            for (let i = 0; i < deckSlides.length; i++) {
                const slide = deckSlides[i];
                const pageNo = i + 1;

                let layoutHtml = '';

                if (slide.layout === 'hero') {
                    layoutHtml = `
                        <div style="width:1000px; height:562.5px; padding:50px; background:${bg}; color:${textColor}; font-family:system-ui, -apple-system, sans-serif; position:relative; box-sizing:border-box; letter-spacing:0.1px;">
                            <!-- Header -->
                            <div style="position:absolute; top:40px; left:50px; right:50px; border-bottom:1px solid ${borderColor}; padding-bottom:10px;">
                                <span style="font-size:14px; font-weight:bold; float:left; text-transform:uppercase;">${slide.title}</span>
                                <span style="font-size:14px; float:right;">${slide.subtitle}</span>
                                <div style="clear:both;"></div>
                            </div>
                            <!-- Content -->
                            <div style="position:absolute; top:110px; bottom:100px; left:50px; right:50px; text-align:center; padding-top:60px;">
                                <h1 style="font-size:38px; font-weight:900; line-height:1.3; margin:0 0 20px 0; color:${accentColor};">${slide.content.heading}</h1>
                                <p style="font-size:16px; opacity:0.8; line-height:1.6; max-width:800px; margin:0 auto;">${slide.content.body || ''}</p>
                            </div>
                            <!-- Footer -->
                            <div style="position:absolute; bottom:40px; left:50px; right:50px; border-top:1px solid ${borderColor}; padding-top:10px;">
                                <span style="font-size:12px; opacity:0.6; float:left;">SETMYBIZZ BIZOS CREATOR</span>
                                <span style="font-size:12px; opacity:0.6; float:right;">Page ${pageNo} of ${deckSlides.length}</span>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                    `;
                } else if (slide.layout === 'two-column') {
                    const bulletsHtml = (slide.content.bullets || []).map((bullet: string) => `
                        <div style="margin-bottom:15px; padding:15px 20px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:12px; font-size:13px; line-height:1.5; text-align:left; box-sizing:border-box;">
                            <span style="color:${bulletColor}; font-weight:bold; margin-right:8px;">•</span>
                            <span style="opacity:0.9;">${bullet}</span>
                        </div>
                    `).join('');

                    layoutHtml = `
                        <div style="width:1000px; height:562.5px; padding:50px; background:${bg}; color:${textColor}; font-family:system-ui, -apple-system, sans-serif; position:relative; box-sizing:border-box; letter-spacing:0.1px;">
                            <!-- Header -->
                            <div style="position:absolute; top:40px; left:50px; right:50px; border-bottom:1px solid ${borderColor}; padding-bottom:10px;">
                                <span style="font-size:14px; font-weight:bold; float:left; text-transform:uppercase;">${slide.title}</span>
                                <span style="font-size:14px; float:right;">${slide.subtitle}</span>
                                <div style="clear:both;"></div>
                            </div>
                            <!-- Columns -->
                            <div style="position:absolute; top:110px; bottom:100px; left:50px; right:50px;">
                                <div style="width:500px; float:left; padding-top:40px; padding-right:30px; box-sizing:border-box; text-align:left;">
                                    <h2 style="font-size:28px; font-weight:800; line-height:1.3; margin:0 0 20px 0; color:${accentColor};">${slide.content.heading}</h2>
                                    <p style="font-size:14px; opacity:0.8; line-height:1.6; margin:0;">${slide.content.body || ''}</p>
                                </div>
                                <div style="width:400px; float:right; padding-top:10px; box-sizing:border-box;">
                                    ${bulletsHtml}
                                </div>
                                <div style="clear:both;"></div>
                            </div>
                            <!-- Footer -->
                            <div style="position:absolute; bottom:40px; left:50px; right:50px; border-top:1px solid ${borderColor}; padding-top:10px;">
                                <span style="font-size:12px; opacity:0.6; float:left;">SETMYBIZZ BIZOS CREATOR</span>
                                <span style="font-size:12px; opacity:0.6; float:right;">Page ${pageNo} of ${deckSlides.length}</span>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                    `;
                } else if (slide.layout === 'traction') {
                    const stats = slide.content.stats || slide.content.metrics || [];
                    const statsHtml = stats.map((s: any, idx: number) => `
                        <div style="width:280px; float:left; margin-right:${idx === 2 ? '0px' : '30px'}; padding:25px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:16px; box-sizing:border-box;">
                            <div style="font-size:32px; font-weight:950; color:${accentColor}; margin-bottom:8px; line-height:1;">${s.value || s.val}</div>
                            <div style="font-size:11px; font-weight:bold; opacity:0.7; text-transform:uppercase; margin-bottom:5px;">${s.label}</div>
                            <div style="font-size:10px; opacity:0.5; line-height:1.4;">${s.desc || ''}</div>
                        </div>
                    `).join('');

                    layoutHtml = `
                        <div style="width:1000px; height:562.5px; padding:50px; background:${bg}; color:${textColor}; font-family:system-ui, -apple-system, sans-serif; position:relative; box-sizing:border-box; letter-spacing:0.1px;">
                            <!-- Header -->
                            <div style="position:absolute; top:40px; left:50px; right:50px; border-bottom:1px solid ${borderColor}; padding-bottom:10px;">
                                <span style="font-size:14px; font-weight:bold; float:left; text-transform:uppercase;">${slide.title}</span>
                                <span style="font-size:14px; float:right;">${slide.subtitle}</span>
                                <div style="clear:both;"></div>
                            </div>
                            <!-- Content -->
                            <div style="position:absolute; top:110px; bottom:100px; left:50px; right:50px; text-align:center;">
                                <h2 style="font-size:26px; font-weight:800; margin:0 0 35px 0; color:${accentColor};">${slide.content.heading}</h2>
                                <div style="width:900px; margin:0 auto;">
                                    ${statsHtml}
                                    <div style="clear:both;"></div>
                                </div>
                            </div>
                            <!-- Footer -->
                            <div style="position:absolute; bottom:40px; left:50px; right:50px; border-top:1px solid ${borderColor}; padding-top:10px;">
                                <span style="font-size:12px; opacity:0.6; float:left;">SETMYBIZZ BIZOS CREATOR</span>
                                <span style="font-size:12px; opacity:0.6; float:right;">Page ${pageNo} of ${deckSlides.length}</span>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                    `;
                } else if (slide.layout === 'matrix') {
                    const competitors = slide.content.competitors || slide.content.matrix || [];
                    const rowsHtml = competitors.map((c: any) => `
                        <tr style="border-bottom:1px solid ${cardBorder};">
                            <td style="text-align:left; padding:12px 10px; font-weight:bold; color:${textColor};">${c.name || c.competitor}</td>
                            <td style="padding:12px 10px; opacity:0.8;">${c.easy || ''}</td>
                            <td style="padding:12px 10px; opacity:0.8;">${c.tech || ''}</td>
                            <td style="padding:12px 10px; font-weight:bold; color:${accentColor};">${c.price || ''}</td>
                        </tr>
                    `).join('');

                    layoutHtml = `
                        <div style="width:1000px; height:562.5px; padding:50px; background:${bg}; color:${textColor}; font-family:system-ui, -apple-system, sans-serif; position:relative; box-sizing:border-box; letter-spacing:0.1px;">
                            <!-- Header -->
                            <div style="position:absolute; top:40px; left:50px; right:50px; border-bottom:1px solid ${borderColor}; padding-bottom:10px;">
                                <span style="font-size:14px; font-weight:bold; float:left; text-transform:uppercase;">${slide.title}</span>
                                <span style="font-size:14px; float:right;">${slide.subtitle}</span>
                                <div style="clear:both;"></div>
                            </div>
                            <!-- Content -->
                            <div style="position:absolute; top:110px; bottom:100px; left:50px; right:50px;">
                                <h2 style="font-size:24px; font-weight:800; text-align:center; margin:0 0 25px 0; color:${accentColor};">${slide.content.heading}</h2>
                                <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px; color:${textColor};">
                                    <thead>
                                        <tr style="border-bottom:1px solid ${borderColor};">
                                            <th style="text-align:left; padding:10px; opacity:0.6;">Competitor</th>
                                            <th style="padding:10px; opacity:0.6;">Simplicity</th>
                                            <th style="padding:10px; opacity:0.6;">AI Integration</th>
                                            <th style="padding:10px; opacity:0.6;">Pricing</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${rowsHtml}
                                    </tbody>
                                </table>
                            </div>
                            <!-- Footer -->
                            <div style="position:absolute; bottom:40px; left:50px; right:50px; border-top:1px solid ${borderColor}; padding-top:10px;">
                                <span style="font-size:12px; opacity:0.6; float:left;">SETMYBIZZ BIZOS CREATOR</span>
                                <span style="font-size:12px; opacity:0.6; float:right;">Page ${pageNo} of ${deckSlides.length}</span>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                    `;
                }

                tempDiv.innerHTML = layoutHtml;

                const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
                    scale: 2.0, // High definition capture!
                    useCORS: true,
                    backgroundColor: bg,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.98);

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, 11, 8.5);
            }

            // Cleanup
            document.body.removeChild(tempDiv);

            const name = (wizardInputs.businessName || 'SetMyBizz').replace(/\s+/g, '_');
            pdf.save(`${name}_Pitch_Deck.pdf`);

        } catch (err) {
            console.error("Local multi-page PDF render failed:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDeckGenerating(false);
        }
    };

    /* ── State ─────────────────────────────────────────── */
    const [selectedLauncherTool, setSelectedLauncherTool] = useState<any>(null);
    const [topTab, setTopTab] = useState<TopTab>('launcher');
    /* ── Master Theme Configuration (Mood Colors - DETAILED RESTORATION) ── */
    const themes: any = {
        arkle: {
            primary: '#0082ff',
            secondary: '#3b82f6',
            glow: 'rgba(0, 130, 255, 0.4)',
            bgBase: '#ffffff',
            meshColor1: 'rgba(219, 234, 254, 0.3)',
            meshColor2: 'rgba(239, 246, 255, 0.2)',
            accent: 'bg-gradient-to-r from-blue-600 to-cyan-500',
            text: 'text-[#0082ff]',
            border: 'border-blue-500/10'
        },
        launcher: {
            primary: '#10b981',
            secondary: '#059669',
            glow: 'rgba(16, 185, 129, 0.4)',
            bgBase: '#ffffff',
            meshColor1: 'rgba(209, 250, 229, 0.3)',
            meshColor2: 'rgba(236, 253, 245, 0.2)',
            accent: 'bg-gradient-to-r from-emerald-600 to-teal-500',
            text: 'text-emerald-600',
            border: 'border-emerald-500/10'
        },
        'tool-lab': {
            primary: '#a855f7',
            secondary: '#9333ea',
            glow: 'rgba(168, 85, 247, 0.4)',
            bgBase: '#ffffff',
            meshColor1: 'rgba(243, 232, 255, 0.3)',
            meshColor2: 'rgba(250, 245, 255, 0.2)',
            accent: 'bg-gradient-to-r from-purple-600 to-pink-500',
            text: 'text-purple-600',
            border: 'border-purple-500/10'
        },
        agents: {
            primary: '#f59e0b',
            secondary: '#d97706',
            glow: 'rgba(245, 158, 11, 0.4)',
            bgBase: '#ffffff',
            meshColor1: 'rgba(254, 243, 199, 0.3)',
            meshColor2: 'rgba(255, 251, 235, 0.2)',
            accent: 'bg-gradient-to-r from-amber-500 to-orange-400',
            text: 'text-amber-600',
            border: 'border-amber-500/10'
        }
    };
    const theme = themes[topTab] || themes.arkle;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        setIsMounted(true); 
        setLiveTranscript('');
        setPromptInput('');
    }, []);

    const [appState, setAppState] = useState<AppState>('home');
    const [promptInput, setPromptInput] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Tab-Specific Animated Words
    const [wordIndex, setWordIndex] = useState(0);
    const tabWords: Record<string, string[]> = {
        arkle: ['Ideas', 'Tasks', 'Goals', 'Challenges', 'Gaps', 'Context'],
        launcher: ['Launch', 'Build', 'Design', 'Scale', 'Venture', 'Brand'],
        'tool-lab': ['Tool', 'App', 'Idea', 'CRM', 'Automation', 'Solution'],
        agents: ['Employee', 'Expert', 'Worker', 'Assistant', 'Specialist']
    };
    const currentWords = tabWords[topTab] || tabWords.arkle;

    useEffect(() => {
        setWordIndex(0); // Reset index on tab change to avoid out-of-bounds
    }, [topTab]);

    useEffect(() => {
        if (!isMounted) return;
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % currentWords.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [currentWords.length, isMounted]);
    const [agentTaskInput, setAgentTaskInput] = useState('');
    const [agentTasks, setAgentTasks] = useState<any[]>([]);
    const [isAgentWorking, setIsAgentWorking] = useState(false);

    // Onboarding & Discovery
    const [isSetupLocked, setIsSetupLocked] = useState(false);
    const [setupStep, setSetupStep] = useState(0);
    const [magicProgress, setMagicProgress] = useState(0);
    const [isMagicLoading, setIsMagicLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const [isTrayExpanded, setIsTrayExpanded] = useState(false);
    const [forgeMode, setForgeMode] = useState<'launcher' | 'pure-creation' | 'quick-template' | 'predictive'>('launcher');
    const [forgeStep, setForgeStep] = useState(0);
    const forgeSteps = ["Neural Architecting", "Generating Codebase", "Structuring Database", "Styling UI/UX", "Deploying Prototype"];

    // Forge Workspace State
    const [forgeStatus, setForgeStatus] = useState<'idle' | 'planning' | 'generating' | 'previewing' | 'refining'>('idle');
    const [forgeFiles, setForgeFiles] = useState<{ name: string; path: string; code: string; lang: string; icon: string }[]>([]);
    const [activeForgeFile, setActiveForgeFile] = useState('app/page.tsx');
    const [forgeChat, setForgeChat] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
    const [forgeChatInput, setForgeChatInput] = useState('');
    const [forgePlan, setForgePlan] = useState<{ name: string; desc: string; pages: string[]; stack: string[] }>({ name: '', desc: '', pages: [], stack: [] });
    const [forgeTerminalLogs, setForgeTerminalLogs] = useState<string[]>([]);
    const [forgeViewMode, setForgeViewMode] = useState<'code' | 'preview' | 'split'>('split');
    const [forgePreviewHtml, setForgePreviewHtml] = useState('');
    const [forgeProjectName, setForgeProjectName] = useState('');
    const [forgeSaved, setForgeSaved] = useState(false);
    const [forgeVoiceActive, setForgeVoiceActive] = useState(false);
    const [showProjectLibrary, setShowProjectLibrary] = useState(false);
    const [selectedAIModel, setSelectedAIModel] = useState<'gemini' | 'gpt4' | 'claude' | 'dummy'>('dummy');
    const [forgeSplitPercent, setForgeSplitPercent] = useState(50);
    const [forgeChatWidth, setForgeChatWidth] = useState(380);
    const [isResizingForge, setIsResizingForge] = useState(false);
    const [isResizingChat, setIsResizingChat] = useState(false);
    const [showIdeHeader, setShowIdeHeader] = useState(true);
    const forgeEndRef = useRef<HTMLDivElement>(null);
    const forgeIframeRef = useRef<HTMLIFrameElement>(null);
    const forgeVoiceRef = useRef<any>(null);

    /* ── RE-SIZE LOGIC FOR FORGE IDE ── */
    useEffect(() => {
        const handleResize = (e: MouseEvent) => {
            if (isResizingForge) {
                const newPercent = (e.clientX - forgeChatWidth) / (window.innerWidth - forgeChatWidth) * 100;
                if (newPercent > 10 && newPercent < 90) setForgeSplitPercent(newPercent);
            }
            if (isResizingChat) {
                const newWidth = e.clientX;
                if (newWidth > 200 && newWidth < 800) setForgeChatWidth(newWidth);
            }
            if (isResizingPitchDeck) {
                const newWidth = e.clientX;
                if (newWidth > 250 && newWidth < 600) setPitchDeckAsideWidth(newWidth);
            }
        };

        const stopResize = () => {
            setIsResizingForge(false);
            setIsResizingChat(false);
            setIsResizingPitchDeck(false);
        };

        if (isResizingForge || isResizingChat || isResizingPitchDeck) {
            window.addEventListener('mousemove', handleResize);
            window.addEventListener('mouseup', stopResize);
        }

        return () => {
            window.removeEventListener('mousemove', handleResize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizingForge, isResizingChat, isResizingPitchDeck, forgeChatWidth]);

    // Sticker Animations
    const [toolIndex, setToolIndex] = useState(0);
    const toolWords = ["app", "tool", "Automation", "solution"];

    useEffect(() => {
        const interval = setInterval(() => {
            setToolIndex((prev) => (prev + 1) % toolWords.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Business context collected from Co-Founder discussion
    const [bizCtx, setBizCtx] = useState<BusinessContext>({
        businessName: '', idea: '', stage: '', type: '',
        industry: '', techLevel: '', brandVoice: '', designTaste: '', struggles: '',
        colors: [], fonts: '', audience: '', model: '', usp: '', commitment: '', services: []
    });

    const [showDiscovery, setShowDiscovery] = useState(false);
    const [discoveryStep, setDiscoveryStep] = useState(0);
    const selectedLang = externalLang || 'en-IN';
    const setSelectedLang = onLangChange || (() => { });
    const isVoiceActive = useBizStore((state) => state.isVoiceActive);
    const lastVoiceCommand = useBizStore((state) => state.lastVoiceCommand);
    const setLastVoiceCommand = useBizStore((state) => state.setLastVoiceCommand);

    // ── Global Voice Bridge ──
    useEffect(() => {
        if (lastVoiceCommand) {
            const isCreationCmd = /build|create|generate|setup|make/i.test(lastVoiceCommand);
            
            if (isCreationCmd) {
                console.log("Global Build Command Detected:", lastVoiceCommand);
                // Force switch to forge mode if it's a build request
                setAppState('forge');
                setForgeStatus('planning');
                handleForgeChatSubmit(lastVoiceCommand);
                setLastVoiceCommand(null);
                return;
            }

            if (topTab === 'arkle') {
                console.log("LaunchPad responding to global voice:", lastVoiceCommand);
                handleForgeChatSubmit(lastVoiceCommand);
                setLastVoiceCommand(null);
            }
        }
    }, [lastVoiceCommand, topTab, setLastVoiceCommand, appState]);

    // Discussion chat
    const [chatThread, setChatThread] = useState<ChatMsg[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [discussStep, setDiscussStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    // Fetch Existing Profile
    useEffect(() => {
        if (user?.id) {
            fetch(`/api/business-profile?userId=${user.id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.profile) {
                        setBizCtx(data.profile);
                        setShowWelcome(false);
                    } else {
                        setShowWelcome(false);
                    }
                });
        }
    }, [user]);

    // Force Onboarding Logic
    useEffect(() => {
        if (!bizCtx.businessName && appState === 'home' && user?.id) {
            // Check again after fetch
            const timer = setTimeout(() => {
                if (!bizCtx.businessName) setShowWelcome(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [bizCtx.businessName, appState, user]);

    // Solutions chat
    const [solThread, setSolThread] = useState<ChatMsg[]>([]);
    const [solInput, setSolInput] = useState('');
    const [solStep, setSolStep] = useState(0);
    const [solContext, setSolContext] = useState<Record<string, string>>({});

    // Service selection
    const [selectedServices, setSelectedServices] = useState<string[]>(['logo', 'website', 'pitchdeck']);

    // Building & Ready
    const [builtAssets, setBuiltAssets] = useState<BuiltAsset[]>([]);
    const [buildProgress, setBuildProgress] = useState(0);
    const [viewingAsset, setViewingAsset] = useState<BuiltAsset | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const solEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const launcherWords = currentWords;

    /* ── Voice Synthesis (Arkle Talking) ──────────────── */
    const speak = (text: string, langOverride?: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Dynamic Voice Selection
        const voices = window.speechSynthesis.getVoices();
        const targetLang = langOverride || selectedLang;

        const preferredVoice = voices.find(v => v.lang.startsWith(targetLang) && v.name.includes('Neural')) ||
            voices.find(v => v.lang.startsWith(targetLang)) ||
            voices.find(v => v.lang.startsWith('en-IN'));

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
    };

    // Auto-speak new AI messages
    useEffect(() => {
        if (appState === 'discuss' && chatThread.length > 0) {
            const lastMsg = chatThread[chatThread.length - 1];
            if (lastMsg.role === 'ai') speak(lastMsg.text);
        } else if (appState === 'solutions-chat' && solThread.length > 0) {
            const lastMsg = solThread[solThread.length - 1];
            if (lastMsg.role === 'ai') speak(lastMsg.text);
        }
    }, [chatThread, solThread, appState]);

    /* ── Voice Recognition Setup ──────────────────────── */
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = selectedLang; // Dynamic language support

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    let isFinal = false;
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                        if (event.results[i].isFinal) isFinal = true;
                    }

                    setLiveTranscript(transcript);

                    // Auto-fill inputs
                    if (appState === 'home') setPromptInput(transcript);
                    else if (appState === 'discuss') setChatInput(transcript);
                    else if (appState === 'solutions-chat') setSolInput(transcript);
                    else if (appState === 'agent-workspace') setAgentTaskInput(transcript);

                    if (isFinal) {
                        setLiveTranscript('');
                        setIsRecording(false);
                        // For discovery modal, we handle it specially
                        setTimeout(() => {
                            if (appState === 'discuss') handleDiscussSubmit();
                            else if (appState === 'solutions-chat') handleSolSubmit();
                            else if (appState === 'agent-workspace') {
                                handleAgentTaskSubmit(transcript);
                            }
                        }, 500);
                    }
                };

                recognition.onerror = () => { setIsRecording(false); setLiveTranscript(''); };
                recognition.onend = () => { if (isVoiceActive && !showDiscovery) setIsRecording(false); };
                recognitionRef.current = recognition;
            }
        }
    }, [appState, selectedLang, showDiscovery]); // Re-init on language change

    const toggleVoice = () => {
        if (!recognitionRef.current) return alert("Your browser doesn't support live voice.");
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setLiveTranscript(''); // Clear transcript on stop
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const toggleVoiceStudio = () => setIsVoiceActive(!isVoiceActive);
    const showVoiceStudio = isVoiceActive;

    /* ── Auto-scroll ───────────────────────────────────── */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatThread, isTyping]);

    useEffect(() => {
        solEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [solThread]);

    /* ── Co-Founder Discussion Logic ──────────────────── */
    const startDiscussion = () => {
        setAppState('discuss');
        setDiscussStep(0);
        setChatThread([
            { role: 'ai', text: `Hey ${firstName}! I'm your AI Co-Founder. Let me know how I can help with your strategy or current challenges. 🚀`, ts: Date.now() },
            { role: 'ai', text: "What's on your mind regarding your startup?", ts: Date.now() + 100 },
        ]);
    };

    const handleDiscussSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const input = chatInput.trim();
        if (!input) return;

        setChatThread(prev => [...prev, { role: 'user', text: input, ts: Date.now() }]);
        setChatInput('');
        setIsTyping(true);

        const aiResponse = await callAI(input, `Industry: ${bizCtx.industry}, Stage: ${bizCtx.stage}`);
        if (aiResponse) {
            setChatThread(prev => [...prev, { role: 'ai', text: aiResponse, ts: Date.now() }]);
        }
        setIsTyping(false);
    };

    const callAI = useCallback(async (message: string, context: string = '') => {
        try {
            const res = await fetch('/api/ai-cofounder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    businessProfile: data,
                    conversationHistory: chatThread.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
                    mode: 'deep',
                    chatName: 'LaunchPad Discussion',
                    // Use latest model if configured, e.g., 'gemini-pro'
                    model: process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-3.5-turbo',
                }),
            });
            const json = await res.json();
            return json.response || json.error || "I'm processing your request...";
        } catch {
            return null; // Fallback to scripted flow
        }
    }, [chatThread, data]);


    const WelcomeModal = () => {
        if (!showWelcome || isSetupLocked) return null;
        return (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6 animate-in fade-in duration-1000">
                <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden p-12 text-center relative">
                    {/* Horizontal Category Scroller with Navigation Arrows */}
                    <div className="max-w-[1200px] mx-auto mb-12 px-10 overflow-visible relative group/scroller">
                        {/* Left Scroll Button */}
                        <button
                            type="button"
                            onClick={() => {
                                const el = document.getElementById('launcher-scroller');
                                if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all z-30 opacity-0 group-hover/scroller:opacity-100 hover:scale-110 active:scale-95"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        <div id="launcher-scroller" className="flex items-center gap-4 overflow-x-auto pb-6 px-4 no-scrollbar scroll-smooth">
                            {LAUNCHER_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedLauncherTool(cat)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-3 p-5 rounded-[28px] transition-all duration-500 relative group w-[130px] ${selectedLauncherTool?.id === cat.id
                                        ? 'bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] scale-105 z-10 border border-slate-100'
                                        : 'hover:bg-white/50 hover:translate-y-[-2px]'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-md group-hover:rotate-3 transition-transform duration-500`}>
                                        <span className="material-symbols-outlined text-[30px]">{cat.icon}</span>
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest text-center ${selectedLauncherTool?.id === cat.id ? 'text-slate-900' : 'text-slate-400'}`}>{cat.label}</span>
                                    {selectedLauncherTool?.id === cat.id && (
                                        <motion.div layoutId="activeCat" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Right Scroll Button */}
                        <button
                            type="button"
                            onClick={() => {
                                const el = document.getElementById('launcher-scroller');
                                if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all z-30 opacity-0 group-hover/scroller:opacity-100 hover:scale-110 active:scale-95"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    <div className="w-24 h-24 bg-gradient-to-tr from-sky-600 to-blue-700 rounded-[32px] mx-auto mb-10 flex items-center justify-center shadow-2xl shadow-sky-500/30">
                        <span className="material-symbols-outlined text-white text-[48px] animate-pulse">psychology</span>
                    </div>

                    <h1 className="text-[42px] font-medium text-slate-900 mb-4 leading-tight tracking-tight">Hi {firstName},</h1>
                    <p className="text-[20px] text-slate-500 mb-12 leading-relaxed">Let's build your entire startup in minutes. Just answer a few questions to sync your business brain.</p>

                    <button
                        onClick={() => {
                            setIsSetupLocked(true);
                            setShowWelcome(false);
                        }}
                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[18px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
                    >
                        Begin Startup Journey
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        );
    };

    const DiscoveryWizard = () => {
        if (!isSetupLocked) return null;
        const steps = [
            { key: 'stage', q: "What's your business stage?", options: ['Idea Phase', 'MVP Ready', 'Launched', 'Scaling'] },
            { key: 'size', q: "What's your team size?", options: ['Solo Founder', '2-5 People', '10+ Team', 'Enterprise'] },
            { key: 'type', q: "Are you building a...", options: ['Product', 'Service', 'Manufacturing', 'Marketplace'] },
            { key: 'industry', q: "Which industry are you in?", options: ['Tech & SaaS', 'Retail & D2C', 'Healthcare', 'Fintech', 'Other'] }
        ];

        const current = steps[setupStep];

        return (
            <div className="fixed inset-0 z-[180] bg-white flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-10 duration-700">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-12">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Step {setupStep + 1} of {steps.length + 1}</span>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-8 h-1 rounded-full ${i <= setupStep ? 'bg-sky-500' : 'bg-slate-100'}`}></div>
                            ))}
                        </div>
                    </div>

                    <h1 className="text-[36px] font-medium text-slate-900 leading-tight mb-10">{current?.q || "Tell me more about your startup"}</h1>

                    {setupStep < steps.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {current.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setBizCtx(prev => ({ ...prev, [current.key]: opt }));
                                        setSetupStep(prev => prev + 1);
                                    }}
                                    className="px-8 py-5 border-2 border-slate-50 bg-slate-50/50 hover:border-sky-500 hover:bg-white rounded-3xl text-left transition-all group"
                                >
                                    <span className="text-[18px] font-bold text-slate-800 group-hover:text-sky-600">{opt}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <textarea
                                className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-50 rounded-[32px] outline-none focus:border-sky-500 transition-all text-[18px] font-medium"
                                placeholder="Describe your vision, goals, and what you want Arkle to build..."
                                value={bizCtx.idea}
                                onChange={(e) => setBizCtx(prev => ({ ...prev, idea: e.target.value }))}
                            />
                            <button
                                onClick={() => {
                                    setIsMagicLoading(true);
                                    let p = 0;
                                    const t = setInterval(() => {
                                        p += 1;
                                        setMagicProgress(p);
                                        if (p >= 100) {
                                            clearInterval(t);
                                            setIsSetupLocked(false);
                                            setIsMagicLoading(false);
                                            setAppState('home');
                                            speak(`Welcome, Founder. Your business brain is now synchronized. Let's build.`);
                                        }
                                    }, 40);
                                }}
                                className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[18px] font-black uppercase tracking-widest hover:scale-[0.98] transition-all shadow-2xl"
                            >
                                Finalize Brain Setup
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const MagicLoading = () => {
        if (!isMagicLoading) return null;
        return (
            <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
                <div className="w-full max-w-lg text-center">
                    <div className="relative w-48 h-48 mx-auto mb-12">
                        <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-xl">
                            <span className="material-symbols-outlined text-white text-[64px] animate-pulse">psychology</span>
                        </div>
                    </div>

                    <h2 className="text-white text-[28px] font-black uppercase tracking-tighter mb-4">Arkle is Building...</h2>
                    <p className="text-sky-300/60 text-[14px] uppercase tracking-[0.3em] mb-12">Generating Your Startup Ecosystem</p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[
                            { label: 'Neural Logo', delay: 5 },
                            { label: 'Responsive Website', delay: 15 },
                            { label: 'E-commerce Store', delay: 25 },
                            { label: 'Page Content', delay: 35 },
                            { label: 'Product Images', delay: 45 },
                            { label: 'SEO Optimization', delay: 55 },
                            { label: 'Brochure Design', delay: 65 },
                            { label: 'Digital Cards', delay: 75 },
                            { label: 'Pitch Deck AI', delay: 85 },
                            { label: 'Legal Drafting', delay: 95 }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 transition-all duration-300">
                                <span className={`material-symbols-outlined text-[18px] ${magicProgress > item.delay ? 'text-emerald-500' : 'text-white/20'}`}>
                                    {magicProgress > item.delay ? 'check_circle' : 'pending'}
                                </span>
                                <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    /* ── Solutions Discussion Logic ────────────────────── */
    const startSolutionsChat = () => {
        setAppState('solutions-chat');
        setSolStep(0);
        setSolThread([
            { role: 'ai', text: `Hey ${firstName}, welcome to Solutions Lab. I'll analyze your business challenges and help you build the right tools. Let's start:`, ts: Date.now() },
            { role: 'ai', text: SOLUTIONS_FLOW[0].q, ts: Date.now() + 100 },
        ]);
    };

    const handleSolSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const input = solInput.trim();
        if (!input) return;

        setSolThread(prev => [...prev, { role: 'user', text: input, ts: Date.now() }]);
        setSolInput('');

        const currentKey = SOLUTIONS_FLOW[solStep]?.key;
        if (currentKey) {
            setSolContext(prev => ({ ...prev, [currentKey]: input }));
        }

        const nextStep = solStep + 1;

        setTimeout(async () => {
            if (nextStep < SOLUTIONS_FLOW.length - 1) {
                setSolThread(prev => [...prev, { role: 'ai', text: SOLUTIONS_FLOW[nextStep].q, ts: Date.now() }]);
                setSolStep(nextStep);
            } else {
                // Final recommendation
                const recommendation = `Based on your analysis:\n\n**Problem**: ${solContext.problem || input}\n**Gap**: ${solContext.gaps || 'Manual processes'}\n\nI recommend building:\n\n🛠️ **Custom CRM Dashboard** — Track leads & conversions\n🤖 **AI Automation Agent** — Auto-follow-up sequences\n📊 **Performance Tracker** — Real-time business analytics\n\nShall I start building these solutions for you?`;

                setSolThread(prev => [...prev, { role: 'ai', text: recommendation, ts: Date.now() }]);
                setSolStep(nextStep);
            }
        }, 800);
    };

    /* ── Building Engine ──────────────────────────────── */
    const startBuilding = async () => {
        setAppState('building');
        setBuildProgress(0);

        const assets: BuiltAsset[] = selectedServices.map(id => {
            const svc = SERVICES.find(s => s.id === id)!;
            return { id: svc.id, label: svc.label, icon: svc.icon, status: 'pending', color: svc.color };
        });

        setBuiltAssets(assets);

        let completed = 0;

        for (let i = 0; i < assets.length; i++) {
            const currentAsset = assets[i];

            // Mark as building
            setBuiltAssets(prev => prev.map(a =>
                a.id === currentAsset.id ? { ...a, status: 'building' } : a
            ));

            try {
                const res = await fetch('/api/generate-asset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assetType: currentAsset.id, context: bizCtx })
                });

                const data = await res.json();

                if (data.success && data.result) {
                    setBuiltAssets(prev => prev.map(a =>
                        a.id === currentAsset.id ? { ...a, status: 'done', result: data.result } : a
                    ));
                } else {
                    setBuiltAssets(prev => prev.map(a =>
                        a.id === currentAsset.id ? { ...a, status: 'failed' } : a
                    ));
                }
            } catch (err) {
                setBuiltAssets(prev => prev.map(a =>
                    a.id === currentAsset.id ? { ...a, status: 'failed' } : a
                ));
            }

            completed++;
            setBuildProgress(Math.round((completed / assets.length) * 100));
        }

        setTimeout(() => {
            setAppState('ready');
            const successMsg = selectedLang === 'te-IN' ? "మీ అసెట్స్ అన్నీ సిద్ధమయ్యాయి!" : "All your assets are generated and ready to view!";
            speak(successMsg, selectedLang);
        }, 1000);
    };

    /* ── Direct submit from prompt ────────────────────── */
    const handleDirectSubmit = (cmdOverride?: string) => {
        const input = (cmdOverride || promptInput).trim();
        if (!input) return;

        if (selectedLauncherTool?.id === 'deck') {
            startPitchDeckGeneration(input);
            if (!cmdOverride) setPromptInput('');
            return;
        }

        if (topTab === 'launcher' || topTab === 'tool-lab') {
            startForging(input);
        } else {
            // Arkle mode — direct build
            startBuilding();
        }
        if (!cmdOverride) setPromptInput('');
    };

    /* ── Toggle service selection ──────────────────────── */
    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    /* ── Render: Chat thread (Neural Engine Design) ──────────────── */
    const renderChat = (
        thread: ChatMsg[],
        input: string,
        setInput: (v: string) => void,
        onSubmit: (e?: React.FormEvent) => void,
        endRef: React.RefObject<HTMLDivElement | null>,
        title: string
    ) => {

        return (
            <div className="max-w-3xl mx-auto h-full flex flex-col pt-4 px-4 animate-in fade-in duration-700 relative overflow-hidden">
                {/* Atmospheric Mode Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-64 blur-[120px] pointer-events-none opacity-40 transition-all duration-1000" style={{ backgroundColor: theme.primary }}></div>

                {/* Neural Grid Background (Tinted) */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none transition-all duration-1000"
                    style={{
                        backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}></div>

                {/* Advanced Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100/50 relative z-10">
                    <button onClick={() => setAppState('home')} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-xl hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">{title}</h2>
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-black text-slate-500 uppercase">Secure</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary, boxShadow: `0 0 8px ${theme.primary}` }}></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Neural Link Established</span>
                        </div>
                    </div>
                </div>

                {/* Intelligent Message Thread */}
                <div className="flex-1 overflow-y-auto pb-6 space-y-6 custom-scrollbar px-2 relative z-10">
                    {thread.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3 mt-1 shadow-lg shrink-0 scale-90" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                                    <span className="material-symbols-outlined text-[18px]">neurology</span>
                                </div>
                            )}
                            <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-[14px] leading-relaxed transition-all shadow-sm ${msg.role === 'user'
                                ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                                : 'bg-white/70 backdrop-blur-md border border-slate-100 text-slate-800 rounded-tl-none font-medium'
                                }`}
                                style={{ borderLeft: msg.role === 'ai' ? `3px solid ${theme.primary}44` : undefined }}
                            >
                                {msg.text}
                                {msg.role === 'ai' && (
                                    <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between opacity-40">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]" style={{ color: theme.primary }}>verified</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Neural Verified</span>
                                        </div>
                                        <span className="text-[9px] font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-3 ml-2 animate-pulse">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            </div>
                            <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-xl">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: theme.primary }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: theme.primary }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Universal Prompt Box Input Area */}
                <div className="pb-8 pt-2 relative z-10 w-full px-4 max-w-4xl mx-auto">
                    <form onSubmit={onSubmit} className="relative group bg-white/95 border border-slate-200/50 backdrop-blur-2xl rounded-[48px] shadow-2xl focus-within:border-blue-500/30 transition-all duration-500">
                        <textarea
                            value={isRecording && (appState === 'discuss' || appState === 'solutions-chat') && liveTranscript ? liveTranscript : input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent border-none outline-none text-[18px] font-medium text-slate-700 placeholder-slate-400 px-8 pt-4 pb-6 resize-none no-scrollbar"
                            rows={2}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'inherit';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSubmit();
                                }
                            }}
                        />

                        {/* Universal Task Bar */}
                        <div className="flex items-center justify-between px-6 pb-2">
                            <div className="flex items-center gap-3">
                                <button type="button" title="Upload / Add File" className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                                </button>
                                <select
                                    value={selectedAIModel}
                                    onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                    className="bg-transparent border border-slate-200/60 rounded-lg px-2.5 py-1 text-slate-600 text-[11px] font-semibold tracking-tight outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                                    title="Select AI Model"
                                >
                                    <option value="dummy">Dummy Model</option>
                                    <option value="gemini">Gemini 1.5 Pro</option>
                                    <option value="gemini-flash">Gemini 1.5 Flash</option>
                                    <option value="gpt4o">GPT-4o</option>
                                    <option value="gpt4-turbo">GPT-4 Turbo</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button type="button" onClick={toggleVoice} title="Voice Typing (Dictation)" className={`w-10 h-10 flex items-center justify-center transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-slate-700'}`}>
                                    <span className="material-symbols-outlined text-[24px]">mic</span>
                                </button>
                                <button type="button" onClick={() => setIsVoiceActive(true)} title="Live Voice Mode" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors mx-1">
                                    <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                                </button>
                                <button type="button" onClick={(e) => { e.preventDefault(); onSubmit(); }} title="Send (Enter)" className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">send</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    /* ── Render: Tool Lab (Modern Solutions) ───────────── */
    const renderToolLabUI = () => {
        return (
            <div className="flex flex-col items-center text-center max-w-6xl mx-auto py-20 px-8 relative z-10">
                <div className="mb-8 scale-110">
                    <span className={`px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border transition-all duration-500 bg-white/5 border-white/10`} style={{ color: theme.primary, boxShadow: `0 0 30px ${theme.glow}` }}>
                        System Architect Active
                    </span>
                </div>

                <h1 className="text-[64px] font-black text-slate-900 mb-6 leading-[0.95] uppercase tracking-tighter">
                    Hi {firstName}, <br />
                    <span className="text-slate-400">Forge Your</span> <span style={{ color: theme.primary, textShadow: `0 0 20px ${theme.glow}` }} className={`italic`}>Solution</span>
                </h1>

                <p className="text-slate-500 text-[18px] max-w-2xl mx-auto mb-16 font-medium leading-relaxed opacity-80">
                    Translate your vision into high-performance autonomous tools. <br />
                    <span className="text-slate-400 text-[13px] font-black uppercase tracking-widest mt-4 block">Arkle Pure Creation Engine v2.4</span>
                </p>

                {/* Build from Idea Card */}
                <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-[80px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] p-24 flex flex-col items-center relative overflow-hidden group backdrop-blur-3xl ring-1 ring-white/5">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
                    <div
                        className="absolute -top-40 -left-40 w-[500px] h-[500px] blur-[150px] rounded-full transition-all duration-1000 group-hover:scale-125"
                        style={{ backgroundColor: `${theme.primary}10` }}
                    ></div>

                    <div className={`w-28 h-28 rounded-[40px] bg-slate-50 border border-slate-100 flex items-center justify-center mb-12 shadow-sm relative z-10 group-hover:rotate-[10deg] transition-all duration-500`}>
                        <span className={`material-symbols-outlined text-[56px]`} style={{ color: theme.primary }}>architecture</span>
                    </div>

                    <h2 className="text-[72px] font-black text-slate-900 mb-8 tracking-tighter leading-none relative z-10">
                        Build from <span style={{ color: theme.primary, textShadow: `0 0 20px ${theme.glow}` }} className="italic">Idea.</span>
                    </h2>

                    <p className="text-[22px] text-slate-500 mb-16 max-w-2xl leading-relaxed font-bold relative z-10 opacity-90">
                        Zero templates. Pure neural generation. <br />
                        <span className="text-slate-400 text-[11px] uppercase tracking-[0.4em] font-black mt-4 block">Initialization ready for uplink</span>
                    </p>

                    <button
                        onClick={() => startForging("Build a high-performance autonomous tool/app for my startup.")}
                        className="group relative px-20 py-8 text-white rounded-[40px] font-black uppercase tracking-[0.2em] text-[16px] hover:scale-105 transition-all active:scale-95 z-10 overflow-hidden shadow-2xl"
                        style={{ backgroundColor: theme.primary, boxShadow: `0 30px 60px ${theme.glow}` }}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 flex items-center gap-4">
                            Initialize Forge
                            <span className="material-symbols-outlined">bolt</span>
                        </span>
                    </button>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 w-full text-left relative z-10">
                    <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[60px] shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all relative overflow-hidden group backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000"></div>
                        <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-4 text-white">
                            <span className="material-symbols-outlined text-[32px]" style={{ color: theme.primary }}>hub</span>
                            Connect Stack
                        </h3>
                        <p className="text-slate-500 text-sm mb-10 leading-relaxed font-bold">Link your critical startup tools to Arkle's neural orchestration engine.</p>
                        <div className="flex gap-6">
                            {['Stripe', 'Gmail', 'Twilio'].map(s => (
                                <div key={s} onClick={() => startForging(`Integrate ${s} API module into current workspace stack.`)} className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 hover:border-orange-500 transition-all cursor-pointer shadow-inner group/icon">
                                    <span className="material-symbols-outlined text-orange-500 text-[24px] group-hover/icon:scale-125 transition-transform" title={`Link ${s}`}>bolt</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 bg-slate-900/50 border border-white/5 rounded-[60px] shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000"></div>
                        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-4">
                            <span className="material-symbols-outlined text-[32px]" style={{ color: theme.primary }}>grid_view</span>
                            Hive Blueprints
                        </h3>
                        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-bold">Import battle-tested operational blueprints from other successful founders.</p>
                        <button onClick={() => startForging("Browse and import custom operational blueprints from marketplace collection.")} className="flex items-center gap-4 text-white text-[12px] font-black uppercase tracking-widest bg-white/10 px-8 py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10 active:scale-95 shadow-xl">
                            <span className="material-symbols-outlined text-[20px]">explore</span>
                            Browse Marketplace
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const startPitchDeckGeneration = async (inputPrompt: string) => {
        setSelectedLauncherTool({ id: 'deck', label: 'Pitch Deck Maker' });
        setForgeMode('pure-creation');
        setForgeStatus('generating');
        setIsDeckGenerating(true);
        setDeckSlides(DEFAULT_SLIDES);
        
        try {
            const res = await fetch('/api/launchpad/generate-pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: inputPrompt })
            });
            const data = await res.json();
            if (data.slides) {
                setDeckSlides(data.slides);
                setActiveDeckIdx(0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeckGenerating(false);
            setForgeStatus('previewing');
        }
    };

    const handlePitchChatSubmit = async (userMsgText: string) => {
        if (!userMsgText.trim()) return;
        
        const nextChatHistory = [...pitchChat, { role: 'user' as const, text: userMsgText }];
        setPitchChat(nextChatHistory);
        setPromptInput('');
        setIsChatResponding(true);
        setIsDeckGenerating(true);

        try {
            const res = await fetch('/api/launchpad/chat-pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userMsgText,
                    messages: nextChatHistory.map(m => ({ role: m.role, text: m.text })),
                    currentSlides: deckSlides,
                    wizardInputs: wizardInputs,
                    pitchDeckType: pitchDeckType
                })
            });
            const data = await res.json();
            if (data.text) {
                setPitchChat(prev => [...prev, { role: 'assistant', text: data.text }]);
            }
            if (data.slides) {
                setDeckSlides(data.slides);
            }
            if (data.wizardInputs) {
                setWizardInputs(data.wizardInputs);
            }
        } catch (err) {
            console.error(err);
            setPitchChat(prev => [...prev, { role: 'assistant', text: "I'm having a bit of trouble connecting to my neural core right now. Let's try again!" }]);
        } finally {
            setIsChatResponding(false);
            setIsDeckGenerating(false);
        }
    };

    /* ── Forge Engine: Start Building from Idea ──────── */
    const startForging = async (idea?: string) => {
        const userIdea = idea || promptInput.trim();
        if (!userIdea) return;

        setForgeMode('pure-creation');
        setForgeStatus('generating');
        setForgeStep(0);
        setForgeFiles([]);
        setForgePreviewHtml('');
        setForgeViewMode('split');
        const addLog = (msg: string) => setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        setForgeChat([{ role: 'user', text: userIdea }, { role: 'ai', text: `⚡ Arkle Brain Synced. Targeted Tool: ${selectedLauncherTool?.label || 'Custom Solution'}.\n\nInitiating Neural Materialization. Standby.` }]);
        setPromptInput('');

        addLog(`FORGE_START: Mode=${topTab.toUpperCase()}, Context=${bizCtx.businessName || 'New Project'}`);
        addLog('CODEGEN: Sending to AI Code Engine (Gemini Pro)...');

        try {
            const res = await fetch('/api/forge/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userIdea,
                    userId: user?.id,
                    toolId: selectedLauncherTool?.id || 'website',
                    mode: 'generate',
                    model: selectedAIModel,
                    businessContext: bizCtx,
                    projectType: 'webapp',
                }),
            });

            const data = await res.json();

            if (data.success && data.files && data.files.length > 0) {
                addLog(`CODEGEN: Received ${data.files.length} files from AI ✓`);

                // Animate file arrival
                data.files.forEach((file: any, i: number) => {
                    setTimeout(() => {
                        setForgeFiles(prev => [...prev, {
                            name: file.name,
                            path: file.path,
                            code: file.code,
                            lang: file.lang || 'html',
                            icon: file.lang === 'html' ? 'code' : file.lang === 'css' ? 'palette' : file.lang === 'javascript' || file.lang === 'js' ? 'javascript' : 'description'
                        }]);
                        setActiveForgeFile(file.path);
                        addLog(`WRITE: ${file.path} (${file.code.length} bytes) ✓`);

                        if (i === data.files.length - 1) {
                            // All files loaded — assemble preview
                            assemblePreview(data.files);
                            setForgeStatus('previewing');
                            setForgeStep(3);
                            addLog('BUILD: Compilation successful ✓');
                            addLog('PREVIEW: Live preview rendered ✓');
                            setForgeChat(prev => [...prev, {
                                role: 'ai',
                                text: `🚀 **Your app is live!**\n\n${data.plan?.desc || ''}\n\nI've generated **${data.files.length} files** with a complete, working interface.\n\n**Features:**\n${(data.plan?.features || []).map((f: string) => `• ${f}`).join('\n')}\n\nYou can:\n• View the **live preview** on the right\n• Edit code in the **editor**\n• Ask me to **refine** anything\n• **Download** the complete project`
                            }]);
                        }
                    }, i * 800);
                });
            } else {
                addLog(`CODEGEN_ERR: ${data.error || 'No files generated'}`);
                setForgeStatus('previewing');
                setForgeChat(prev => [...prev, { role: 'ai', text: `⚠️ I had trouble generating the full project. ${data.error || 'Please try rephrasing your request.'}\n\nTry being more specific about what you want to build.` }]);
            }
        } catch (err: any) {
            addLog(`NETWORK_ERR: ${err.message}`);
            setForgeStatus('previewing');
            setForgeChat(prev => [...prev, { role: 'ai', text: `⚠️ Connection error: ${err.message}\n\nPlease check your network and try again.` }]);
        }
    };

    // Assemble preview HTML from generated files
    const assemblePreview = (files: any[]) => {
        const htmlFile = files.find((f: any) => f.name?.endsWith('.html') || f.path?.endsWith('.html'));
        if (htmlFile) {
            // Find CSS and JS files to inject if not already inline
            let html = htmlFile.code;
            const cssFile = files.find((f: any) => f.lang === 'css' || f.name?.endsWith('.css'));
            const jsFile = files.find((f: any) => f.lang === 'javascript' || f.lang === 'js' || f.name?.endsWith('.js'));

            // Inject CSS if not already in the HTML
            if (cssFile && !html.includes(cssFile.code.slice(0, 50))) {
                html = html.replace('</head>', `<style>\n${cssFile.code}\n</style>\n</head>`);
            }
            // Inject JS if not already in the HTML
            if (jsFile && !html.includes(jsFile.code.slice(0, 50))) {
                html = html.replace('</body>', `<script>\n${jsFile.code}\n</script>\n</body>`);
            }
            setForgePreviewHtml(html);
        } else {
            // If no HTML file, create a wrapper
            const allCode = files.map((f: any) => `<!-- ${f.path} -->\n${f.code}`).join('\n\n');
            setForgePreviewHtml(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title></head><body><pre style="padding:20px;font-family:monospace;white-space:pre-wrap;">${allCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`);
        }
    };

    const handleForgeChatSubmit = async (msg?: string) => {
        const input = msg || forgeChatInput.trim();
        if (!input) return;

        setForgeChat(prev => [...prev, { role: 'user', text: input }]);
        setForgeChatInput('');

        const addLog = (msg: string) => setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

        if (forgeFiles.length === 0) {
            // No files yet — treat as a new build request
            startForging(input);
            return;
        }

        // Refinement mode — send existing files + refinement prompt to AI
        setForgeStatus('refining');
        setForgeChat(prev => [...prev, { role: 'ai', text: `🔧 Refining your app...\n\nProcessing: "${input}"` }]);
        addLog(`REFINE: Processing "${input.slice(0, 40)}..."`);

        try {
            const res = await fetch('/api/forge/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    mode: 'refine',
                    model: selectedAIModel,
                    existingFiles: forgeFiles,
                    businessContext: bizCtx,
                }),
            });

            const data = await res.json();

            if (data.success && data.files && data.files.length > 0) {
                addLog(`REFINE: Received ${data.files.length} updated files ✓`);

                // Update existing files or add new ones
                setForgeFiles(prev => {
                    const updated = [...prev];
                    data.files.forEach((newFile: any) => {
                        const existingIdx = updated.findIndex(f => f.path === newFile.path || f.name === newFile.name);
                        const fileObj = {
                            name: newFile.name,
                            path: newFile.path,
                            code: newFile.code,
                            lang: newFile.lang || 'html',
                            icon: newFile.lang === 'html' ? 'code' : newFile.lang === 'css' ? 'palette' : 'javascript'
                        };
                        if (existingIdx >= 0) {
                            updated[existingIdx] = fileObj;
                            addLog(`UPDATE: ${newFile.path} ✓`);
                        } else {
                            updated.push(fileObj);
                            addLog(`NEW_FILE: ${newFile.path} ✓`);
                        }
                    });
                    // Reassemble preview with updated files
                    setTimeout(() => assemblePreview(updated), 100);
                    return updated;
                });

                setForgeStatus('previewing');
                addLog('BUILD: Recompilation successful ✓');
                setForgeChat(prev => [...prev, { role: 'ai', text: `✅ **Done!** I've updated your app.\n\n${data.plan?.desc || 'Changes applied successfully.'}\n\nCheck the live preview to see the changes. Want to refine further?` }]);
            } else {
                // Fallback to chat-only response
                const chatResponse = await callAI(
                    `The user wants to modify their app. Request: "${input}". Describe what changes you would make in 2-3 sentences.`,
                    'forge-refine'
                );
                setForgeChat(prev => [...prev, { role: 'ai', text: chatResponse || "I understand your request. Let me work on those changes..." }]);
                setForgeStatus('previewing');
            }
        } catch (err: any) {
            addLog(`REFINE_ERR: ${err.message}`);
            setForgeStatus('previewing');
            setForgeChat(prev => [...prev, { role: 'ai', text: `⚠️ Refinement error. Please try again.` }]);
        }
    };

    // Download project as HTML file
    const downloadForgeProject = () => {
        if (forgeFiles.length === 0) return;

        // For a single-page app, download the assembled HTML
        const htmlContent = forgePreviewHtml || forgeFiles[0]?.code || '';
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${forgePlan.name || 'arkle-app'}.html`.replace(/\s+/g, '-').toLowerCase();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] EXPORT: Project downloaded ✓`]);
    };

    // Save project to localStorage
    const saveForgeProject = (files = forgeFiles, name = forgeProjectName) => {
        if (files.length === 0) return;
        const project = { name: name || 'Untitled', files, plan: forgePlan, savedAt: Date.now() };
        const key = `forge_project_${Date.now()}`;
        const existing = JSON.parse(localStorage.getItem('forge_projects') || '[]');
        // Keep last 10 projects
        const updated = [{ key, ...project }, ...existing].slice(0, 10);
        localStorage.setItem('forge_projects', JSON.stringify(updated));
        localStorage.setItem('forge_current', JSON.stringify(project));
        setForgeSaved(true);
        setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SAVE: Project "${project.name}" saved locally ✓`]);
        setTimeout(() => setForgeSaved(false), 2000);
    };

    // Update a single file's code and sync preview
    const updateForgeFileCode = (path: string, newCode: string) => {
        setForgeFiles(prev => {
            const updated = prev.map(f => f.path === path ? { ...f, code: newCode } : f);
            // Live preview sync
            setTimeout(() => assemblePreview(updated), 300);
            return updated;
        });
    };

    // Start voice in forge chat
    const toggleForgeVoice = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice not supported in this browser. Try Chrome.');
            return;
        }
        if (forgeVoiceActive) {
            forgeVoiceRef.current?.stop();
            setForgeVoiceActive(false);
            return;
        }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SR();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-IN';
        rec.onresult = (e: any) => {
            const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
            setForgeChatInput(transcript);
        };
        rec.onend = () => setForgeVoiceActive(false);
        rec.start();
        forgeVoiceRef.current = rec;
        setForgeVoiceActive(true);
    };

    // Reset for a new project without closing IDE
    const startNewForgeProject = () => {
        if (forgeFiles.length > 0) saveForgeProject();
        setForgeFiles([]);
        setForgePreviewHtml('');
        setForgeChat([]);
        setForgeTerminalLogs([`[${new Date().toLocaleTimeString()}] FORGE_RESET: Ready for new project`]);
        setForgeStatus('idle');
        setForgeProjectName('');
        setForgePlan({ name: '', desc: '', pages: [], stack: [] });
        setForgeChatInput('');
    };

    const handleSelectProject = async (project: any) => {
        setShowProjectLibrary(false);
        setForgeStatus('generating');
        setForgeTerminalLogs([`[${new Date().toLocaleTimeString()}] FORGE_RESTORE: Project "${project.title}"`]);

        try {
            const { supabase } = await import('@/lib/supabase');
            const { data: files, error } = await supabase
                .from('project_files')
                .select('*')
                .eq('project_id', project.id)
                .order('created_at');

            if (!error && files) {
                const mappedFiles = files.map(f => ({
                    name: f.name,
                    path: f.path,
                    code: f.code,
                    lang: f.lang || 'html',
                    icon: f.lang === 'html' ? 'code' : f.lang === 'css' ? 'palette' : 'javascript'
                }));
                setForgeFiles(mappedFiles);
                setForgeProjectName(project.title);
                setForgePlan(project.plan || { name: project.title, desc: project.description, pages: [], stack: [] });
                assemblePreview(mappedFiles);
                setForgeStatus('previewing');
                setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] RESTORE_COMPLETE: ${files.length} files loaded ✓`]);
            }
        } catch (err) {
            console.error('Project Restore Error:', err);
            setForgeStatus('idle');
        }
    };

    const renderPitchDeckForge = () => {
        const activeSlide = deckSlides[activeDeckIdx] || DEFAULT_SLIDES[0];
        
        // Styles based on theme
        const getThemeStyles = () => {
            switch (deckTheme) {
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

        return (
            <div className="fixed inset-0 z-[999] bg-zinc-950 flex animate-in fade-in duration-500 overflow-hidden font-sans text-white">
                
                {/* VERTICAL SLIDE TRAY (Open/Close on Hover) */}
                <div 
                    onMouseEnter={() => setShowSlideTray(true)}
                    onMouseLeave={() => setShowSlideTray(false)}
                    className={`absolute left-0 top-0 bottom-0 bg-zinc-950/95 border-r border-zinc-800/80 z-[1000] flex flex-col items-center py-8 gap-6 transition-all duration-350 shadow-2xl backdrop-blur-md ${
                        showSlideTray ? 'w-[85px] translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
                    }`}
                >
                    <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase rotate-90 my-6 shrink-0 font-outfit">SLIDES</span>
                    <div className="flex-1 w-full flex flex-col items-center gap-4 overflow-y-auto px-2 custom-scrollbar">
                        {(deckSlides.length > 0 ? deckSlides : DEFAULT_SLIDES).map((s: any, idx: number) => {
                            let icon = "slideshow";
                            if (s.layout === 'hero') icon = "co_present";
                            if (s.layout === 'competitors') icon = "compare_arrows";
                            if (s.layout === 'grid' || s.layout === 'features') icon = "grid_view";
                            if (s.layout === 'split') icon = "vertical_split";

                            return (
                                <button
                                    key={s.id || idx}
                                    onClick={() => setActiveDeckIdx(idx)}
                                    className={`group relative w-13 h-13 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 hover:scale-110 ${
                                        activeDeckIdx === idx 
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105' 
                                            : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:border-indigo-500/50 hover:text-white hover:bg-zinc-850'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                    <span className="text-[9px] font-extrabold mt-0.5">{idx + 1}</span>

                                    {/* Premium Tooltip */}
                                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-zinc-950 text-white border border-zinc-800 text-[10px] font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-[1010] shadow-xl">
                                        <div className="font-extrabold text-indigo-400">Slide {idx + 1}: {s.title}</div>
                                        <div className="text-[8px] text-zinc-400">{s.subtitle}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* HOVER ZONE TRIGGER (LEFT) */}
                <div 
                    onMouseEnter={() => setShowSlideTray(true)}
                    className="absolute left-0 top-0 bottom-0 w-3 z-[999] cursor-pointer"
                />

                {/* RIGHT SLIDING TRAY (Open/Close on Hover) */}
                <div 
                    onMouseEnter={() => setShowRightHistoryTray(true)}
                    onMouseLeave={() => setShowRightHistoryTray(false)}
                    className={`absolute right-0 top-0 bottom-0 bg-zinc-950/95 border-l border-zinc-800/80 z-[1000] flex flex-col p-6 gap-6 transition-all duration-350 shadow-2xl backdrop-blur-md ${
                        showRightHistoryTray ? 'w-[280px] translate-x-0' : 'w-0 translate-x-full overflow-hidden'
                    }`}
                >
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 shrink-0">
                        <span className="material-symbols-outlined text-indigo-400">history</span>
                        <h3 className="text-sm font-black tracking-tight text-white uppercase font-outfit">Deck Workspace Hub</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
                        {/* Old Pitch Decks Section */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/80 flex items-center gap-1.5 font-outfit">
                                <span className="material-symbols-outlined text-[14px]">collections_bookmark</span> Old Pitch Decks
                            </span>
                            <div className="space-y-2">
                                {[
                                    { name: "SetMyBizz Seed Pitch", date: "2 mins ago", score: "98%" },
                                    { name: "FinTech OS Pitch V2", date: "Yesterday", score: "88%" },
                                    { name: "SaaS Launch Presentation", date: "4 days ago", score: "95%" }
                                ].map((deck, idx) => (
                                    <div key={idx} className="p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/60 rounded-xl transition-all cursor-pointer hover:border-zinc-700">
                                        <div className="text-[11px] font-bold text-white leading-tight">{deck.name}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[9px] text-zinc-500">{deck.date}</span>
                                            <span className="text-[9px] font-bold text-indigo-400">{deck.score} score</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* History Chats Section */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/80 flex items-center gap-1.5 font-outfit">
                                <span className="material-symbols-outlined text-[14px]">forum</span> Chat History
                            </span>
                            <div className="space-y-2">
                                {[
                                    "Refine product USP & target segment details",
                                    "Change theme styling to Ocean Green gradient",
                                    "Add slide for competitor analysis metrics"
                                ].map((chat, idx) => (
                                    <div key={idx} className="p-3 bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-white flex gap-2">
                                        <span className="material-symbols-outlined text-[14px] mt-0.5 text-zinc-600">chat_bubble_outline</span>
                                        <p className="text-[10px] leading-snug font-medium line-clamp-2">{chat}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommended Features Section */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/80 flex items-center gap-1.5 font-outfit">
                                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Suggested Actions
                            </span>
                            <div className="space-y-2">
                                {[
                                    { title: "Generate Market Size Slide", desc: "Arkle can calculate SAM/SOM using database" },
                                    { title: "Add Financial Projection", desc: "Includes growth models & unit economics" }
                                ].map((feat, idx) => (
                                    <div key={idx} className="p-3 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/10 rounded-xl text-left cursor-pointer hover:border-indigo-500/30 transition-all">
                                        <h5 className="text-[10px] font-bold text-indigo-300">{feat.title}</h5>
                                        <p className="text-[8px] text-zinc-500 mt-1 leading-normal">{feat.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOVER ZONE TRIGGER (RIGHT) */}
                <div 
                    onMouseEnter={() => setShowRightHistoryTray(true)}
                    className="absolute right-0 top-0 bottom-0 w-3 z-[999] cursor-pointer"
                />

                {/* LEFT COLUMN: Controls & Slide Editor */}
                <aside 
                    style={{ width: `${pitchDeckAsideWidth}px` }}
                    className="h-full bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 z-10"
                >
                    <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={() => { setForgeStatus('idle'); setSelectedLauncherTool(null); }} 
                                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] mr-1 align-middle">arrow_back</span>
                                Back to Launcher
                            </button>
                        </div>

                        <div>
                            {/* Pitch Style / Type Dropdown */}
                            <div className="mt-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5 font-outfit">Pitch Deck Style</label>
                                <div className="relative">
                                    <select
                                        value={pitchDeckType}
                                        onChange={(e) => setPitchDeckType(e.target.value as any)}
                                        className="w-full bg-zinc-950/85 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white outline-none cursor-pointer hover:border-zinc-700 transition-all appearance-none font-outfit"
                                    >
                                        <option value="investor">💼 Investor Seed Pitch</option>
                                        <option value="sales">🚀 Product & Sales Pitch</option>
                                        <option value="partnership">🤝 Partnership / B2B Pitch</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[16px]">expand_more</span>
                                </div>
                            </div>

                            {/* Visual Themes Selector Grid */}
                            <div className="space-y-2 mt-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1 font-outfit">Visual Theme Style</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'neon', name: 'Neon Cyber', previewBg: 'from-purple-900 to-indigo-900' },
                                        { id: 'notion', name: 'Minimalist', previewBg: 'from-zinc-800 to-zinc-950' },
                                        { id: 'ocean', name: 'Emerald Ocean', previewBg: 'from-emerald-900 to-cyan-950' }
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setDeckTheme(t.id as any)}
                                            className={`p-2 rounded-xl border text-left transition-all duration-300 ${
                                                deckTheme === t.id 
                                                    ? 'bg-zinc-850 border-indigo-500/80 shadow-md shadow-indigo-500/10 scale-105' 
                                                    : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900'
                                            }`}
                                        >
                                            <div className={`h-2.5 rounded bg-gradient-to-br ${t.previewBg} mb-1.5`} />
                                            <span className="text-[8px] font-extrabold text-zinc-300 block leading-tight font-outfit uppercase tracking-wider">{t.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* WIZARD CONTAINER inside Sidebar */}
                        {isWizardActive && (
                            <div className="space-y-4 border-t border-zinc-800/80 pt-4 flex flex-col">
                                
                                {/* Form / Checklist Mode Layout */}
                                {wizardMode === 'form' ? (
                                    <div className="space-y-4">
                                        {/* Language and Step Header */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-outfit">Step {wizardStep} of 4</span>
                                            {/* Language Selector Dropdown */}
                                            <div className="relative">
                                                <select
                                                    value={wizardLang}
                                                    onChange={(e) => {
                                                        const selectedL = e.target.value;
                                                        setWizardLang(selectedL);
                                                        onLangChange?.(selectedL);
                                                    }}
                                                    className="bg-zinc-950 border border-zinc-800 rounded-lg pl-2 pr-6 py-1 text-zinc-400 hover:text-white text-[10px] font-bold outline-none cursor-pointer appearance-none transition-colors font-outfit"
                                                    title="Select Wizard Language"
                                                >
                                                    <option value="en-IN">🇬🇧 English</option>
                                                    <option value="te-IN">🇮🇳 తెలుగు (Telugu)</option>
                                                    <option value="hi-IN">🇮🇳 हिन्दी (Hindi)</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[12px]">expand_more</span>
                                            </div>
                                        </div>

                                        {/* Step Progress Circles */}
                                        <div className="flex items-center gap-1.5 py-1 justify-center bg-zinc-950/20 py-2 rounded-xl border border-zinc-800/40">
                                            {[1, 2, 3, 4].map((step) => (
                                                <button 
                                                    key={step} 
                                                    onClick={() => setWizardStep(step)}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                                                        wizardStep === step 
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110 font-black' 
                                                            : wizardStep > step 
                                                                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20' 
                                                                : 'bg-zinc-950 border border-zinc-800 text-zinc-600'
                                                    }`}
                                                >
                                                    {step}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Arkle Onboarding Welcome Banner */}
                                        {wizardStep === 1 && (
                                            <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                                <span className="material-symbols-outlined text-indigo-400 text-[18px] shrink-0 mt-0.5 animate-pulse">forum</span>
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-white leading-tight">
                                                        Hi, I'm Arkle! Ready to build your pitch deck and script.
                                                    </h4>
                                                    <p className="text-[9px] text-zinc-400 leading-normal mt-0.5">
                                                        You can chat or speak in any language.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Missing Setup Questions Checklist */}
                                        {(!wizardInputs.businessName || !wizardInputs.idea || !wizardInputs.problem) && (
                                            <div className="space-y-2 p-3.5 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 font-outfit">Arkle's Info Discovery Checklist</span>
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                                </div>
                                                <p className="text-[9px] text-zinc-500 leading-normal font-sans font-medium">
                                                    Please answer the missing questions below, click them to talk to Arkle, or update the checklist directly:
                                                </p>
                                                <div className="flex flex-col gap-1.5 pt-1.5">
                                                    {[
                                                        { check: !!wizardInputs.businessName, label: "🏢 Launch Date & Company Logo Name", query: "Help me define my company's official name, launch date, and logo concept." },
                                                        { check: !!wizardInputs.idea, label: "🛠️ What Technology & Core Vibe?", query: "Let's discuss the tech stack and the visual vibe for the presentation." },
                                                        { check: !!wizardInputs.problem, label: "📈 Stage, Target Audience & Team Size", query: "What funding stage, target audience, and founding team size are we pitching?" },
                                                        { check: !!wizardInputs.solution, label: "🎯 Solution & Direct Call-to-Action (CTA)", query: "What direct call-to-action (CTA) should we ask investors for at the end?" },
                                                    ].map((q, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setPromptInput(q.query);
                                                                setWizardMode('chat');
                                                                setIsVoiceActive(true);
                                                            }}
                                                            className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-850 border border-zinc-800/60 text-left transition-all"
                                                        >
                                                            <span className={`text-[9px] font-bold ${q.check ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>{q.label}</span>
                                                            <span className="material-symbols-outlined text-[13px] text-zinc-505">{q.check ? 'check_circle' : 'help_outline'}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step Form Inputs */}
                                        <div className="space-y-4 bg-zinc-950/30 p-3 rounded-2xl border border-zinc-800/60">
                                            {wizardStep === 1 && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">Business Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={wizardInputs.businessName} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, businessName: e.target.value })}
                                                            placeholder="e.g., Organic Oasis" 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-650 outline-none focus:border-indigo-500/80 transition-all font-sans font-bold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">One-Line Business Idea</label>
                                                        <textarea 
                                                            value={wizardInputs.idea} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, idea: e.target.value })}
                                                            placeholder="e.g., A farm-to-table organic delivery app connects local farmers directly with urban households." 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-655 outline-none focus:border-indigo-500/80 transition-all h-20 resize-none font-sans font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {wizardStep === 2 && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">Core Problem / Bottleneck</label>
                                                        <textarea 
                                                            value={wizardInputs.problem} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, problem: e.target.value })}
                                                            placeholder="e.g., MSMEs lack technical resources and pay exorbitant agency fee." 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-655 outline-none focus:border-indigo-500/80 transition-all h-20 resize-none font-sans font-bold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">Your Solution</label>
                                                        <textarea 
                                                            value={wizardInputs.solution} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, solution: e.target.value })}
                                                            placeholder="e.g., AI co-founder builds fully functional pages, code and documents." 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-655 outline-none focus:border-indigo-500/80 transition-all h-20 resize-none font-sans font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {wizardStep === 3 && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">Target Audience</label>
                                                        <input 
                                                            type="text" 
                                                            value={wizardInputs.targetAudience} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, targetAudience: e.target.value })}
                                                            placeholder="e.g., Small business owners, MSMEs" 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/80 transition-all font-sans font-bold"
                                                        />
                                                        <div className="flex gap-1.5 mt-1.5">
                                                            {["B2B Founders", "D2C Brands", "Local MSMEs"].map((pill) => (
                                                                <button 
                                                                    key={pill} 
                                                                    onClick={() => setWizardInputs({ ...wizardInputs, targetAudience: pill })}
                                                                    className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-white rounded text-[8px] font-bold uppercase font-outfit"
                                                                >
                                                                    {pill}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">Revenue Model</label>
                                                        <input 
                                                            type="text" 
                                                            value={wizardInputs.revenueModel} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, revenueModel: e.target.value })}
                                                            placeholder="e.g., Transaction commissions" 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/80 transition-all font-sans font-bold"
                                                        />
                                                        <div className="flex gap-1.5 mt-1.5">
                                                            {["Transaction Fee", "Subscription"].map((pill) => (
                                                                <button 
                                                                    key={pill} 
                                                                    onClick={() => setWizardInputs({ ...wizardInputs, revenueModel: pill })}
                                                                    className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-white rounded text-[8px] font-bold uppercase font-outfit"
                                                                >
                                                                    {pill}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {wizardStep === 4 && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1 font-outfit">Growth & Launch Plan</label>
                                                        <textarea 
                                                            value={wizardInputs.growthPlan} 
                                                            onChange={(e) => setWizardInputs({ ...wizardInputs, growthPlan: e.target.value })}
                                                            placeholder="e.g., Phase 1 local launch, then scale digital ads." 
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/80 transition-all h-20 resize-none font-sans font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Conversation / Chat Mode Layout */
                                    <div className="flex-1 flex flex-col gap-3.5 h-[340px] overflow-y-auto pr-1.5 custom-scrollbar pb-4">
                                        {pitchChat.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex gap-2.5 items-start ${
                                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                {msg.role !== 'user' && (
                                                    <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-indigo-500/10">
                                                        <span className="material-symbols-outlined text-[14px] animate-pulse">smart_toy</span>
                                                    </div>
                                                )}
                                                <div
                                                    className={`p-3 rounded-2xl text-[10.5px] leading-relaxed max-w-[85%] font-sans font-bold ${
                                                        msg.role === 'user'
                                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                                            : 'bg-zinc-950/80 border border-zinc-800 text-zinc-200 rounded-tl-none'
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                        {isChatResponding && (
                                            <div className="flex gap-2.5 items-start justify-start">
                                                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 animate-bounce">
                                                    <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-zinc-550 text-[10.5px] rounded-tl-none flex items-center gap-1.5 font-sans font-bold">
                                                    Arkle is building slides... <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Back / Next / Mode Toggle wizard navigation buttons inside sidebar */}
                                <div className="flex justify-between items-center gap-2 pt-2 border-t border-zinc-800/60">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => setWizardMode('chat')}
                                            className={`px-2.5 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all flex items-center gap-1 font-outfit ${
                                                wizardMode === 'chat' 
                                                    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                                                    : 'bg-transparent text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800'
                                            }`}
                                            title="Start co-founder agent chat discussion"
                                        >
                                            <span className="material-symbols-outlined text-[12px]">forum</span> Chat
                                        </button>
                                        <button
                                            onClick={() => setWizardMode('form')}
                                            className={`px-2.5 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all font-outfit ${
                                                wizardMode === 'form' 
                                                    ? 'bg-indigo-650 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                                                    : 'bg-transparent text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800'
                                            }`}
                                        >
                                            Checklist
                                        </button>
                                    </div>
                                    
                                    {wizardMode === 'form' && (
                                        <div className="flex gap-1.5">
                                            {wizardStep > 1 && (
                                                <button 
                                                    onClick={() => setWizardStep(wizardStep - 1)}
                                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg transition-all font-outfit"
                                                >
                                                    Back
                                                </button>
                                            )}
                                            {wizardStep < 4 ? (
                                                <button 
                                                    onClick={() => setWizardStep(wizardStep + 1)}
                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all font-outfit"
                                                >
                                                    Next
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        setIsWizardActive(false);
                                                        const formattedPrompt = `Generate a premium visual pitch deck for my business: ${wizardInputs.businessName}. Focus: ${wizardInputs.idea}. Problem: ${wizardInputs.problem}. Solution: ${wizardInputs.solution}. Audience: ${wizardInputs.targetAudience}. Revenue: ${wizardInputs.revenueModel}. Growth: ${wizardInputs.growthPlan}. Deck type is ${pitchDeckType}.`;
                                                        startPitchDeckGeneration(formattedPrompt);
                                                    }}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-750 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-md font-outfit"
                                                >
                                                    Generate ✨
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isWizardActive && (
                            <div className="mt-4 border-t border-zinc-800/80 pt-4">
                                <button
                                    onClick={() => setIsWizardActive(true)}
                                    className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 font-outfit"
                                >
                                    <span className="material-symbols-outlined text-[14px]">edit_note</span> Open Setup Wizard
                                </button>
                            </div>
                        )}
                    </div>

                    {/* BOTTOM PANEL: Arkle Prompt Box */}
                    <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 space-y-3 shrink-0">
                        {/* Prompt Input Area */}
                        <div className="relative group">
                            <textarea
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                                placeholder="Ask Arkle to edit, refine, or build your slides..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 pt-4 pb-12 text-[12px] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-36 custom-scrollbar"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (wizardMode === 'chat') {
                                            handlePitchChatSubmit(promptInput);
                                        } else {
                                            startPitchDeckGeneration(promptInput);
                                        }
                                    }
                                }}
                            />
                            {/* Taskbar inside prompt box */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <button title="Upload / Add File" className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                    </button>
                                    <select
                                        value={selectedAIModel}
                                        onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-0.5 text-zinc-400 hover:text-white text-[9px] font-semibold outline-none cursor-pointer transition-colors"
                                        title="Select AI Model"
                                    >
                                        <option value="dummy">Dummy Model</option>
                                        <option value="gemini">Gemini 1.5 Pro</option>
                                        <option value="gemini-flash">Gemini 1.5 Flash</option>
                                        <option value="gpt4o">GPT-4o</option>
                                        <option value="gpt4-turbo">GPT-4 Turbo</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => setIsVoiceActive(true)} 
                                        title="Live Voice Mode" 
                                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (wizardMode === 'chat') {
                                                handlePitchChatSubmit(promptInput);
                                            } else {
                                                startPitchDeckGeneration(promptInput);
                                            }
                                        }} 
                                        disabled={isDeckGenerating || !promptInput} 
                                        title="Send / Enter" 
                                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-indigo-400 transition-colors disabled:opacity-40"
                                    >
                                        {isDeckGenerating ? (
                                            <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-[18px]">send</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* PITCH DECK RESIZE HANDLE */}
                <div
                    onMouseDown={() => setIsResizingPitchDeck(true)}
                    className={`w-1 h-full cursor-col-resize z-[60] hover:bg-indigo-500/50 transition-colors ${
                        isResizingPitchDeck ? 'bg-indigo-500' : 'bg-zinc-800'
                    }`}
                />

                {/* RIGHT COLUMN: Active Slide Live Preview */}
                <main className="flex-1 h-full bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-y-auto relative z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none" />
                    
                    {/* Top Right Action Symbols */}
                    <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
                        <button
                            onClick={handlePrintDeck}
                            title="Download PDF"
                            className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-all hover:scale-105"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                        <button
                            onClick={() => {
                                if (isGoogleConnected) {
                                    alert("Exporting to Google Docs... Slide exported successfully!");
                                } else {
                                    setShowGoogleAuth(true);
                                }
                            }}
                            title="Export to Google Doc"
                            className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-all hover:scale-105"
                        >
                            <span className="material-symbols-outlined text-[20px]">description</span>
                        </button>
                    </div>

                    {/* Hidden Offscreen Container for multi-page PDF generation */}
                    <div 
                        id="hidden-pdf-capture-container" 
                        className="absolute -left-[9999px] -top-[9999px] w-[1000px] flex flex-col gap-10"
                        style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", letterSpacing: 'normal', wordSpacing: 'normal' }}
                    >
                        {deckSlides.map((slide, sIdx) => (
                            <div 
                                key={slide.id} 
                                data-slide-page="true"
                                className={`w-[1000px] h-[562.5px] p-16 flex flex-col justify-between relative overflow-hidden ${styles.bg}`}
                                style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", letterSpacing: 'normal', wordSpacing: 'normal', padding: '64px' }}
                            >
                                {/* Decorative Slide Light Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                                {/* Slide Header */}
                                <div className="flex justify-between items-center opacity-80 border-b pb-4 border-current/10" style={{ letterSpacing: '0.05em' }}>
                                    <span className="text-xs font-bold uppercase">{slide.title}</span>
                                    <span className="text-xs font-light">{slide.subtitle}</span>
                                </div>

                                {/* Slide Layout Switcher */}
                                <div className="flex-1 flex flex-col justify-center my-6">
                                    {/* HERO LAYOUT */}
                                    {slide.layout === 'hero' && (
                                        <div className="text-center max-w-2xl mx-auto space-y-6">
                                            <h2 
                                                className="text-3xl font-black leading-tight" 
                                                style={{ color: deckTheme === 'neon' ? '#818cf8' : deckTheme === 'ocean' ? '#2dd4bf' : '#18181b' }}
                                            >
                                                {slide.content.heading}
                                            </h2>
                                            {slide.content.body && (
                                                <p className="text-sm opacity-75 font-light" style={{ lineHeight: '1.6' }}>{slide.content.body}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* TWO-COLUMN LAYOUT */}
                                    {slide.layout === 'two-column' && (
                                        <div className="grid grid-cols-5 gap-10 items-center">
                                            <div className="col-span-3 space-y-4">
                                                <h2 className="text-2xl font-extrabold leading-tight">
                                                    {slide.content.heading}
                                                </h2>
                                                {slide.content.body && (
                                                    <p className="text-xs opacity-70 leading-relaxed" style={{ lineHeight: '1.6' }}>{slide.content.body}</p>
                                                )}
                                            </div>
                                            <div className="col-span-2 space-y-3.5">
                                                {slide.content.bullets?.map((b: string, i: number) => (
                                                    <div key={i} className={`p-4 rounded-2xl ${styles.card} text-xs flex gap-3 items-start`} style={{ padding: '16px' }}>
                                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                        <span className="font-medium opacity-90">{b}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TRACTION LAYOUT */}
                                    {slide.layout === 'traction' && (
                                        <div className="space-y-6 text-center">
                                            <h2 className="text-2xl font-extrabold">{slide.content.heading}</h2>
                                            <div className="grid grid-cols-3 gap-6">
                                                {slide.content.stats?.map((s: any, i: number) => (
                                                    <div key={i} className={`p-6 rounded-2xl ${styles.card} space-y-2`} style={{ padding: '24px' }}>
                                                        <span 
                                                            className="text-3xl font-black" 
                                                            style={{ color: deckTheme === 'neon' ? '#818cf8' : deckTheme === 'ocean' ? '#2dd4bf' : '#18181b' }}
                                                        >
                                                            {s.value}
                                                        </span>
                                                        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block">{s.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* COMPETITION / MATRIX LAYOUT */}
                                    {slide.layout === 'matrix' && (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-extrabold text-center">{slide.content.heading}</h2>
                                            <div className="grid grid-cols-4 gap-4 pt-2">
                                                {slide.content.matrix?.map((m: any, i: number) => (
                                                    <div key={i} className={`p-4 rounded-2xl ${styles.card} text-center space-y-2`} style={{ padding: '16px' }}>
                                                        <span className="text-xs font-extrabold text-white block">{m.competitor}</span>
                                                        <div className="flex justify-center gap-1">
                                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                                <span 
                                                                    key={idx} 
                                                                    className={`w-2 h-2 rounded-full ${
                                                                        idx < m.score ? 'bg-indigo-500' : 'bg-zinc-800'
                                                                    }`} 
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[8px] text-zinc-500 block uppercase font-bold">{m.advantage}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Slide Footer */}
                                <div className="flex justify-between items-center text-[10px] opacity-60 pt-4 border-t border-t-current/10">
                                    <span className="font-extrabold tracking-wider uppercase">SetMyBizz BizOS Creator</span>
                                    <span>Page {sIdx + 1} of {deckSlides.length}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rendered Slide Area */}
                    <div id="slide-presentation-area" className={`w-full max-w-4xl aspect-[16/9] rounded-3xl p-8 md:p-16 shadow-2xl flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${styles.bg}`}>
                        
                        {/* Decorative Slide Light Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Slide Header */}
                        <div className="flex justify-between items-center opacity-80 border-b pb-4 border-current/10">
                            <span className="text-xs font-bold uppercase tracking-widest">{activeSlide.title}</span>
                            <span className="text-xs font-light">{activeSlide.subtitle}</span>
                        </div>

                        {/* Slide Layout Switcher */}
                        <div className="flex-1 flex flex-col justify-center my-6">
                            
                            {/* HERO LAYOUT */}
                            {activeSlide.layout === 'hero' && (
                                <div className="text-center max-w-2xl mx-auto space-y-6">
                                    <h2 className={`text-3xl md:text-5xl font-black tracking-tight leading-tight ${styles.gradientText}`}>
                                        {activeSlide.content.heading}
                                    </h2>
                                    {activeSlide.content.body && (
                                        <p className="text-sm md:text-lg opacity-75 font-light">{activeSlide.content.body}</p>
                                    )}
                                </div>
                            )}

                            {/* TWO-COLUMN LAYOUT */}
                            {activeSlide.layout === 'two-column' && (
                                <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-center">
                                    <div className="md:col-span-3 space-y-4">
                                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                                            {activeSlide.content.heading}
                                        </h2>
                                        {activeSlide.content.body && (
                                            <p className="text-xs md:text-sm opacity-70 leading-relaxed">{activeSlide.content.body}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2 space-y-3.5">
                                        {activeSlide.content.bullets?.map((b: string, i: number) => (
                                            <div key={i} className={`p-4 rounded-2xl ${styles.card} text-xs flex gap-3 items-start`}>
                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                <span>{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TRACTION LAYOUT */}
                            {activeSlide.layout === 'traction' && (
                                <div className="space-y-6 md:space-y-8">
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-center tracking-tight mb-4">{activeSlide.content.heading}</h2>
                                    <div className="grid grid-cols-3 gap-4 md:grid-cols-3 md:gap-6 text-center">
                                        {activeSlide.content.metrics?.map((m: any, i: number) => (
                                            <div key={i} className={`p-4 md:p-6 rounded-2xl ${styles.card} hover:scale-105 transition-all`}>
                                                <div className="text-2xl md:text-4xl font-black text-current mb-1.5">{m.val}</div>
                                                <h4 className="text-xs md:text-sm font-bold opacity-80 mb-1">{m.label}</h4>
                                                {m.desc && <p className="text-[9px] md:text-[10px] opacity-50">{m.desc}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MATRIX LAYOUT */}
                            {activeSlide.layout === 'matrix' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight mb-2 text-center">
                                        {activeSlide.content.heading}
                                    </h2>
                                    <div className="grid grid-cols-4 gap-4 text-[10px] md:text-xs font-semibold text-center border-t border-current/10 pt-4">
                                        <span className="text-left font-bold opacity-60">Competitor</span>
                                        <span className="opacity-60">Simplicity</span>
                                        <span className="opacity-60">AI Integration</span>
                                        <span className="opacity-60">Pricing</span>

                                        {activeSlide.content.competitors?.map((c: any, i: number) => (
                                            <React.Fragment key={i}>
                                                <span className="text-left font-bold text-current border-t border-current/5 py-3">{c.name}</span>
                                                <span className="border-t border-current/5 py-3 opacity-70">{c.easy}</span>
                                                <span className="border-t border-current/5 py-3 opacity-70">{c.tech}</span>
                                                <span className="border-t border-current/5 py-3 opacity-90 font-bold">{c.price}</span>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Slide Footer */}
                        <div className="flex justify-between items-center opacity-65 text-[10px] uppercase tracking-widest pt-4 border-t border-current/10">
                            <span>SetMyBizz BizOS Creator</span>
                            <span>Powered by Arkle AI</span>
                        </div>

                    </div>
                </main>
            </div>
        );
    };

    /* ── Render: Mode 1 - Pure Creation Forge (Advanced Builder) ── */
    const renderPureCreationForge = () => {
        if (selectedLauncherTool?.id === 'deck') {
            return renderPitchDeckForge();
        }
        const currentFile = forgeFiles.find(f => f.path === activeForgeFile) || forgeFiles[0];
        const showCode = forgeViewMode === 'code' || forgeViewMode === 'split';
        const showPreview = forgeViewMode === 'preview' || forgeViewMode === 'split';

        return (
            <div className={`fixed inset-0 z-[999] bg-white flex animate-in fade-in duration-500 overflow-hidden ${(isResizingForge || isResizingChat) ? 'cursor-col-resize select-none' : ''}`} style={{ fontFamily: '"DM Sans", "Inter", sans-serif' }}>
                {/* ══════ UNIVERSAL MOOD SURFACE (White Mode for Tool Lab) ══════ */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {/* Base Soft Tint */}
                    <div className="absolute inset-0 bg-[#ffffff]" />

                    {/* Central Mood Glow Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />

                    {/* Edge Shading - Left & Right 20% White Gradients */}
                    <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-white via-white/80 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-white via-white/80 to-transparent" />
                </div>

                {/* LEFT: AGENT CHAT PANEL */}
                <div style={{ width: `${forgeChatWidth}px` }} className="h-full border-r border-slate-200/50 flex flex-col bg-white/40 backdrop-blur-md relative shrink-0 z-10">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Arkle Architect</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Branding</span>
                                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest opacity-30">•</span>
                                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Tool Hub</span>
                                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest opacity-30">•</span>
                                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Agents</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setShowProjectLibrary(true)} title="Project Library" className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                                    <span className="material-symbols-outlined text-[16px]">database</span>
                                </button>
                                <button onClick={startNewForgeProject} title="New Project" className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                </button>
                                <button onClick={() => { setForgeMode('launcher'); setForgeStatus('idle'); }} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all ml-1">
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        </div>


                        {/* Project Name Only */}
                        <div className="flex items-center justify-between mt-1">
                            <input value={forgeProjectName} onChange={e => setForgeProjectName(e.target.value)} placeholder="Untitled Project" className="text-[11px] font-bold text-slate-400 bg-transparent border-none outline-none placeholder-slate-600 w-full focus:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Chat Area */}

                    {/* Chat */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {forgeChat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[92%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed break-all ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                </div>
                            </div>
                        ))}

                        {(forgeStatus === 'generating' || forgeStatus === 'refining') && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl">
                                <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></div><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]"></div><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.3s]"></div></div>
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{forgeStatus === 'generating' ? 'Building...' : 'Refining...'}</span>
                            </div>
                        )}
                        <div ref={forgeEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-slate-100 bg-slate-50/50" style={{ height: 'auto' }}>
                        <div className="relative group">
                            <textarea
                                value={forgeChatInput}
                                onChange={(e) => setForgeChatInput(e.target.value)}
                                placeholder={forgeFiles.length === 0 ? "What shall Arkle build for your startup today?" : "I don't just chat, I build. Refine your creation..."}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 pt-4 pb-12 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 resize-none transition-all scrollbar-hide shadow-sm"
                                rows={Math.min(6, Math.max(2, forgeChatInput.split('\n').length))}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleForgeChatSubmit(); } }}
                            />
                            {/* UNIVERSAL TASK BAR (Light Mode Version) */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <button title="Upload / Add File" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                    </button>
                                    <select
                                        value={selectedAIModel}
                                        onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                        className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 hover:text-slate-900 text-[10px] font-semibold tracking-tight outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                                        title="Select AI Model"
                                    >
                                        <option value="dummy">Dummy Model</option>
                                        <option value="gemini">Gemini 1.5 Pro</option>
                                        <option value="gemini-flash">Gemini 1.5 Flash</option>
                                        <option value="gpt4o">GPT-4o</option>
                                        <option value="gpt4-turbo">GPT-4 Turbo</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={toggleForgeVoice} title="Voice Typing (Dictation)" className={`w-7 h-7 flex items-center justify-center transition-colors ${forgeVoiceActive ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-600'}`}>
                                        <span className="material-symbols-outlined text-[18px]">mic</span>
                                    </button>
                                    <button onClick={toggleVoiceStudio} title="Live Voice Mode" className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ml-1 ${showVoiceStudio ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                                    </button>
                                    <button onClick={() => handleForgeChatSubmit()} disabled={forgeStatus === 'generating' || forgeStatus === 'refining'} title="Send / Enter" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors ml-1 disabled:opacity-40">
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status Line */}
                        <div className="flex items-center justify-between mt-2 px-1">
                            <div className="flex gap-1">
                                {['Add Database', 'Mobile View', 'Dark Mode'].map(chip => (
                                    <button key={chip} onClick={() => setForgeChatInput(chip)} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-tighter hover:text-white hover:border-white/20 transition-all">{chip}</button>
                                ))}
                            </div>
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{selectedAIModel.toUpperCase()} CORE 1.0</span>
                        </div>
                    </div>
                </div>

                {/* CHAT RESIZE HANDLE */}
                <div
                    onMouseDown={() => setIsResizingChat(true)}
                    className={`w-1 h-full cursor-col-resize z-[60] hover:bg-blue-500/50 transition-colors bg-white/5`}
                />

                {/* RIGHT: IDE WORKSPACE */}
                <div className="flex-1 flex flex-col bg-[#0f0f13] relative overflow-hidden">
                    {/* Floating Header Toggle Button */}
                    <button
                        onClick={() => setShowIdeHeader(!showIdeHeader)}
                        className={`absolute top-2 right-6 z-[110] w-8 h-8 rounded-full flex items-center justify-center transition-all ${showIdeHeader ? 'text-slate-500 hover:text-white bg-white/5' : 'bg-blue-600 text-white shadow-lg'}`}
                        title={showIdeHeader ? "Hide Header" : "Show Header"}
                    >
                        <span className="material-symbols-outlined text-[18px]">{showIdeHeader ? 'expand_less' : 'expand_more'}</span>
                    </button>

                    {/* IDE Top Bar */}
                    <div className={`border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a24] shadow-lg relative z-[100] transition-all duration-300 ${showIdeHeader ? 'h-14 opacity-100' : 'h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 mr-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            {/* View Mode Toggle */}
                            {(['code', 'split', 'preview'] as const).map(mode => (
                                <button key={mode} onClick={() => setForgeViewMode(mode)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${forgeViewMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                    <span className="material-symbols-outlined text-[16px] mr-2 align-middle">{mode === 'code' ? 'code' : mode === 'preview' ? 'visibility' : 'vertical_split'}</span>
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            {forgeFiles.length > 0 && (
                                <>
                                    <button onClick={() => saveForgeProject()} className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${forgeSaved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                                        <span className="material-symbols-outlined text-[14px]">{forgeSaved ? 'check_circle' : 'save'}</span>
                                        {forgeSaved ? 'Saved!' : 'Save'}
                                    </button>
                                    <button onClick={downloadForgeProject} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/10">
                                        <span className="material-symbols-outlined text-[14px]">download</span> Export
                                    </button>
                                </>
                            )}
                            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
                            <button onClick={() => { setForgeMode('launcher'); setForgeStatus('idle'); }} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-all" title="Exit Forge">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                    </div>


                    {/* File Tabs */}
                    {forgeFiles.length > 0 && (
                        <div className="h-10 bg-[#1a1a24] border-b border-white/5 flex items-center gap-0 overflow-x-auto no-scrollbar">
                            {forgeFiles.map(file => (
                                <button key={file.path} onClick={() => setActiveForgeFile(file.path)}
                                    className={`h-full px-4 flex items-center gap-2 text-[11px] font-bold border-r border-white/5 transition-all shrink-0 ${activeForgeFile === file.path ? 'bg-[#0f0f13] text-white border-b-2 border-b-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/3'
                                        }`}>
                                    <span className="material-symbols-outlined text-[14px]">{file.icon || 'description'}</span>
                                    {file.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main IDE Area: Code + Preview */}
                    <div className="flex-1 flex overflow-hidden relative">
                        {/* Code Editor — Editable */}
                        {showCode && (
                            <div
                                style={{ width: showPreview ? `${forgeSplitPercent}%` : '100%' }}
                                className="bg-[#0d1117] flex flex-col overflow-hidden transition-none"
                            >
                                {currentFile ? (
                                    <div className="flex-1 relative overflow-hidden">
                                        {/* Line numbers overlay */}
                                        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#0d1117] z-10 pt-4 overflow-hidden pointer-events-none">
                                            {currentFile.code.split('\n').map((_, i) => (
                                                <div key={i} className="text-[12px] text-slate-600 text-right pr-2 leading-[1.7] font-mono opacity-40">{i + 1}</div>
                                            ))}
                                        </div>
                                        {/* Editable textarea */}
                                        <textarea
                                            value={currentFile.code}
                                            onChange={e => updateForgeFileCode(currentFile.path, e.target.value)}
                                            className="absolute inset-0 w-full h-full bg-transparent text-slate-300 font-mono text-[13px] leading-[1.7] resize-none outline-none pl-12 pr-4 pt-4 pb-4 custom-scrollbar selection:bg-blue-500/30 caret-blue-400"
                                            spellCheck={false}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                                        <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">code_blocks</span>
                                        <p className="text-[12px] font-bold uppercase tracking-widest opacity-30">Describe your idea in the chat →</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DRAG HANDLE */}
                        {showCode && showPreview && (
                            <div
                                onMouseDown={() => setIsResizingForge(true)}
                                className={`w-1 h-full cursor-col-resize z-50 hover:bg-blue-500/50 transition-colors group relative ${isResizingForge ? 'bg-blue-500' : 'bg-white/5'}`}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1 h-4 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                        )}

                        {/* Live Preview */}
                        {showPreview && (
                            <div
                                style={{ width: showCode ? `${100 - forgeSplitPercent}%` : '100%' }}
                                className="bg-white flex flex-col overflow-hidden transition-none"
                            >
                                <div className="h-8 bg-[#1a1a24] border-b border-white/5 flex items-center px-3 gap-2">
                                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div></div>
                                    <span className="text-[10px] text-slate-500 font-bold ml-2">Live Preview</span>
                                </div>
                                {forgePreviewHtml ? (
                                    <iframe srcDoc={forgePreviewHtml} className="flex-1 w-full bg-white border-0" sandbox="allow-scripts allow-same-origin" title="App Preview" />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                                        <span className="material-symbols-outlined text-[48px] mb-3 opacity-30">preview</span>
                                        <p className="text-[11px] font-bold uppercase tracking-widest opacity-50">Preview will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Terminal */}
                    <div className="h-40 bg-[#010409] border-t border-white/5 flex flex-col">
                        <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px] text-indigo-400">terminal</span>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Deployment Stream</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-slate-600 uppercase">Port: 3000</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">● System Live</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] space-y-1.5 custom-scrollbar bg-black/40">
                            {forgeTerminalLogs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-slate-700 opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={`${log.includes('✓') ? 'text-emerald-400' : log.includes('ERR') ? 'text-rose-400' : log.includes('AGENT') ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                                        {log.includes('✓') ? '✔ ' : log.includes('ERR') ? '✖ ' : '▶ '}{log.split('] ')[1] || log}
                                    </span>
                                </div>
                            ))}
                            {(forgeStatus === 'generating' || forgeStatus === 'refining') && (
                                <div className="text-indigo-400 animate-pulse flex items-center gap-2">
                                    <span>▶</span>
                                    <span>AGENT: Materializing Neural Assets...</span>
                                    <span className="w-2 h-4 bg-indigo-500 animate-caret"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── Render: Legacy Solutions (Keep for Backup) ────── */
    const renderLegacySolutionsUI = () => {
        return (
            <div className="w-full flex flex-col items-center py-20 text-center animate-in fade-in duration-700">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                    <span className="material-symbols-outlined text-[32px]">science</span>
                </div>
                <h3 className="text-[24px] font-bold text-slate-800 mb-2">Build from Scratch</h3>
                <p className="text-slate-500 max-w-md mx-auto">Use the chat below to describe any business tool, automation, or custom engine you need. Arkle will build it purely from your ideas.</p>
            </div>
        );
    };

    /* ── Render: Home ──────────────────────────────────── */
    const renderLauncherUI = () => {
        return (
            <div className="w-full mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 px-6 sm:px-12 lg:px-20">
                {/* Horizontal Category Scroller with Navigation Arrows - Increased Padding to prevent cropping */}
                <div className="mb-12 overflow-visible relative group/scroller max-w-[1200px] mx-auto py-12">
                    {/* Left Arrow */}
                    <button
                        type="button"
                        onClick={() => {
                            const el = document.getElementById('launcher-scroller');
                            if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                        }}
                        className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all z-30 opacity-0 group-hover/scroller:opacity-100 hover:scale-110 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                    </button>

                    <div id="launcher-scroller" className="flex items-center gap-8 overflow-x-auto py-8 px-6 no-scrollbar scroll-smooth">
                        {LAUNCHER_CATEGORIES.map((cat) => (
                            <motion.button
                                key={cat.id}
                                whileHover={{ y: -10, scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    if (cat.id === 'voice') {
                                        setIsVoiceActive(true);
                                        return;
                                    }
                                    setSelectedLauncherTool(cat);
                                    if (cat.id === 'deck') {
                                        let name = data?.name || "My Business";
                                        const idea = (data as any)?.idea || "a custom service/product platform";
                                        let industry = data?.industry || "Retail/Tech";
                                        let audience = (data as any)?.audience || "local MSMEs/startups";
                                        const model = (data as any)?.model || "Subscription";

                                        try {
                                            const localData = localStorage.getItem('setmybizz_data');
                                            if (localData) {
                                                const parsed = JSON.parse(localData);
                                                if (parsed.name) name = parsed.name;
                                                if (parsed.sector) industry = parsed.sector;
                                                if (parsed.size) audience = `Team size ${parsed.size}`;
                                            }
                                        } catch (e) {}

                                        const formattedPrompt = `Generate a premium visual pitch deck for my business:
Name: ${name}
Core Idea: ${idea}
Industry: ${industry}
Target Audience: ${audience}
Revenue Model: ${model}`;
                                        setPromptInput(formattedPrompt);
                                    } else {
                                        setPromptInput(`Build a ${cat.label} for my business`);
                                    }
                                }}
                                className={`flex flex-col items-center gap-4 group shrink-0 transition-all relative ${selectedLauncherTool?.id === cat.id ? 'z-10' : 'z-0'}`}
                            >
                                <div className={`${cat.id === 'voice' ? 'w-28 h-28 rounded-full shadow-[0_15px_40px_rgba(59,130,246,0.4)] animate-pulse' : 'w-20 h-20 rounded-[28px] shadow-xl'} bg-gradient-to-br ${cat.gradient} p-0.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 ${selectedLauncherTool?.id === cat.id ? 'ring-4 ring-blue-500 ring-offset-4' : ''}`}>
                                    <div className={`w-full h-full ${cat.id === 'voice' ? 'rounded-full' : 'rounded-[26px]'} bg-white/10 backdrop-blur-md flex items-center justify-center text-white`}>
                                        {cat.id === 'voice' ? (
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className="w-1.5 h-10 bg-white rounded-full animate-voice-wave" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="material-symbols-outlined text-[36px]">{cat.icon}</span>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-[12px] font-black transition-colors uppercase tracking-[0.15em] ${selectedLauncherTool?.id === cat.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{cat.label}</span>

                                {selectedLauncherTool?.id === cat.id && (
                                    <motion.div layoutId="activeToolDot" className="absolute -bottom-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        type="button"
                        onClick={() => {
                            const el = document.getElementById('launcher-scroller');
                            if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                        }}
                        className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all z-30 opacity-0 group-hover/scroller:opacity-100 hover:scale-110 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                    </button>
                </div>

                {/* ── Full Width Expansive Template Gallery (Vercel/Lovable Style) ── */}
                {selectedLauncherTool && (
                    <div className="w-full mt-12 mb-24 bg-white border-y border-slate-200/60 py-20 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedLauncherTool.gradient} flex items-center justify-center text-white shadow-lg`}>
                                            <span className="material-symbols-outlined text-[28px]">{selectedLauncherTool.icon}</span>
                                        </div>
                                        <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                                            {selectedLauncherTool.label} Blueprints
                                        </span>
                                    </div>
                                    <h3 className="text-[48px] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                                        Choose a starting point for your {selectedLauncherTool.label}.
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[20px] leading-relaxed">
                                        Select from 25+ verified industry blueprints or use Arkle AI to forge a custom solution from scratch.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedLauncherTool(null)}
                                    className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center gap-2 transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                    Close Gallery
                                </button>
                            </div>

                            {/* Build with AI - Large Feature Tile */}
                            <button
                                onClick={() => {
                                    startForging(`${promptInput} Start advanced conversational build.`);
                                    setPromptInput('');
                                }}
                                className="w-full mb-20 p-12 rounded-[48px] bg-slate-900 text-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] hover:shadow-[0_60px_120px_rgba(0,0,0,0.2)] transition-all duration-700 group relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent opacity-50"></div>
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 blur-[120px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-12 relative z-10">
                                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-[56px] animate-pulse">psychology</span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-[36px] font-black tracking-tight">Forge with Arkle AI</h3>
                                            <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[12px] font-black uppercase tracking-widest border border-white/20">Advanced Engine</span>
                                        </div>
                                        <p className="text-[20px] text-slate-400 font-medium max-w-3xl leading-relaxed">
                                            Don't see exactly what you need? Describe your unique business logic and Arkle will act as your lead developer to build a bespoke {selectedLauncherTool.label} in real-time.
                                        </p>
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 text-white transition-all duration-500 border border-white/10">
                                        <span className="material-symbols-outlined text-[40px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                    </div>
                                </div>
                            </button>

                            {/* Templates Grid - 3 Per Row Large Tiles */}
                            <div className="space-y-12">
                                <div className="flex items-center gap-6">
                                    <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Industry Blueprints</h4>
                                    <div className="h-px w-full bg-slate-100"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {(
                                        selectedLauncherTool.id === 'logo' ? LOGO_TEMPLATES :
                                            selectedLauncherTool.id === 'ecom' ? ECOM_REAL_TEMPLATES :
                                                WEB_TEMPLATES
                                    ).map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => {
                                                if ((template as any).path) {
                                                    router.push((template as any).path);
                                                } else {
                                                    startForging(`Clone Template ${template.id}: ${template.title}.`);
                                                }
                                            }}
                                            className="flex flex-col text-left group bg-white rounded-[40px] border border-slate-200/60 hover:border-blue-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Realistic Wireframe Thumbnail Preview */}
                                            <div className="aspect-[16/10] w-full relative overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center p-6">
                                                {/* Background Grid Pattern */}
                                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                                                {/* Website Skeleton / Browser Window */}
                                                <div className="w-full h-full bg-white rounded-t-xl rounded-b-md shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden flex flex-col transform group-hover:scale-[1.02] transition-transform duration-700">
                                                    {/* Browser Header */}
                                                    <div className="h-8 border-b border-slate-100 bg-slate-50 flex items-center px-3 gap-1.5 shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                    </div>

                                                    {/* Website Body Skeleton */}
                                                    <div className="flex-1 p-4 flex flex-col gap-4 relative">
                                                        {selectedLauncherTool.id === 'logo' ? (
                                                            // Logo Presentation Mode
                                                            <div className="flex-1 flex flex-col items-center justify-center">
                                                                <div className="w-24 h-24 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: `${template.color}15`, color: template.color }}>
                                                                    <span className="material-symbols-outlined text-[48px]">{template.icon}</span>
                                                                </div>
                                                                <div className="mt-4 w-32 h-3 rounded-full bg-slate-200"></div>
                                                            </div>
                                                        ) : (
                                                            // Ecom/Website Presentation Mode
                                                            <>
                                                                {/* Nav */}
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.color }}></div>
                                                                        <div className="w-16 h-2 rounded-full bg-slate-200"></div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <div className="w-8 h-1.5 rounded-full bg-slate-100"></div>
                                                                        <div className="w-8 h-1.5 rounded-full bg-slate-100"></div>
                                                                    </div>
                                                                </div>

                                                                {/* Hero Section */}
                                                                <div className="h-20 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: `${template.color}15` }}>
                                                                    <span className="material-symbols-outlined text-[40px] opacity-20 absolute" style={{ color: template.color }}>{template.icon}</span>
                                                                    <div className="flex flex-col items-center gap-2 relative z-10">
                                                                        <div className="w-32 h-3 rounded-full bg-white opacity-80"></div>
                                                                        <div className="w-24 h-2 rounded-full bg-white opacity-50"></div>
                                                                    </div>
                                                                </div>

                                                                {/* Grid Section */}
                                                                <div className="grid grid-cols-3 gap-3 flex-1">
                                                                    {[1, 2, 3].map(i => (
                                                                        <div key={i} className="rounded-md bg-slate-50 border border-slate-100 p-2 flex flex-col gap-2">
                                                                            <div className="flex-1 bg-slate-100 rounded"></div>
                                                                            <div className="w-full h-1.5 rounded-full bg-slate-200"></div>
                                                                            <div className="w-1/2 h-1.5 rounded-full bg-slate-200"></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* Gradient Fade for bottom overflow */}
                                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                                                    </div>
                                                </div>

                                                {/* Hover Action Overlay */}
                                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                                                    <div className="bg-white px-8 py-4 rounded-full shadow-2xl scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-100 font-black text-[13px] uppercase tracking-widest text-slate-900 flex items-center gap-2 hover:bg-slate-50">
                                                        <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                                                        Deploy Template
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-10 flex-1 bg-white">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.color }}></div>
                                                    <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">{template.category}</span>
                                                </div>
                                                <h4 className="text-[24px] font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">{template.title}</h4>
                                                <p className="text-[15px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{template.desc}</p>

                                                <div className="mt-8 flex items-center justify-between pt-8 border-t border-slate-50">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Certified Blueprint</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Expansive Footer CTA */}
                                <div className="mt-12 p-12 rounded-[40px] bg-slate-50 border border-slate-200/60 text-center">
                                    <h4 className="text-[20px] font-black text-slate-900 mb-4">Need a bespoke solution?</h4>
                                    <p className="text-slate-500 font-medium mb-8 max-w-xl mx-auto">Our 25+ templates are just the beginning. Arkle can clone any existing website or build custom tools for your specific business niche.</p>
                                    <button
                                        onClick={() => {
                                            startForging("Request custom industry template.");
                                        }}
                                        className="px-10 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md text-slate-900 font-black text-[14px] uppercase tracking-widest transition-all"
                                    >
                                        Contact Arkle Studio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    };

    const renderHome = () => {
        return (
            <div className="pb-12 flex flex-col items-center min-h-full px-4 animate-in fade-in duration-1000 relative overflow-hidden transition-all duration-1000"
                style={{ backgroundColor: theme.bgBase }}>

                {/* Premium Edge Shading (Left & Right Emphasis) & Mood Glow */}
                <div className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
                    style={{
                        background: `
                            radial-gradient(circle at 50% 35%, ${theme.primary}18 0%, transparent 60%),
                            linear-gradient(to right, white 0%, transparent 20%, transparent 80%, white 100%),
                            linear-gradient(to bottom, white 0%, transparent 15%, transparent 85%, white 100%)
                         `
                    }}></div>

                {/* Soft Centralized Pulse */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] md:h-[500px] blur-[100px] md:blur-[140px] rounded-full pointer-events-none opacity-20 transition-all duration-1000 z-0 animate-pulse"
                    style={{ backgroundColor: theme.primary }}></div>

                {/* Main Header - Refined Hierarchy */}
                <div className="text-center mt-24 mb-12 w-full max-w-5xl px-4 relative z-10">
                    <h1 className="text-[42px] md:text-[52px] font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase transition-opacity duration-300" style={{ opacity: isMounted ? 1 : 0.8 }}>
                        Hi {isMounted ? (user?.role || firstName) : 'Founder'},
                    </h1>

                    <div className="flex items-center justify-center gap-3 text-[20px] md:text-[24px] font-bold text-slate-500 tracking-tight">
                        <span>
                            {topTab === 'launcher' || topTab === 'tool-lab' ? "Let's Build" :
                                topTab === 'agents' ? "Hire a new" : "Let's Discuss"}
                        </span>
                        {isMounted ? (
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentWords[wordIndex % currentWords.length]}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="px-5 py-1.5 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 text-[18px] font-black uppercase tracking-widest inline-block"
                                    style={{ color: theme.primary }}
                                >
                                    {currentWords[wordIndex % currentWords.length]}
                                </motion.span>
                            </AnimatePresence>
                        ) : (
                            <span className="px-5 py-1.5 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 text-[18px] font-black uppercase tracking-widest inline-block" style={{ color: theme.primary }}>
                                {currentWords[0]}
                            </span>
                        )}
                        {(topTab === 'launcher' || topTab === 'tool-lab') && <span>something big.</span>}
                    </div>
                </div>

                {/* Central Attached Prompt Box UI */}
                <div className="w-full max-w-[760px] mx-auto relative z-20 mt-16 mb-10">

                    {/* The Main Pill Prompt Box */}
                    <div className="w-full bg-white rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 p-2 relative pt-8">

                        {/* --- TOP EMBEDDED COMPONENTS --- */}
                        {/* 1. Mode Selector Pill - PREMIUM UPGRADE */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-[#f1f5f9]/60 backdrop-blur-3xl shadow-[0_15px_30px_rgba(0,0,0,0.05)] p-1.5 rounded-full border border-white/80 z-30 ring-1 ring-black/[0.02]">

                            <div className="flex items-center relative z-10 px-1">
                                {[
                                    { id: 'arkle', icon: 'neurology', label: 'Arkle' },
                                    { id: 'launcher', icon: 'rocket_launch', label: 'Launcher' },
                                    { id: 'tool-lab', icon: 'grid_view', label: 'Tool Lab' },
                                    { id: 'agents', icon: 'smart_toy', label: 'Agents' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setTopTab(tab.id as any)}
                                        className="relative flex items-center justify-center w-[58px] h-10 transition-all duration-300 z-10 group/tab"
                                    >
                                        {topTab === tab.id && (
                                            <motion.div
                                                layoutId="activeModePill"
                                                className="absolute inset-0 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08)] rounded-full border border-white -z-10"
                                                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                            />
                                        )}
                                        <span
                                            className={`material-symbols-outlined text-[24px] transition-all duration-300 ${topTab === tab.id ? 'scale-110' : 'text-slate-400 group-hover/tab:text-slate-600'}`}
                                            style={{ color: topTab === tab.id ? theme.primary : undefined }}
                                        >
                                            {tab.icon}
                                        </span>

                                        {/* Hover Indicator */}
                                        {topTab !== tab.id && (
                                            <div className="absolute inset-0 bg-slate-900/[0.03] opacity-0 group-hover/tab:opacity-100 transition-opacity rounded-[20px] m-1"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Paper Rocket (Send) Icon - Screenshot Match */}
                        <div className="absolute top-0 left-1/2 ml-[200px] -translate-y-1/2 z-30 group/rocket">
                            <div className="relative">
                                <span className="material-symbols-outlined text-[22px] text-blue-500/30 -rotate-12 group-hover/rocket:rotate-0 transition-all duration-500 cursor-pointer animate-rocket-hover">send</span>
                            </div>
                        </div>

                        {/* --- END TOP EMBEDDED COMPONENTS --- */}

                        <textarea
                            ref={(el) => {
                                if (el) {
                                    el.style.height = 'auto';
                                    el.style.height = `${Math.min(Math.max(el.scrollHeight, 96), 220)}px`;
                                }
                            }}
                            value={isVoiceActive && (appState === 'home') && liveTranscript ? liveTranscript : promptInput}
                            onChange={(e) => {
                                setPromptInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(Math.max(e.target.scrollHeight, 96), 220)}px`;
                            }}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter' && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    handleDirectSubmit(); 
                                    if (e.currentTarget) e.currentTarget.style.height = '96px';
                                } 
                            }}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent border-none outline-none text-[18px] font-medium text-slate-700 placeholder-slate-400 px-8 pt-5 pb-8 resize-none custom-scrollbar min-h-[96px] max-h-[220px] transition-[height] duration-100"
                            rows={2}
                        />

                        {/* Bottom Task Bar */}
                        <div className="flex items-center justify-between px-6 pb-2">
                            <div className="flex items-center gap-3">
                                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors" title="Upload / Add File">
                                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                                </button>
                                <select
                                    value={selectedAIModel}
                                    onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                    className="bg-transparent border border-slate-200/60 rounded-lg px-2.5 py-1 text-slate-600 text-[11px] font-semibold tracking-tight outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                                    title="Select AI Model"
                                >
                                    <option value="dummy">Dummy Model</option>
                                    <option value="gemini">Gemini 1.5 Pro</option>
                                    <option value="gemini-flash">Gemini 1.5 Flash</option>
                                    <option value="gpt4o">GPT-4o</option>
                                    <option value="gpt4-turbo">GPT-4 Turbo</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={toggleVoice} className={`w-10 h-10 flex items-center justify-center transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-slate-700'}`} title="Voice Typing (Dictation)">
                                    <span className="material-symbols-outlined text-[24px]">mic</span>
                                </button>
                                <button onClick={() => setIsVoiceActive(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors mx-1" title="Live Voice Mode">
                                    <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                                </button>
                                <button onClick={() => handleDirectSubmit()} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors" title="Send (Enter)">
                                    <span className="material-symbols-outlined text-[24px]">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Chat Tiles under Prompt Box for Arkle Mode matching screenshot exactly */}
                {topTab === 'arkle' && (
                    <div className="w-full max-w-4xl mx-auto mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 relative z-20">
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                            {[
                                { label: 'Growth Gaps', icon: 'auto_awesome', prompt: 'Identify growth gaps in my business model and suggest strategies' },
                                { label: 'AI Automation', icon: 'alt_route', prompt: 'Where can I apply AI automation to streamline daily operations?' },
                                { label: 'Tech Solutions', icon: 'monitoring', prompt: 'Recommend technical solutions to scale my startup ecosystem' },
                                { label: 'Social Plan', icon: 'rocket_launch', prompt: 'Generate a complete social media plan for brand awareness' }
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPromptInput(item.prompt)}
                                    className="px-5 py-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-white/60 hover:border-blue-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-blue-600 group-hover:rotate-12 transition-transform">
                                        {item.icon}
                                    </span>
                                    <span className="text-[13px] font-bold text-slate-800 tracking-tight whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub UI for specific modes - Edge-to-Edge Enabled */}
                <div className="w-full px-0 mt-12 relative z-10">


                    {/* Launcher/Tool Lab UI Integration */}
                    {(topTab === 'launcher' || topTab === 'tool-lab') && (
                        <div className="w-full">
                            {topTab === 'launcher' && renderLauncherUI()}
                            {topTab === 'tool-lab' && renderToolLabUI()}
                        </div>
                    )}

                    {/* Agents Mode Below Card */}
                    {topTab === 'agents' && (
                        <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 mt-8">
                            <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100 p-12 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/30"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                        <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                                    </div>
                                    <h2 className="text-[32px] md:text-[48px] font-black text-[#0f172a] mb-2 tracking-tight italic pr-4 leading-tight">Your AI Employees.</h2>
                                    <p className="text-[16px] text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">Hire specialized AI Agents to handle your marketing, research, and technical operations while you sleep.</p>
                                    <div className="mt-8 flex justify-center gap-3">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Active Workforce</p>
                                            <p className="text-[10px] font-bold text-slate-400">Ready to execute missions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Employees Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                {DIGITAL_EMPLOYEES.map(emp => (
                                    <div key={emp.id} className="bg-white rounded-[32px] border border-slate-200/60 p-8 flex flex-col justify-between hover:border-blue-500 hover:shadow-2xl transition-all duration-500 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full group-hover:scale-150 transition-transform"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${emp.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform`}>
                                                    <span className="material-symbols-outlined text-[28px]">{emp.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-[16px] font-black text-slate-900 leading-tight">{emp.name}</h3>
                                                    <p className="text-[11px] font-bold text-blue-600">{emp.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">{emp.desc}</p>
                                            
                                            {/* Capabilities */}
                                            <div className="space-y-2 mb-8">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Capabilities</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(emp.capabilities || []).map((cap, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600">
                                                            {cap}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedAgentId(emp.id);
                                                setAppState('agent-workspace');
                                            }}
                                            className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-[12px] rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 relative z-10"
                                        >
                                            <span>Hire / Manage Agent</span>
                                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    /* ── Render: Building ──────────────────────────────── */
    const renderBuilding = () => (
        <div className="flex flex-col items-center justify-center h-full px-4 animate-in zoom-in-95 duration-500">
            <div className="max-w-md w-full text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-[3px] border-[#e6e9ef] rounded-full"></div>
                    <div className="absolute inset-0 border-[3px] border-t-[#0073ea] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <span className="text-[24px]">🚀</span>
                    </div>
                </div>
                <h2 className="text-[20px] font-medium text-[#323338] mb-1">Building your ecosystem</h2>
                <p className="text-[14px] text-[#676879] mb-8">{buildProgress}% complete</p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#e6e9ef] rounded-full mb-8 overflow-hidden">
                    <div className="h-full bg-[#0073ea] rounded-full transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                </div>

                {/* Asset status list */}
                <div className="space-y-2 text-left">
                    {builtAssets.map(asset => (
                        <div key={asset.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#f9fafb] border border-[#e6e9ef]">
                            <span className="material-symbols-outlined text-[18px]" style={{ color: asset.color }}>{asset.icon}</span>
                            <span className="text-[14px] text-[#323338] font-normal flex-1">{asset.label}</span>
                            {asset.status === 'pending' && <span className="text-[12px] text-[#b8bccc]">Queued</span>}
                            {asset.status === 'building' && <span className="material-symbols-outlined text-[16px] text-[#0073ea] animate-spin">progress_activity</span>}
                            {asset.status === 'done' && <span className="material-symbols-outlined text-[16px] text-[#00c875]">check_circle</span>}
                            {asset.status === 'failed' && <span className="material-symbols-outlined text-[16px] text-red-500">error</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ── Render: Ready ─────────────────────────────────── */
    const renderReady = () => (
        <div className="max-w-3xl mx-auto pt-10 px-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e9ef]">
                <div>
                    <h2 className="text-[22px] font-medium text-[#323338]">Your ecosystem is ready! 🎉</h2>
                    <p className="text-[14px] text-[#676879] mt-0.5">{builtAssets.length} assets built — click to open & customize</p>
                </div>
                <button onClick={() => { setAppState('home'); setBuildProgress(0); }} className="px-3 py-2 border border-[#c3c6d4] text-[#323338] text-[13px] rounded-lg hover:bg-[#f5f6f8] transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    New Build
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {builtAssets.map(asset => (
                    <div key={asset.id} onClick={() => asset.status === 'done' && setViewingAsset(asset)} className="bg-white p-5 rounded-xl border border-[#e6e9ef] hover:border-[#0073ea] hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: `${asset.color}18` }}>
                            <span className="material-symbols-outlined text-[20px]" style={{ color: asset.color }}>{asset.icon}</span>
                        </div>
                        <h3 className="text-[15px] text-[#323338] font-medium">{asset.label}</h3>
                        <p className="text-[12px] text-[#676879] mt-1">{asset.status === 'done' ? 'Click to view' : 'Generation failed'}</p>
                        <div className={`flex items-center gap-1 mt-3 text-[12px] font-medium ${asset.status === 'done' ? 'text-[#00c875]' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-[14px]">{asset.status === 'done' ? 'check_circle' : 'error'}</span>
                            {asset.status === 'done' ? 'Generated securely' : 'Failed'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Business context summary if available */}
            {bizCtx.idea && (
                <div className="mt-8 p-5 rounded-xl bg-[#f5f6f8] border border-[#e6e9ef]">
                    <h3 className="text-[14px] font-medium text-[#323338] mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#0073ea]">psychology</span>
                        Business Context Captured
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                        {bizCtx.idea && <div><span className="text-[#676879]">Idea:</span> <span className="text-[#323338]">{bizCtx.idea}</span></div>}
                        {bizCtx.audience && <div><span className="text-[#676879]">Audience:</span> <span className="text-[#323338]">{bizCtx.audience}</span></div>}
                        {bizCtx.stage && <div><span className="text-[#676879]">Stage:</span> <span className="text-[#323338]">{bizCtx.stage}</span></div>}
                        {bizCtx.model && <div><span className="text-[#676879]">Model:</span> <span className="text-[#323338]">{bizCtx.model}</span></div>}
                    </div>
                </div>
            )}
        </div>
    );

    /* ── Render: Digital Employee Workspace ─────────────────────────── */
    const renderAgentWorkspace = () => {
        const agent = DIGITAL_EMPLOYEES.find(a => a.id === selectedAgentId);
        if (!agent) return null;

        const currentTasks = agentTasks.filter(t => t.agentId === selectedAgentId);
        const inProgressTasks = currentTasks.filter(t => t.status === 'in-progress');
        const doneTasks = currentTasks.filter(t => t.status === 'done');

        return (
            <div className="flex flex-col h-full bg-[#f4f7fe] animate-in fade-in slide-in-from-right-8 duration-500 relative z-0">
                {/* Workspace Header */}
                <div className="bg-white px-6 py-5 border-b border-[#e6e9ef] shadow-sm flex items-center justify-between shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setAppState('home')} className="w-8 h-8 rounded-full hover:bg-[#f5f6f8] flex items-center justify-center text-[#676879] transition-colors border border-[#e6e9ef] hover:border-[#c3c6d4]">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md relative bg-gradient-to-br ${agent.color} text-white`}>
                                <span className="material-symbols-outlined text-[24px]">{agent.icon}</span>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00c875] border-2 border-white flex items-center justify-center shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-[18px] font-bold text-[#323338] leading-tight flex items-center gap-2">
                                    {agent.name}
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-800 text-white">AI Worker</span>
                                </h1>
                                <p className="text-[13px] text-[#676879] flex items-center gap-1.5 mt-0.5">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                    {agent.role} &bull; Ready to execute
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-[#e6e9ef] rounded-lg text-[13px] text-[#676879] font-medium hover:bg-[#f5f6f8] transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">settings</span>
                            Train Agent
                        </button>
                    </div>
                </div>

                {/* Workspace Board (Monday.com concept) */}
                <div className="flex-1 overflow-x-auto overflow-y-auto p-6 flex items-start gap-6 no-scrollbar relative z-0">
                    {/* Backlog / Inbox Column */}
                    <div className="w-[320px] shrink-0 flex flex-col gap-3">
                        <div className="bg-[#eef5ff] text-[#0073ea] px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-between border border-blue-100 shadow-xs">
                            Inbox / Backlog <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm">Demo</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#e6e9ef] shadow-sm cursor-grab hover:border-[#0073ea] transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">Example</span>
                            </div>
                            <p className="text-[14px] text-[#323338] font-medium leading-snug">Generate {agent.role} strategy report for Q3</p>
                            <div className="mt-3 flex items-center gap-2 text-[#676879] text-[12px]">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                Suggested
                            </div>
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="w-[320px] shrink-0 flex flex-col gap-3">
                        <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-between border border-orange-100 shadow-xs">
                            Working <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm animate-pulse">{inProgressTasks.length}</span>
                        </div>
                        {inProgressTasks.map((t) => (
                            <div key={t.id} className="bg-white p-4 rounded-xl border border-[#e6e9ef] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-2 ring-orange-500/20">
                                <p className="text-[14px] text-[#323338] font-medium mb-3">{t.title}</p>
                                <div className="w-full bg-[#f5f6f8] h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[60%] animate-pulse"></div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit capitalize">
                                    <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                                    Arkle Processing
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Done Column */}
                    <div className="w-[350px] shrink-0 flex flex-col gap-3">
                        <div className="bg-[#e6fff4] text-[#00c875] px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-between border border-green-100 shadow-xs">
                            Done <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm">{doneTasks.length}</span>
                        </div>
                        {doneTasks.map((t) => (
                            <div key={t.id} className="bg-white p-4 rounded-xl border border-[#e6e9ef] shadow-sm overflow-hidden flex flex-col gap-2">
                                <div className="flex items-start gap-2 border-b border-[#f0f1f3] pb-3">
                                    <span className="material-symbols-outlined text-[16px] text-green-500 shrink-0 mt-0.5">check_circle</span>
                                    <p className="text-[13px] text-[#323338] font-medium leading-tight">{t.title}</p>
                                </div>
                                <div className="text-[12px] text-[#676879] whitespace-pre-wrap mt-1 bg-[#f5f6f8] p-3 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
                                    {t.result}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-[#e6e9ef] shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-8 relative flex flex-col items-center">
                    <div className="max-w-[960px] w-full mx-auto bg-white/95 border border-slate-200/40 backdrop-blur-xl rounded-[20px] flex flex-col p-3 shadow-2xl focus-within:border-blue-500/20 transition-all duration-500">
                        {/* Top: Dynamic Task Prompt */}
                        <input
                            value={isRecording && liveTranscript ? liveTranscript : agentTaskInput}
                            onChange={(e) => setAgentTaskInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAgentTaskSubmit(); }}
                            placeholder={`Assign a task to ${agent.name}...`}
                            className="w-full bg-transparent outline-none text-[14px] text-slate-800 placeholder-slate-400 mb-1.5"
                            disabled={isAgentWorking}
                        />

                        {/* Bottom: Razor-Thin Action Bar */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100/30">
                            <div className="flex items-center gap-3">
                                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all" title="Upload Assets">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                </button>
                                <select
                                    value={selectedAIModel}
                                    onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                    className="bg-transparent border-none text-[8px] font-black text-slate-800 uppercase tracking-widest outline-none cursor-pointer"
                                >
                                    <option value="gemini">Gemini</option>
                                    <option value="gpt4">GPT-4</option>
                                    <option value="claude">Claude</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleVoice}
                                    className={`w-6 h-6 flex items-center justify-center transition-all ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-900'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{isRecording ? 'graphic_eq' : 'waves'}</span>
                                </button>
                                <button
                                    onClick={() => handleAgentTaskSubmit()}
                                    className="w-6 h-6 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                    style={{ color: theme.primary }}
                                >
                                    <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── Agent Workspace Flow ────────────────────────────── */
    const handleAgentTaskSubmit = async (overrideText?: string) => {
        const textToSubmit = overrideText || agentTaskInput;
        if (!textToSubmit.trim() || !selectedAgentId || isAgentWorking) return;

        const newTask = {
            id: Date.now().toString(),
            agentId: selectedAgentId,
            title: textToSubmit,
            status: 'in-progress',
            result: null
        };

        setAgentTasks(prev => [...prev, newTask]);
        setAgentTaskInput('');
        setIsAgentWorking(true);

        try {
            // Using the sales agent API as a universal backend for now
            const res = await fetch('/api/agents/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: newTask.title,
                    context: bizCtx
                })
            });

            const data = await res.json();

            if (res.ok && data.result) {
                setAgentTasks(prev => prev.map(t =>
                    t.id === newTask.id ? { ...t, status: 'done', result: data.result } : t
                ));
                // Speak out the actual response clearly without markdown characters
                speak(data.result.replace(/[*_#\[\]]/g, '').slice(0, 300) + (data.result.length > 300 ? '...' : ''));
            } else {
                setAgentTasks(prev => prev.map(t =>
                    t.id === newTask.id ? { ...t, status: 'done', result: `⚠️ API Error: ${data.error || 'Unknown error'}. ${data.details || ''}` } : t
                ));
            }
        } catch (e: any) {
            setAgentTasks(prev => prev.map(t =>
                t.id === newTask.id ? { ...t, status: 'done', result: `Failed to connect to agent backend: ${e.message}` } : t
            ));
        } finally {
            setIsAgentWorking(false);
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-white relative" style={{ zoom: 0.85 }}>

            {/* Main Content */}
            {/* Main Content Area with Atmospheric Mood Surface (Vibrant Mode for Launcher) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-[#090b1a] transition-all duration-1000 z-10">
                {/* ══════ VIBRANT ATMOSPHERIC SURFACE ══════ */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {/* Primary Atmospheric Glow */}
                    <div
                        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-[100%] opacity-30 blur-[120px] transition-all duration-1000"
                        style={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` }}
                    ></div>

                    {/* Secondary Accent Pulse */}
                    <div
                        className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] transition-all duration-1000 animate-pulse"
                        style={{ background: theme.primary }}
                    ></div>

                    {/* Technical Grid Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                </div>





                {/* QA Overlay */}
                <QAOverlay isScanning={forgeStatus === 'generating' || appState === 'building'} />



                {/* Content Router */}
                {appState === 'home' && renderHome()}
                {appState === 'discuss' && renderChat(chatThread, chatInput, setChatInput, handleDiscussSubmit, chatEndRef, 'Co-Founder Discussion')}
                {appState === 'building' && renderBuilding()}
                {appState === 'ready' && renderReady()}
                {appState === 'agent-workspace' && renderAgentWorkspace()}
            </div>

            {/* Inner Sidebar: Hover-Expandable Contextual Tray (Hidden in active tasks) */}
            <AnimatePresence>
                {(appState === 'home' || appState === 'agent-workspace') && (
                    <motion.div
                        key="launchpad-inner-sidebar"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: isTrayExpanded ? 280 : 64, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        onMouseEnter={() => setIsTrayExpanded(true)}
                        onMouseLeave={() => setIsTrayExpanded(false)}
                        className="shrink-0 h-full border-l border-[#e6e9ef] bg-white transition-all duration-500 ease-in-out z-30 shadow-2xl overflow-hidden"
                    >
                        <div className="p-0 flex flex-col h-full bg-[#fcfcfd] overflow-hidden">

                            {/* Header by Mode */}
                            <div className={`p-4 pt-8 transition-all duration-500 ${isTrayExpanded ? 'opacity-100' : 'opacity-0 scale-90 translate-x-10'}`}>
                                {topTab === 'arkle' && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Arkle Intelligence</h3>
                                        <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Brain Memory</h2>
                                    </div>
                                )}
                                {topTab === 'launcher' && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Launcher Center</h3>
                                        <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Startup Assets</h2>
                                    </div>
                                )}
                                {topTab === 'tool-lab' && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Development Lab</h3>
                                        <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Tool Factory</h2>
                                    </div>
                                )}
                                {topTab === 'agents' && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Your AI Employees</h3>
                                        <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">AI Agents</h2>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Action Buttons */}
                            <div className="px-3 space-y-3 mt-4">
                                {topTab === 'arkle' && (
                                    <>
                                        <button onClick={() => setAppState('home')} className={`w-full flex items-center bg-[#0073ea] text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 justify-between' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-[20px]">add_comment</span>
                                                {isTrayExpanded && <span className="text-[13px] font-bold">New Session</span>}
                                            </div>
                                            {isTrayExpanded && <span className="text-[10px] opacity-60">⌘K</span>}
                                        </button>
                                        <button className={`w-full flex items-center bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <span className="material-symbols-outlined text-[20px]">psychology</span>
                                            {isTrayExpanded && <span className="text-[13px] font-bold">Strategy Lab</span>}
                                        </button>
                                    </>
                                )}
                                {topTab === 'launcher' && (
                                    <>
                                        <button onClick={() => setAppState('home')} className={`w-full flex items-center bg-[#00c875] text-white rounded-2xl shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                            {isTrayExpanded && <span className="text-[13px] font-bold">Launch Hub</span>}
                                        </button>
                                        <button className={`w-full flex items-center bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <span className="material-symbols-outlined text-[20px]">branding_watermark</span>
                                            {isTrayExpanded && <span className="text-[13px] font-bold">Brand Kit</span>}
                                        </button>
                                    </>
                                )}
                                {topTab === 'tool-lab' && (
                                    <>
                                        <button onClick={() => startForging("Build a new business tool")} className={`w-full flex items-center bg-[#ff7b00] text-white rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                                            {isTrayExpanded && <span className="text-[13px] font-bold">Build App</span>}
                                        </button>
                                        <button className={`w-full flex items-center bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <span className="material-symbols-outlined text-[20px]">extension</span>
                                            {isTrayExpanded && <span className="text-[13px] font-bold">Skill Library</span>}
                                        </button>
                                    </>
                                )}
                                {topTab === 'agents' && (
                                    <>
                                        <button onClick={() => setAppState('home')} className={`w-full flex items-center bg-[#f59e0b] text-white rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                                            {isTrayExpanded && <span className="text-[13px] font-bold">Hire Agent</span>}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Contextual History/List */}
                            <div className={`flex-1 overflow-y-auto no-scrollbar px-3 mt-10 transition-all duration-500 ${isTrayExpanded ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History</span>
                                    <span className="material-symbols-outlined text-slate-300 text-[16px]">history</span>
                                </div>

                                <div className="space-y-1">
                                    {topTab === 'arkle' && (
                                        <>
                                            {chatThread.filter(m => m.role === 'user').length > 0 ? (
                                                chatThread.filter(m => m.role === 'user').slice(-5).reverse().map((msg, i) => (
                                                    <button key={i} onClick={() => setAppState('discuss')} className="w-full px-3 py-2 text-left rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all text-[12px] font-medium flex items-center gap-2 truncate group">
                                                        <span className="material-symbols-outlined text-[14px] opacity-40 group-hover:opacity-100 transition-opacity">chat_bubble</span>
                                                        <span className="truncate">{msg.text}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="px-3 py-2 text-[11px] text-slate-400 italic">No recent prompts.</p>
                                            )}
                                        </>
                                    )}
                                    {topTab === 'launcher' && (
                                        <>
                                            {builtAssets.length > 0 ? (
                                                builtAssets.filter(a => a.status === 'done').map(asset => (
                                                    <button key={asset.id} className="w-full px-3 py-2 text-left rounded-lg text-slate-500 hover:bg-slate-50 hover:text-green-600 transition-all text-[12px] font-medium flex items-center gap-2 truncate">
                                                        <span className="material-symbols-outlined text-[14px]" style={{ color: asset.color }}>{asset.icon}</span>
                                                        {asset.label}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-[11px] text-slate-400 italic px-3">No assets yet.</p>
                                            )}
                                        </>
                                    )}
                                    {topTab === 'tool-lab' && (
                                        <>
                                            {solThread.filter(m => m.role === 'user').length > 0 ? (
                                                solThread.filter(m => m.role === 'user').slice(-5).reverse().map((msg, i) => (
                                                    <button key={i} onClick={() => setAppState('home')} className="w-full px-3 py-2 text-left rounded-lg text-slate-500 hover:bg-slate-50 hover:text-orange-600 transition-all text-[12px] font-medium flex items-center gap-2 truncate group">
                                                        <span className="material-symbols-outlined text-[14px] opacity-40 group-hover:opacity-100 transition-opacity">lightbulb</span>
                                                        <span className="truncate">{msg.text}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="px-3 py-2 text-[11px] text-slate-400 italic">No history.</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Status / Profile */}
                            <div className="mt-auto p-2 border-t border-slate-100 bg-slate-50/50">
                                <div className={`flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm transition-all ${isTrayExpanded ? 'w-full px-3 py-3' : 'w-10 h-10 justify-center p-0 mx-auto'}`}>
                                    <div className="shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                                        {firstName[0]}
                                    </div>
                                    {isTrayExpanded && (
                                        <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2">
                                            <p className="text-[11px] font-black text-slate-800 truncate">{firstName}'s Hub</p>
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Active</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c3c6d4; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #676879; }
                
                @keyframes voice-wave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(2); }
                }
                .animate-voice-wave {
                    animation: voice-wave 0.6s ease-in-out infinite;
                }
            `}</style>
            <WelcomeModal />
            <DiscoveryWizard />
            <MagicLoading />

            {/* Asset Viewer Modal */}
            {viewingAsset && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in py-10 px-5">
                    <div className="bg-[#f0f1f3] w-full max-w-7xl h-full rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#e6e9ef] bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${viewingAsset.color}20` }}>
                                    <span className="material-symbols-outlined text-[20px]" style={{ color: viewingAsset.color }}>{viewingAsset.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#323338]">{bizCtx.businessName || 'Your'} {viewingAsset.label}</h3>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#00c875] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c875] animate-pulse"></span>
                                        Arkle AI Generated
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-5 py-2 bg-[#0073ea] text-white font-bold text-[13px] rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">download</span> Download
                                </button>
                                <button onClick={() => setViewingAsset(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#323338] transition-colors border border-transparent hover:border-slate-300">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center relative">
                            {viewingAsset.id === 'website' ? (
                                <div className="w-full h-full bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200">
                                    <div className="bg-slate-100 py-2 px-4 border-b border-slate-200 flex items-center gap-2">
                                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                                        <div className="mx-auto bg-white border border-slate-200 rounded-md px-4 py-0.5 text-[11px] text-slate-500 w-1/2 text-center truncate">
                                            https://{bizCtx.businessName ? bizCtx.businessName.toLowerCase().replace(/\s+/g, '') : 'startup'}.setmybizz.com
                                        </div>
                                    </div>
                                    <iframe
                                        srcDoc={viewingAsset.result}
                                        className="w-full h-[calc(100%-36px)]"
                                        title="Website Preview"
                                    />
                                </div>
                            ) : viewingAsset.id === 'logo' ? (
                                <div className="max-w-2xl w-full aspect-square bg-[#1c1f3b] rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:400%_400%] animate-shine pointer-events-none"></div>
                                    {viewingAsset.result ? (
                                        <div className="w-3/4 h-3/4 p-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-105" dangerouslySetInnerHTML={{ __html: viewingAsset.result }} />
                                    ) : (
                                        <span className="text-white">SVG Failed to render</span>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl min-h-full bg-white shadow-xl p-10 rounded-2xl border border-slate-200 font-serif">
                                    <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                                        {viewingAsset.result}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .font-outfit { font-family: 'Outfit', sans-serif; }
                @keyframes voice-wave {
                    0%, 100% { transform: scaleY(1); opacity: 0.3; }
                    50% { transform: scaleY(1.8); opacity: 1; }
                }
                .animate-voice-wave {
                    animation: voice-wave 0.8s ease-in-out infinite;
                }
                @keyframes thread-flow {
                    0% { stroke-dashoffset: 40; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-thread-flow {
                    animation: thread-flow 2s linear infinite;
                }
                @keyframes rocket-hover {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-3px) rotate(-8deg); }
                }
                .animate-rocket-hover {
                    animation: rocket-hover 3s ease-in-out infinite;
                }
            `}</style>

            {/* RENDER PURE CREATION IDE IF ACTIVE */}
            {forgeStatus !== 'idle' && renderPureCreationForge()}

            {showProjectLibrary && (
                <ProjectLibraryModal
                    show={showProjectLibrary}
                    onClose={() => setShowProjectLibrary(false)}
                    userId={user?.id || undefined}
                    onSelectProject={handleSelectProject}
                />
            )}

            {showGoogleAuth && (
                <GoogleIntegrationModal 
                    onClose={() => setShowGoogleAuth(false)}
                    onConnect={() => {
                        setIsGoogleConnected(true);
                        setShowGoogleAuth(false);
                    }}
                />
            )}

        </div>
    );
};

export default LaunchPadTab;
