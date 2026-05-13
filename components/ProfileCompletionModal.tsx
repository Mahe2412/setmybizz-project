"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useBizStore } from '@/lib/useBizStore';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onComplete: (data: any) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isOpen, onComplete }) => {
    const { user, dbUser, dbBusiness } = useAuth();
    const [formData, setFormData] = useState({
        displayName: '',
        businessName: '',
        phone: '',
        state: '',
        city: '',
        country: 'India',
        size: '1-10 Employees',
        sector: 'E-commerce & Retail',
    });
    const [loading, setLoading] = useState(false);

    // Load existing data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                displayName: dbUser?.full_name || user.user_metadata?.full_name || '',
                businessName: dbBusiness?.business_name || dbUser?.business_name || '',
                phone: dbUser?.phone || '',
                state: dbUser?.state || '',
                city: dbUser?.city || '',
                country: dbBusiness?.region?.includes(',') ? dbBusiness.region.split(',').pop()?.trim() || 'India' : 'India',
                size: dbBusiness?.tagline || '1-10 Employees',
                sector: dbBusiness?.industry || 'E-commerce & Retail',
            });
        }
    }, [isOpen, user, dbUser, dbBusiness]);

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
                    id: user.id,
                    full_name: formData.displayName,
                    email: user.email,
                    phone: formData.phone,
                    updated_at: new Date().toISOString(),
                };

                // Save to Supabase 'users' table
                const { error: userError } = await supabase.from('users').upsert(updateData);
                if (userError) throw userError;

                // --- Autonomous Performance Gap Audit Engine ---
                const generatedGaps = [];
                generatedGaps.push({ type: 'compliance', severity: 'high', message: 'GST Registration / Basic Compliance Verification Pending' });
                if (!dbBusiness?.cin) generatedGaps.push({ type: 'legal', severity: 'medium', message: 'Company Incorporation (RoC) Not Verified' });
                if (formData.sector === 'E-commerce & Retail') generatedGaps.push({ type: 'growth', severity: 'low', message: 'Ondc Integration Opportunity Detected' });
                generatedGaps.push({ type: 'brand', severity: 'medium', message: 'Core Brand Identity / Digital LaunchPad Kit Missing' });
                
                // Dispatch to Global State for Arkle Consumption
                useBizStore.getState().setPerformanceGaps(generatedGaps);

                // Also save/update the 'businesses' table
                const { error: bizError } = await supabase.from('businesses').upsert({
                    user_id: user.id,
                    name: formData.businessName,
                    address: `${formData.city || 'City'}, ${formData.state || 'State'}, ${formData.country || 'India'}`,
                    state: formData.state
                }, { onConflict: 'user_id' });
                
                if (bizError) throw bizError;

                // Broadcast local state cache updates instantly
                const localPayload = {
                    userName: formData.displayName,
                    name: formData.businessName,
                    phone: formData.phone,
                    state: formData.state,
                    country: formData.country,
                    sector: formData.sector,
                    size: formData.size,
                    email: user.email,
                };
                localStorage.setItem('setmybizz_data', JSON.stringify(localPayload));

                onComplete({ ...formData, registeredId: uniqueId });
            }
        } catch (error: any) {
            console.error("Error saving profile to Supabase:", error);
            alert("Failed to save profile: " + error.message);
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
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">City</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 text-xs font-medium placeholder-slate-400"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">State</label>
                            <input
                                type="text"
                                required
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 text-xs font-medium placeholder-slate-400"
                                placeholder="State"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Country</label>
                            <input
                                type="text"
                                required
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 text-xs font-medium placeholder-slate-400"
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Industry Sector</label>
                            <select
                                value={formData.sector}
                                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 text-xs font-medium"
                            >
                                <option value="E-commerce & Retail">E-commerce & Retail</option>
                                <option value="SaaS & Technology">SaaS & Technology</option>
                                <option value="Professional Services">Professional Services</option>
                                <option value="Health & Wellness">Health & Wellness</option>
                                <option value="Food & Hospitality">Food & Hospitality</option>
                                <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
                                <option value="Creative & Media">Creative & Media</option>
                                <option value="Other Startup Sector">Other Startup Sector</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Team Size</label>
                            <select
                                value={formData.size}
                                onChange={e => setFormData({ ...formData, size: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 text-xs font-medium"
                            >
                                <option value="Solo Founder">Solo Founder</option>
                                <option value="1-10 Employees">1-10 Employees</option>
                                <option value="11-50 Employees">11-50 Employees</option>
                                <option value="50+ Scaled Team">50+ Scaled Team</option>
                            </select>
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
