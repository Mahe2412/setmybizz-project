'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { BusinessData } from '@/types';

function DashboardWithParams() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    // Default mock data to satisfy type requirements
    const [data] = useState<BusinessData>({
        name: 'My Startup',
        offeringType: 'tech',
        offeringOther: '',
        industry: 'Technology',
        sector: 'Software',
        size: 'small_team',
        businessModel: 'B2B',
        description: 'Building the next big thing',
        motivation: 'Innovation',
        stage: 'idea',
        existingAssets: [],
        focusAreas: ['formation']
    });

    return <Dashboard data={data} initialTab={(tab as 'A' | 'B' | 'Workspace') || 'A'} />;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <DashboardWithParams />
        </Suspense>
    );
}
