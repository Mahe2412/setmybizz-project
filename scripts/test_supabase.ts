import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SCHEMA_SQL = `
-- 1. Neural Memory
CREATE TABLE IF NOT EXISTS neural_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    conversation JSONB NOT NULL,
    context JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Autopilot Tasks
CREATE TABLE IF NOT EXISTS autopilot_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_role TEXT NOT NULL,
    task_name TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRM Leads
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    phone TEXT,
    email TEXT,
    interest_score INT DEFAULT 0,
    status TEXT DEFAULT 'NEW',
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function main() {
  console.log('--- ARKIA Neural Core: Database Setup ---');
  console.log(`Connecting to: ${supabaseUrl}`);

  try {
    // Testing connection by fetching tables (will be empty but should not error)
    const { data, error } = await supabase.from('neural_memory').select('id').limit(1);
    
    // If table doesn't exist, we need to tell the user to run the SQL manually 
    // because Supabase JS client cannot run raw SQL strings for DDL like this 
    // unless using a specific RPC or if they have the SQL API enabled.
    
    if (error && error.code === '42P01') {
      console.log('✅ Connection Successful! Tables do not exist yet.');
      console.log('\nACTION REQUIRED:');
      console.log('Please go to your Supabase SQL Editor and run the script I provided.');
      console.log('I cannot create tables directly via the API for security reasons.');
    } else if (error) {
      throw error;
    } else {
      console.log('✅ Connection Successful! Tables already exist.');
    }
  } catch (err: any) {
    console.error('❌ Connection Failed:', err.message);
  }
}

main();
