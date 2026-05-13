import { supabase } from './supabase';
import { BusinessData } from '../types';

/**
 * Saves or updates a business profile for a user in Supabase.
 * @param userId - The Supabase Auth User ID
 * @param data - The business data collected during onboarding
 */
export const saveBusinessProfile = async (userId: string, data: BusinessData) => {
    try {
        // 1. Upsert User Metadata
        const { error: userError } = await supabase.from('users').upsert({
            id: userId,
            full_name: data.userName || 'Founder',
            updated_at: new Date().toISOString()
        });

        if (userError) throw userError;

        // 2. Upsert Business Context
        const { error: bizError } = await supabase.from('businesses').upsert({
            user_id: userId,
            business_name: data.name || 'My Business',
            industry: data.industry || 'Technology',
            tagline: data.mission || '',
            primary_color: '#3b82f6', // Default blue
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        if (bizError) throw bizError;

        console.log("Business Profile Saved Successfully to Supabase!");
        return true;
    } catch (error) {
        console.error("Error saving business profile to Supabase:", error);
        throw error;
    }
};

