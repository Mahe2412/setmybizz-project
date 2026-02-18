"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BusinessData } from '@/types';

interface AuthGuardProps {
    children: (data: BusinessData | null) => React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [data, setData] = useState<BusinessData | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            const hasLocalSession = typeof window !== 'undefined' && localStorage.getItem('setmybizz_session') === 'true';

            if (!user && !hasLocalSession) {
                router.push('/?view=login');
            } else {
                // User is authorized
                setTimeout(() => setIsAuthorized(true), 0);
                // Try to load data
                try {
                    const saved = localStorage.getItem('setmybizz_data');
                    if (saved) setData(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse data", e);
                }
            }
            setChecking(false);
        }
    }, [user, authLoading, router]);

    if (authLoading || checking) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null; // Redirecting...
    }

    return <>{children(data)}</>;
};

export default AuthGuard;
