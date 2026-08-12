export const whatsappService = {
  /**
   * Sends a standard text message.
   */
  sendMessage: async (phone: string, message: string) => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message, type: 'text' })
      });
      return await response.json();
    } catch (error) {
      console.error("WhatsApp Send Error:", error);
      return { success: false, error };
    }
  },

  /**
   * Sends an invoice (or any document) link via WhatsApp.
   */
  sendInvoice: async (phone: string, invoiceId: string, pdfUrl: string, totalAmount: number) => {
    const message = `Hello! Here is your invoice #${invoiceId} for ₹${totalAmount}. You can download it here: ${pdfUrl}\n\nThank you for your business! - SetMyBizz`;
    return whatsappService.sendMessage(phone, message);
  },

  /**
   * Fallback for client-side redirection (wa.me) if API is not configured.
   */
  sendViaWeb: (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  }
};
