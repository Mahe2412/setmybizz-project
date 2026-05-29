import React from 'react';
import os from 'os';

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      // Check for IPv4 and make sure it's not a loopback address
      if (iface.family === 'IPv4' && !iface.internal) {
        if (
          iface.address.startsWith('192.168.') ||
          iface.address.startsWith('10.') ||
          iface.address.startsWith('172.')
        ) {
          return iface.address;
        }
      }
    }
  }
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

export default async function QrPage() {
  const ip = getLocalIp();
  const port = process.env.PORT || '3000';
  const localUrl = `http://${ip}:${port}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(localUrl)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        {/* Header */}
        <div className="space-y-2">
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
            OnePlus Pad 3 Preview
          </h1>
          <p className="text-sm text-slate-400">
            Scan this QR code to view your localhost preview on your tablet
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-inner relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl}
            alt="Localhost QR Code"
            className="w-64 h-64 rounded-xl border border-slate-800 p-2 bg-white"
          />
        </div>

        {/* Info & Instructions */}
        <div className="space-y-4 text-left bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 text-xs">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <p className="text-slate-300">
              Ensure both this PC and your <strong>OnePlus Pad 3</strong> are connected to the <strong>same Wi-Fi network</strong>.
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <div className="space-y-1">
              <p className="text-slate-300">
                Or manually open this URL in your Pad's browser:
              </p>
              <code className="block p-2 bg-slate-900 rounded border border-slate-800 text-indigo-300 font-mono text-[11px] break-all select-all">
                {localUrl}
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-500 font-mono">
          Antigravity Developer Tools &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
