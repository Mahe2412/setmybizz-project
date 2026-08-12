/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ARKLE AGENT BRAIN  — Advanced Agentic AI Core              ║
 * ║  Inbound • Outbound • Chat                                  ║
 * ║  Supports: Voice Calls, WhatsApp, Web Chat                  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  HOW IT WORKS:
 *  ─────────────────────────────────────────────────────────────
 *  1. USER INPUT (voice/text) → AgentBrain.think()
 *  2. Brain reads system prompt + conversation history
 *  3. Gemini decides: REPLY or USE_TOOL
 *  4. If USE_TOOL → AgentToolExecutor runs the tool
 *  5. Tool result is fed back to Gemini for final reply
 *  6. Reply goes back to caller via voice / text / whatsapp
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChannelType = 'voice_inbound' | 'voice_outbound' | 'chat_web' | 'chat_whatsapp';

export interface AgentConfig {
  agentId: string;
  agentName: string;
  businessName: string;
  language: string;          // 'tenglish' | 'hindi' | 'english'
  systemPrompt: string;      // The agent's full personality + business knowledge
  enabledTools: ToolName[];  // Which tools this agent can use
  channel: ChannelType;
}

export interface ConversationMessage {
  role: 'agent' | 'user' | 'tool_result';
  content: string;
  toolName?: string;
  timestamp: number;
}

export interface ThinkResult {
  reply: string;               // What agent says back (text)
  toolCalled?: ToolName;       // If a tool was used
  toolResult?: any;            // Result from tool
  intent: AgentIntent;         // Detected intent
  confidence: number;          // 0-1 confidence in understanding
  suggestedActions?: string[]; // Next suggested actions for UI
}

export type AgentIntent = 
  | 'GREETING'
  | 'PRODUCT_INQUIRY'
  | 'PRICE_INQUIRY'
  | 'ORDER_PLACEMENT'
  | 'ORDER_STATUS'
  | 'COMPLAINT'
  | 'APPOINTMENT_BOOKING'
  | 'PAYMENT_QUERY'
  | 'FAREWELL'
  | 'GENERAL_CHAT'
  | 'ESCALATE_TO_HUMAN'
  | 'UNKNOWN';

export type ToolName =
  | 'search_products'       // Search business catalog
  | 'create_crm_lead'       // Add lead to CRM
  | 'update_crm_lead'       // Update lead status
  | 'create_order'          // Create order in billbook
  | 'send_whatsapp'         // Send WhatsApp message
  | 'lookup_customer'       // Find customer by phone
  | 'check_order_status'    // Check existing order
  | 'book_appointment'      // Book appointment slot
  | 'send_invoice_link';    // Send payment link

// ─── Intent Detector ──────────────────────────────────────────────────────────

const INTENT_KEYWORDS: Record<AgentIntent, string[]> = {
  GREETING: ['hello', 'hi', 'namaste', 'hai', 'helo', 'good morning', 'good evening'],
  PRODUCT_INQUIRY: ['product', 'item', 'show', 'list', 'available', 'stock', 'vundi', 'untundi'],
  PRICE_INQUIRY: ['price', 'cost', 'rate', 'how much', 'enta', 'charge', 'rupees', '₹'],
  ORDER_PLACEMENT: ['order', 'buy', 'purchase', 'want', 'book', 'kavali', 'konu', 'teesuko'],
  ORDER_STATUS: ['status', 'delivered', 'where', 'track', 'reached', 'ochinda'],
  COMPLAINT: ['problem', 'issue', 'damaged', 'wrong', 'complaint', 'bad', 'terrible'],
  APPOINTMENT_BOOKING: ['appointment', 'visit', 'meet', 'schedule', 'booking', 'slot'],
  PAYMENT_QUERY: ['payment', 'pay', 'upi', 'gpay', 'phonepay', 'bank', 'account'],
  FAREWELL: ['bye', 'thank you', 'thanks', 'ok bye', 'dhanyavadam', 'sari bye'],
  GENERAL_CHAT: [],
  ESCALATE_TO_HUMAN: ['manager', 'human', 'person', 'transfer', 'real person'],
  UNKNOWN: [],
};

export function detectIntent(userInput: string): AgentIntent {
  const input = userInput.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(k => input.includes(k))) {
      return intent as AgentIntent;
    }
  }
  return 'GENERAL_CHAT';
}

// ─── Language Style Prompt ─────────────────────────────────────────────────────

function getLanguageStyle(lang: string): string {
  switch (lang) {
    case 'tenglish':
      return 'Speak in a friendly mix of Telugu and English (Tenglish). Example: "Alright garu, mee order place chesestamu. Delivery 2 days lo vasthundi."';
    case 'hindi':
      return 'Speak in Hinglish (Hindi + English mix). Example: "Ji zaroor, main aapka order place kar deta hoon. 2 din mein aa jayega."';
    case 'telugu':
      return 'Speak primarily in Telugu with some English terms for technical/business words.';
    default:
      return 'Speak in clear, friendly Indian English.';
  }
}

// ─── Core Brain ────────────────────────────────────────────────────────────────

export class AgentBrain {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  constructor(private config: AgentConfig) {}

  /**
   * Main think() function — the core of the agent.
   * Takes user input + history, returns what the agent should say/do.
   */
  async think(
    userInput: string,
    history: ConversationMessage[],
    callerInfo?: { phone?: string; name?: string }
  ): Promise<ThinkResult> {
    
    const intent = detectIntent(userInput);
    const langStyle = getLanguageStyle(this.config.language);
    const historyText = history
      .slice(-10) // last 10 messages only (context window management)
      .map(h => `${h.role === 'agent' ? this.config.agentName : 'Customer'}: ${h.content}`)
      .join('\n');

    // ── Build the agentic prompt ──────────────────────────────────────────────
    const prompt = `${this.config.systemPrompt}

═══ YOUR CAPABILITIES (TOOLS) ═══
You can perform these actions during the call. When you decide to use a tool, output EXACTLY in this format:
[TOOL: tool_name | param1="value1" | param2="value2"]

Available tools (only use ones in your enabled list):
- [TOOL: search_products | query="hair serum"] — Search product catalog
- [TOOL: create_crm_lead | name="Ramesh" | phone="9876543210" | interest="Hair Serum"] — Add to CRM
- [TOOL: create_order | customerName="Ramesh" | product="Hair Serum" | qty="2"] — Create order
- [TOOL: send_whatsapp | phone="9876543210" | message="Your order is confirmed!"] — Send WhatsApp
- [TOOL: lookup_customer | phone="9876543210"] — Check if customer exists
- [TOOL: check_order_status | customerPhone="9876543210"] — Check order status
- [TOOL: book_appointment | name="Ramesh" | date="tomorrow" | time="10am"] — Book appointment
- [TOOL: send_invoice_link | phone="9876543210" | amount="599"] — Send payment link

═══ CONVERSATION RULES ═══
${langStyle}
- This is a ${this.config.channel.includes('voice') ? 'PHONE CALL — keep replies SHORT (2-3 sentences max)' : 'chat — can be slightly longer but still concise'}
- Be warm, helpful, professional
- If customer wants to order → use create_order tool AND confirm via send_whatsapp
- If new caller → use create_crm_lead tool to capture their info
- If customer seems upset → acknowledge first, then solve
- NEVER make up prices or product info — use search_products tool
- Channel type: ${this.config.channel}
- Caller phone: ${callerInfo?.phone || 'unknown'}
- Caller name: ${callerInfo?.name || 'not provided yet'}

═══ DETECTED INTENT ═══
Customer's intent appears to be: ${intent}

═══ CONVERSATION HISTORY ═══
${historyText || '(Call just started)'}

═══ CUSTOMER JUST SAID ═══
"${userInput}"

═══ YOUR RESPONSE ═══
Think step by step:
1. What does the customer need?
2. Should I use a tool? (If yes, include [TOOL: ...] line first)
3. What should I say?

Respond now:`;

    const result = await this.model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    // ── Parse tool calls from response ───────────────────────────────────────
    const toolMatch = rawResponse.match(/\[TOOL:\s*(\w+)([^\]]*)\]/);
    let toolCalled: ToolName | undefined;
    let toolParams: Record<string, string> = {};
    let replyText = rawResponse;

    if (toolMatch) {
      toolCalled = toolMatch[1] as ToolName;
      
      // Parse params like: | name="Ramesh" | phone="9876543210"
      const paramMatches = toolMatch[2].matchAll(/(\w+)="([^"]+)"/g);
      for (const pm of paramMatches) {
        toolParams[pm[1]] = pm[2];
      }
      
      // Clean the reply text (remove tool call syntax)
      replyText = rawResponse.replace(/\[TOOL:[^\]]+\]/, '').trim();
      
      // If reply is empty after removing tool call, add a default
      if (!replyText) {
        replyText = 'Oka second wait cheyandi, process chestunna...';
      }
    }

    return {
      reply: replyText,
      toolCalled,
      toolResult: toolParams, // Will be passed to executor
      intent,
      confidence: 0.85,
      suggestedActions: this.getSuggestedActions(intent),
    };
  }

  /**
   * Generate the opening greeting when agent picks up / initiates call
   */
  async generateGreeting(callerName?: string, callType: 'inbound' | 'outbound' = 'inbound'): Promise<string> {
    const langStyle = getLanguageStyle(this.config.language);
    
    const prompt = callType === 'inbound'
      ? `You are ${this.config.agentName}, AI assistant for ${this.config.businessName}. 
         Generate a short, warm inbound call greeting (1-2 sentences).
         ${langStyle}
         Caller name: ${callerName || 'unknown'}
         Example style: "Hello! ${this.config.businessName} ki welcome. Nenu ${this.config.agentName}, meeru emi kavalo cheppagalaru?"`
      : `You are ${this.config.agentName}, calling on behalf of ${this.config.businessName}.
         Generate a short outbound call opening (2-3 sentences). Be friendly, not pushy.
         ${langStyle}
         Customer name: ${callerName || 'Sir/Madam'}
         Example style: "Hello ${callerName || 'garu'}, nenu ${this.config.agentName}, ${this.config.businessName} nundi matladutunna. Meeru maatho inquire chesaru, konadam ki interest unnara?"`;

    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  /**
   * Generate call summary after conversation ends
   */
  async generateCallSummary(history: ConversationMessage[]): Promise<{
    summary: string;
    outcome: string;
    nextAction: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }> {
    const historyText = history
      .map(h => `${h.role}: ${h.content}`)
      .join('\n');

    const prompt = `Analyze this conversation and return JSON:
${historyText}

Return ONLY this JSON (no markdown):
{
  "summary": "2-3 sentence summary of what happened",
  "outcome": "ordered|interested|callback|complaint|not_interested|no_answer",
  "nextAction": "What should happen next",
  "sentiment": "positive|neutral|negative"
}`;

    const result = await this.model.generateContent(prompt);
    let text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(text);
    } catch {
      return {
        summary: 'Call completed.',
        outcome: 'unknown',
        nextAction: 'Follow up within 24 hours.',
        sentiment: 'neutral',
      };
    }
  }

  private getSuggestedActions(intent: AgentIntent): string[] {
    const actions: Record<AgentIntent, string[]> = {
      ORDER_PLACEMENT: ['Create Order', 'Send Payment Link', 'Update CRM'],
      COMPLAINT: ['Log Complaint', 'Escalate to Human', 'Send Apology WhatsApp'],
      PRICE_INQUIRY: ['Share Catalog', 'Send WhatsApp Brochure'],
      APPOINTMENT_BOOKING: ['Book Slot', 'Send Confirmation'],
      FAREWELL: ['Close Call', 'Send Thank You WhatsApp', 'Update CRM Status'],
      ESCALATE_TO_HUMAN: ['Transfer to Human', 'Log Issue'],
      GREETING: [],
      PRODUCT_INQUIRY: ['Show Products', 'Share Catalog'],
      ORDER_STATUS: ['Check Order', 'Send Update'],
      PAYMENT_QUERY: ['Send Payment Link', 'Share Bank Details'],
      GENERAL_CHAT: [],
      UNKNOWN: [],
    };
    return actions[intent] || [];
  }
}
