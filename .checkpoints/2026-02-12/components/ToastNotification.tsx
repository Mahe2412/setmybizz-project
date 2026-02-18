import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    subMessage?: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, subMessage, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-24 right-6 z-[200] animate-in slide-in-from-right-10 fade-in duration-500">
            <div className="bg-white border-l-4 border-dashboard-primary shadow-2xl rounded-lg p-4 max-w-sm flex items-start gap-4 ring-1 ring-slate-900/5">
                <div className="bg-blue-50 text-dashboard-primary rounded-full p-2">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{message}</h4>
                    {subMessage && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subMessage}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 ml-2"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        </div>
    );
};

export default Toast;
