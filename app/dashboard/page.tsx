'use client';

import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { BusinessData } from '@/types';

export default function DashboardPage() {
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

    return (
        <Dashboard
            data={data}
            initialTab="A" // Set "Incorporation" as default tab to match user request
        />
    );
}
