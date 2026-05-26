import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Loader2, Bot, User, Minimize2, AlertCircle, ExternalLink } from "lucide-react";
import { sendChatMessage } from "../api/client";
import type { ChatMessage } from "../types/chat";

interface Props { datasetId: string; filename?: string; }
type DisplayMessage = ChatMessage & { source?: string };

export default function DatasetChat({ datasetId, filename }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput(""); setLoading(true);
    try {
      const history = messages.map(({ role, content }) => ({ role, content }));
      const res = await sendChatMessage(datasetId, text, history);
      const source = res.model === "nexora-grounded"
        ? "CSV fact"
        : res.model === "nexora-guidance"
          ? "Workflow guidance"
          : "Ollama explanation";
      setMessages((m) => [...m, { role: "assistant", content: res.reply, source }]);
    } catch { 
      setMessages((m) => [...m, { role: "assistant", content: "Failed to reach Nexora AI. Please make sure the backend is running." }]); 
    } finally { 
      setLoading(false); 
    }
  };

  const suggestions = ["What can I predict?", "Which models are eligible?", "How many rows and columns?"];

  return (
    <>
      <AnimatePresence>
        {open && !minimized && (
          <motion.div 
            className="fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-3rem)] flex flex-col bg-white border border-gray-200/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl" 
            initial={{ opacity: 0, y: 30, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 30, scale: 0.95 }} 
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            style={{ maxHeight: "min(600px, 75vh)" }}
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 tracking-tight">Nexora Guide</p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{filename ?? datasetId.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" aria-label="Minimize chat" onClick={() => setMinimized(true)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><Minimize2 className="w-3.8 h-3.8" /></button>
                <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><X className="w-3.8 h-3.8" /></button>
              </div>
            </div>

            {!isLocal && (
              <div className="bg-amber-50/80 border-b border-amber-100 px-4 py-2.5 text-xs text-amber-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span>
                    <strong>Nexora-Helper (Ollama)</strong> is only available when running locally.
                  </span>
                  <a 
                    href="https://github.com/jeet2005/Nexora" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-0.5 text-emerald-700 hover:text-emerald-800 font-medium underline ml-1.5"
                  >
                    View clone guide <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[220px] bg-gradient-to-b from-transparent to-gray-50/20">
              {messages.length === 0 && (
                <div className="space-y-3 py-2">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    CSV facts and analytical insights answer instantly. Advanced open-ended definitions require a local Ollama instance.
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((s) => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setInput(s)} 
                        className="block w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-gray-100 bg-white text-gray-500 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border ${m.role === "user" ? "bg-gray-100 border-gray-200" : "bg-emerald-50 border-emerald-100"}`}>
                    {m.role === "user" ? <User className="w-3.8 h-3.8 text-gray-600" /> : <Bot className="w-3.8 h-3.8 text-emerald-600" />}
                  </div>
                  <div className={`text-sm px-3.5 py-2.5 rounded-2xl max-w-[82%] leading-relaxed whitespace-pre-wrap shadow-sm border ${m.role === "user" ? "bg-gray-50 border-gray-200/60 text-gray-800" : "bg-emerald-50/40 border-emerald-100/40 text-gray-800"}`}>
                    {m.source && <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-1">{m.source}</span>}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex gap-2 items-center text-gray-400 text-sm font-medium pl-1"><Loader2 className="w-4 h-4 animate-spin text-emerald-600" />Thinking…</div>}
              <div ref={bottomRef} />
            </div>
            
            <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()} 
                placeholder="Ask what to predict or why…" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:outline-none transition-all" 
              />
              <button 
                type="button" 
                aria-label="Send message" 
                onClick={send} 
                disabled={loading || !input.trim()} 
                className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all shadow-md shadow-emerald-600/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button 
        type="button" 
        aria-label="Open data guide chat" 
        onClick={() => { setOpen(true); setMinimized(false); }} 
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all" 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-6 h-6" />
        {open && minimized && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full animate-pulse" />}
      </motion.button>
    </>
  );
}
