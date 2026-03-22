"use client";

import React, { useState } from 'react';
import { CHATBOT_QUESTIONS } from '@/lib/globalIncorporationData';
import { PackageSuggestion } from '@/types/globalIncorporation';

interface GlobalChatbotProps {
    countryName: string;
    serviceName: string;
    onComplete: (data: any, leadData: { email: string; phone: string }) => void;
    onClose: () => void;
}

export default function GlobalChatbot({ countryName, serviceName, onComplete, onClose }: GlobalChatbotProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const [leadData, setLeadData] = useState({ email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questions = CHATBOT_QUESTIONS;
    const currentQ = questions[currentQuestion];

    const handleAnswer = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // All questions answered, show lead capture
            setShowLeadCapture(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmitLead = () => {
        if (!leadData.email || !leadData.phone) {
            alert('Please provide both email and phone number');
            return;
        }

        setIsSubmitting(true);
        // Combine all data
        const completeData = {
            ...answers,
            targetCountry: countryName,
            selectedService: serviceName,
            timestamp: new Date().toISOString()
        };

        onComplete(completeData, leadData);
    };

    const canProceed = currentQ.required ? !!answers[currentQ.id] : true;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                        <span className="material-icons text-sm">close</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="material-icons text-2xl">quiz</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Global Expansion Assistant</h2>
                            <p className="text-blue-100 text-sm">{countryName} • {serviceName}</p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {!showLeadCapture && (
                    <div className="px-6 pt-4">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
                    {!showLeadCapture ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Question */}
                            <div>
                                <label className="block text-lg font-bold text-slate-900 mb-4">
                                    {currentQ.question}
                                    {currentQ.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {/* Input based on type */}
                                {currentQ.type === 'text' && (
                                    <input
                                        type="text"
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        placeholder={currentQ.placeholder}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
                                        autoFocus
                                    />
                                )}

                                {currentQ.type === 'textarea' && (
                                    <textarea
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        placeholder={currentQ.placeholder}
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium resize-none transition-colors"
                                        autoFocus
                                    />
                                )}

                                {currentQ.type === 'select' && (
                                    <div className="space-y-2">
                                        {currentQ.options?.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handleAnswer(option)}
                                                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${answers[currentQ.id] === option
                                                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                                                        : 'border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option}</span>
                                                    {answers[currentQ.id] === option && (
                                                        <span className="material-icons text-blue-600">check_circle</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-icons text-blue-600 text-3xl">connect_without_contact</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Almost There!</h3>
                                <p className="text-slate-600">Let our experts connect with you to provide personalized guidance</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={leadData.email}
                                        onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={leadData.phone}
                                        onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900"
                                    />
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                    <span className="material-icons text-amber-600">info</span>
                                    <p className="text-xs text-amber-800 font-medium">
                                        You'll need to <strong>login or register</strong> to view your personalized package recommendations and connect with our experts.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 p-6 bg-slate-50">
                    {!showLeadCapture ? (
                        <div className="flex gap-3 justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {currentQuestion === questions.length - 1 ? 'Continue' : 'Next'}
                                <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleSubmitLead}
                            disabled={isSubmitting || !leadData.email || !leadData.phone}
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-icons animate-spin">sync</span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Get My Package Recommendations
                                    <span className="material-icons">arrow_forward</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
