'use client';
import React from 'react';

export default function SuppliersTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Suppliers Network</h1>
           <p className="text-slate-500 font-medium mt-1">Manage and connect with verified manufacturing and material suppliers.</p>
         </div>
         <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-blue-700 transition-all">+ Add Supplier</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Supplier Name</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'RPL Packaging', cat: 'Logistics', status: 'Active' },
              { name: 'Global Tech Components', cat: 'Hardware', status: 'Pending Review' },
              { name: 'IndiaMart Bulk (API)', cat: 'Raw Material', status: 'Active' },
            ].map((s, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-sm text-slate-900">{s.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{s.cat}</td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 text-[11px] font-bold rounded-lg ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                     {s.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-slate-400 hover:text-blue-600 font-medium text-xs">Manage &rarr;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
