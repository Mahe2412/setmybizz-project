"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SmartFooterProps {
    currentStep: number;
}

const SmartFooter: React.FC<SmartFooterProps> = ({ currentStep }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Show from step 3 (SizeStep) onwards (0-indexed, so index 3 is actually 4th step if we count 0)
    // Actually Steps array: [Welcome, Name, IndOffer, IndDetail, Size, Motivation, Stage, Focus, Summary]
    // 0=Welcome, 1=Name, 2=Offer, 3=Detail, 4=Size, 5=Motivation ...
    // User requirement: "From 4th page onwards" -> Step Index 3
    if (currentStep < 3 || submitted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "leads"), {
                email,
                source: "smart_footer",
                step: currentStep,
                createdAt: serverTimestamp()
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting lead:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-20 left-0 right-0 bg-slate-900 border-t border-slate-800 p-3 z-[60] animate-in slide-in-from-bottom-5 duration-700">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-4 flex-1">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-slate-900 z-30" title="Website"><span className="material-symbols-outlined text-sm text-blue-600">language</span></div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-slate-900 z-20" title="Logo"><span className="material-symbols-outlined text-sm text-pink-500">brush</span></div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-slate-900 z-10" title="Brand Kit"><span className="material-symbols-outlined text-sm text-purple-600">category</span></div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Unlock your <span className="text-yellow-400">Free Brand Kit, Logo & Website Credits!</span></h4>
                        <p className="text-slate-400 text-[10px]">Provide Email/Phone to continue.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
                    <input
                        type="text"
                        placeholder="Enter Email or Phone..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 placeholder-slate-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-blue-600/20"
                    >
                        {loading ? '...' : 'Unlock Now'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubmitted(true)}
                        className="text-slate-500 hover:text-white px-2"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SmartFooter;
