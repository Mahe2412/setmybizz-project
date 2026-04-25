/**
 * ArkleMemoryManager
 * Persistent "Startup Bible" & Context Injection Logic
 */

export interface StartupBible {
  styleGuide: {
    theme: string;
    primaryColor: string;
    fonts: string[];
    tone: 'Professional' | 'Friendly' | 'Bold' | 'Minimalist';
  };
  techStack: {
    database: 'Supabase' | 'Firebase' | 'PostgreSQL';
    hosting: string;
    framework: string;
  };
  businessLogic: string[]; // Custom rules
  metadata: {
    lastUpdated: number;
    version: string;
  };
}

const STORAGE_KEY = 'arkle_startup_bible';

const DEFAULT_BIBLE: StartupBible = {
  styleGuide: {
    theme: 'Vibrant',
    primaryColor: '#3b82f6',
    fonts: ['DM Sans', 'Inter'],
    tone: 'Professional'
  },
  techStack: {
    database: 'Supabase',
    hosting: 'Vercel',
    framework: 'Next.js'
  },
  businessLogic: [
    "Always verify leads before adding to CRM",
    "Use mobile-first responsive designs"
  ],
  metadata: {
    lastUpdated: Date.now(),
    version: '1.0'
  }
};

/**
 * Loads the Startup Bible from persistent storage
 */
export const loadBible = (): StartupBible => {
  if (typeof window === 'undefined') return DEFAULT_BIBLE;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_BIBLE;
};

/**
 * Saves/Updates the Startup Bible
 */
export const saveBible = (bible: StartupBible) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...bible,
    metadata: { lastUpdated: Date.now(), version: '1.0' }
  }));
};

/**
 * RAG Logic: Injects relevant context into the AI System Prompt
 */
export const injectContextIntoPrompt = (currentTask: string): string => {
  const bible = loadBible();
  return `
--- STARTUP CONTEXT (MEMORY VAULT) ---
Goal: Build a ${currentTask}.
Remember: 
- Theme: ${bible.styleGuide.theme} (${bible.styleGuide.tone} tone).
- Colors: Primary is ${bible.styleGuide.primaryColor}.
- Tech: Using ${bible.techStack.database} for data and ${bible.techStack.framework}.
- Rules: ${bible.businessLogic.join('; ')}.
--- END CONTEXT ---
`;
};

/**
 * Conflict Resolution: Detects contradictions in user commands
 */
export const detectBibleConflict = (newInput: string): string | null => {
  const bible = loadBible();
  const p = newInput.toLowerCase();

  if (bible.styleGuide.tone === 'Minimalist' && (p.includes('maximalist') || p.includes('cluttered'))) {
    return "I noticed you previously wanted a 'Minimalist' look, but now you're asking for 'Maximalist' elements. Should I update your global brand kit?";
  }
  
  if (bible.techStack.database === 'Supabase' && p.includes('firebase')) {
    return "We established 'Supabase' as your tech stack earlier. Are we switching to 'Firebase' for this tool?";
  }

  return null;
};
