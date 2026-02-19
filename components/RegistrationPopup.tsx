"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface RegistrationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegistrationPopup({ isOpen, onClose }: RegistrationPopupProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        nature: '', // Added nature field
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Use the API route to register lead and get AI insight
            const response = await fetch('/api/register-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to register');

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({ name: '', email: '', phone: '', businessName: '', nature: '' });
            }, 2000);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error submitting form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 transition-opacity duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_ease-in-out_1]">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Success!</h3>
                        <p className="text-slate-600 font-medium">Your business roadmap is being prepared.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider mb-3">Early Access</span>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Get Your Free Business Roadmap</h2>
                            <p className="text-slate-500 mt-2 text-sm">Unlock tech tools, expert consultation, and a personalized incorporation plan.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium transition-all"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    placeholder="TechNova Solutions"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Sector</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Consulting, Retail, IT"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium transition-all"
                                    value={formData.nature}
                                    onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Get Roadmap
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
