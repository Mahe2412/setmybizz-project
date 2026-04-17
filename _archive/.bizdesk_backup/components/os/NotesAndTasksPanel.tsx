'use client';
import React, { useState } from 'react';

type Note = {
  id: string;
  type: 'task' | 'meeting' | 'plan' | 'ai-note';
  title: string;
  content: string;
  date: string;
  completed?: boolean;
};

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    type: 'ai-note',
    title: 'Arkle: US Expansion Strategy',
    content: 'Recommended states for incorporation: Delaware or Wyoming. Next step: confirm market access budget.',
    date: 'Today, 10:30 AM',
  },
  {
    id: '2',
    type: 'task',
    title: 'File GSTR-1 for Feb',
    content: 'Collect invoices from finance team and file before the 11th.',
    date: 'Due Tomorrow',
    completed: false,
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Kickoff with Compliance Expert',
    content: 'Discussing the timeline for obtaining IEC Code for direct exports.',
    date: 'Tomorrow, 2:00 PM',
  }
];

export default function NotesAndTasksPanel({ onClose }: { onClose?: () => void }) {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'task' | 'meeting' | 'plan' | 'ai-note'>('task');
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const n: Note = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle,
      content: newContent,
      date: 'Just now',
      completed: newType === 'task' ? false : undefined,
    };
    setNotes([n, ...notes]);
    setIsAdding(false);
    setNewTitle('');
    setNewContent('');
  };

  const toggleTask = (id: string) => {
    setNotes(notes.map(n => n.id === id && n.type === 'task' ? { ...n, completed: !n.completed } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleGoogleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 1500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return '✅';
      case 'meeting': return '📅';
      case 'plan': return '📝';
      case 'ai-note': return '🤖';
      default: return '📌';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-slate-200 shrink-0 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-lg shadow-inner">
             📝
          </div>
          <div>
            <h2 className="text-[15px] font-black text-slate-900 tracking-tight">Notes & Tasks</h2>
            <p className="text-[10px] font-bold text-slate-500">Your OS Clipboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <button 
          onClick={handleGoogleSync}
          disabled={syncing}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
            synced ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
            syncing ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
           {synced ? '✓ Synced to Docs' : syncing ? 'Syncing...' : '📄 Connect to Google Docs'}
        </button>
        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Share Notes">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {isAdding ? (
          <div className="bg-white rounded-2xl border-2 border-blue-400 p-4 shadow-md animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 mb-3">
               <select 
                 value={newType} 
                 onChange={(e) => setNewType(e.target.value as any)}
                 className="text-xs font-bold bg-slate-100 text-slate-700 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20"
               >
                 <option value="task">✅ Task</option>
                 <option value="meeting">📅 Meeting</option>
                 <option value="plan">📝 Plan / Idea</option>
               </select>
             </div>
             <input 
               autoFocus
               placeholder="Title..." 
               value={newTitle}
               onChange={e => setNewTitle(e.target.value)}
               className="w-full text-sm font-black text-slate-900 border-none outline-none placeholder-slate-400 mb-2"
             />
             <textarea 
               placeholder="Details, strategy, or AI inputs..." 
               value={newContent}
               onChange={e => setNewContent(e.target.value)}
               className="w-full text-xs text-slate-600 border-none outline-none placeholder-slate-400 resize-none h-20"
             />
             <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleAdd} className="px-4 py-1.5 text-xs font-black bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm">Save Note</button>
             </div>
          </div>
        ) : (
          <button 
             onClick={() => setIsAdding(true)}
             className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-sm flex items-center justify-center gap-2"
          >
             <span>+</span> Add Note, Task or Plan
          </button>
        )}

        {notes.map(n => (
          <div key={n.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:-translate-y-0.5 transition-transform hover:shadow-md">
             <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 overflow-hidden">
                   {n.type === 'task' ? (
                     <button 
                       onClick={() => toggleTask(n.id)}
                       className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${n.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 hover:border-blue-400'}`}
                     >
                       {n.completed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                     </button>
                   ) : (
                     <div className="text-xl shrink-0 mt-0.5">{getTypeIcon(n.type)}</div>
                   )}
                   <div className={`flex-1 ${n.type === 'task' && n.completed ? 'opacity-50' : ''}`}>
                      <h3 className={`text-sm font-black text-slate-900 mb-1 ${n.type === 'task' && n.completed ? 'line-through' : ''}`}>
                        {n.title}
                      </h3>
                      {n.content && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-3 pr-2 break-words">
                          {n.content}
                        </p>
                      )}
                      <p className="text-[10px] font-bold text-slate-400">{n.date}</p>
                   </div>
                </div>
                
                <button 
                  onClick={() => deleteNote(n.id)}
                  className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
             </div>
          </div>
        ))}
        {notes.length === 0 && !isAdding && (
          <div className="text-center py-10 opacity-60">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-bold text-slate-600">Your workspace is empty.</p>
            <p className="text-xs text-slate-500 mt-1">Capture AI advice, tasks, and plans here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
