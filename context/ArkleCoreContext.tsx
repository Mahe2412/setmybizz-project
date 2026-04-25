import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/**
 * Arkle Core Context
 * Autonomous Startup Architect Reasoning Framework
 */

/* ── Founder Schema Types ─────────────────────────────── */

export type StartupStage = 'Pre-seed' | 'Seed' | 'Series A' | 'Bootstrap';
export type ProjectIntent = 'Branding' | 'Product' | 'Automation' | 'Unknown';

export interface UIDesignTokens {
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
  fontWeight: string;
  aesthetic: string;
}

export interface FounderSchema {
  identity: {
    name: string;
    industry: string;
    stage: StartupStage;
  };
  intent: ProjectIntent;
  voiceCode: UIDesignTokens;
  actions: string[]; // List of derived actions like 'generate_logo', 'create_website'
}

interface ArkleState {
  founder: FounderSchema;
  rawPrompt: string;
  isProcessing: boolean;
}

type ArkleAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'PARSE_SCHEMA'; payload: Partial<FounderSchema> }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'RESET' };

/* ── UI Design Token Mapping Logic ─────────────────────── */

const mapVoiceToTokens = (aesthetic: string): UIDesignTokens => {
  const aesthetics: Record<string, UIDesignTokens> = {
    minimalist: {
      primaryColor: '#000000',
      secondaryColor: '#f4f4f4',
      borderRadius: '4px',
      fontWeight: '300',
      aesthetic: 'minimalist'
    },
    'aggressive growth': {
      primaryColor: '#ff0000',
      secondaryColor: '#1a1a1a',
      borderRadius: '12px',
      fontWeight: '900',
      aesthetic: 'aggressive'
    },
    trustworthy: {
      primaryColor: '#0052cc',
      secondaryColor: '#ffffff',
      borderRadius: '8px',
      fontWeight: '500',
      aesthetic: 'corporate'
    },
    futuristic: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#0f172a',
      borderRadius: '24px',
      fontWeight: '700',
      aesthetic: 'tech'
    }
  };

  return aesthetics[aesthetic.toLowerCase()] || aesthetics['trustworthy'];
};

/* ── Prompt-to-Action Mapping System ───────────────────── */

const deriveActions = (prompt: string): string[] => {
  const actions: string[] = [];
  const p = prompt.toLowerCase();

  if (p.includes('logo') || p.includes('branding') || p.includes('identity')) {
    actions.push('generate_logo');
  }
  if (p.includes('website') || p.includes('landing page') || p.includes('site')) {
    actions.push('create_website');
  }
  if (p.includes('crm') || p.includes('database') || p.includes('manage leads')) {
    actions.push('generate_crm_db');
  }
  if (p.includes('automation') || p.includes('workflow') || p.includes('agent')) {
    actions.push('deploy_agent');
  }

  return actions;
};

/* ── Reducer ────────────────────────────────────────── */

const initialState: ArkleState = {
  founder: {
    identity: { name: '', industry: '', stage: 'Pre-seed' },
    intent: 'Unknown',
    voiceCode: mapVoiceToTokens('trustworthy'),
    actions: []
  },
  rawPrompt: '',
  isProcessing: false
};

function arkleReducer(state: ArkleState, action: ArkleAction): ArkleState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { 
        ...state, 
        rawPrompt: action.payload,
        founder: {
          ...state.founder,
          actions: deriveActions(action.payload)
        }
      };
    case 'PARSE_SCHEMA':
      return {
        ...state,
        founder: {
          ...state.founder,
          ...action.payload,
          identity: { ...state.founder.identity, ...action.payload.identity },
          // Auto-map tokens if aesthetic is provided in the payload
          voiceCode: action.payload.voiceCode?.aesthetic 
            ? mapVoiceToTokens(action.payload.voiceCode.aesthetic) 
            : state.founder.voiceCode
        }
      };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/* ── Provider & Hook ─────────────────────────────────── */

const ArkleCoreContext = createContext<{
  state: ArkleState;
  dispatch: React.Dispatch<ArkleAction>;
} | undefined>(undefined);

export const ArkleCoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(arkleReducer, initialState);

  return (
    <ArkleCoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ArkleCoreContext.Provider>
  );
};

export const useArkleCore = () => {
  const context = useContext(ArkleCoreContext);
  if (context === undefined) {
    throw new Error('useArkleCore must be used within an ArkleCoreProvider');
  }
  return context;
};
