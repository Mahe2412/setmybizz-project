"use client";

import React, { useState } from 'react';
import { signInWithGoogle, signInWithEmailPassword, createUserAccount } from '@/lib/firebase';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (leadData: any, userId?: string) => void;
    prefilledData?: {
        businessName?: string;
        email?: string;
        phone?: string;
    };
    source: string; // 'global_incorporation', 'dashboard_a', 'dashboard_b', etc.
}

type Step = 'lead_capture' | 'create_account' | 'success';

export default function LeadCaptureModal({ isOpen, onClose, onComplete, prefilledData, source }: LeadCaptureModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>('lead_capture');
    const [leadData, setLeadData] = useState({
        businessName: prefilledData?.businessName || '',
        email: prefilledData?.email || '',
        phone: prefilledData?.phone || ''
    });
    const [accountData, setAccountData] = useState({
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLeadSubmit = async () => {
        setError('');

        // Validation
        if (!leadData.email || !leadData.phone || !leadData.businessName) {
            setError('All fields are required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(leadData.email)) {
            setError('Please enter a valid email');
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = leadData.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setIsSubmitting(true);

        try {
            // Save lead to database
            const response = await fetch('/api/master-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...leadData,
                    source,
                    timestamp: new Date().toISOString(),
                    status: 'pending_registration'
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Move to account creation
                setCurrentStep('create_account');
            } else {
                setError('Failed to save your information. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const { user } = await signInWithGoogle();

            // Save complete lead with user ID
            const completeData = {
                ...leadData,
                userId: user.uid,
                email: user.email || leadData.email,
                displayName: user.displayName || leadData.businessName,
                status: 'registered',
                registrationMethod: 'google'
            };

            await fetch('/api/master-leads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeData)
            });

            setCurrentStep('success');
            setTimeout(() => {
                onComplete(completeData, user.uid);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailSignUp = async () => {
        setError('');

        // Validation
        if (!accountData.fullName || !accountData.password || !accountData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (accountData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (accountData.password !== accountData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const { user } = await createUserAccount(leadData.email, accountData.password, accountData.fullName);

            // Save complete lead with user ID
            const completeData = {
                ...leadData,
                userId: user.uid,
                displayName: accountData.fullName,
                status: 'registered',
                registrationMethod: 'email'
            };

            await fetch('/api/master-leads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeData)
            });

            setCurrentStep('success');
            setTimeout(() => {
                onComplete(completeData, user.uid);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Step 1: Lead Capture */}
                {currentStep === 'lead_capture' && (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons text-blue-600 text-3xl">rocket_launch</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's Get Started!</h2>
                            <p className="text-slate-600">We need a few details to create your personalized plan</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <span className="material-icons text-red-600 text-sm">error</span>
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={leadData.businessName}
                                    onChange={(e) => setLeadData(prev => ({ ...prev, businessName: e.target.value }))}
                                    placeholder="Your Business Name"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={leadData.email}
                                    onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
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
                                    placeholder="10-digit mobile number"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLeadSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="material-icons animate-spin text-sm">sync</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <span className="material-icons text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                )}

                {/* Step 2: Create Account */}
                {currentStep === 'create_account' && (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons text-green-600 text-3xl">verified_user</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h2>
                            <p className="text-slate-600">One account for all SetMyBizz dashboards</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <span className="material-icons text-red-600 text-sm">error</span>
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isSubmitting}
                            className="w-full mb-4 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-sm text-slate-500 font-medium">OR</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* Email Sign Up */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={accountData.fullName}
                                    onChange={(e) => setAccountData(prev => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="Your Full Name"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={accountData.password}
                                    onChange={(e) => setAccountData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={accountData.confirmPassword}
                                    onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Re-enter password"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 font-medium transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleEmailSignUp}
                            disabled={isSubmitting}
                            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-icons animate-spin text-sm">sync</span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span className="material-icons text-sm">arrow_forward</span>
                                </>
                            )}
                        </button>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            Email: <strong>{leadData.email}</strong>
                        </p>
                    </div>
                )}

                {/* Step 3: Success */}
                {currentStep === 'success' && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                            <span className="material-icons text-green-600 text-4xl">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Aboard! 🎉</h2>
                        <p className="text-slate-600 mb-6">
                            Your account has been created successfully. You now have access to all SetMyBizz dashboards!
                        </p>
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-sm text-slate-500 mt-4">Redirecting to your dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
