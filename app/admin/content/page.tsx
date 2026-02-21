"use client";
import { useState } from 'react';

// Example: Managing dynamic sections
const DEFAULT_CONTENT = {
    hero: {
        title: "Build Your Dream Business",
        subtitle: "India's #1 All-in-One Startup Platform",
    },
    pricing: {
        basic: "₹2,999",
        pro: "₹7,999",
    }
};

export default function ContentEditor() {
    const [content, setContent] = useState(DEFAULT_CONTENT);

    const handleSave = () => {
        // Here we would call an API or update Firestore
        alert('Content update saved! (Mock)');
        console.log('Updated Content:', content);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Content Editor</h1>
            <p className="text-slate-500 text-sm mb-8">Manage website text, pricing, and banners without code.</p>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
                {/* Hero Section */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Home Page Hero</h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Main Headline</label>
                            <input 
                                type="text" 
                                value={content.hero.title}
                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 font-black text-lg text-slate-900" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sub Headline</label>
                            <input 
                                type="text"
                                value={content.hero.subtitle}
                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-600" 
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Pricing Modules</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Basic Plan Price</label>
                            <input 
                                type="text" 
                                value={content.pricing.basic}
                                onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, basic: e.target.value } })}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-mono font-bold" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pro Plan Price</label>
                            <input 
                                type="text" 
                                value={content.pricing.pro}
                                onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, pro: e.target.value } })}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-mono font-bold" 
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
