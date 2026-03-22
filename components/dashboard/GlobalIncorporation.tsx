"use client";

import React, { useState } from 'react';
import { Country, GlobalService } from '@/types/globalIncorporation';
import { COUNTRIES, getServicesForCountry, getServiceInfo, LANGUAGES } from '@/lib/globalIncorporationData';
import CountrySelector from './CountrySelector';
import GlobalChatbot from './GlobalChatbot';

interface GlobalIncorporationProps {
    onLeadCapture?: (leadData: any) => void;
}

export default function GlobalIncorporation({ onLeadCapture }: GlobalIncorporationProps) {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedService, setSelectedService] = useState<GlobalService | null>(null);
    const [showChatbot, setShowChatbot] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const services = selectedCountry ? getServicesForCountry(selectedCountry.id) : [];
    const serviceInfo = selectedCountry && selectedService
        ? getServiceInfo(selectedCountry.id, selectedService.type)
        : null;

    const handleServiceClick = (service: GlobalService) => {
        setSelectedService(service);
    };

    const handleGetAssistance = () => {
        if (!selectedCountry || !selectedService) {
            alert('Please select a country and service first');
            return;
        }
        setShowChatbot(true);
    };

    const handleChatbotComplete = async (data: any, leadData: { email: string; phone: string }) => {
        const completeLeadData = {
            ...data,
            ...leadData,
            country: selectedCountry?.name,
            service: selectedService?.title,
            timestamp: new Date()
        };

        // Save to database
        try {
            const response = await fetch('/api/global-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeLeadData)
            });

            if (response.ok) {
                setShowChatbot(false);
                // Trigger parent callback
                onLeadCapture?.(completeLeadData);

                // Show login modal (will be handled by parent)
                alert('Lead captured! Please login to continue.');
            }
        } catch (error) {
            console.error('Failed to save lead:', error);
        }
    };

    return (
        <div className="w-full py-12 bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                    🌍 Expand Globally
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                    Take Your Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Global</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                    Expand your Indian startup to international markets. We handle incorporation, export compliance, and market access in 50+ countries.
                </p>

                {/* Language Selector */}
                <div className="mt-6 flex items-center justify-center gap-2">
                    <span className="material-icons text-slate-400 text-sm">translate</span>
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLanguage(lang.code)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedLanguage === lang.code
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {lang.flag} {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Country Selector */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="material-icons text-blue-600">public</span>
                    Select Target Country
                </h3>
                <CountrySelector
                    countries={COUNTRIES}
                    selectedCountry={selectedCountry}
                    onSelectCountry={setSelectedCountry}
                />
            </div>

            {/* Services Section */}
            {selectedCountry && (
                <div className="max-w-7xl mx-auto px-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="material-icons text-blue-600">business_center</span>
                        Choose Your Service for {selectedCountry.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((service) => {
                            const isSelected = selectedService?.id === service.id;
                            const colorMap: Record<string, string> = {
                                blue: 'from-blue-600 to-blue-700',
                                green: 'from-green-600 to-green-700',
                                purple: 'from-purple-600 to-purple-700'
                            };

                            return (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                            ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-500/20'
                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[service.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <span className="material-icons text-white text-2xl">{service.icon}</span>
                                    </div>
                                    <h4 className={`text-lg font-bold mb-2 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                        {service.title}
                                    </h4>
                                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                                        {service.description}
                                    </p>
                                    {isSelected && (
                                        <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-bold">
                                            <span className="material-icons text-sm">check_circle</span>
                                            Selected
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Service Information Boxes */}
            {selectedService && serviceInfo && (
                <div className="max-w-7xl mx-auto px-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* What Is It */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <span className="material-icons text-blue-600">info</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">What is {selectedService.title}?</h4>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{serviceInfo.whatIs}</p>
                            <div className="mt-4 flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-green-600 font-bold">
                                    <span className="material-icons text-sm">schedule</span>
                                    {serviceInfo.timeline}
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 font-bold">
                                    <span className="material-icons text-sm">currency_rupee</span>
                                    Starting at {serviceInfo.startingPrice}
                                </div>
                            </div>
                        </div>

                        {/* Eligibility */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <span className="material-icons text-green-600">verified</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Eligibility Criteria</h4>
                            </div>
                            <ul className="space-y-2">
                                {serviceInfo.eligibility.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Who Can Start */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <span className="material-icons text-purple-600">groups</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Who Can Apply?</h4>
                            </div>
                            <ul className="space-y-2">
                                {serviceInfo.whoCanStart.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="material-icons text-purple-500 text-sm mt-0.5">person</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <span className="material-icons text-white">workspace_premium</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Key Benefits</h4>
                            </div>
                            <ul className="space-y-2">
                                {serviceInfo.benefits.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                                        <span className="material-icons text-blue-600 text-sm mt-0.5">star</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleGetAssistance}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="material-icons text-2xl">rocket_launch</span>
                            Get Global Incorporation Assistance
                            <span className="material-icons">arrow_forward</span>
                        </button>
                        <p className="mt-3 text-sm text-slate-500 font-medium">
                            Free consultation • Expert guidance • Custom package
                        </p>
                    </div>
                </div>
            )}

            {/* Chatbot Modal */}
            {showChatbot && selectedCountry && selectedService && (
                <GlobalChatbot
                    countryName={selectedCountry.name}
                    serviceName={selectedService.title}
                    onComplete={handleChatbotComplete}
                    onClose={() => setShowChatbot(false)}
                />
            )}
        </div>
    );
}
