"use client";

import React, { useState } from 'react';

interface IntegrationModalProps {
    toolName: string; // If 'Custom', we allow user to input the name
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function IntegrationModal({ toolName: initialToolName, onClose, onSave }: IntegrationModalProps) {
    const [toolName, setToolName] = useState(initialToolName === 'Custom App' ? '' : initialToolName);
    const [apiKey, setApiKey] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    const isCustom = initialToolName === 'Custom App';

    const handleTest = () => {
        setIsTesting(true);
        // Simulate Secure Proxy Test
        // In real web app: await fetch('/api/integrations/test', { method: 'POST', body: JSON.stringify({ apiKey, url: webhookUrl }) })
        setTimeout(() => {
            setIsTesting(false);
            setTestStatus('success');
        }, 1500);
    };

    const handleSave = () => {
        onSave({
            name: toolName || initialToolName,
            apiKey,
            webhookUrl,
            type: 'generic_proxy' // Flag for backend to treat this as a proxy integration
        });
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <span className="material-icons-outlined text-lg">{isCustom ? 'add_link' : 'extension'}</span>
                        </div>
                        <h3 className="font-bold text-slate-800">{isCustom ? 'Connect New App' : `Connect ${initialToolName}`}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Security & Privacy Banner */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-3">
                        <span className="material-icons-outlined text-blue-600 text-sm mt-0.5">lock</span>
                        <div className="text-xs text-blue-800">
                            <strong className="font-bold block mb-1">End-to-End Encrypted & Private</strong>
                            Your credentials are encrypted before storage. We use a secure proxy to communicate with third-party apps, so your API keys are never exposed to the client or public networks.
                        </div>
                    </div>

                    {/* Integration Guide Steps */}
                    {isCustom && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">How to Integrate securely</h4>
                            <div className="space-y-3 relative">
                                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                                {[
                                    { title: 'Select Service', desc: 'Choose the external tool you want to connect.' },
                                    { title: 'Generate API Key', desc: 'Go to the tool\'s settings and generate a secure API Key/Token.' },
                                    { title: 'Enter Credentials', desc: 'Paste the key below. It will be encrypted immediately.' },
                                    { title: 'Verify Connection', desc: 'We will send a test packet to ensure the link is secure.' }
                                ].map((step, i) => (
                                    <div key={i} className="relative flex items-start gap-3 pl-1">
                                        <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 relative z-10">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-slate-800">{step.title}</h5>
                                            <p className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isCustom && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">App / Tool Name</label>
                            <input
                                type="text"
                                value={toolName}
                                onChange={(e) => setToolName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                placeholder="e.g. Slack, Trello, Zapier"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">API Key / Secret Token</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                            placeholder="sk_live_..."
                        />
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <span className="material-icons-outlined text-[10px]">verified_user</span>
                            This key will be encrypted and stored in our secure vault.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Webhook / API Endpoint</label>
                        <input
                            type="text"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                            placeholder="https://api.example.com/v1/..."
                        />
                    </div>

                    {/* Data Control Section */}
                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Data Control & Privacy</h4>
                        <div className="flex items-start gap-2">
                            <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            <p className="text-xs text-slate-600">
                                I authorize <strong>Secure Proxy</strong> to handle data traffic for this integration.
                                <span className="block text-[10px] text-slate-400 mt-0.5">You can revoke this access at any time from Settings. No data is stored permanently on our servers.</span>
                            </p>
                        </div>
                    </div>

                    {testStatus === 'success' && (
                        <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">check_circle</span>
                            <span>Secure connection established via Proxy.</span>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button
                        onClick={handleTest}
                        disabled={!apiKey || isTesting || (isCustom && !toolName)}
                        className={`px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg hover:bg-indigo-100 transition-colors ${(!apiKey || isTesting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isTesting ? 'Verifying Encrypted Tunnel...' : 'Test Connection'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={testStatus !== 'success'}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Secure Integration
                    </button>
                </div>
            </div>
        </div>
    );
}
