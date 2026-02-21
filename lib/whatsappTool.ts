/**
 * WhatsApp Integration: Custom "Click-to-Chat" Builder
 * Since official API is expensive ($10+/mo + msg costs), we use a free alternative:
 * We generate pre-filled WhatsApp links for manual sending by the team.
 * 
 * PROS: 100% Free
 * CONS: Requires one manual click by sales team
 */

export const generateWhatsAppLink = (phone: string, message: string) => {
    // Clean phone number (remove +91, spaces)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Templates for various scenarios
export const WHATSAPP_TEMPLATES = {
    welcome: (name: string) => 
        `Hi ${name}! 👋 Welcome to SetMyBizz. I'm your dedicated startup advisor. I saw you're interested in registering your business. Do you have 5 mins for a quick call?`,
    
    doc_request: (name: string, docName: string) =>
        `Hello ${name}, for your *${docName}* application, we need your PAN and Aadhar card. You can upload them here: https://setmybizz.in/upload`,

    payment_link: (name: string, amount: string, link: string) =>
        `Hi ${name}, here is the payment link for ₹${amount}: ${link}. Once paid, we start the process immediately! 🚀`
};
