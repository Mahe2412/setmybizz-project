"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onComplete: (data: any) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isOpen, onComplete }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        businessName: '',
        phone: '',
        state: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (user) {
                // Generate Unique Registered ID
                const uniqueId = `SMB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

                // Save to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    ...formData,
                    email: user.email,
                    uid: user.uid,
                    registeredId: uniqueId,
                    updatedAt: new Date(),
                    role: 'user' // Default role
                }, { merge: true });

                // Also update local data context via callback if needed, but for now just close
                onComplete({ ...formData, registeredId: uniqueId });
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h2>
                <p className="text-slate-500 mb-6 text-sm">Please provide a few more details to customize your dashboard.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.displayName}
                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Name</label>
                        <input
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                            <input
                                type="text"
                                required
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Enter Dashboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;
