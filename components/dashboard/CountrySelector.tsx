"use client";

import React from 'react';
import { Country } from '@/types/globalIncorporation';

interface CountrySelectorProps {
    countries: Country[];
    selectedCountry: Country | null;
    onSelectCountry: (country: Country) => void;
}

export default function CountrySelector({ countries, selectedCountry, onSelectCountry }: CountrySelectorProps) {
    return (
        <div className="w-full overflow-x-auto custom-scroll pb-4">
            <div className="flex gap-4 min-w-max px-2">
                {countries.map((country) => {
                    const isSelected = selectedCountry?.id === country.id;
                    return (
                        <button
                            key={country.id}
                            onClick={() => onSelectCountry(country)}
                            className={`group relative flex-shrink-0 w-40 h-48 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected
                                    ? 'border-blue-600 shadow-xl shadow-blue-500/20 scale-105'
                                    : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
                                }`}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${country.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                            {/* Flag */}
                            <div className="relative z-10 pt-6 pb-3 flex justify-center">
                                <div className={`text-6xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'
                                    }`}>
                                    {country.flag}
                                </div>
                            </div>

                            {/* Country Name */}
                            <div className="relative z-10 px-3 text-center">
                                <h3 className={`font-bold text-sm mb-1 transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                                    }`}>
                                    {country.name}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">{country.language}</p>
                                <p className="text-xs text-slate-400 font-bold mt-1">{country.currency}</p>
                            </div>

                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                    <span className="material-icons text-white text-sm">check</span>
                                </div>
                            )}

                            {/* Hover Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
