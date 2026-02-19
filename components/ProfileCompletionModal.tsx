"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onComplete: (data: any) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isOpen, onComplete }) => {
    const { user, dbUser } = useAuth();
    const [formData, setFormData] = useState({
        displayName: '',
        businessName: '',
        phone: '',
        state: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);

    // Load existing data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                displayName: dbUser?.displayName || user.displayName || '',
                businessName: dbUser?.businessName || '',
                phone: dbUser?.phone || '',
                state: dbUser?.state || '',
                city: dbUser?.city || '',
            });
        }
    }, [isOpen, user, dbUser]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (user) {
                // Generate Unique Registered ID if not exists
                const existingId = dbUser?.registeredId;
                const uniqueId = existingId || `SMB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

                const updateData = {
                    ...formData,
                    email: user.email,
                    uid: user.uid,
                    registeredId: uniqueId,
                    updatedAt: new Date(),
                    role: dbUser?.role || 'user'
                };

                // Save to Firestore
                await setDoc(doc(db, "users", user.uid), updateData, { merge: true });

                onComplete(updateData);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 border border-white/20 relative overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {!dbUser && (
                     <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <span className="material-symbols-outlined text-2xl">person_add</span>
                    </div>
                )}

                {dbUser && (
                    <button onClick={() => onComplete(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors z-10">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}

                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight relative z-10">
                    {dbUser ? 'Update Profile' : 'Complete Your Profile'}
                </h2>
                <p className="text-slate-500 mb-8 text-sm font-medium relative z-10">
                    {dbUser ? 'Update your personal and business details.' : 'Please provide a few more details to customize your dashboard experince.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.displayName}
                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                            placeholder="e.g. Michael Scott"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Business Name</label>
                        <input
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                            placeholder="e.g. Dunder Mifflin"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
                        <div className="flex gap-2">
                             <div className="px-3 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm flex items-center">
                                🇮🇳
                            </div>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                                placeholder="98765 43210"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">State</label>
                            <input
                                type="text"
                                required
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                                placeholder="State"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">City</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                                placeholder="City"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
                            {loading ? 'Saving...' : (dbUser ? 'Update Profile' : 'Enter Dashboard')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;
