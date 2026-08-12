/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  AGENT ORCHESTRATOR                                         ║
 * ║  The main entry point — ties Brain + Tools together         ║
 * ║  Handles: Voice Calls, Chat, Inbound, Outbound              ║
 * ╚══════════════════════════════════════════════════════════════╝
 * 
 * Usage:
 *   const orchestrator = new AgentOrchestrator(agentConfig, toolContext);
 *   const result = await orchestrator.handleTurn(userInput, history);
 */

import { AgentBrain, AgentConfig, ConversationMessage, ThinkResult } from './AgentBrain';
import { AgentToolExecutor, ToolContext, ToolResult } from './AgentToolExecutor';

export interface TurnResult {
  reply: string;                    // Final text reply to speak/send
  audioText: string;                // Same as reply but cleaned for TTS
  toolsExecuted: {
    name: string;
    result: ToolResult;
  }[];
  intent: string;
  suggestedActions: string[];
  shouldEndCall: boolean;
  escalateToHuman: boolean;
  callSummary?: {
    summary: string;
    outcome: string;
    nextAction: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

// ─── The Orchestrator ──────────────────────────────────────────────────────────

export class AgentOrchestrator {
  private brain: AgentBrain;
  private executor: AgentToolExecutor;

  constructor(
    private agentConfig: AgentConfig,
    private toolContext: ToolContext
  ) {
    this.brain = new AgentBrain(agentConfig);
    this.executor = new AgentToolExecutor(toolContext);
  }

  /**
   * Handle one conversation turn — the main loop.
   * Call this on every message from the user.
   */
  async handleTurn(
    userInput: string,
    history: ConversationMessage[],
    callerInfo?: { phone?: string; name?: string }
  ): Promise<TurnResult> {
    
    // ── 1. Brain thinks ───────────────────────────────────────────────────────
    const thinkResult: ThinkResult = await this.brain.think(userInput, history, callerInfo);

    const toolsExecuted: TurnResult['toolsExecuted'] = [];
    let finalReply = thinkResult.reply;

    // ── 2. Execute tools if needed ────────────────────────────────────────────
    if (thinkResult.toolCalled && thinkResult.toolResult) {
      
      // Check if tool is allowed for this agent
      if (this.agentConfig.enabledTools.includes(thinkResult.toolCalled)) {
        const toolResult = await this.executor.execute(
          thinkResult.toolCalled,
          thinkResult.toolResult as Record<string, string>
        );
        
        toolsExecuted.push({ name: thinkResult.toolCalled, result: toolResult });
        
        // Replace generic reply with tool-specific response
        if (toolResult.success && toolResult.message) {
          finalReply = finalReply || toolResult.message;
        }
      } else {
        console.warn(`[Orchestrator] Tool ${thinkResult.toolCalled} not enabled for agent ${this.agentConfig.agentName}`);
      }
    }

    // ── 3. Detect end conditions ──────────────────────────────────────────────
    const shouldEndCall = thinkResult.intent === 'FAREWELL' || 
      userInput.toLowerCase().includes('bye') ||
      userInput.toLowerCase().includes('thank you bye');

    const escalateToHuman = thinkResult.intent === 'ESCALATE_TO_HUMAN';

    // ── 4. Generate call summary if ending ────────────────────────────────────
    let callSummary: TurnResult['callSummary'] | undefined;
    if (shouldEndCall && history.length > 2) {
      const fullHistory = [...history, { role: 'user' as const, content: userInput, timestamp: Date.now() }];
      callSummary = await this.brain.generateCallSummary(fullHistory);
    }

    // ── 5. Clean text for TTS (remove special chars) ──────────────────────────
    const audioText = finalReply
      .replace(/\[.*?\]/g, '')    // Remove any tool call remnants
      .replace(/[*_#]/g, '')       // Remove markdown
      .replace(/₹/g, 'rupees')    // Replace currency symbol for speech
      .trim();

    return {
      reply: finalReply,
      audioText,
      toolsExecuted,
      intent: thinkResult.intent,
      suggestedActions: thinkResult.suggestedActions || [],
      shouldEndCall,
      escalateToHuman,
      callSummary,
    };
  }

  /**
   * Generate the opening message when call starts
   */
  async getOpeningGreeting(
    callType: 'inbound' | 'outbound' = 'inbound',
    callerName?: string
  ): Promise<string> {
    return await this.brain.generateGreeting(callerName, callType);
  }

  /**
   * Build agent config from DB agent record
   */
  static buildConfig(agent: any, channel: AgentConfig['channel']): AgentConfig {
    const defaultTools: AgentConfig['enabledTools'] = [
      'search_products',
      'create_crm_lead',
      'lookup_customer',
    ];

    // Parse skills from agent DB record
    const skills: string[] = typeof agent.skills === 'string' 
      ? JSON.parse(agent.skills || '[]') 
      : (agent.skills || []);
    
    const enabledTools: AgentConfig['enabledTools'] = [...defaultTools];
    
    if (skills.includes('crm_update')) enabledTools.push('update_crm_lead');
    if (skills.includes('whatsapp')) enabledTools.push('send_whatsapp', 'send_invoice_link');
    if (skills.includes('sales')) enabledTools.push('create_order');
    if (skills.includes('booking')) enabledTools.push('book_appointment');

    return {
      agentId: agent.id,
      agentName: agent.name,
      businessName: agent.businessName || 'Our Business',
      language: agent.language || 'tenglish',
      systemPrompt: agent.systemPrompt || `You are ${agent.name}, a helpful AI assistant.`,
      enabledTools,
      channel,
    };
  }
}

// ─── Voice Synthesis Helper ────────────────────────────────────────────────────

export async function synthesizeVoice(text: string, voiceId?: string): Promise<string | null> {
  const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
  if (!ELEVEN_KEY) return null;

  const targetVoiceId = voiceId || 'pNInz6obpgDQGcFmaJgB'; // Default: Adam (Indian English)
  
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVEN_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.slice(0, 500),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) return null;
    
    const audioBuffer = await res.arrayBuffer();
    return Buffer.from(audioBuffer).toString('base64');
  } catch (err) {
    console.error('[Voice Synthesis Error]', err);
    return null;
  }
}
