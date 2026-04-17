const fs = require('fs');
const path = 'c:/Users/mahen/OneDrive/Desktop/setmybizz-project/components/os/HomeTab.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /\{\/\* CHAT MESSAGES \*\/\}([\s\S]*?)\{\/\* RIGHT PANEL: NEURAL WORKSPACE \(AGENT MODE ONLY\) \*\/\}/;

const newJSX = `{/* CHAT MESSAGES */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-10 bg-[#f8fafc]">
                           <div className="w-full max-w-[850px] mx-auto pb-6">
                              {msgs.map((m) => (
                                 <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={\`flex w-full mb-10 \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}
                                 >
                                    {m.role === 'user' ? (
                                       // USER MESSAGE - Right aligned, soft pill background
                                       <div className="max-w-[80%] bg-[#eef2f6] text-slate-800 px-6 py-4 rounded-[28px] rounded-br-sm shadow-sm border border-slate-100">
                                          <div className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap break-words">
                                             {m.content}
                                          </div>
                                       </div>
                                    ) : (
                                       // AI MESSAGE - Left aligned, transparent background, sparkle icon
                                       <div className="flex gap-5 w-full max-w-[95%]">
                                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shrink-0 flex items-center justify-center mt-1 shadow-md shadow-blue-200">
                                             <span className="material-symbols-rounded text-white text-[20px]">auto_awesome</span>
                                          </div>
                                          <div className="flex-1 min-w-0 pt-1">
                                             <div className="text-[15px] md:text-[16px] text-slate-800 leading-[1.8] font-normal whitespace-pre-wrap break-words">
                                                {m.content}
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                 </motion.div>
                              ))}
                              
                              {loading && (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-5 w-full max-w-[95%] mb-8">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 shrink-0 flex items-center justify-center mt-1 animate-pulse">
                                       <span className="material-symbols-rounded text-white text-[20px]">auto_awesome</span>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                 </motion.div>
                              )}
                              <div ref={scrollRef} className="h-10" />
                           </div>
                        </div>

                        {/* CHAT INPUT (CLEAN GEMINI STYLE) */}
                        <div className="px-8 pb-8 pt-2 bg-gradient-to-t from-[#f8fafc] to-transparent sticky bottom-0 z-30">
                           <div className="w-full max-w-[850px] mx-auto">
                              <div className="bg-white rounded-[32px] p-2 flex flex-col transition-all border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                                 <div className="flex items-end gap-3 px-2 pb-1 pt-1">
                                    <button className="w-10 h-10 mb-1 rounded-full text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all shrink-0">
                                        <span className="material-symbols-rounded text-[24px]">add</span>
                                    </button>
                                    <textarea
                                       value={input}
                                       onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                       placeholder="Ask Arkle..."
                                       rows={1}
                                       ref={convoTextareaRef}
                                       onChange={e => { setInput(e.target.value); resetIdleTimer(); adjustHeight(convoTextareaRef); }}
                                       className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-slate-800 text-[16px] py-3.5 resize-none no-scrollbar min-h-[52px] max-h-[200px] overflow-y-auto leading-[1.6] placeholder:text-slate-400"
                                    />
                                    <div className="flex items-center gap-1 mb-1 shrink-0">
                                        <button className="w-10 h-10 rounded-full text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all">
                                            <span className="material-symbols-rounded text-[22px]">mic</span>
                                        </button>
                                        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className={\`w-10 h-10 rounded-full flex items-center justify-center transition-all \${input.trim() ? 'bg-blue-600 text-white shadow-md hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300'}\`}>
                                            <span className="material-symbols-rounded text-[20px]">arrow_upward</span>
                                        </button>
                                    </div>
                                 </div>
                              </div>
                              <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">Arkle AI is a Neural Operating System and can make mistakes. Verify important business logic.</p>
                           </div>
                        </div>
                     </div>

                     {/* RIGHT PANEL: NEURAL WORKSPACE (AGENT MODE ONLY) */}`;

if(regex.test(content)) {
   content = content.replace(regex, newJSX);
   fs.writeFileSync(path, content, 'utf8');
   console.log('Successfully updated to Gemini layout');
} else {
   console.log('Regex failed. Could not find Chat UI sections.');
}
