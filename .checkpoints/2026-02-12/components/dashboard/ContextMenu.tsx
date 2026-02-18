"use client";

import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    options: { label: string; action: () => void; icon?: string; danger?: boolean }[];
    onClose: () => void;
}

export default function ContextMenu({ x, y, options, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Prevent off-screen rendering
    const style = {
        top: y,
        left: x,
    };

    return (
        <div
            ref={menuRef}
            className="fixed z-[100] bg-white rounded-lg shadow-xl border border-slate-200 py-1 w-48 animate-in fade-in zoom-in-95 duration-100"
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            {options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => {
                        opt.action();
                        onClose();
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${opt.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}`}
                >
                    {opt.icon && <span className="material-icons-outlined text-sm">{opt.icon}</span>}
                    <span className="font-medium">{opt.label}</span>
                </button>
            ))}
        </div>
    );
}
