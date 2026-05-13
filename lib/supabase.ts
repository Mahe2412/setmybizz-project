/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  SUPABASE BACKEND — SetMyBizz OS                         ║
 * ║  Database schema + client + typed helper functions       ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * DATABASE TABLES:
 * ┌─────────────────────────────────────────────────────────┐
 * │  users          — Auth profiles linked to Supabase auth  │
 * │  businesses     — User's business context & branding     │
 * │  projects       — Each Forge build = one project         │
 * │  project_files  — Generated code files per project       │
 * │  voice_logs     — Voice command transcripts & results    │
 * │  agent_runs     — Digital employee execution records     │
 * └─────────────────────────────────────────────────────────┘
 *
 * SQL TO RUN IN SUPABASE SQL EDITOR:
 * (Copy the SQL block at the bottom of this file)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ── Types ──────────────────────────────────────────────────────────

export interface DBUser {
  id: string;           // = auth.uid()
  email: string;
  full_name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  credits_remaining: number;
  created_at: string;
}

export interface DBBusiness {
  id: string;
  user_id: string;
  business_name: string;
  industry?: string;
  tagline?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  website_url?: string;
  whatsapp?: string;
  region?: string;
  design_taste?: string;  // 'modern' | 'luxury' | 'playful' | 'organic'
  created_at: string;
  updated_at: string;
}

export interface DBProject {
  id: string;
  user_id: string;
  business_id?: string;
  tool_id: string;         // 'website' | 'ecom' | 'logo' etc.
  persona_label: string;   // '⚡ Next.js Architect'
  title: string;
  description?: string;
  status: 'building' | 'ready' | 'deployed' | 'error';
  prompt: string;
  model_used: string;
  preview_url?: string;
  deploy_url?: string;
  voice_triggered: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBProjectFile {
  id: string;
  project_id: string;
  name: string;
  path: string;
  code: string;
  lang: string;
  size_bytes: number;
  created_at: string;
}

export interface DBVoiceLog {
  id: string;
  user_id: string;
  project_id?: string;
  transcript: string;
  command_type: string;
  tool_hint?: string;
  confidence: number;
  was_processed: boolean;
  created_at: string;
}

export interface DBAgentRun {
  id: string;
  user_id: string;
  agent_id: string;
  agent_name: string;
  agent_role: string;
  status: 'idle' | 'working' | 'completed' | 'failed';
  steps_completed: string[];
  result_summary?: string;
  created_at: string;
  completed_at?: string;
}

// ── Supabase Client (Singleton) ─────────────────────────────────────

let _client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (_client) return _client;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.warn('[Supabase] Missing environment variables. Using mock mode.');
    // Return a mock-safe client that won't crash the app
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  
  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  
  return _client;
};

// Export singleton instance for easy import
export const supabase = getSupabase();


// ── User Helpers ────────────────────────────────────────────────────

export const getUserProfile = async (userId: string): Promise<DBUser | null> => {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) { console.error('[Supabase] getUserProfile:', error.message); return null; }
  return data;
};

export const upsertUserProfile = async (user: Partial<DBUser> & { id: string }): Promise<boolean> => {
  const { error } = await getSupabase()
    .from('users')
    .upsert({ ...user, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) { console.error('[Supabase] upsertUserProfile:', error.message); return false; }
  return true;
};

// ── Business Helpers ────────────────────────────────────────────────

export const getUserBusiness = async (userId: string): Promise<DBBusiness | null> => {
  const { data, error } = await getSupabase()
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data;
};

export const upsertBusiness = async (business: Partial<DBBusiness> & { user_id: string }): Promise<DBBusiness | null> => {
  const { data, error } = await getSupabase()
    .from('businesses')
    .upsert({ ...business, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) { console.error('[Supabase] upsertBusiness:', error.message); return null; }
  return data;
};

// ── Project Helpers ─────────────────────────────────────────────────

export const createProject = async (project: Omit<DBProject, 'id' | 'created_at' | 'updated_at'>): Promise<DBProject | null> => {
  const { data, error } = await getSupabase()
    .from('projects')
    .insert({
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) { console.error('[Supabase] createProject:', error.message); return null; }
  return data;
};

export const updateProjectStatus = async (
  projectId: string,
  status: DBProject['status'],
  extra?: Partial<DBProject>
): Promise<boolean> => {
  const { error } = await getSupabase()
    .from('projects')
    .update({ status, ...extra, updated_at: new Date().toISOString() })
    .eq('id', projectId);
  if (error) { console.error('[Supabase] updateProjectStatus:', error.message); return false; }
  return true;
};

export const getUserProjects = async (userId: string, limit = 20): Promise<DBProject[]> => {
  const { data, error } = await getSupabase()
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('[Supabase] getUserProjects:', error.message); return []; }
  return data || [];
};

// ── Project Files Helpers ────────────────────────────────────────────

export const saveProjectFiles = async (
  projectId: string,
  files: { name: string; path: string; code: string; lang: string }[]
): Promise<boolean> => {
  const rows = files.map(f => ({
    project_id: projectId,
    name: f.name,
    path: f.path,
    code: f.code,
    lang: f.lang,
    size_bytes: new Blob([f.code]).size,
    created_at: new Date().toISOString(),
  }));
  
  const { error } = await getSupabase()
    .from('project_files')
    .insert(rows);
  if (error) { console.error('[Supabase] saveProjectFiles:', error.message); return false; }
  return true;
};

export const getProjectFiles = async (projectId: string): Promise<DBProjectFile[]> => {
  const { data, error } = await getSupabase()
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at');
  if (error) { console.error('[Supabase] getProjectFiles:', error.message); return []; }
  return data || [];
};

// ── Voice Log Helpers ───────────────────────────────────────────────

export const logVoiceCommand = async (log: Omit<DBVoiceLog, 'id' | 'created_at'>): Promise<void> => {
  await getSupabase()
    .from('voice_logs')
    .insert({ ...log, created_at: new Date().toISOString() });
  // Fire-and-forget, don't block the voice pipeline on this
};

// ── Agent Run Helpers ────────────────────────────────────────────────

export const createAgentRun = async (run: Omit<DBAgentRun, 'id' | 'created_at'>): Promise<DBAgentRun | null> => {
  const { data, error } = await getSupabase()
    .from('agent_runs')
    .insert({ ...run, created_at: new Date().toISOString() })
    .select()
    .single();
  if (error) { console.error('[Supabase] createAgentRun:', error.message); return null; }
  return data;
};

// ── Full Forge Save Pipeline ─────────────────────────────────────────
/**
 * Called after a successful Forge generation to persist everything.
 * One function to save project + files together.
 */
export const persistForgeResult = async (opts: {
  userId: string;
  toolId: string;
  personaLabel: string;
  prompt: string;
  modelUsed: string;
  title: string;
  files: { name: string; path: string; code: string; lang: string }[];
  voiceTriggered?: boolean;
  businessId?: string;
}): Promise<string | null> => {
  const project = await createProject({
    user_id: opts.userId,
    business_id: opts.businessId,
    tool_id: opts.toolId,
    persona_label: opts.personaLabel,
    title: opts.title,
    prompt: opts.prompt,
    model_used: opts.modelUsed,
    status: 'ready',
    voice_triggered: opts.voiceTriggered || false,
  });

  if (!project) return null;

  await saveProjectFiles(project.id, opts.files);
  return project.id;
};

/* 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗄️  SUPABASE SQL — Run this in your Supabase SQL Editor:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- USERS TABLE
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  credits_remaining integer default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.users enable row level security;
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- BUSINESSES TABLE
create table if not exists public.businesses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  business_name text not null,
  industry text,
  tagline text,
  primary_color text,
  secondary_color text,
  logo_url text,
  website_url text,
  whatsapp text,
  region text default 'India',
  design_taste text default 'modern',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.businesses enable row level security;
create policy "Users own their businesses" on public.businesses for all using (auth.uid() = user_id);

-- PROJECTS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  business_id uuid references public.businesses(id) on delete set null,
  tool_id text not null,
  persona_label text,
  title text not null,
  description text,
  status text default 'building' check (status in ('building', 'ready', 'deployed', 'error')),
  prompt text not null,
  model_used text,
  preview_url text,
  deploy_url text,
  voice_triggered boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "Users own their projects" on public.projects for all using (auth.uid() = user_id);

-- PROJECT FILES TABLE
create table if not exists public.project_files (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  path text not null,
  code text not null,
  lang text,
  size_bytes integer,
  created_at timestamptz default now()
);
alter table public.project_files enable row level security;
create policy "Users can access files via project" on public.project_files for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

-- VOICE LOGS TABLE
create table if not exists public.voice_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  transcript text not null,
  command_type text,
  tool_hint text,
  confidence real default 0.9,
  was_processed boolean default false,
  created_at timestamptz default now()
);
alter table public.voice_logs enable row level security;
create policy "Users own their voice logs" on public.voice_logs for all using (auth.uid() = user_id);

-- AGENT RUNS TABLE
create table if not exists public.agent_runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  agent_id text not null,
  agent_name text not null,
  agent_role text,
  status text default 'idle' check (status in ('idle', 'working', 'completed', 'failed')),
  steps_completed text[] default '{}',
  result_summary text,
  created_at timestamptz default now(),
  completed_at timestamptz
);
alter table public.agent_runs enable row level security;
create policy "Users own their agent runs" on public.agent_runs for all using (auth.uid() = user_id);

-- LEADS TABLE (Master Leads / Funnel Intake)
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  businessName text not null,
  email text not null,
  phone text not null,
  source text,
  status text default 'pending_registration',
  userId uuid references public.users(id) on delete set null,
  displayName text,
  registrationMethod text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.leads enable row level security;
-- Allow anonymous lead capture inserts, but restrict read/update permissions to owner or service role
create policy "Enable insert for all users" on public.leads for insert with check (true);
create policy "Users can view own leads" on public.leads for select using (auth.uid() = userId);

-- HELPFUL INDEXES
create index if not exists idx_projects_user on public.projects(user_id, created_at desc);
create index if not exists idx_project_files_project on public.project_files(project_id);
create index if not exists idx_voice_logs_user on public.voice_logs(user_id, created_at desc);

-- AUTO-CREATE USER PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
