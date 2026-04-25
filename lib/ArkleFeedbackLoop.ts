/**
 * ArkleFeedbackLoop
 * Evolution engine for Arkle - Learning from Founder Critiques
 */

export interface GlobalRule {
  key: string;
  value: string | number;
  priority: 'low' | 'medium' | 'high';
}

export interface RestorePoint {
  id: string;
  timestamp: number;
  description: string;
  state: any; // Snapshot of Code + DB Schema + Agent Config
}

export interface EvolutionState {
  globalRules: GlobalRule[];
  negativeConstraints: string[];
  restorePoints: RestorePoint[];
}

const STORAGE_KEY = 'arkle_evolution_state';

/**
 * Translates natural language critique into structural guidelines
 */
export const analyzeUserFeedback = (feedback: string): GlobalRule[] => {
  const p = feedback.toLowerCase();
  const newRules: GlobalRule[] = [];

  if (p.includes('cluttered') || p.includes('too much')) {
    newRules.push({ key: 'UI_DENSITY', value: 'low', priority: 'high' });
    newRules.push({ key: 'WHITESPACE', value: 'increased', priority: 'medium' });
  }

  if (p.includes('boring') || p.includes('flat')) {
    newRules.push({ key: 'ANIMATION_LEVEL', value: 'high', priority: 'medium' });
    newRules.push({ key: 'GRADIENTS', value: 'enabled', priority: 'medium' });
  }

  if (p.includes('slow') || p.includes('laggy')) {
    newRules.push({ key: 'PERFORMANCE_MODE', value: 'optimized', priority: 'high' });
  }

  return newRules;
};

/**
 * Version Control: Creates a snapshot of the current IDE state
 */
export const createRestorePoint = (description: string, currentState: any) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const state: EvolutionState = saved ? JSON.parse(saved) : { globalRules: [], negativeConstraints: [], restorePoints: [] };

  const newPoint: RestorePoint = {
    id: `rp_${Date.now()}`,
    timestamp: Date.now(),
    description,
    state: currentState
  };

  state.restorePoints.unshift(newPoint);
  // Keep only last 10 points
  state.restorePoints = state.restorePoints.slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  console.log(`Arkle Evolution: Restore point created - ${description}`);
};

/**
 * Rollback to a specific restore point
 */
export const rollbackToPoint = (pointId: string): any | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const state: EvolutionState = JSON.parse(saved);
  const point = state.restorePoints.find(p => p.id === pointId);
  return point ? point.state : null;
};
