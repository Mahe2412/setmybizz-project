"use client";

import React, { useState } from 'react';
import { Country, GlobalService } from '@/types/globalIncorporation';
import { COUNTRIES, getServicesForCountry, getServiceInfo } from '@/lib/globalIncorporationData';
import LeadCaptureModal from '../LeadCaptureModal';

interface GlobalIncorporationFullPageProps {
    onLeadCapture?: (leadData: any) => void;
    onClose?: () => void;
}

type Step = 'country' | 'service' | 'assistance' | 'chatbot';

export default function GlobalIncorporationFullPage({ onLeadCapture, onClose }: GlobalIncorporationFullPageProps) {
    const [currentStep, setCurrentStep] = useState<Step>('country');
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedService, setSelectedService] = useState<GlobalService | null>(null);
    const [showCountrySidebar, setShowCountrySidebar] = useState(false);
    const [showServiceSidebar, setShowServiceSidebar] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; message: string }>>([]);
    const [userInput, setUserInput] = useState('');
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const services = selectedCountry ? getServicesForCountry(selectedCountry.id) : [];
    const serviceInfo = selectedCountry && selectedService
        ? getServiceInfo(selectedCountry.id, selectedService.type)
        : null;

    const handleCountryClick = (country: Country) => {
        setSelectedCountry(country);
        setShowCountrySidebar(true);
    };

    const handleCountryConfirm = () => {
        setShowCountrySidebar(false);
        setCurrentStep('service');
    };

    const handleServiceClick = (service: GlobalService) => {
        setSelectedService(service);
        setShowServiceSidebar(true);
    };

    const handleServiceConfirm = () => {
        setShowServiceSidebar(false);
        setCurrentStep('assistance');
    };

    const handleGetExpert = () => {
        setCurrentStep('chatbot');
        // Initialize AI conversation
        setChatMessages([
            {
                role: 'ai',
                message: `Hello! I'm your global expansion assistant. I'll help you understand what licenses and registrations you need for ${selectedCountry?.name} ${selectedService?.type === 'incorporation' ? 'incorporation' : selectedService?.type === 'export' ? 'export' : 'market access'}. What would you like to know?`
            }
        ]);
    };

    const handleSendMessage = () => {
        if (!userInput.trim()) return;

        setChatMessages(prev => [...prev, { role: 'user', message: userInput }]);

        // Simulate AI response
        setTimeout(() => {
            let aiResponse = '';

            if (userInput.toLowerCase().includes('cost') || userInput.toLowerCase().includes('price')) {
                aiResponse = `For ${selectedCountry?.name} ${selectedService?.title}, the cost typically ranges from ${serviceInfo?.startingPrice} onwards. This includes registration fees, legal documentation, and compliance setup. Would you like a detailed pricing breakdown?`;
            } else if (userInput.toLowerCase().includes('time') || userInput.toLowerCase().includes('duration')) {
                aiResponse = `The typical timeline for ${selectedService?.title} in ${selectedCountry?.name} is ${serviceInfo?.timeline}. However, this can vary based on your specific business type and documentation readiness. Shall I connect you with an expert for a precise timeline?`;
            } else if (userInput.toLowerCase().includes('document') || userInput.toLowerCase().includes('requirement')) {
                aiResponse = `For ${selectedCountry?.name} ${selectedService?.type}, you'll need: PAN Card, Aadhaar, Business Plan, Financial Statements, and industry-specific licenses. I can provide a complete checklist. Would you like that?`;
            } else {
                aiResponse = `That's a great question! For ${selectedService?.title} in ${selectedCountry?.name}, I recommend speaking with our expert who can provide detailed guidance on your specific situation. Would you like to connect now?`;
            }

            setChatMessages(prev => [...prev, { role: 'ai', message: aiResponse }]);
        }, 1000);

        setUserInput('');
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                    <span className="material-icons">close</span>
                </button>
            )}

            {/* Page 1: Country Selection */}
            {currentStep === 'country' && (
                <div className="h-full overflow-y-auto custom-scroll">
                    <div className="min-h-full flex flex-col items-center justify-center p-8">
                        {/* Hero Section */}
                        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                                <span className="text-white/90 text-sm font-bold uppercase tracking-widest">🌍 Global Expansion Made Easy</span>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
                                Reach Your Business
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                                    Global
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
                                Expand your Indian startup to international markets. We handle incorporation, export compliance, and market access in 50+ countries with expert guidance.
                            </p>
                        </div>

                        {/* Country Grid */}
                        <div className="max-w-6xl w-full">
                            <h2 className="text-2xl font-bold text-white mb-8 text-center">Select Your Target Country</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {COUNTRIES.map((country, idx) => (
                                    <button
                                        key={country.id}
                                        onClick={() => handleCountryClick(country)}
                                        className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 animate-in zoom-in duration-500"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                            {country.flag}
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">{country.name}</h3>
                                        <p className="text-blue-200 text-sm font-medium">{country.language}</p>
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-icons text-blue-400 text-xl">arrow_forward</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page 2: Service Selection */}
            {currentStep === 'service' && (
                <div className="h-full overflow-y-auto custom-scroll">
                    <div className="min-h-full flex flex-col items-center justify-center p-8">
                        {/* Back Button */}
                        <button
                            onClick={() => setCurrentStep('country')}
                            className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                            <span className="material-icons">arrow_back</span>
                            <span className="font-bold">Change Country</span>
                        </button>

                        <div className="text-center mb-12">
                            <div className="text-6xl mb-4">{selectedCountry?.flag}</div>
                            <h1 className="text-5xl font-black text-white mb-4">
                                {selectedCountry?.name}
                            </h1>
                            <p className="text-xl text-blue-100">Choose your service type</p>
                        </div>

                        {/* Service Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                            {services.map((service, idx) => {
                                const colorClasses = {
                                    blue: { gradient: 'from-blue-500 to-blue-600', hover: 'hover:shadow-blue-500/50' },
                                    green: { gradient: 'from-green-500 to-green-600', hover: 'hover:shadow-green-500/50' },
                                    purple: { gradient: 'from-purple-500 to-purple-600', hover: 'hover:shadow-purple-500/50' }
                                };
                                const colors = colorClasses[service.color as keyof typeof colorClasses];

                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => handleServiceClick(service)}
                                        className={`group bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl ${colors.hover} text-left animate-in zoom-in duration-500`}
                                        style={{ animationDelay: `${idx * 150}ms` }}
                                    >
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                                            <span className="material-icons text-white text-4xl">{service.icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                                        <p className="text-blue-100 font-medium leading-relaxed">{service.description}</p>
                                        <div className="mt-6 flex items-center text-cyan-400 font-bold group-hover:gap-3 gap-2 transition-all">
                                            <span>Learn More</span>
                                            <span className="material-icons">arrow_forward</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Page 3: Get Assistance */}
            {currentStep === 'assistance' && serviceInfo && (
                <div className="h-full overflow-y-auto custom-scroll">
                    <div className="min-h-full flex flex-col items-center justify-center p-8">
                        <div className="max-w-4xl w-full">
                            <div className="text-center mb-12">
                                <h1 className="text-5xl font-black text-white mb-6">
                                    Get Your Customized Plan
                                </h1>
                                <p className="text-xl text-blue-100 mb-8">
                                    For <span className="font-bold text-cyan-400">{selectedService?.title}</span> in <span className="font-bold text-cyan-400">{selectedCountry?.name}</span>
                                </p>
                            </div>

                            {/* What You Need Section */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="material-icons text-cyan-400 text-3xl">checklist</span>
                                    What Licenses & Registrations Do You Need?
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-cyan-400 mb-3">✅ Eligibility</h3>
                                        <ul className="space-y-2">
                                            {serviceInfo.eligibility.slice(0, 3).map((item, idx) => (
                                                <li key={idx} className="text-blue-100 flex items-start gap-2">
                                                    <span className="material-icons text-green-400 text-sm mt-1">check_circle</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-cyan-400 mb-3">⚡ Key Benefits</h3>
                                        <ul className="space-y-2">
                                            {serviceInfo.benefits.slice(0, 3).map((item, idx) => (
                                                <li key={idx} className="text-blue-100 flex items-start gap-2">
                                                    <span className="material-icons text-yellow-400 text-sm mt-1">star</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-6">
                                    <div>
                                        <div className="text-sm text-blue-200 mb-1">Timeline</div>
                                        <div className="text-2xl font-bold text-white">{serviceInfo.timeline}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-blue-200 mb-1">Starting From</div>
                                        <div className="text-2xl font-bold text-cyan-400">{serviceInfo.startingPrice}</div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleGetExpert}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl py-6 px-8 font-bold text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <span className="material-icons text-2xl">smart_toy</span>
                                    Explore with AI Assistant
                                </button>
                                <button
                                    onClick={handleGetExpert}
                                    className="flex-1 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl py-6 px-8 font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <span className="material-icons text-2xl">support_agent</span>
                                    Talk to Expert Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page 4: AI Chatbot */}
            {currentStep === 'chatbot' && (
                <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-6">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <span className="material-icons text-white">smart_toy</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">AI Global Expansion Assistant</h2>
                                    <p className="text-sm text-blue-200">{selectedCountry?.name} • {selectedService?.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCurrentStep('assistance')}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto custom-scroll p-6">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-2xl rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                        : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
                                        }`}>
                                        <p className="leading-relaxed">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="bg-white/10 backdrop-blur-md border-t border-white/20 p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex gap-4 mb-4">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask anything about global expansion..."
                                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-colors"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl px-8 py-4 font-bold shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    <span>Send</span>
                                    <span className="material-icons">send</span>
                                </button>
                            </div>

                            {/* Get Started Button */}
                            {chatMessages.length >= 3 && (
                                <button
                                    onClick={() => setShowLeadCapture(true)}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-4 font-bold shadow-2xl hover:shadow-green-500/30 transition-all hover:scale-105 flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-500"
                                >
                                    <span className="material-icons text-2xl">rocket_launch</span>
                                    Ready to Get Started? Create Your Account
                                    <span className="material-icons">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Country Sidebar */}
            {showCountrySidebar && selectedCountry && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowCountrySidebar(false)}></div>
                    <div className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-slate-900">Country Details</h2>
                                <button onClick={() => setShowCountrySidebar(false)} className="text-slate-400 hover:text-slate-900">
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <div className="text-center mb-8">
                                <div className="text-8xl mb-4">{selectedCountry.flag}</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedCountry.name}</h3>
                                <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                                    <span>💱 {selectedCountry.currency}</span>
                                    <span>🗣️ {selectedCountry.language}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                                <h4 className="font-bold text-slate-900 mb-3">Why Choose {selectedCountry.name}?</h4>
                                <ul className="space-y-2 text-sm text-slate-700">
                                    <li className="flex items-start gap-2">
                                        <span className="material-icons text-blue-600 text-sm mt-0.5">check_circle</span>
                                        Strong economy and stable market
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="material-icons text-blue-600 text-sm mt-0.5">check_circle</span>
                                        Business-friendly regulations
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="material-icons text-blue-600 text-sm mt-0.5">check_circle</span>
                                        Large consumer base
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="material-icons text-blue-600 text-sm mt-0.5">check_circle</span>
                                        Access to international markets
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={handleCountryConfirm}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-4 font-bold shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                Select {selectedCountry.name}
                                <span className="material-icons">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Service Sidebar */}
            {showServiceSidebar && selectedService && serviceInfo && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowServiceSidebar(false)}></div>
                    <div className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-slate-900">Service Details</h2>
                                <button onClick={() => setShowServiceSidebar(false)} className="text-slate-400 hover:text-slate-900">
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{selectedService.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">{serviceInfo.whatIs}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-green-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600 mb-1">{serviceInfo.timeline}</div>
                                        <div className="text-xs text-green-700 font-medium">Timeline</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600 mb-1">{serviceInfo.startingPrice}</div>
                                        <div className="text-xs text-blue-700 font-medium">Starting From</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <span className="material-icons text-green-600">verified</span>
                                            Eligibility
                                        </h4>
                                        <ul className="space-y-1 text-sm text-slate-600">
                                            {serviceInfo.eligibility.slice(0, 3).map((item, idx) => (
                                                <li key={idx}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <span className="material-icons text-yellow-600">star</span>
                                            Benefits
                                        </h4>
                                        <ul className="space-y-1 text-sm text-slate-600">
                                            {serviceInfo.benefits.slice(0, 3).map((item, idx) => (
                                                <li key={idx}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleServiceConfirm}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-4 font-bold shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                Continue with {selectedService.type === 'incorporation' ? 'Incorporation' : selectedService.type === 'export' ? 'Export' : 'Market Access'}
                                <span className="material-icons">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Lead Capture Modal */}
            <LeadCaptureModal
                isOpen={showLeadCapture}
                onClose={() => setShowLeadCapture(false)}
                onComplete={(leadData, userId) => {
                    // Lead captured and account created
                    setShowLeadCapture(false);
                    if (onLeadCapture) {
                        onLeadCapture({ ...leadData, userId });
                    }
                }}
                prefilledData={{
                    businessName: '',
                    email: '',
                    phone: ''
                }}
                source="global_incorporation"
            />
        </div>
    );
}
