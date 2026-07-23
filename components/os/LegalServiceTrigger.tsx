'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined SetMyBizz legal services catalog
export const LEGAL_SERVICES = {
  gst: {
    name: 'GST Registration',
    price: '₹999',
    time: '2-3 Business Days',
    desc: 'Government GSTIN certificate with state code mapping. Needed for selling on Amazon, Flipkart, or D2C.',
    perks: ['CA-assisted verification', '100% online process', 'Zero government fees']
  },
  msme: {
    name: 'MSME Udyam Registration',
    price: '₹499',
    time: '1 Business Day',
    desc: 'Udyam micro-enterprise registration certificate. Unlocks PM MUDRA loans and government subsidies.',
    perks: ['Collateral-free loan eligibility', 'Subsidy on patents & barcodes', 'Fast approval']
  },
  incorporation: {
    name: 'Pvt Ltd Company Incorporation',
    price: '₹4,999',
    time: '7-10 Business Days',
    desc: 'Full incorporation under MCA, including DSC, DIN, MoA, AoA, and Certificate of Incorporation.',
    perks: ['Limited liability protection', 'Ready for VC funding', 'PAN & TAN included']
  },
  fssai: {
    name: 'FSSAI Food License',
    price: '₹1,499',
    time: '3-5 Business Days',
    desc: 'Food safety license standard for restaurants, D2C food brands, and packaging products.',
    perks: ['Compliance certified', '1-year validity registration', 'Fast track processing']
  },
  trademark: {
    name: 'Trademark (TM) Filing',
    price: '₹2,999',
    time: '2 Business Days (Filing)',
    desc: 'Brand name and logo protection to prevent copycats in the marketplace.',
    perks: ['Brand ownership', 'Legal protection', 'Filing under active CA/Attorney']
  }
};

export type LegalServiceKey = keyof typeof LEGAL_SERVICES;

interface LegalServiceTriggerProps {
  serviceKey: LegalServiceKey;
  label?: string;
  className?: string;
}

export default function LegalServiceTrigger({ serviceKey, label, className = '' }: LegalServiceTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const service = LEGAL_SERVICES[serviceKey];

  const handleOrder = async () => {
    setOrdered(true);
    // Simulate order pipeline integration
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Request: ${service.name}`,
          phone: '9876543210',
          note: `User initiated purchase for ${service.name} (${service.price}) from BizDesk workflow.`,
          source: 'Legal Trigger',
          category: 'Legal Registration',
          stage: 'Interested'
        })
      });
      // Fire refresh event
      window.dispatchEvent(new CustomEvent('crm-leads-updated'));
    } catch {}
  };

  return (
    <>
      {/* Tiny contextual trigger button */}
      <button
        onClick={() => { setIsOpen(true); setOrdered(false); }}
        className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200/50 transition-all ${className}`}
      >
        <span className="material-symbols-rounded text-[11px] animate-pulse">sparkles</span>
        {label || `Click to Get`}
      </button>

      {/* Glassmorphic Purchase Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-sm w-full font-sans text-left text-slate-800"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-blue-600 text-lg">verified</span>
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">SetMyBizz AI Service</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <span className="material-symbols-rounded text-xs">close</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">{service.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{service.desc}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600">{service.price}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">all-inclusive</span>
                </div>

                {/* Delivery Time Info */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="material-symbols-rounded text-slate-400 text-sm">schedule</span>
                  <p className="text-[10px] font-bold text-slate-600">Expected setup: {service.time}</p>
                </div>

                {/* Perks Checklist */}
                <div className="space-y-1.5 pt-1">
                  {service.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                      <span className="material-symbols-rounded text-green-500 text-[14px]">check_circle</span>
                      {perk}
                    </div>
                  ))}
                </div>

                {ordered ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                  >
                    <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">🎉 Order Initiated!</p>
                    <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Our CA/CS team will contact you under 2 hours.</p>
                  </motion.div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 uppercase transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOrder}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-md"
                    >
                      Buy Service
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
