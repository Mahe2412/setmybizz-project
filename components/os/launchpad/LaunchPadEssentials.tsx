import React from 'react';
import { SERVICES } from './LaunchPadConstants';

interface LaunchPadEssentialsProps {
    selectedServices: string[];
    toggleService: (id: string) => void;
}

export const LaunchPadEssentials: React.FC<LaunchPadEssentialsProps> = ({
    selectedServices,
    toggleService
}) => {
    return (
        <div className="w-full mt-10 max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-center text-[15px] text-slate-800 mb-8 font-black uppercase tracking-widest flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-slate-100"></span>
                Build Startup Essentials
                <span className="h-px w-10 bg-slate-100"></span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                {SERVICES.map(svc => {
                    const isSelected = selectedServices.includes(svc.id);
                    return (
                        <button
                            key={svc.id}
                            onClick={() => toggleService(svc.id)}
                            className="flex flex-col items-center gap-3 group transition-all"
                        >
                            <div 
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                                    isSelected 
                                    ? 'border-[#0073ea] bg-[#eef5ff] shadow-lg scale-110' 
                                    : 'border-slate-100 bg-white group-hover:border-[#0073ea] group-hover:shadow-md'
                                }`}
                            >
                                <span 
                                    className="material-symbols-outlined text-[28px] transition-all" 
                                    style={{ color: isSelected ? '#0073ea' : svc.color }}
                                >
                                    {svc.icon}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className={`text-[13px] font-black transition-colors ${
                                    isSelected ? 'text-[#0073ea]' : 'text-slate-800'
                                }`}>
                                    {svc.label}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
