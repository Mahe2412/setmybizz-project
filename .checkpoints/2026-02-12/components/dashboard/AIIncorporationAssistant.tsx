"use client";

import React, { useState } from 'react';
import { BusinessData } from '@/types';
import LeadCaptureModal from '../LeadCaptureModal';
import { useAuth } from '@/context/AuthContext';

interface AIIncorporationAssistantProps {
    onComplete?: (data: BusinessData) => void;
}

export default function AIIncorporationAssistant({ onComplete }: AIIncorporationAssistantProps) {
    const { user } = useAuth();
    const isGuest = !user;

    const [showChatbot, setShowChatbot] = useState(false);
    const [showFlowPopup, setShowFlowPopup] = useState(false);
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; message: string }>>([
        {
            role: 'ai',
            message: 'Hello! I\'m your AI Incorporation Assistant. I can help you with business registration, compliance, and setup. What would you like to know?'
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    // Flow Pages State
    const [currentFlowStep, setCurrentFlowStep] = useState(0);
    const [businessData, setBusinessData] = useState<Partial<BusinessData>>({});

    // Contact step for guests (first step)
    const guestContactStep = {
        id: 'contact',
        question: 'Almost there! Where should we send your Tailor-Made Setup Plan?',
        type: 'contact',
        placeholder: '',
        options: [] as string[]
    };

    const mainFlowSteps = [
        {
            id: 'businessName',
            question: 'What is your business name?',
            placeholder: 'Enter your business name',
            type: 'text'
        },
        {
            id: 'stage',
            question: 'What stage is your business in?',
            options: ['Idea Stage', 'MVP Ready', 'Pre-Revenue', 'Revenue Generating', 'Scaling'],
            type: 'select'
        },
        {
            id: 'industry',
            question: 'Which industry are you in?',
            options: ['Technology', 'E-commerce', 'Healthcare', 'Education', 'Finance', 'Manufacturing', 'Services', 'Other'],
            type: 'select'
        },
        {
            id: 'focus',
            question: 'What is your primary focus?',
            options: ['B2B', 'B2C', 'B2B2C', 'D2C', 'Marketplace'],
            type: 'select'
        },
        {
            id: 'teamSize',
            question: 'How many team members do you have?',
            options: ['Just Me', '2-5', '6-10', '11-20', '20+'],
            type: 'select'
        },
        {
            id: 'funding',
            question: 'Have you raised funding?',
            options: ['Bootstrapped', 'Angel Round', 'Seed Round', 'Series A+', 'Not Yet'],
            type: 'select'
        },
        {
            id: 'location',
            question: 'Where is your business located?',
            placeholder: 'City, State',
            type: 'text'
        },
        {
            id: 'goal',
            question: 'What is your primary goal for the next 6 months?',
            placeholder: 'E.g., Launch MVP, Get first customers, Raise funding...',
            type: 'textarea'
        }
    ];

    // Combine steps: main steps first, then contact at the end for guests (Soft Collection)
    const flowSteps = isGuest ? [...mainFlowSteps, guestContactStep] : mainFlowSteps;
    const totalSteps = flowSteps.length;

    const handleSendMessage = () => {
        if (!userInput.trim()) return;

        setChatMessages(prev => [...prev, { role: 'user', message: userInput }]);

        setTimeout(() => {
            let aiResponse = '';

            const input = userInput.toLowerCase();

            if (input.includes('register') || input.includes('incorporation')) {
                aiResponse = 'For business incorporation in India, you can choose from: Private Limited Company (most popular for startups), LLP (for partnerships), or Sole Proprietorship (for solo entrepreneurs). Which one interests you?';
            } else if (input.includes('private limited') || input.includes('pvt ltd')) {
                aiResponse = 'Private Limited Company is great for startups! Benefits: Limited liability, easier to raise funding, separate legal entity. Required: 2 directors, 2 shareholders, DIN, DSC. Timeline: 10-15 days. Cost starts at ₹6,999. Would you like to start the process?';
            } else if (input.includes('gst')) {
                aiResponse = 'GST registration is required if your turnover exceeds ₹40 lakhs (₹20 lakhs for services). Timeline: 3-7 days. Documents needed: PAN, Aadhaar, Business proof. Cost: ₹2,499. Need help with GST registration?';
            } else if (input.includes('trademark')) {
                aiResponse = 'Trademark registration protects your brand name and logo. Timeline: 12-18 months. Cost: ₹4,999 onwards. Benefits: Exclusive rights, legal protection, brand value. Shall I help you search for trademark availability?';
            } else if (input.includes('cost') || input.includes('price')) {
                aiResponse = 'Here are our incorporation packages:\n• Basic: ₹6,999 (Pvt Ltd registration)\n• Standard: ₹12,999 (Pvt Ltd + GST)\n• Premium: ₹24,999 (Pvt Ltd + GST + Trademark)\nAll include: Name approval, MOA/AOA, Certificate of Incorporation, PAN, TAN. What package suits you?';
            } else if (input.includes('time') || input.includes('duration')) {
                aiResponse = 'Typical timelines:\n• Pvt Ltd Company: 10-15 days\n• GST Registration: 3-7 days\n• Trademark: 12-18 months\n• MSME: 1-2 days\nWant to get started with a customized plan?';
            } else if (input.includes('document')) {
                aiResponse = 'For Private Limited Company, you need:\n• PAN Card (all directors)\n• Aadhaar Card (all directors)\n• Passport size photos\n• Address proof (utility bill)\n• Rent agreement (if office is rented)\nI can help you prepare these documents. Ready to proceed?';
            } else {
                aiResponse = 'I can help you with: Business Incorporation, GST Registration, Trademark, MSME, Compliance, and more. You can also click "Get Tailor-Made Business Setup" for a personalized plan. What would you like to explore?';
            }

            setChatMessages(prev => [...prev, { role: 'ai', message: aiResponse }]);

            // After 3+ messages, suggest login for guests
            if (isGuest && chatMessages.length >= 5) {
                setTimeout(() => {
                    setChatMessages(prev => [...prev, {
                        role: 'ai',
                        message: '💡 To save your conversation and get personalized recommendations, please create an account. It takes just 1 minute!'
                    }]);
                }, 1500);
            }
        }, 800);

        setUserInput('');
    };

    const handleFlowAnswer = (value: string) => {
        const currentStep = flowSteps[currentFlowStep];
        setBusinessData(prev => ({
            ...prev,
            [currentStep.id]: value
        }));
    };

    const handleContactSubmit = () => {
        if (!guestEmail || !guestPhone) return;

        // If it's the last step for a guest, show the lead capture / account creation modal
        if (currentFlowStep === totalSteps - 1 && isGuest) {
            setShowLeadCapture(true);
        } else {
            setCurrentFlowStep(prev => prev + 1);
        }
    };

    const handleFlowNext = () => {
        const currentStep = flowSteps[currentFlowStep];

        // If on contact step (first for guests)
        if (currentStep.type === 'contact') {
            handleContactSubmit();
            return;
        }

        if (currentFlowStep < totalSteps - 1) {
            setCurrentFlowStep(prev => prev + 1);
        } else {
            // Last question - show login for guests
            if (isGuest) {
                setShowLeadCapture(true);
            } else {
                // Complete flow for logged-in users
                const completeData: BusinessData = {
                    name: businessData.businessName || '',
                    businessName: businessData.businessName || '',
                    stage: businessData.stage || 'idea',
                    industry: businessData.industry || '',
                    focus: businessData.focus || '',
                    teamSize: businessData.teamSize || '',
                    funding: businessData.funding || '',
                    location: businessData.location || '',
                    goal: businessData.goal || '',
                    offeringType: 'services',
                    offeringOther: '',
                    sector: '',
                    size: 'solo',
                    businessModel: '',
                    description: '',
                    motivation: '',
                    existingAssets: [],
                    focusAreas: []
                };

                onComplete?.(completeData);
                setShowFlowPopup(false);
                setCurrentFlowStep(0);
                setBusinessData({});
                setGuestEmail('');
                setGuestPhone('');
            }
        }
    };

    const currentStep = flowSteps[currentFlowStep];

    return (
        <div className="mb-6">
            {/* Header Cards - 30% Smaller */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Chatbot Card - Reduced size */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <span className="material-icons text-white text-lg">smart_toy</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">AI Incorporation Assistant</h3>
                            <p className="text-xs text-slate-600 font-medium">Get instant answers to your queries</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowChatbot(!showChatbot)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-2 px-4 text-sm font-bold shadow-md hover:shadow-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span className="material-icons text-sm">{showChatbot ? 'close' : 'chat'}</span>
                        {showChatbot ? 'Close Chat' : 'Start Chatting'}
                    </button>
                </div>

                {/* Tailor-Made Setup Card - Reduced size */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                            <span className="material-icons text-white text-lg">auto_awesome</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">Get Tailor-Made Business Setup</h3>
                            <p className="text-xs text-slate-600 font-medium">Personalized recommendations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowFlowPopup(true);
                            setCurrentFlowStep(0);
                            setBusinessData({});
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg py-2 px-4 text-sm font-bold shadow-md hover:shadow-purple-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span className="material-icons text-sm">rocket_launch</span>
                        Start Questionnaire
                    </button>
                </div>
            </div>

            {/* Chatbot Popup - 30% Smaller */}
            {showChatbot && (
                <div className="mt-4 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden animate-in slide-in-from-top duration-500">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="material-icons text-sm">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">AI Assistant</h3>
                                <p className="text-xs text-blue-100">Online • Ready to help</p>
                            </div>
                        </div>
                        <button onClick={() => setShowChatbot(false)} className="hover:bg-white/10 rounded-lg p-1 transition-colors">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>

                    <div className="h-64 overflow-y-auto p-3 bg-slate-50">
                        <div className="space-y-3">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl p-2.5 ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                        : 'bg-white border border-slate-200 text-slate-900'
                                        }`}>
                                        <p className="text-xs leading-relaxed whitespace-pre-line">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 bg-white border-t border-slate-200">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask anything..."
                                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-bold shadow-md hover:shadow-blue-500/30 transition-all flex items-center gap-1"
                            >
                                <span className="material-icons text-sm">send</span>
                            </button>
                        </div>

                        {/* Login prompt for guests after chatting */}
                        {isGuest && chatMessages.length >= 6 && (
                            <button
                                onClick={() => setShowLeadCapture(true)}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg py-2 text-xs font-bold shadow-md hover:shadow-green-500/30 transition-all flex items-center justify-center gap-1"
                            >
                                <span className="material-icons text-sm">account_circle</span>
                                Create Account to Save Progress
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Flow Pages Popup - 30% Smaller */}
            {showFlowPopup && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-500">
                        {/* Header - Smaller */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold">Tailor-Made Setup</h2>
                                <button
                                    onClick={() => {
                                        setShowFlowPopup(false);
                                        setCurrentFlowStep(0);
                                        setGuestEmail('');
                                        setGuestPhone('');
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            </div>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span>Question {currentFlowStep + 1} of {totalSteps}</span>
                                <span>{Math.round(((currentFlowStep + 1) / totalSteps) * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5">
                                <div
                                    className="bg-white h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentFlowStep + 1) / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question - Smaller */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">{currentStep.question}</h3>

                            {/* Contact Form for Guests */}
                            {currentStep.type === 'contact' && (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100 italic">
                                            "Enter your details to unlock your secure workspace and get the full 30-day roadmap delivered to you."
                                        </p>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-slate-900"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={guestPhone}
                                            onChange={(e) => setGuestPhone(e.target.value)}
                                            placeholder="10-digit mobile number"
                                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-slate-900"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep.type === 'text' && (
                                <input
                                    type="text"
                                    value={businessData[currentStep.id as keyof BusinessData] || ''}
                                    onChange={(e) => handleFlowAnswer(e.target.value)}
                                    placeholder={currentStep.placeholder}
                                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-slate-900"
                                    autoFocus
                                />
                            )}

                            {currentStep.type === 'textarea' && (
                                <textarea
                                    value={businessData[currentStep.id as keyof BusinessData] || ''}
                                    onChange={(e) => handleFlowAnswer(e.target.value)}
                                    placeholder={currentStep.placeholder}
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-slate-900 resize-none"
                                    autoFocus
                                />
                            )}

                            {currentStep.type === 'select' && (
                                <div className="space-y-2">
                                    {currentStep.options?.map((option: string) => (
                                        <button
                                            key={option}
                                            onClick={() => handleFlowAnswer(option)}
                                            className={`w-full p-3 rounded-lg border text-left text-sm font-bold transition-all ${businessData[currentStep.id as keyof BusinessData] === option
                                                ? 'border-purple-600 bg-purple-50 text-purple-900'
                                                : 'border-slate-200 hover:border-purple-300 text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {businessData[currentStep.id as keyof BusinessData] === option && (
                                                    <span className="material-icons text-purple-600 text-sm">check_circle</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Smaller */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 justify-between">
                            <button
                                onClick={() => setCurrentFlowStep(prev => Math.max(0, prev - 1))}
                                disabled={currentFlowStep === 0}
                                className="px-4 py-2 text-sm rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleFlowNext}
                                disabled={
                                    currentStep.type === 'contact'
                                        ? !guestEmail || !guestPhone
                                        : !businessData[currentStep.id as keyof BusinessData]
                                }
                                className="px-6 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                {currentFlowStep === totalSteps - 1 ? (isGuest ? 'Create Account' : 'Complete') : 'Next'}
                                <span className="material-icons text-xs">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lead Capture Modal */}
            <LeadCaptureModal
                isOpen={showLeadCapture}
                onClose={() => setShowLeadCapture(false)}
                onComplete={(leadData, userId) => {
                    // Account created
                    setShowLeadCapture(false);
                    setShowFlowPopup(false);
                    setShowChatbot(false);

                    // Complete flow if coming from questionnaire
                    if (Object.keys(businessData).length > 0) {
                        const completeData: BusinessData = {
                            name: businessData.businessName || '',
                            businessName: businessData.businessName || '',
                            stage: businessData.stage || 'idea',
                            industry: businessData.industry || '',
                            focus: businessData.focus || '',
                            teamSize: businessData.teamSize || '',
                            funding: businessData.funding || '',
                            location: businessData.location || '',
                            goal: businessData.goal || '',
                            offeringType: 'services',
                            offeringOther: '',
                            sector: '',
                            size: 'solo',
                            businessModel: '',
                            description: '',
                            motivation: '',
                            existingAssets: [],
                            focusAreas: []
                        };
                        onComplete?.({ ...completeData, ...leadData } as BusinessData);
                    }

                    setCurrentFlowStep(0);
                    setBusinessData({});
                    setGuestEmail('');
                    setGuestPhone('');
                }}
                prefilledData={{
                    businessName: businessData.businessName || '',
                    email: guestEmail,
                    phone: guestPhone
                }}
                source="ai_incorporation_assistant"
            />
        </div>
    );
}
