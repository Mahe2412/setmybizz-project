'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhiteboardPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const updates = [
    { id: 1, type: 'ALERT', text: 'GSTR-1 filing deadline is tomorrow!', priority: 'High' },
    { id: 2, type: 'UPDATE', text: '3 new leads captured via Landing Page.', priority: 'Normal' },
    { id: 3, type: 'ACTION', text: 'Pending: Verify Bank Account for Autopay.', priority: 'Medium' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Dropdown Panel - No Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 right-4 w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Notifications & Tasks</h3>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[10px] font-black text-blue-600 uppercase">Live Updates</span>
              </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto no-scrollbar">
              {updates.map(item => (
                <div key={item.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100 mb-2">
                   <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'ALERT' ? 'bg-red-50 text-red-500' : 
                        item.type === 'ACTION' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-500'
                      }`}>
                         <span className="material-symbols-outlined text-[18px]">
                            {item.type === 'ALERT' ? 'warning' : item.type === 'ACTION' ? 'bolt' : 'notification_important'}
                         </span>
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.type}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                               item.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>{item.priority}</span>
                         </div>
                         <p className="text-[12px] font-bold text-slate-800 mt-1">{item.text}</p>
                         <button className="mt-3 text-[10px] font-black text-blue-600 uppercase hover:underline">Execute Action</button>
                      </div>
                   </div>
                </div>
              ))}

              {updates.length === 0 && (
                <div className="p-10 text-center">
                   <p className="text-xs text-slate-400 font-medium">No immediate actions needed, Miyan! Everything is on autopilot.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-all">View All Activity</button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
