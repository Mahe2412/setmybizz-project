import React from 'react';
import Dashboard from '@/components/Dashboard';
import { BusinessData } from '@/types';

export const dynamic = 'force-dynamic';

export default function DashboardPage({ searchParams }: { searchParams: { tab?: string } }) {
    // Default mock data to satisfy type requirements
    const data: BusinessData = {
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
    };

    return <Dashboard data={data} initialTab={(searchParams.tab as 'A' | 'B' | 'Workspace') || 'A'} />;
}
