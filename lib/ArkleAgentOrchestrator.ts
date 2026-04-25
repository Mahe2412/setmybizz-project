/**
 * ArkleAgentOrchestrator
 * Mode 4: Agentic Workforce Orchestration
 */

export type AgentRole = 'Sales' | 'Accounting' | 'Research' | 'Operations' | 'Marketing';
export type AgentStatus = 'Idle' | 'Working' | 'Completed' | 'Failed';

export interface DigitalEmployee {
  id: string;
  name: string;
  role: AgentRole;
  persona: string;
  toolAccess: string[]; // e.g., ['LinkedIn API', 'Gmail', 'Mode3_CRM']
  memoryType: 'Session' | 'LongTerm';
  status: AgentStatus;
  progress: number;
  logs: string[];
}

export interface AgentWorkflow {
  agent: DigitalEmployee;
  steps: string[];
  systemPrompt: string;
}

const AGENT_TEMPLATES: Record<string, Partial<DigitalEmployee>> = {
  'sales_bot': {
    role: 'Sales',
    persona: 'Professional, persistent, yet friendly outreach specialist.',
    toolAccess: ['LinkedIn API', 'Email', 'CRM_Mode3'],
    memoryType: 'LongTerm'
  },
  'market_researcher': {
    role: 'Research',
    persona: 'Detail-oriented data analyst looking for market gaps.',
    toolAccess: ['Google Search', 'Web Scraper', 'Internal_Docs'],
    memoryType: 'Session'
  }
};

/**
 * Spawns a specialized sub-agent based on user requirements
 */
export const deployDigitalEmployee = (requirement: string): AgentWorkflow => {
  const p = requirement.toLowerCase();
  let agent: DigitalEmployee = {
    id: `agent_${Date.now()}`,
    name: 'Neural Agent',
    role: 'Operations',
    persona: 'Helpful AI Agent',
    toolAccess: [],
    status: 'Idle',
    progress: 0,
    memoryType: 'Session',
    logs: ['Initializing...']
  };

  const steps: string[] = [];
  let systemPrompt = '';

  if (p.includes('linkedin') || p.includes('leads') || p.includes('email')) {
    // Spawn Sales Specialist
    agent = { ...agent, ...AGENT_TEMPLATES['sales_bot'], name: 'Sales-Bot v1' } as DigitalEmployee;
    steps.push('Search LinkedIn for SaaS prospects', 'Verify email addresses', 'Draft personalized outreach');
    systemPrompt = `You are a Cold Outreach Specialist. Your goal is to find ${requirement.match(/\d+/) || 50} leads and draft emails. Access CRM to save data.`;
  } else if (p.includes('accounting') || p.includes('invoice') || p.includes('audit')) {
    // Spawn Accountant
    agent.role = 'Accounting';
    agent.name = 'Finance-AI';
    agent.toolAccess = ['Invoicing_Tool', 'Bank_API'];
    steps.push('Scan Mode 3 CRM for new invoices', 'Categorize expenses', 'Generate monthly report');
    systemPrompt = "You are a Digital Accountant. Audit the Tool Hub records and flag discrepancies.";
  }

  return { agent, steps, systemPrompt };
};

/**
 * Simulates agent activity for UI testing
 */
export const getSimulatedAgentLogs = (agentName: string) => [
  `${agentName}: Connecting to SaaS search engine...`,
  `${agentName}: Found 12 prospects matching criteria...`,
  `${agentName}: Writing drafts to CRM Mode 3...`,
  `${agentName}: 40% of goal reached.`
];
