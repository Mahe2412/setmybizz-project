'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Truck, CheckCircle2, MessageCircle, FileText, Bot, Plus, Tag, Filter, User, MapPin, Search, Download, AlertCircle, Clock, ChevronRight, X, TrendingUp, CreditCard } from 'lucide-react';
import { whatsappService } from '@/lib/whatsappService';

const INDUSTRIES = ["E-Commerce", "Manufacturing", "Wholesale", "Retail / Kirana", "Service", "Hospital", "Restaurant"];

interface Order {
  id: string;
  source: string;
  items: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  amount: string;
  ref: string;
  date: string;
  tags: string[];
  ltv: string;
  dbId?: string; // DB ID if loaded from DB
}

const FALLBACK_ORDERS: Order[] = [
  { id: "ORD-9021", source: "WhatsApp", items: "2x RetroSweets Box, 1x Mint Choco", customer: "Rahul Verma", phone: "+91 99999 11111", email: "rahul.v@gmail.com", address: "12/A, Koramangala, Bangalore - 560034", status: "Unfulfilled", amount: "₹1,350", ref: "UPI_1204892", date: "Today, 11:30 AM", tags: ["VIP", "Returning"], ltv: "₹12,400" },
  { id: "ORD-9022", source: "Instagram", items: "1x Vintage Denim Jacket", customer: "Priya Singh", phone: "+91 88888 22222", email: "priya.style@yahoo.com", address: "45, Jubilee Hills, Hyderabad - 500033", status: "Unfulfilled", amount: "₹2,499", ref: "RZP_491823", date: "Today, 10:15 AM", tags: ["New Customer"], ltv: "₹2,499" },
  { id: "ORD-9023", source: "Website", items: "5kg Raw Cocoa Materials", customer: "TechCorp Ind", phone: "+91 77777 33333", email: "procurement@techcorp.in", address: "MIDC Andheri, Mumbai - 400093", status: "Shipped", amount: "₹15,000", ref: "NEFT_9912", date: "Yesterday", tags: ["B2B", "Wholesale"], ltv: "₹1,45,000" },
  { id: "ABN-1044", source: "WhatsApp", items: "1x Sugarfree Combo", customer: "Anita Sharma", phone: "+91 66666 44444", email: "anita.s@gmail.com", address: "Unknown", status: "Abandoned", amount: "₹850", ref: "-", date: "2 hours ago", tags: ["High Intent"], ltv: "₹0" },
];

export default function OmniSalesTab() {
  const [industry, setIndustry] = useState("E-Commerce");
  const [activeTab, setActiveTab] = useState("unfulfilled");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activePanelOrder, setActivePanelOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    phone: "",
    email: "",
    items: "",
    amount: "",
    address: "",
    source: "WhatsApp",
    paymentRef: ""
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads");
      if (res.ok) {
        const data = await res.json();
        // Filter leads belonging to E-Commerce category or having an orderId
        const dbOrders = data
          .filter((lead: any) => lead.category === "E-Commerce" || lead.orderId)
          .map((lead: any) => ({
            id: lead.orderId || `ORD-${lead.id.slice(-4).toUpperCase()}`,
            source: lead.source || "Manual",
            items: lead.itemsList || "1x Product Item",
            customer: lead.name,
            phone: lead.phone,
            email: lead.email || "—",
            address: lead.address || "No Address Provided",
            status: lead.stage === "Paid" ? "Paid" : lead.stage === "Pending Dispatch" ? "Unfulfilled" : lead.stage === "Dispatched" ? "Shipped" : lead.stage,
            amount: lead.score ? `₹${lead.score * 10}` : "₹0", // Map score to amount for representation
            ref: lead.paymentRef || "-",
            date: new Date(lead.addedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }),
            tags: lead.priority === "High" ? ["VIP"] : ["Standard"],
            ltv: `₹${(lead.score || 0) * 10}`,
            dbId: lead.id
          }));

        // Combine DB orders with fallback orders to show complete data if DB is empty
        setOrders(dbOrders.length > 0 ? dbOrders : FALLBACK_ORDERS);
      }
    } catch (e) {
      console.error("Failed to load orders from CRM", e);
      setOrders(FALLBACK_ORDERS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.items.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "unfulfilled") return o.status === "Unfulfilled" || o.status === "Pending Dispatch";
    if (activeTab === "shipped") return o.status === "Shipped" || o.status === "Dispatched";
    if (activeTab === "abandoned") return o.status === "Abandoned";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Shipped':
      case 'Dispatched':
        return <span className="bg-green-100 text-green-700 border-green-200 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border">Shipped</span>;
      case 'Unfulfilled':
      case 'Pending Dispatch':
        return <span className="bg-amber-100 text-amber-700 border-amber-200 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1"><Clock size={10} /> Unfulfilled</span>;
      case 'Abandoned':
        return <span className="bg-red-100 text-red-700 border-red-200 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1"><AlertCircle size={10} /> Abandoned</span>;
      case 'Paid':
        return <span className="bg-emerald-100 text-emerald-700 border-emerald-200 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1"><CheckCircle2 size={10} /> Paid</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border-slate-200 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border">{status}</span>;
    }
  };

  const getSourceIcon = (source: string) => {
    if (source === 'WhatsApp') return <span className="text-[#25D366] font-black bg-[#25D366]/10 px-1.5 py-0.5 rounded text-[10px]">WA</span>;
    if (source === 'Instagram') return <span className="text-[#E1306C] font-black bg-[#E1306C]/10 px-1.5 py-0.5 rounded text-[10px]">IG</span>;
    return <span className="text-blue-600 font-black bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">WEB</span>;
  };

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newOrder.customer,
          phone: newOrder.phone,
          email: newOrder.email,
          category: "E-Commerce",
          stage: "Pending Dispatch",
          priority: "High",
          source: newOrder.source,
          note: `New Order Placed: ${newOrder.items}`,
          score: Math.round(Number(newOrder.amount.replace(/[^0-9]/g, '')) / 10) || 50,
          orderId,
          itemsList: newOrder.items,
          address: newOrder.address,
          paymentRef: newOrder.paymentRef
        })
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewOrder({ customer: "", phone: "", email: "", items: "", amount: "", address: "", source: "WhatsApp", paymentRef: "" });
        fetchOrders();
      }
    } catch (err) {
      console.error("Error creating order", err);
    }
  };

  const fulfillOrder = async (order: Order) => {
    if (!order.dbId) {
      // Offline/Mock fallback fulfillment
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Shipped' } : o));
      setActivePanelOrder(null);
      return;
    }
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.dbId,
          stage: "Dispatched"
        })
      });
      if (res.ok) {
        fetchOrders();
        setActivePanelOrder(null);
      }
    } catch (err) {
      console.error("Error fulfilling order", err);
    }
  };

  const triggerAICampaign = async (order: Order) => {
    const message = `Hi ${order.customer}! We noticed you left some items in your cart: ${order.items}. Use code SAVE10 for 10% off your purchase. Order link: https://pay.setmybizz.in/cart-recovery`;
    const res = await whatsappService.sendMessage(order.phone, message);
    alert(res.success ? "AI Cart Recovery WhatsApp Message Sent!" : "Failed to send WhatsApp message");
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 flex h-full overflow-hidden">
      
      {/* Main Content Area */}
      <div className={`flex-1 space-y-6 transition-all duration-300 overflow-y-auto pr-2 ${activePanelOrder ? 'mr-[400px]' : ''}`}>
        
        {/* Top Intelligence Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Omni-Sales Engine
              <span className="bg-brand/10 text-brand text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Pro</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Unified command center for orders, inventory fulfillment, and abandoned cart recovery.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 pl-3 uppercase tracking-wider">Workspace:</span>
            <select 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg outline-none cursor-pointer"
            >
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-50"><ShoppingBag size={100} /></div>
            <p className="text-xs font-bold text-slate-500 mb-1 relative z-10">Today's Revenue</p>
            <p className="text-2xl font-black text-slate-900 relative z-10 flex items-center gap-2">
              ₹18,450 <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center"><TrendingUp size={10} className="mr-1"/> +12%</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-slate-500 mb-1">To Fulfill (Pending)</p>
            <p className="text-2xl font-black text-amber-600">
              {orders.filter(o => o.status === "Unfulfilled" || o.status === "Pending Dispatch").length} Orders
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-slate-500 mb-1">Abandoned Carts</p>
            <p className="text-2xl font-black text-red-600">
              {orders.filter(o => o.status === "Abandoned").length} Lost
            </p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">₹4,200 potential value</p>
          </div>
          <div className="bg-brand rounded-2xl p-5 border border-brand shadow-sm text-white relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-50"><Bot size={40} /></div>
            <p className="text-xs font-bold text-brand-100 mb-1 text-blue-200">Arkle AI Recovery</p>
            <p className="text-2xl font-black">₹12,400</p>
            <p className="text-[10px] font-bold mt-1 text-blue-100">Recovered via WhatsApp this week</p>
          </div>
        </div>

        {/* Orders Table Area */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 pt-4 border-b border-slate-100 bg-slate-50/50">
            {['All', 'Unfulfilled', 'Shipped', 'Abandoned'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t.toLowerCase())}
                className={`pb-3 text-sm font-black transition-colors relative ${activeTab === t.toLowerCase() ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t}
                {t === 'Unfulfilled' && (
                  <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full">
                    {orders.filter(o => o.status === "Unfulfilled" || o.status === "Pending Dispatch").length}
                  </span>
                )}
                {activeTab === t.toLowerCase() && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand rounded-t-full" />}
              </button>
            ))}
          </div>

          {/* Table Toolbar */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search orders, customers..." 
                  className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand w-64 bg-slate-50" 
                />
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
                <Filter size={14} /> Filter
              </button>
            </div>
            
            <div className="flex gap-2">
              {selectedOrders.length > 0 ? (
                <>
                  <span className="text-xs font-bold text-brand self-center mr-2">{selectedOrders.length} selected</span>
                  <button onClick={() => alert("Printing labels...")} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 shadow-sm">
                    <Download size={14} /> Print Shipping Labels
                  </button>
                  <button className="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm">
                    <Truck size={14} /> Mark Fulfilled
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 shadow-sm"
                >
                  <Plus size={14} /> Create Draft Order
                </button>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Syncing Omni-orders...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-y border-slate-100">
                    <th className="p-4 w-10">
                      <input type="checkbox" className="rounded border-slate-300" 
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={(e) => setSelectedOrders(e.target.checked ? filteredOrders.map(o => o.id) : [])}
                      />
                    </th>
                    <th className="p-4 font-bold">Order</th>
                    <th className="p-4 font-bold">Date & Source</th>
                    <th className="p-4 font-bold">Customer Profile</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => setActivePanelOrder(order)}
                      className="border-b border-slate-50 hover:bg-brand/5 transition-colors group cursor-pointer"
                    >
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-slate-300"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedOrders([...selectedOrders, order.id]);
                            else setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                          }}
                        />
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-black text-slate-900 text-sm">{order.id}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1 max-w-[120px] truncate">{order.items}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-xs font-bold text-slate-700">{order.date}</div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {getSourceIcon(order.source)} <span className="text-[10px] font-bold text-slate-400">{order.source}</span>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-bold text-slate-800 text-sm mb-1">{order.customer}</div>
                        <div className="flex gap-1 flex-wrap">
                          {order.tags.map(t => (
                            <span key={t} className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-black text-slate-900 text-sm">{order.amount}</div>
                        {order.ref !== "-" && <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Ref: {order.ref}</div>}
                      </td>
                      <td className="p-4 align-top">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel (Order Details Drawer) */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${activePanelOrder ? 'translate-x-0' : 'translate-x-full'}`}>
        {activePanelOrder && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">{activePanelOrder.id}</h2>
              <button onClick={() => setActivePanelOrder(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-8">
              <button 
                onClick={() => fulfillOrder(activePanelOrder)}
                className="flex-1 py-2 bg-brand text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <Truck size={14} /> Fulfill Order
              </button>
              <button 
                onClick={() => whatsappService.sendViaWeb(activePanelOrder.phone, `Hello ${activePanelOrder.customer}, your order ${activePanelOrder.id} is currently processed.`)}
                className="px-3 py-2 bg-[#25D366]/10 text-[#1e9a48] rounded-lg text-xs font-bold flex items-center justify-center hover:bg-[#25D366]/20"
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
            </div>

            {/* Status Timeline */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Order Timeline</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                <div className="relative flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-slate-300 border-2 border-white z-10"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Order Placed via {activePanelOrder.source}</p>
                    <p className="text-[10px] text-slate-400">{activePanelOrder.date}</p>
                  </div>
                </div>
                {activePanelOrder.status !== 'Abandoned' && (
                  <div className="relative flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white z-10 shadow-sm"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1">Payment Captured <CreditCard size={10} className="text-green-600"/></p>
                      <p className="text-[10px] text-slate-400">Ref: {activePanelOrder.ref}</p>
                    </div>
                  </div>
                )}
                <div className={`relative flex items-center gap-4 ${activePanelOrder.status === 'Shipped' ? '' : 'opacity-50'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 border-white z-10 ${activePanelOrder.status === 'Shipped' ? 'bg-green-500 shadow-sm' : 'bg-slate-300'}`}></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Fulfillment & Shipping</p>
                    <p className="text-[10px] text-slate-400">{activePanelOrder.status === 'Shipped' ? 'Dispatched' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Customer Profile</h3>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">LTV: {activePanelOrder.ltv}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-black text-lg">
                    {activePanelOrder.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activePanelOrder.customer}</p>
                    <p className="text-xs text-slate-500">{activePanelOrder.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <MapPin size={14} className="shrink-0 text-slate-400 mt-0.5" />
                    <span>{activePanelOrder.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recovery Box (If Abandoned) */}
            {activePanelOrder.status === 'Abandoned' && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 text-red-100 opacity-50 transform translate-x-4 -translate-y-4"><Bot size={80} /></div>
                <h3 className="text-sm font-black text-red-900 mb-1 flex items-center gap-1"><AlertCircle size={14} /> Recover this Cart</h3>
                <p className="text-xs text-red-700 mb-3 relative z-10">Arkle AI can send an automated 10% discount to this customer via WhatsApp.</p>
                <button 
                  onClick={() => triggerAICampaign(activePanelOrder)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors w-full relative z-10 shadow-sm"
                >
                  Trigger AI WhatsApp Campaign
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[100]">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Create Omni-Sales Order</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={createOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Customer Name</label>
                <input type="text" required value={newOrder.customer} onChange={e => setNewOrder({...newOrder, customer: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Phone</label>
                  <input type="text" required value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. +91 99999 88888" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Email</label>
                  <input type="email" value={newOrder.email} onChange={e => setNewOrder({...newOrder, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. rahul@gmail.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Source Channel</label>
                <select value={newOrder.source} onChange={e => setNewOrder({...newOrder, source: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm">
                  <option value="WhatsApp">WhatsApp Store</option>
                  <option value="Instagram">Instagram Direct</option>
                  <option value="Website">Website Checkout</option>
                  <option value="Manual">Manual Entry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Items Ordered (List)</label>
                <input type="text" required value={newOrder.items} onChange={e => setNewOrder({...newOrder, items: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. 2x RetroSweets Box, 1x Mint Choco" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Amount</label>
                  <input type="text" required value={newOrder.amount} onChange={e => setNewOrder({...newOrder, amount: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. ₹1350" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Payment Ref / Transaction ID</label>
                  <input type="text" value={newOrder.paymentRef} onChange={e => setNewOrder({...newOrder, paymentRef: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. UPI_12345" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Shipping Address</label>
                <textarea required rows={2} value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand text-sm" placeholder="e.g. 12/A, Koramangala, Bangalore - 560034" />
              </div>
              <button type="submit" className="w-full py-3 bg-brand hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors">
                Save & Create Order
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
