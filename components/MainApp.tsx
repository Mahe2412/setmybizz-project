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
import FocusStep from './steps/FocusStep';
import SummaryStep from './steps/SummaryStep';
import LoginStep from './steps/LoginStep';
import Dashboard from './Dashboard';
import Layout from './Layout';
import ProfileCompletionModal from './ProfileCompletionModal';
import SmartFooter from './SmartFooter';
import TeaserFlow from './onboarding/TeaserFlow';
import { BusinessData } from '../types';

const INITIAL_DATA: BusinessData = {
    name: '',
    offeringType: 'physical_goods',
    offeringOther: '',
    industry: '',
    sector: '',
    size: 'solo',
    businessModel: '',
    description: '',
    motivation: 'Being my own boss',
    stage: 'launch',
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

    // Auth Context
    const { user, loading, leadId } = useAuth(); // Destructure leadId
    const [showProfileModal, setShowProfileModal] = useState(false);

    // State for initial dashboard configuration from deep links
    const [dashboardConfig, setDashboardConfig] = useState<{tab: 'A'|'B'|'Workspace'|'LearnerStudio'|'Oracle'|'Hook', global?: boolean}>({tab: 'Workspace'});

    // Deep Link & Persistence Logic
    useEffect(() => {
        // 1. Load from LocalStorage
        const savedData = localStorage.getItem('setmybizz_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setTimeout(() => setData(prev => ({ ...prev, ...parsed })), 0);
            } catch (e) {
                console.error("Failed to load saved data", e);
            }
        }

        // 2. Handle Search Params for Deep Linking
        // Accept both ?name= (from home page quick-setup) and ?businessName= (legacy)
        const nameFromHome = searchParams?.get('name') || searchParams?.get('businessName');
        const viewParam = searchParams?.get('view');
        const flowParam = searchParams?.get('flow');

        if (nameFromHome) {
            setData(prev => ({ ...prev, name: nameFromHome }));
        }

        if (flowParam === 'global') {
            setView('dashboard');
            setDashboardConfig({ tab: 'A', global: true });
        } else if (flowParam === 'launchpad') {
            setView('dashboard');
            setDashboardConfig({ tab: 'B' });
        } else if (flowParam === 'workspace') {
            setView('dashboard');
            setDashboardConfig({ tab: 'Workspace' });
        } else if (nameFromHome && !flowParam) {
            setShowTeaser(true);
            // Skip WelcomeStep (0) and NameStep (1) — go directly to IndustryOfferStep (2)
            setCurrentStep(2);
        }

        if (viewParam === 'login') {
            setView('login');
        } else if (viewParam === 'dashboard') {
            setView('dashboard');
        }

        setIsLoaded(true);
    }, [searchParams]);

    // Session Check Effect
    useEffect(() => {
        if (!loading) {
            const hasLocalSession = localStorage.getItem('setmybizz_session') === 'true';

            if (user || hasLocalSession) {
                // If user is logged in (Firebase or Local), go to dashboard
                // Check if profile is complete only if using Firebase
                if (user && !user.displayName) {
                    setTimeout(() => setShowProfileModal(true), 0);
                } else {
                    setView('dashboard');
                }
            }
        }
    }, [user, loading]);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('setmybizz_data', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

    // Updated updateData to sync with Lead Engine
    const updateData = (newData: Partial<BusinessData>) => {
        setData(prev => {
            const updated = { ...prev, ...newData };
            // Sync to Lead Engine if leadId exists
            if (leadId) {
                import('../lib/leadSystem').then(({ syncLeadData }) => {
                    syncLeadData(leadId, updated);
                });
            }
            return updated;
        });
    };

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const handleBackToFlow = () => {
        // Clear session so user doesn't get redirected back immediately on refresh
        localStorage.removeItem('setmybizz_session');
        setView('onboarding');
        setCurrentStep(0);
    };

    const handleLoginSuccess = async (skipAuth = false) => {
        localStorage.setItem('setmybizz_session', 'true');

        if (skipAuth) {
            setView('dashboard');
            return;
        }

        // Save data to Firestore if user is present
        if (user && user.uid) {
            try {
                await saveBusinessProfile(user.uid, data);
            } catch (err) {
                console.error("Failed to save business profile on login:", err);
            }

            // Sync to CRM (Google Sheets)
            try {
                fetch('/api/crm-webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user, businessData: data, guestId: leadId }) // Use leadId as guestId source if tracking
                });
            } catch (crmErr) {
                console.error("Failed to sync with CRM:", crmErr);
            }
        }

        // If user just logged in via Firebase in LoginStep, the AuthContext effect above will handle the redirect/modal
        // But for manual enforcement:
        if (user && !user.displayName) {
            setShowProfileModal(true);
        } else {
            setView('dashboard');
        }
    };

    const handleProfileComplete = async (profileData: any) => {
        const updatedData = {
            ...data,
            name: profileData.businessName || data.name,
        };
        updateData(updatedData);

        // Save updated data to Firestore
        if (user && user.uid) {
            try {
                await saveBusinessProfile(user.uid, updatedData);
            } catch (err) {
                console.error("Failed to save business profile on completion:", err);
            }
        }

        setShowProfileModal(false);
        setView('dashboard');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Initializing SetMyBizz...</p>
                </div>
            </div>
        );
    }

    if (view === 'login') {
        return <LoginStep onLogin={handleLoginSuccess} businessName={data.name} />;
    }

    if (showTeaser) {
        return <TeaserFlow businessName={data.name} onComplete={() => {
            setShowTeaser(false);
            setView('dashboard');
            setDashboardConfig({ tab: 'Hook' });
        }} />;
    }

    useEffect(() => {
        if (view === 'dashboard') {
            router.push('/os');
        }
    }, [view, router]);

    if (view === 'dashboard') {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Launching your AI Operating System...</p>
                </div>
            </div>
        );
    }

    const steps = [
        <WelcomeStep key="welcome" onNext={nextStep} />,
        <NameStep key="name" data={data} updateData={updateData} onNext={nextStep} />,
        <IndustryOfferStep
            key="industry"
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            uiStep={1}
            totalSteps={6}
        />,
        <IndustryDetailStep
            key="detail"
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            uiStep={2}
            totalSteps={6}
        />,
        <SizeStep
            key="size"
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            uiStep={3}
            totalSteps={6}
        />,
        <MotivationStep
            key="motivation"
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            uiStep={4}
            totalSteps={6}
        />,
        <StageStep
            key="stage"
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            uiStep={5}
            totalSteps={6}
        />,
        <FocusStep
            key="focus"
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            uiStep={6}
            totalSteps={6}
        />,
        <SummaryStep
            key="summary"
            data={data}
            onBack={prevStep}
            onDashboard={() => setView('login')}
        />
    ];

    return (
        <Layout
            currentStep={currentStep}
            totalSteps={steps.length}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        >
            {steps[currentStep]}
            <SmartFooter currentStep={currentStep} />
        </Layout>
    );
};

export default MainApp;
