'use client';
import React, { useState } from 'react';
import { Package, Wrench, Hammer, Plus, Users, Zap } from 'lucide-react';

const INDUSTRIES = ["Manufacturing", "Service / Agency", "Trading / Retail"];

const INVENTORY_DATA = [
  { id: "ITEM-001", type: "Raw Material", name: "Premium Cotton Fabric", stock: "1450 Meters", value: "₹2,17,500", reorderAt: "500 Meters" },
  { id: "ITEM-002", type: "Raw Material", name: "Thread Spools (Black)", stock: "120 Units", value: "₹4,800", reorderAt: "50 Units" },
  { id: "ITEM-003", type: "Finished Good", name: "Classic Black T-Shirt (M)", stock: "450 Pcs", value: "₹1,35,000", reorderAt: "100 Pcs" },
];

const SERVICE_PROJECTS = [
  { id: "PRJ-901", client: "TechCorp Ind", task: "Website Redesign", status: "In Progress", deadline: "12 Aug", assignees: ["Rahul", "Priya"] },
  { id: "PRJ-902", client: "Vikram Mehta", task: "GST Filing FY 24-25", status: "Waiting for Docs", deadline: "30 Aug", assignees: ["Admin"] },
];

export default function OperationsTab() {
  const [industry, setIndustry] = useState("Manufacturing");
  const [activeSubTab, setActiveSubTab] = useState("inventory");

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations & Inventory</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
            Manage your supply chain, manufacturing bill of materials, and service project statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Mode:</label>
          <select 
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              if (e.target.value === 'Service / Agency') setActiveSubTab('projects');
              else setActiveSubTab('inventory');
            }}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl outline-none shadow-md cursor-pointer"
          >
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
        {industry !== 'Service / Agency' && (
          <>
            <button onClick={() => setActiveSubTab('inventory')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'inventory' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              Stock & Inventory
            </button>
            <button onClick={() => setActiveSubTab('production')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'production' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              Production (BOM)
            </button>
          </>
        )}
        {(industry === 'Service / Agency' || industry === 'Manufacturing') && (
          <button onClick={() => setActiveSubTab('projects')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'projects' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            {industry === 'Manufacturing' ? 'Work Orders' : 'Active Projects / Tasks'}
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2"><Package size={16} /> Raw Materials & Goods</h2>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2">
              <Plus size={14} /> Add Item
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="p-4 font-bold">Item & Type</th>
                <th className="p-4 font-bold">Current Stock</th>
                <th className="p-4 font-bold">Stock Value</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {INVENTORY_DATA.map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-[10px] bg-slate-100 text-slate-500 w-fit px-2 py-0.5 rounded uppercase font-black mt-1">{item.type}</div>
                  </td>
                  <td className="p-4 font-black text-slate-700">{item.stock}</td>
                  <td className="p-4 font-bold text-green-700">{item.value}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                      In Stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'production' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-lg text-slate-800 flex items-center gap-2"><Hammer className="text-amber-600" size={20} /> Bill of Materials (BOM)</h2>
              <button className="text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-lg">Create Formula</button>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 mb-2">Classic Black T-Shirt (M)</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Formula to manufacture 1 unit of this finished good:</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                  <span className="font-bold text-slate-700">Premium Cotton Fabric</span>
                  <span className="font-black text-brand">1.2 Meters</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                  <span className="font-bold text-slate-700">Thread Spools (Black)</span>
                  <span className="font-black text-brand">0.05 Units</span>
                </div>
              </div>
              
              <button className="mt-4 w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">
                Run Production Batch
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <Zap size={32} />
            </div>
            <h3 className="font-black text-lg text-slate-900 mb-2">AI Manufacturing Math</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Arkle AI will automatically deduct raw materials when a finished good is marked as manufactured. 
              It will alert you to order more fabric before you run out.
            </p>
            <button className="px-6 py-2 border-2 border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
              Configure Alerts
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'projects' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2"><Wrench size={16} /> Active Operations</h2>
            <button className="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold flex items-center gap-2">
              <Plus size={14} /> New Task
            </button>
          </div>
          <div className="p-6 grid gap-4">
            {SERVICE_PROJECTS.map(proj => (
              <div key={proj.id} className="border border-slate-200 rounded-xl p-4 hover:border-brand transition-colors flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">{proj.id}</div>
                  <h3 className="font-bold text-slate-900">{proj.task}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Users size={12} /> Client: {proj.client}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide mb-2">
                    {proj.status}
                  </div>
                  <div className="text-xs font-bold text-slate-400">Due: {proj.deadline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
