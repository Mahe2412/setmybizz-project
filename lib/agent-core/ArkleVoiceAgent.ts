/**
 * Arkle Voice Agent System Prompt Builder
 * 
 * This builds the system prompt for the Universal Arkle Agent.
 * It is injected into Vapi when creating/updating the assistant.
 */

export function buildArkleSystemPrompt(businessContext: {
  businessName?: string;
  ownerName?: string;
  industry?: string;
  products?: string;
  phone?: string;
  customInstructions?: string;
}) {
  const {
    businessName = 'Our Business',
    ownerName = 'the Owner',
    industry = 'Business',
    products = 'various products and services',
    phone = '',
    customInstructions = '',
  } = businessContext;

  return `You are Arkle, a smart, friendly AI business assistant for ${businessName}.

## YOUR IDENTITY
- Your name is Arkle
- You work for ${businessName} (owned by ${ownerName})
- Industry: ${industry}

## YOUR LANGUAGE STYLE
- Speak in natural Tenglish (Telugu + English mix), like a friendly, professional local person
- Use phrases like "అండి", "చెప్పండి", "అవునా", "సరే" naturally
- Be warm, confident, and helpful — NOT robotic
- Keep responses SHORT (2-3 sentences max) — this is a PHONE CALL
- Use natural pauses: "సరే అండి...", "ఒక్క నిమిషం అండి..."

## PRODUCTS & SERVICES
${products}

## YOUR CAPABILITIES
When a customer calls, you can:
1. Answer questions about products, prices, availability
2. Take orders and note down customer requirements
3. Book appointments
4. Collect customer details (save_lead tool)
5. Transfer to human if needed

## TOOLS YOU HAVE
- **save_lead**: Save customer's name, phone, and interest to CRM
- **get_business_info**: Get latest product/pricing info

## RULES
1. ALWAYS greet warmly first
2. NEVER give wrong prices — if unsure, say "నేను confirm చేసి మీకు WhatsApp చేస్తాను అండి"
3. If customer is angry, stay calm and say "నేను అర్థం చేసుకున్నాను అండి, let me help you"
4. If you can't help, say "నేను మన team ని connect చేస్తాను అండి" and end call gracefully
5. At end of call, ALWAYS save the lead using save_lead tool

## OPENING GREETING
"నమస్కారం అండి! నేను అర్కిల్ ని, ${businessName} నుంచి. మీకు ఏ విధంగా సహాయం చేయాలి?"

${customInstructions ? `## CUSTOM INSTRUCTIONS\n${customInstructions}` : ''}`;
}

/**
 * Create or update a Vapi Assistant for Arkle
 * Call this when a user sets up their business agent
 */
export async function createVapiAssistant(options: {
  businessContext: Parameters<typeof buildArkleSystemPrompt>[0];
  assistantName?: string;
  language?: string;
}) {
  const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
  if (!VAPI_PRIVATE_KEY) {
    throw new Error('VAPI_PRIVATE_KEY not configured. Get it from dashboard.vapi.ai');
  }

  const systemPrompt = buildArkleSystemPrompt(options.businessContext);
  const language = options.language || 'te-IN';

  // Map language to Azure voice
  const voiceMap: Record<string, string> = {
    'te-IN': 'te-IN-ShrutiNeural',
    'hi-IN': 'hi-IN-SwaraNeural',
    'en-IN': 'en-IN-NeerjaNeural',
    'ta-IN': 'ta-IN-PallaviNeural',
  };

  const payload = {
    name: options.assistantName || 'Arkle',
    firstMessage: 'నమస్కారం అండి! నేను అర్కిల్ ని. మీకు ఏ విధంగా సహాయం చేయాలి?',
    model: {
      provider: 'azure-openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [{ role: 'system', content: systemPrompt }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'save_lead',
            description: 'Save customer details to CRM after a call',
            parameters: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Customer full name' },
                phone: { type: 'string', description: 'Customer phone number' },
                interest: { type: 'string', description: 'What they are interested in' },
                notes: { type: 'string', description: 'Key points from the conversation' },
              },
              required: ['phone'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'get_business_info',
            description: 'Get current product catalog and business information',
            parameters: {
              type: 'object',
              properties: {
                businessId: { type: 'string', description: 'Business ID' },
              },
              required: [],
            },
          },
        },
      ],
    },
    voice: {
      provider: 'azure',
      voiceId: voiceMap[language] || 'te-IN-ShrutiNeural',
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: language === 'te-IN' ? 'te' : language === 'hi-IN' ? 'hi' : 'en-IN',
    },
    endCallFunctionEnabled: true,
    recordingEnabled: true,
    serverUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`,
    serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET || '',
  };

  const res = await fetch('https://api.vapi.ai/assistant', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Vapi API error: ${error}`);
  }

  return await res.json();
}
