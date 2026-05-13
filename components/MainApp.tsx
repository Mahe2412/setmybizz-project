"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { saveBusinessProfile } from '../lib/db';
import WelcomeStep from './steps/WelcomeStep';
import NameStep from './steps/NameStep';
import IndustryOfferStep from './steps/IndustryOfferStep';
import IndustryDetailStep from './steps/IndustryDetailStep';
import SizeStep from './steps/SizeStep';
import MotivationStep from './steps/MotivationStep';
import StageStep from './steps/StageStep';
import IdentityStep from './steps/IdentityStep';
import LocationStep from './steps/LocationStep';
import FocusStep from './steps/FocusStep';
import SummaryStep from './steps/SummaryStep';
import MarketHookStep from './steps/MarketHookStep';
import LoginStep from './steps/LoginStep';
import BizOSShell from './os/BizOSShell';
import Layout from './Layout';
import ProfileCompletionModal from './ProfileCompletionModal';
import SmartFooter from './marketing/SmartFooter';
import TeaserFlow from './onboarding/TeaserFlow';
import { BusinessData } from '../types';
import { Building2, ShieldCheck, Sparkles, Globe2, LayoutDashboard, Cpu } from 'lucide-react';

const INITIAL_DATA: BusinessData = {
    userId: '',
    userName: '',
    name: '',
    country: '',
    state: '',
    email: '',
    phone: '',
    offeringType: 'physical_goods',
    offeringOther: '',
    industry: '',
    sector: '',
    size: 'solo',
    businessModel: '',
    description: '',
    motivation: 'Being my own boss',
    stage: '',
    existingAssets: [],
    focusAreas: [],
};

type View = 'onboarding' | 'login' | 'dashboard';

const MainApp: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

const AppContent: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [view, setView] = useState<View>('onboarding');
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<BusinessData>(INITIAL_DATA);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showTeaser, setShowTeaser] = useState(false);

    // 0. Handle View Switching from URL
    useEffect(() => {
        const viewParam = searchParams?.get('view');
        if (viewParam === 'login') {
            setView('login');
        } else if (viewParam === 'dashboard') {
            setView('dashboard');
        }
    }, [searchParams]);

    // Auth Context
    const { user, loading, leadId } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);

    // 1. Generate Unique User ID if not exists
    useEffect(() => {
        if (!data.userId) {
            const randomId = Math.floor(10000 + Math.random() * 90000);
            const newId = `SBZ-${randomId}`;
            setData(prev => ({ ...prev, userId: newId }));
            console.log(`[ARKLE SYSTEM] Unique User Session Initialized: ${newId}`);
        }
    }, [data.userId]);

    // 2. Handle Search Params & Persistence
    useEffect(() => {
        const savedData = localStorage.getItem('setmybizz_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to load saved data", e);
            }
        }

        const nameFromHome = searchParams?.get('name') || searchParams?.get('businessName');
        if (nameFromHome) {
            setData(prev => ({ ...prev, name: nameFromHome }));
        }

        setIsLoaded(true);
    }, [searchParams]);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('setmybizz_data', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

    const updateData = (newData: Partial<BusinessData>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const steps = [
        <WelcomeStep key="welcome" onNext={nextStep} />,
        <StageStep key="stage" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <IdentityStep key="identity" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <NameStep key="name" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <LocationStep key="location" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <IndustryOfferStep key="industry" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} uiStep={1} totalSteps={9} />,
        <IndustryDetailStep key="detail" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} uiStep={2} totalSteps={9} />,
        <SizeStep key="size" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} uiStep={3} totalSteps={9} />,
        <MotivationStep key="motivation" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} uiStep={4} totalSteps={9} />,
        <FocusStep key="focus" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} uiStep={5} totalSteps={9} />,
        <SummaryStep key="summary" data={data} onBack={prevStep} onNext={nextStep} />,
        <MarketHookStep key="hook" data={data} onBack={prevStep} onDashboard={() => setView('dashboard')} />
    ];

    if (loading) return <div>Initializing...</div>;

    if (view === 'dashboard') {
        return (
            <BizOSShell data={data} onLogin={() => setView('login')} />
        );
    }

    if (view === 'login') {
        return (
            <LoginStep onLogin={() => setView('dashboard')} businessName={data.name || 'Your Business'} />
        );
    }

    return (
        <Layout currentStep={currentStep} totalSteps={steps.length} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
            {steps[currentStep]}
            <SmartFooter currentStep={currentStep} />
        </Layout>
    );
};

export default MainApp;
