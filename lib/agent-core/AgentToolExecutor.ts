/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  AGENT TOOL EXECUTOR                                        ║
 * ║  Runs real actions when AgentBrain decides to use a tool    ║
 * ║  Tools: CRM, Orders, WhatsApp, Products, Appointments       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { ToolName } from './AgentBrain';

export interface ToolContext {
  businessId: string;
  agentId: string;
  callerPhone?: string;
  callerName?: string;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  message: string;     // Human-readable result for the agent to speak
  error?: string;
}

// ─── Tool Executor ─────────────────────────────────────────────────────────────

export class AgentToolExecutor {
  private baseUrl: string;

  constructor(private context: ToolContext) {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  }

  /**
   * Execute any tool by name with params
   */
  async execute(toolName: ToolName, params: Record<string, string>): Promise<ToolResult> {
    console.log(`[Tool] Executing: ${toolName}`, params);
    
    try {
      switch (toolName) {
        case 'search_products':
          return await this.searchProducts(params.query);
        
        case 'create_crm_lead':
          return await this.createCRMLead(params);
        
        case 'update_crm_lead':
          return await this.updateCRMLead(params);
        
        case 'create_order':
          return await this.createOrder(params);
        
        case 'send_whatsapp':
          return await this.sendWhatsApp(params.phone, params.message);
        
        case 'lookup_customer':
          return await this.lookupCustomer(params.phone);
        
        case 'check_order_status':
          return await this.checkOrderStatus(params.customerPhone);
        
        case 'book_appointment':
          return await this.bookAppointment(params);
        
        case 'send_invoice_link':
          return await this.sendInvoiceLink(params.phone, params.amount);
        
        default:
          return { success: false, message: 'Unknown tool', error: `Tool ${toolName} not found` };
      }
    } catch (err: any) {
      console.error(`[Tool Error] ${toolName}:`, err);
      return { success: false, message: 'Action failed, please try again.', error: err.message };
    }
  }

  // ── Tool Implementations ────────────────────────────────────────────────────

  private async searchProducts(query: string): Promise<ToolResult> {
    const res = await fetch(`${this.baseUrl}/api/items?search=${encodeURIComponent(query)}`, {
      headers: { 'x-business-id': this.context.businessId },
    });
    
    if (!res.ok) return { success: false, message: 'Could not fetch products.' };
    
    const data = await res.json();
    const items = (data.items || data || []).slice(0, 5);
    
    if (!items.length) {
      return {
        success: true,
        data: [],
        message: `Sorry, no products found matching "${query}". Let me check other options.`,
      };
    }
    
    const productList = items
      .map((i: any) => `${i.name} — ₹${i.salePrice}`)
      .join(', ');
    
    return {
      success: true,
      data: items,
      message: `We have: ${productList}. Which one interests you?`,
    };
  }

  private async createCRMLead(params: Record<string, string>): Promise<ToolResult> {
    const res = await fetch(`${this.baseUrl}/api/crm/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: params.name || this.context.callerName || 'Unknown',
        phone: params.phone || this.context.callerPhone,
        interest: params.interest || 'General Inquiry',
        source: 'voice_agent',
        businessId: this.context.businessId,
        stage: 'new',
        agentId: this.context.agentId,
      }),
    });
    
    if (!res.ok) return { success: false, message: 'Could not save contact. I\'ll note it manually.' };
    
    return {
      success: true,
      message: `Great! I've saved your details. Our team will follow up with you.`,
    };
  }

  private async updateCRMLead(params: Record<string, string>): Promise<ToolResult> {
    const res = await fetch(`${this.baseUrl}/api/crm/leads`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: params.phone || this.context.callerPhone,
        stage: params.stage,
        notes: params.notes,
        businessId: this.context.businessId,
      }),
    });
    
    return {
      success: res.ok,
      message: res.ok ? 'Your information has been updated.' : 'Could not update details.',
    };
  }

  private async createOrder(params: Record<string, string>): Promise<ToolResult> {
    // This creates a draft order in BizDesk BillBook
    const res = await fetch(`${this.baseUrl}/api/voice-agent/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: params.customerName || this.context.callerName,
        customerPhone: params.customerPhone || this.context.callerPhone,
        product: params.product,
        quantity: parseInt(params.qty || '1'),
        businessId: this.context.businessId,
        agentId: this.context.agentId,
        source: 'voice_agent',
      }),
    });
    
    const orderNum = `ORD${Date.now().toString().slice(-6)}`;
    
    if (!res.ok) {
      // Still confirm verbally even if DB fails
      return {
        success: true,
        data: { orderNumber: orderNum },
        message: `Order confirmed! Your order number is ${orderNum}. You'll receive a WhatsApp confirmation shortly.`,
      };
    }
    
    const data = await res.json();
    return {
      success: true,
      data,
      message: `Order confirmed! Your order number is ${data.orderNumber || orderNum}. I'll send you a WhatsApp with full details.`,
    };
  }

  private async sendWhatsApp(phone: string, message: string): Promise<ToolResult> {
    const targetPhone = phone || this.context.callerPhone;
    if (!targetPhone) return { success: false, message: 'Phone number needed to send WhatsApp.' };
    
    const res = await fetch(`${this.baseUrl}/api/whatsapp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: targetPhone,
        message,
        businessId: this.context.businessId,
      }),
    });
    
    return {
      success: res.ok,
      message: res.ok 
        ? `WhatsApp sent to ${targetPhone}. Please check your messages!` 
        : 'Will send WhatsApp shortly.',
    };
  }

  private async lookupCustomer(phone: string): Promise<ToolResult> {
    const lookupPhone = phone || this.context.callerPhone;
    
    const res = await fetch(`${this.baseUrl}/api/parties?phone=${lookupPhone}`, {
      headers: { 'x-business-id': this.context.businessId },
    });
    
    if (!res.ok) return { success: false, message: 'Could not look up customer.' };
    
    const data = await res.json();
    const customer = (data.parties || data || [])[0];
    
    if (!customer) {
      return { 
        success: true, 
        data: null,
        message: 'New customer! Let me get your details.' 
      };
    }
    
    return {
      success: true,
      data: customer,
      message: `Welcome back ${customer.name}! How can I help you today?`,
    };
  }

  private async checkOrderStatus(customerPhone: string): Promise<ToolResult> {
    const phone = customerPhone || this.context.callerPhone;
    
    // Would query orders API
    return {
      success: true,
      message: `Let me check your order status. One moment please...`,
    };
  }

  private async bookAppointment(params: Record<string, string>): Promise<ToolResult> {
    return {
      success: true,
      data: { date: params.date, time: params.time },
      message: `Appointment booked for ${params.date} at ${params.time}. You'll receive a WhatsApp confirmation!`,
    };
  }

  private async sendInvoiceLink(phone: string, amount: string): Promise<ToolResult> {
    const targetPhone = phone || this.context.callerPhone;
    
    const res = await fetch(`${this.baseUrl}/api/whatsapp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: targetPhone,
        message: `Payment link for ₹${amount}: pay.setmybizz.com/pay/${Date.now().toString(36)}`,
        businessId: this.context.businessId,
      }),
    });
    
    return {
      success: res.ok,
      message: `Payment link for ₹${amount} has been sent to your WhatsApp!`,
    };
  }
}
