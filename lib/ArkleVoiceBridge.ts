/**
 * ArkleVoiceBridge
 * Specialized Mutation Handler for Voice-to-UI Transformation
 */

export interface ArklePatch {
  component: string;
  target: 'backgroundColor' | 'color' | 'fontSize' | 'borderRadius' | 'padding' | 'layout' | 'theme';
  value: string;
}

export interface StylingIntent {
  action: string;
  patches: ArklePatch[];
}

const INTENT_DICTIONARY: Record<string, ArklePatch[]> = {
  'dark mode': [
    { component: 'Global', target: 'theme', value: 'dark' },
    { component: 'Body', target: 'backgroundColor', value: '#0f172a' },
    { component: 'Text', target: 'color', value: '#f8fafc' }
  ],
  'make it bigger': [
    { component: 'Text', target: 'fontSize', value: '1.25rem' }
  ],
  'bold and energetic': [
    { component: 'Hero', target: 'backgroundColor', value: '#FFD700' }, // Vibrant Yellow
    { component: 'Text', target: 'color', value: '#000000' },
    { component: 'Button', target: 'borderRadius', value: '0px' }, // Bold Sharp Edges
    { component: 'Global', target: 'theme', value: 'high-contrast' }
  ],
  'fintech gen-z': [
    { component: 'Global', target: 'theme', value: 'vibrant' },
    { component: 'Header', target: 'backgroundColor', value: '#00ff41' }, // Matrix Green/Fintech Neon
    { component: 'Cards', target: 'borderRadius', value: '24px' }
  ]
};

/**
 * Parses natural language transcript into structured UI patches
 */
export const parseVoiceIntent = (transcript: string): ArklePatch[] => {
  const p = transcript.toLowerCase();
  let patches: ArklePatch[] = [];

  // Match keyword patterns
  if (p.includes('dark mode')) patches.push(...INTENT_DICTIONARY['dark mode']);
  if (p.includes('bigger') || p.includes('increase size')) patches.push(...INTENT_DICTIONARY['make it bigger']);
  
  // Complex Multi-Action Mapping (Fintech Gen-Z Request)
  if (p.includes('fintech') || p.includes('gen-z') || p.includes('bold') || p.includes('energetic')) {
    patches.push(...INTENT_DICTIONARY['bold and energetic']);
    patches.push(...INTENT_DICTIONARY['fintech gen-z']);
  }

  // Handle direct color commands like "Make the header red"
  const colorMatch = p.match(/make the (header|footer|background|button) (red|blue|green|black|white|yellow)/);
  if (colorMatch) {
    const [, component, color] = colorMatch;
    const colorMap: Record<string, string> = {
      red: '#FF0000',
      blue: '#0000FF',
      green: '#008000',
      black: '#000000',
      white: '#FFFFFF',
      yellow: '#FFFF00'
    };
    patches.push({
      component: component.charAt(0).toUpperCase() + component.slice(1),
      target: component === 'background' ? 'backgroundColor' : 'backgroundColor',
      value: colorMap[color] || color
    });
  }

  return patches;
};

/**
 * Generates a JSON patch summary for logging or state tracking
 */
export const generateArklePatchSummary = (patches: ArklePatch[]) => {
  return JSON.stringify(patches, null, 2);
};
