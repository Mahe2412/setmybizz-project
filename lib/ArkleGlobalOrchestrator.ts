/**
 * ArkleGlobalOrchestrator
 * The "Parent Controller" connecting all 4 Modes of Arkle IDE
 */

export type ArkleMode = 'Launcher' | 'Branding' | 'ToolHub' | 'Workforce';

export interface StartupProgress {
  branding: number; // 0-100
  tools: number; // 0-100
  workforce: number; // 0-100
  healthScore: number; // Overall composite score
}

export interface ArkleState {
  currentMode: ArkleMode;
  progress: StartupProgress;
  brandColors: { primary: string; secondary: string };
  suggestedNextMove: string;
}

/**
 * Analyzes the current state and provides proactive suggestions
 */
export const getProactiveSuggestion = (progress: StartupProgress): string => {
  if (progress.branding === 100 && progress.tools === 0) {
    return "Your brand identity is ready! Should we now move to the Tool Hub to build your first Customer Database?";
  }
  if (progress.tools > 50 && progress.workforce === 0) {
    return "Your tools are taking shape. Shall I hire a Research Agent to populate your lead database?";
  }
  if (progress.healthScore < 50) {
    return "Startup health is low. We should finalize your core brand kit to establish trust.";
  }
  return "What's our next big move for the startup?";
};

/**
 * Self-Correction Logic: Detects if a prompt belongs to a different mode
 */
export const detectModeSwitch = (currentMode: ArkleMode, prompt: string): ArkleMode | null => {
  const p = prompt.toLowerCase();
  
  if (currentMode !== 'Launcher' && (p.includes('logo') || p.includes('brand') || p.includes('font'))) {
    return 'Launcher';
  }
  if (currentMode !== 'ToolHub' && (p.includes('database') || p.includes('crm') || p.includes('inventory') || p.includes('tool'))) {
    return 'ToolHub';
  }
  if (currentMode !== 'Workforce' && (p.includes('agent') || p.includes('hire') || p.includes('employee'))) {
    return 'Workforce';
  }
  
  return null;
};

/**
 * Composite Health Score calculation
 */
export const calculateHealthScore = (progress: StartupProgress): number => {
  const score = (progress.branding * 0.3) + (progress.tools * 0.4) + (progress.workforce * 0.3);
  return Math.round(score);
};

export const INITIAL_ARKLE_STATE: ArkleState = {
  currentMode: 'Launcher',
  progress: {
    branding: 25,
    tools: 0,
    workforce: 0,
    healthScore: 8
  },
  brandColors: { primary: '#0073ea', secondary: '#f4f7fe' },
  suggestedNextMove: "Welcome, Founder. Let's start by defining your brand voice."
};
