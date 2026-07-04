import React from 'react';
import os from 'os';

function getLocalIps() {
  const ips: string[] = [];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips.length > 0 ? [...new Set(ips)] : ['127.0.0.1'];
}

export default async function QrPage() {
  const ips = getLocalIps();
  const port = process.env.PORT || '3001';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            OnePlus 11R Local Preview
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your PC has multiple network adapters. Scan the QR code that matches your phone's Wi-Fi network subnet (usually starts with 192.168.x.x).
          </p>
        </div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ips.map((ip, idx) => {
            const localUrl = `http://${ip}:${port}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(localUrl)}`;
            
            return (
              <div key={ip} className="flex flex-col items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                
                <div className="text-center mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                    Interface #{idx + 1}
                  </span>
                  <code className="text-sm font-mono text-slate-350">{ip}</code>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${ip}`}
                  className="w-48 h-48 rounded-xl border border-slate-800 p-2 bg-white mb-4"
                />

                <div className="w-full">
                  <code className="block p-2 bg-slate-900 rounded border border-slate-800 text-indigo-300 font-mono text-[10px] break-all select-all text-center">
                    {localUrl}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="space-y-3 bg-slate-950/50 p-5 rounded-xl border border-slate-800/50 text-xs">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <p className="text-slate-300">
              Ensure both this PC and your <strong>OnePlus 11R</strong> are connected to the <strong>same Wi-Fi router / SSID</strong>.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <p className="text-slate-300">
              If the page does not load, verify that your computer's network profile is set to <strong>Private</strong> rather than Public, and Windows Firewall permits incoming connections on port <strong>3001</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-500 font-mono text-center">
          Antigravity Developer Tools &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
