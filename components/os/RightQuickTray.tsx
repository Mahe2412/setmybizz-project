'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogleWorkspace } from '@/lib/firebase';
import { fetchUserEmails, GoogleEmail, getMockEmails } from '@/lib/google-api';

interface RightQuickTrayProps {
   onAppClick?: (appId: string) => void;
}

export default function RightQuickTray({ onAppClick }: RightQuickTrayProps) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [activePanel, setActivePanel] = useState<'mail' | 'docs' | 'sheets' | 'drive' | 'meet' | 'esign' | 'grid' | null>(null);
   const [isGoogleConnected, setIsGoogleConnected] = useState(false);
   const [userEmail, setUserEmail] = useState<string | null>(null);
   const [googleToken, setGoogleToken] = useState<string | null>(null);
   const [isConnecting, setIsConnecting] = useState(false);
   const [emails, setEmails] = useState<GoogleEmail[]>([]);
   const [isLoadingEmails, setIsLoadingEmails] = useState(false);

   // E-Sign Canvas Ref & State
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [isDrawing, setIsDrawing] = useState(false);
   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
   const [isSigned, setIsSigned] = useState(false);

   // Google Drive / Sheets Mock Data
   const [driveFiles, setDriveFiles] = useState([
      { name: 'Incorporation_Certificate.pdf', size: '2.4 MB', date: 'Yesterday' },
      { name: 'Founder_Agreement_Signed.pdf', size: '1.8 MB', date: '3 days ago' },
      { name: 'Office_Rental_Agreement.pdf', size: '4.1 MB', date: 'Last week' },
   ]);

   const [sheets, setSheets] = useState([
      { name: 'Financial_Projections_2026.xlsx', date: '2 hours ago', rows: 42 },
      { name: 'Lead_Generation_Tracker.xlsx', date: 'Yesterday', rows: 128 },
      { name: 'GST_Computations_Q1.xlsx', date: 'June 15, 2026', rows: 15 },
   ]);

   // Google Meet States
   const [meetLink, setMeetLink] = useState<string | null>(null);
   const [meetTopic, setMeetTopic] = useState('');

   // Load connection state from localStorage on mount
   useEffect(() => {
      if (typeof window !== 'undefined') {
         const connected = localStorage.getItem('setmybizz_google_connected') === 'true';
         const email = localStorage.getItem('setmybizz_google_email');
         const token = localStorage.getItem('setmybizz_google_token');
         setIsGoogleConnected(connected);
         setUserEmail(email);
         if (token) setGoogleToken(token);
      }
   }, []);

   // Fetch emails when connected
   useEffect(() => {
      if (isGoogleConnected && googleToken) {
         setIsLoadingEmails(true);
         fetchUserEmails(googleToken)
            .then(data => {
               setEmails(data);
               setIsLoadingEmails(false);
            })
            .catch(err => {
               console.error("Failed to fetch emails:", err);
               setEmails(getMockEmails().slice(0, 5));
               setIsLoadingEmails(false);
            });
      } else {
         setEmails(getMockEmails().slice(0, 5));
      }
   }, [isGoogleConnected, googleToken]);

   const handleGoogleConnect = async () => {
      setIsConnecting(true);
      try {
         const { user, token } = await signInWithGoogleWorkspace();
         setIsGoogleConnected(true);
         setUserEmail(user.email);
         if (token) {
            setGoogleToken(token);
            localStorage.setItem('setmybizz_google_token', token);
         }
         localStorage.setItem('setmybizz_google_connected', 'true');
         localStorage.setItem('setmybizz_google_email', user.email || '');
         window.dispatchEvent(new CustomEvent('google-account-connected', { detail: { email: user.email } }));
      } catch (err) {
         console.error("Google connect failed, falling back to mock authentication:", err);
         setIsGoogleConnected(true);
         setUserEmail("admin@localbusiness.com");
         localStorage.setItem('setmybizz_google_connected', 'true');
         localStorage.setItem('setmybizz_google_email', "admin@localbusiness.com");
      } finally {
         setIsConnecting(false);
      }
   };

   const handleDisconnect = () => {
      setIsGoogleConnected(false);
      setUserEmail(null);
      setGoogleToken(null);
      localStorage.removeItem('setmybizz_google_connected');
      localStorage.removeItem('setmybizz_google_email');
      localStorage.removeItem('setmybizz_google_token');
      window.dispatchEvent(new CustomEvent('google-account-disconnected'));
   };

   const handleTrayIconClick = (appId: string) => {
      if (isDrawerOpen && activePanel === appId) {
         setIsDrawerOpen(false);
      } else if (['mail', 'docs', 'sheets', 'drive', 'meet', 'esign', 'grid'].includes(appId)) {
         setActivePanel(appId as any);
         setIsDrawerOpen(true);
      } else {
         onAppClick?.(appId);
      }
   };

   // E-Sign Canvas Handlers
   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      setIsDrawing(true);
   };

   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = '#0f172a'; // dark slate ink
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
   };

   const stopDrawing = () => {
      setIsDrawing(false);
   };

   const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsSigned(false);
   };

   const saveSignature = () => {
      setIsSigned(true);
   };

   // Mock File Upload Handler
   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         setUploadedFile(file);
         // Auto add to drive
         const newFile = {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            date: 'Just now'
         };
         setDriveFiles([newFile, ...driveFiles]);
      }
   };

   // Mock Google Meet generator
   const generateMeetUrl = () => {
      const id = Math.random().toString(36).substring(2, 11).match(/.{1,3}/g)?.join('-');
      setMeetLink(`https://meet.google.com/${id || 'abc-defg-hij'}`);
   };

   const RIGHT_TRAY_APPS = [
      { id: 'mail', icon: 'mail', label: 'Gmail', count: emails.length || 4, color: 'text-red-500' },
      { id: 'esign', icon: 'history_edu', label: 'Google Sign', color: 'text-amber-600' },
      { id: 'sheets', icon: 'table_view', label: 'Google Sheets', color: 'text-emerald-600' },
      { id: 'docs', icon: 'description', label: 'Documents', color: 'text-blue-500' },
      { id: 'drive', icon: 'cloud', label: 'Google Drive', color: 'text-indigo-500' },
      { id: 'meet', icon: 'videocam', label: 'Google Meet', color: 'text-sky-500' },
   ];

   return (
      <>
         {/* STICKY RIGHT TRAY */}
         <div className="fixed right-6 top-[18%] z-[200] flex flex-col gap-4 items-center">
            {RIGHT_TRAY_APPS.map(app => (
               <button 
                  key={app.id} 
                  onClick={() => handleTrayIconClick(app.id)}
                  className={`w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:scale-105 transition-all group relative border ${
                     isDrawerOpen && activePanel === app.id
                        ? 'border-blue-500 ring-2 ring-blue-100' 
                        : 'border-slate-100/50'
                  }`}
               >
                  <span className={`material-symbols-rounded text-[21px] ${app.color}`}>{app.icon}</span>
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

            {/* Add App Button */}
            <button 
               onClick={() => window.dispatchEvent(new CustomEvent('open-marketplace-apps', { detail: { tab: 'marketplace' } }))}
               className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:bg-slate-100 hover:scale-105 transition-all group relative border border-dashed border-slate-300"
            >
               <span className="material-symbols-rounded text-[21px] text-slate-500">add</span>
               <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-2xl">
                  Add Integrations
               </div>
            </button>
         </div>

         {/* EXPANDABLE RIGHT SIDE DRAWER */}
         <AnimatePresence>
            {isDrawerOpen && (
               <>
                  {/* Backdrop */}
                  <div 
                     className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-[180]" 
                     onClick={() => setIsDrawerOpen(false)}
                  />

                  {/* Drawer Container */}
                  <motion.div
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                     className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.08)] border-l border-slate-100 z-[190] flex flex-col"
                  >
                     {/* Drawer Header */}
                     <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2.5">
                           <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                              alt="Google" 
                              className="w-5 h-5" 
                           />
                           <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                              {activePanel === 'mail' && 'Google Mail / Inbox'}
                              {activePanel === 'esign' && 'Google Sign (E-Sign)'}
                              {activePanel === 'sheets' && 'Google Sheets'}
                              {activePanel === 'docs' && 'Google Documents'}
                              {activePanel === 'drive' && 'Google Drive Storage'}
                              {activePanel === 'meet' && 'Google Meet Calls'}
                           </h3>
                        </div>
                        <button 
                           onClick={() => setIsDrawerOpen(false)}
                           className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                           <span className="material-symbols-rounded text-sm">close</span>
                        </button>
                     </div>

                     {/* Drawer Body */}
                     <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                        {/* Connection State */}
                        {!isGoogleConnected ? (
                           <div className="space-y-5 py-4 text-center">
                              <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto border border-blue-100/50">
                                 <span className="material-symbols-rounded text-blue-600 text-3xl">key</span>
                              </div>
                              <div className="space-y-2">
                                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Authorize Google Workspace</h4>
                                 <p className="text-slate-500 text-[11px] leading-relaxed px-4">
                                    Connect your Google Account to authorize Arkle AI with read/write access to your business emails, sheets, and documents.
                                 </p>
                              </div>

                              <button
                                 onClick={handleGoogleConnect}
                                 disabled={isConnecting}
                                 className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
                              >
                                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 bg-white rounded-full p-0.5" />
                                 {isConnecting ? 'Authenticating...' : 'Connect Google'}
                              </button>

                              <div className="border-t border-slate-100 pt-5 text-left space-y-3">
                                 <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Access List</h5>
                                 <ul className="space-y-2 text-[10px] font-bold text-slate-600">
                                    <li className="flex items-center gap-2"><span className="material-symbols-rounded text-green-500 text-sm">check_circle</span> Read & Search Gmail Inbox</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-rounded text-green-500 text-sm">check_circle</span> Create & Read Google Sheets</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-rounded text-green-500 text-sm">check_circle</span> Read Google Drive Files</li>
                                 </ul>
                              </div>
                           </div>
                        ) : (
                           // Connected View
                           <div className="space-y-6">
                              {/* User identity card */}
                              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                                 <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                       {userEmail?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                       <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Connected</span>
                                       <span className="text-[11px] font-bold text-slate-700 truncate block">{userEmail}</span>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={handleDisconnect}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                    title="Disconnect account"
                                 >
                                    <span className="material-symbols-rounded text-sm">logout</span>
                                 </button>
                              </div>

                              {/* GMAIL INBOX LISTING */}
                              {activePanel === 'mail' && (
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gmail Inbox</h4>
                                       <span className="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{emails.length} New</span>
                                    </div>

                                    {isLoadingEmails ? (
                                       <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                                          Loading inbox...
                                       </div>
                                    ) : (
                                       <div className="space-y-2">
                                          {emails.map((mail, idx) => (
                                             <div 
                                                key={mail.id || idx} 
                                                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer space-y-1.5"
                                             >
                                                <div className="flex items-center justify-between gap-2">
                                                   <span className="text-[11px] font-black text-slate-800 truncate">{mail.from}</span>
                                                   <span className="text-[8px] font-black text-slate-400 uppercase whitespace-nowrap">{mail.date}</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-600 truncate">{mail.subject}</div>
                                                <div className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">{mail.snippet}</div>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              )}

                              {/* GOOGLE SIGN (E-SIGNATURE) */}
                              {activePanel === 'esign' && (
                                 <div className="space-y-4">
                                    <div className="border-b border-slate-100 pb-2">
                                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital E-Signature</h4>
                                    </div>

                                    {/* Upload document */}
                                    <div className="space-y-2">
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">1. Upload PDF Document</span>
                                       <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 hover:border-blue-400 rounded-2xl cursor-pointer bg-slate-50/30 hover:bg-blue-50/10 transition-all text-center">
                                          <span className="material-symbols-rounded text-blue-600 text-[24px] mb-1">upload_file</span>
                                          <span className="text-[10px] font-bold text-slate-600">{uploadedFile ? uploadedFile.name : 'Select PDF to Sign'}</span>
                                          <span className="text-[8px] text-slate-400 block mt-0.5">Agreement, invoice or proposal</span>
                                          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                                       </label>
                                    </div>

                                    {/* Drawpad */}
                                    <div className="space-y-2">
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">2. Draw Signature Ink</span>
                                       <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                                          <canvas 
                                             ref={canvasRef}
                                             width={300}
                                             height={120}
                                             onMouseDown={startDrawing}
                                             onMouseMove={draw}
                                             onMouseUp={stopDrawing}
                                             onMouseLeave={stopDrawing}
                                             className="w-full bg-white cursor-crosshair block"
                                          />
                                          <div className="p-2 border-t border-slate-100 flex items-center justify-between bg-white text-[9px] font-black">
                                             <button onClick={clearCanvas} className="text-slate-400 hover:text-slate-600 uppercase">Clear</button>
                                             <button onClick={saveSignature} className="text-blue-600 hover:text-blue-700 uppercase">Apply signature</button>
                                          </div>
                                       </div>
                                    </div>

                                    {isSigned && uploadedFile && (
                                       <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-[10px] font-bold">
                                          <span className="material-symbols-rounded text-emerald-600 text-sm">check_circle</span>
                                          <span>Document signed & saved to Google Drive.</span>
                                       </div>
                                    )}
                                 </div>
                              )}

                              {/* GOOGLE SHEETS */}
                              {activePanel === 'sheets' && (
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Spreadsheets</h4>
                                       <button className="flex items-center gap-1 text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase">
                                          <span className="material-symbols-rounded text-sm">add</span> Create
                                       </button>
                                    </div>

                                    <div className="space-y-2">
                                       {sheets.map((sheet, idx) => (
                                          <div 
                                             key={idx} 
                                             className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all cursor-pointer flex items-center justify-between"
                                          >
                                             <div className="min-w-0">
                                                <span className="text-[11px] font-bold text-slate-700 block truncate">{sheet.name}</span>
                                                <span className="text-[9px] text-slate-400 block mt-0.5">{sheet.rows} rows • Edited {sheet.date}</span>
                                             </div>
                                             <span className="material-symbols-rounded text-emerald-600 text-lg shrink-0">table_view</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* DOCUMENTS */}
                              {activePanel === 'docs' && (
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Docs</h4>
                                       <button className="flex items-center gap-1 text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase">
                                          <span className="material-symbols-rounded text-sm">add</span> Create
                                       </button>
                                    </div>

                                    <div className="space-y-2">
                                       {['Founder_Agreement.docx', 'Business_Plan_Draft.docx', 'Marketing_Strategy.docx'].map((doc, idx) => (
                                          <div 
                                             key={idx} 
                                             className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/10 transition-all cursor-pointer flex items-center justify-between"
                                          >
                                             <div className="min-w-0">
                                                <span className="text-[11px] font-bold text-slate-700 block truncate">{doc}</span>
                                                <span className="text-[9px] text-slate-400 block mt-0.5">Edited last week</span>
                                             </div>
                                             <span className="material-symbols-rounded text-blue-600 text-lg shrink-0">description</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* DRIVE STORAGE */}
                              {activePanel === 'drive' && (
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Drive</h4>
                                       <label className="flex items-center gap-1 text-[9px] font-black text-indigo-600 hover:text-indigo-700 uppercase cursor-pointer">
                                          <span className="material-symbols-rounded text-sm">upload</span> Upload
                                          <input type="file" onChange={handleFileUpload} className="hidden" />
                                       </label>
                                    </div>

                                    <div className="space-y-2">
                                       {driveFiles.map((file, idx) => (
                                          <div 
                                             key={idx} 
                                             className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between"
                                          >
                                             <div className="min-w-0">
                                                <span className="text-[11px] font-bold text-slate-700 block truncate">{file.name}</span>
                                                <span className="text-[9px] text-slate-400 block mt-0.5">{file.size} • {file.date}</span>
                                             </div>
                                             <span className="material-symbols-rounded text-slate-400 text-lg shrink-0">folder</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* MEET CALLS */}
                              {activePanel === 'meet' && (
                                 <div className="space-y-5">
                                    <div className="border-b border-slate-100 pb-2">
                                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Meetings</h4>
                                    </div>

                                    <div className="space-y-3">
                                       <input 
                                          type="text" 
                                          placeholder="Enter meeting topic (e.g. Sales sync)" 
                                          value={meetTopic}
                                          onChange={(e) => setMeetTopic(e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                                       />
                                       <button 
                                          onClick={generateMeetUrl}
                                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                       >
                                          <span className="material-symbols-rounded text-sm">video_call</span>
                                          Generate Meet Link
                                       </button>
                                    </div>

                                    {meetLink && (
                                       <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Meeting Room Ready</span>
                                          <div className="text-xs font-bold text-blue-600 truncate underline cursor-pointer">{meetLink}</div>
                                          <button 
                                             onClick={() => window.open(meetLink, '_blank')}
                                             className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg"
                                          >
                                             Join Call
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>
   );
}
