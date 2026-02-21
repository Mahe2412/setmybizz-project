/**
 * WhatsApp Integration Layer
 * Designed to be provider-agnostic.
 * Currently supports Interakt structure (placeholder).
 */

export interface WhatsAppMessage {
    to: string;
    type: 'template' | 'text';
    templateName?: string;
    templateParams?: string[];
    text?: string;
}

const PROVIDER = 'INTERAKT'; // or 'WATI', 'TWILIO'
const API_KEY = process.env.WHATSAPP_API_KEY || ''; 
const BASE_URL = 'https://api.interakt.ai/v1/public/message/'; // Example

export const sendWhatsApp = async (payload: WhatsAppMessage) => {
    if (!API_KEY) {
        console.log('[WhatsApp Mock]', payload);
        return { success: true, mock: true };
    }

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                countryCode: payload.to.slice(0, 2) || '+91', // simplistic check
                phoneNumber: payload.to.slice(2),
                type: payload.type === 'template' ? 'Template' : 'Text',
                template: {
                    name: payload.templateName,
                    languageCode: 'en',
                    bodyValues: payload.templateParams
                }
            })
        });
        
        const data = await response.json();
        return { success: response.ok, data };

    } catch (error) {
        console.error('WhatsApp Error:', error);
        return { success: false, error };
    }
};
