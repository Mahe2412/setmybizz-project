"use client";
import { useState } from 'react';
import { generateWhatsAppLink, WHATSAPP_TEMPLATES } from '@/lib/whatsappTool';

export default function WhatsAppTool({ phone, name }: { phone: string; name: string }) {
    const [customMsg, setCustomMsg] = useState("");
    
    // Auto populate template
    const handleTemplate = (type: string) => {
        let msg = "";
        switch(type) {
            case 'welcome':
                msg = WHATSAPP_TEMPLATES.welcome(name);
                break;
            case 'docs':
                msg = WHATSAPP_TEMPLATES.doc_request(name, 'Private Limited');
                break;
            // Add more cases
        }
        setCustomMsg(msg);
    };

    const handleSend = () => {
        if (!phone) return alert('Phone number missing');
        const link = generateWhatsAppLink(phone, customMsg);
        window.open(link, '_blank');
    };

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">chat</span>
                WhatsApp Sender (Free Tool)
            </h4>
            
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {['welcome', 'docs', 'status', 'payment'].map(t => (
                    <button 
                        key={t} 
                        onClick={() => handleTemplate(t)}
                        className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 uppercase"
                    >
                        {t}
                    </button>
                ))}
            </div>

            <textarea 
                className="w-full h-24 p-3 rounded-lg border border-slate-300 text-sm mb-3"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type message or select template..."
            />

            <button 
                onClick={handleSend}
                className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-sm">send</span>
                Send on WhatsApp Web
            </button>
        </div>
    );
}
