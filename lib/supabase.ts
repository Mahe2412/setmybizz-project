import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ARKIA Persistence Engine (Neural Memory)
 */

export async function saveNeuralMemory(businessName: string, thread: any[]) {
    if (!supabaseUrl) return;
    const { data, error } = await supabase
        .from('neural_memory')
        .insert([{ business_name: businessName, conversation: thread, updated_at: new Date() }]);
    
    if (error) console.error("Neural Memory Save Failed:", error);
    return data;
}

export async function getNeuralMemory(businessName: string) {
    if (!supabaseUrl) return null;
    const { data, error } = await supabase
        .from('neural_memory')
        .select('*')
        .eq('business_name', businessName)
        .order('updated_at', { ascending: false })
        .limit(1);
    
    if (error) console.error("Neural Memory Fetch Failed:", error);
    return data?.[0];
}
