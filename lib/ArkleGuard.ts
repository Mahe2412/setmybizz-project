import { StartupBible } from './ArkleMemoryManager';

/**
 * ArkleGuard Service
 * Autonomous QA & Self-Healing Logic
 */

export interface QAReport {
  status: 'Pass' | 'Fail' | 'Warning';
  checks: {
    syntax: boolean;
    responsive: boolean;
    accessibility: boolean;
    designMatch: boolean;
  };
  errors: string[];
}

/**
 * Validates generated code for basic syntax and structure
 */
export const validateGeneratedCode = (code: string): { valid: boolean; error?: string } => {
  try {
    // Lightweight check for missing imports or unclosed brackets
    if (code.includes('import') && !code.includes('from')) return { valid: false, error: 'Malformed import detected' };
    const openBrackets = (code.match(/{/g) || []).length;
    const closeBrackets = (code.match(/}/g) || []).length;
    if (openBrackets !== closeBrackets) return { valid: false, error: 'Unclosed code block detected' };
    
    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'Linter check failed' };
  }
};

/**
 * Compares requested design intent with generated code
 */
export const checkDesignCompliance = (code: string, bible: StartupBible): string[] => {
  const issues: string[] = [];
  const p = code.toLowerCase();

  // Dark Mode Check
  if (bible.styleGuide.theme.toLowerCase() === 'dark' && p.includes('background-color: #ffffff')) {
    issues.push("Mismatched Intent: Found white background in a dark theme request.");
  }

  // Accessibility Check
  if (!p.includes('aria-label') && (p.includes('<button') || p.includes('<img'))) {
    issues.push("Accessibility: Missing ARIA labels for interactive elements.");
  }

  return issues;
};

/**
 * Auto-Heal suggestions based on runtime errors
 */
export const suggestAutoHeal = (errorLog: string): string => {
  if (errorLog.includes('not defined')) {
    return "Fix: Auto-importing missing dependency and re-binding component.";
  }
  if (errorLog.includes('null reading')) {
    return "Fix: Adding null-safety checks to the data mapping layer.";
  }
  return "Fix: Refactoring broken layout constraints.";
};

/**
 * Generates the Pre-flight Quality Report
 */
export const generateQAReport = (code: string, bible: StartupBible): QAReport => {
  const syntaxCheck = validateGeneratedCode(code);
  const designIssues = checkDesignCompliance(code, bible);
  
  const hasErrors = !syntaxCheck.valid || designIssues.length > 0;

  return {
    status: hasErrors ? 'Warning' : 'Pass',
    checks: {
      syntax: syntaxCheck.valid,
      responsive: code.includes('flex') || code.includes('grid') || code.includes('@media'),
      accessibility: !designIssues.some(i => i.includes('Accessibility')),
      designMatch: !designIssues.some(i => i.includes('Intent'))
    },
    errors: designIssues
  };
};
