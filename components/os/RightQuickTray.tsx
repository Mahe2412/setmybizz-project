'use client';
import React from 'react';

const RIGHT_TRAY_APPS = [
   { id: 'mail', icon: 'mail', label: 'Gmail', count: 4, color: 'text-red-500' },
   { id: 'docs', icon: 'description', label: 'Documents', color: 'text-blue-500' },
   { id: 'grid', icon: 'grid_view', label: 'Apps', color: 'text-green-500' },
   { id: 'notes', icon: 'edit_note', label: 'Notes', color: 'text-orange-500' },
   { id: 'tasks', icon: 'check_circle', label: 'Tasks', count: 12, color: 'text-indigo-600' },
   { id: 'marketing', icon: 'campaign', label: 'Marketing', color: 'text-pink-500' },
   { id: 'calendar', icon: 'calendar_month', label: 'Calendar', color: 'text-sky-500' },
   { id: 'alerts', icon: 'notifications', label: 'Alerts', count: 2, color: 'text-orange-500' },
   { id: 'chat', icon: 'chat', label: 'WhatsApp', color: 'text-emerald-500' },
];

interface RightQuickTrayProps {
   onAppClick?: (appId: string) => void;
}

export default function RightQuickTray({ onAppClick }: RightQuickTrayProps) {
   return (
      <div className="fixed right-6 top-[18%] z-[200] flex flex-col gap-5 items-center">
         {RIGHT_TRAY_APPS.map(app => (
            <button 
               key={app.id} 
               onClick={() => onAppClick?.(app.id)}
               className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:scale-110 transition-all group relative border border-slate-50"
            >
               <span className={`material-symbols-outlined text-[24px] ${app.color}`}>{app.icon}</span>
               {app.count && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                     {app.count}
                  </span>
               )}
               <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-2xl">
                  {app.label}
               </div>
            </button>
         ))}
      </div>
   );
}
