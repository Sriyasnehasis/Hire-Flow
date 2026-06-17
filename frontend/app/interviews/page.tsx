"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Mic, 
  Sparkles, 
  Zap, 
  Terminal, 
  Play, 
  Volume2, 
  RotateCcw,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function InterviewsPage() {
  const { token } = useAuth() as any;
  const [interviewActive, setInterviewActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("senior_dev");

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/interviews/start-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: selectedRole, interview_type: "voice" }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSessionId(data.session_id);
      setCurrentQuestion(data.current_question);
      setInterviewActive(true);
    } catch (err) {
      alert("System Offline. Check Backend.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (transcript: string) => {
    if (!sessionId || !transcript) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/interviews/sessions/${sessionId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question_id: currentQuestion?.question_id || 0,
          user_answer: transcript,
          answer_type: "voice"
        }),
      });
      const data = await res.json();
      if (data.status === "interview_complete") {
        setInterviewActive(false);
        setFeedback(null);
        alert(`Assessment Complete. Score: ${data.overall_score}/10`);
      } else {
        setFeedback(data.feedback?.overall_comment || data.feedback);
        setCurrentQuestion({ question_text: data.next_question, question_id: 0 });
      }
    } catch (err) {
      alert("Transmission Error.");
    } finally {
      setLoading(false);
      setIsRecording(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* 🔥 Kinetic Header - Semantic Color Update */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
          <div>
            <div className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-5 flex items-center gap-3">
              <div className="flex gap-0.5 items-end h-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1 bg-accent rounded-full" />
                ))}
              </div>
              Voice Interview Labs
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-text">
              Voice <span className="outline-text">Coach.</span>
            </h1>
          </div>
          {!interviewActive && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartInterview}
              className="px-8 py-3.5 bg-accent text-bg-surface rounded-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:filter hover:brightness-110 transition-all group shadow-lg"
            >
              Initialize Node 
              <div className="w-6 h-6 rounded-lg bg-bg-surface/20 flex items-center justify-center group-hover:bg-bg-surface group-hover:text-accent transition-colors">
                <Play size={10} fill="currentColor" />
              </div>
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!interviewActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              key="prep"
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-2 glass-card p-12 overflow-hidden bg-bg-surface relative group border-border">
                {/* Waveform Visualization */}
                <div className="absolute -top-10 -right-10 opacity-[0.05] rotate-12 pointer-events-none group-hover:opacity-[0.1] transition-opacity text-accent">
                   <Volume2 size={300} strokeWidth={0.5} />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-10 leading-none italic text-text">
                   Simulate the <br /> 
                   <motion.span 
                    animate={{ opacity: [1, 0.8, 1], x: [0, -1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
                    className="text-accent"
                   >
                     UNKNOWN.
                   </motion.span>
                </h2>

                <div className="space-y-8 mb-16 relative z-10">
                   {[
                     { t: "Confidence Scan", d: "Voice patterns analyze fluency and communication flow.", i: Mic },
                     { t: "Deep Feedback", d: "Real-time diagnostic on behavioral alignment.", i: Terminal },
                   ].map((item, i) => (
                     <div key={i} className="flex gap-8 items-start">
                       <div className="relative">
                         <div className="absolute -inset-2 bg-accent/10 rounded-full animate-pulse blur-md" />
                         <div className="w-12 h-12 rounded-xl bg-accent-soft border border-accent/20 flex items-center justify-center text-accent group-hover:rotate-3 transition-all relative z-10">
                           <item.i size={20} />
                         </div>
                       </div>
                       <div className="space-y-1.5">
                         <h4 className="font-black text-text uppercase text-xs tracking-widest">{item.t}</h4>
                         <p className="text-text-muted text-[13px] font-bold leading-relaxed">{item.d}</p>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-3 mb-10 relative z-10 max-w-sm">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block">
                    Choose Target Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl py-3 px-4 text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-all"
                  >
                    <option value="senior_dev">Senior Developer</option>
                    <option value="junior_dev">Junior Developer</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="data_scientist">Data Scientist</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="fullstack">Fullstack Developer</option>
                    <option value="sales_executive">Sales Executive</option>
                    <option value="marketing_specialist">Marketing Specialist</option>
                    <option value="customer_support">Customer Support Specialist</option>
                    <option value="hr_specialist">HR Specialist</option>
                  </select>
                </div>

                <motion.button
                  onClick={handleStartInterview}
                  disabled={loading}
                  whileHover="hover"
                  className="relative px-12 py-5 bg-accent text-bg-surface rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:filter hover:brightness-110 transition-all overflow-hidden flex items-center justify-center shadow-xl"
                >
                  <motion.div 
                    variants={{ hover: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: -20 }}
                    className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 pointer-events-none"
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }} className="w-1 bg-bg-surface/30" />
                    ))}
                  </motion.div>
                  <span className="relative z-10">{loading ? "Synching..." : "Launch Full Simulation"}</span>
                </motion.button>
              </div>

              {/* History Nodes - Staggered Animations */}
              <div className="space-y-6">
                <div className="glass-card p-8 bg-bg-surface border-border">
                  <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-10">Recent Logs</h3>
                  <div className="space-y-4">
                    {[
                      { role: "Senior Developer", score: 88, node: "LOG_NODE_102" },
                      { role: "Data Scientist", score: 65, node: "LOG_NODE_103" },
                      { role: "Product Manager", score: 42, node: "LOG_NODE_104" },
                    ].map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center justify-between p-5 bg-[var(--bg-raised)] border-l-2 rounded-xl group hover:bg-[var(--bg-raised)]/80 transition-all border-[var(--border)]
                          ${log.score > 80 ? 'border-l-[var(--accent)]' : log.score > 60 ? 'border-l-[#C25A1A]' : 'border-l-red-500'}`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text)]">{log.role}</span>
                          <span className="text-[8px] font-bold text-[var(--text-muted)] tracking-widest">{log.node}</span>
                        </div>
                        <div className={`font-black text-lg tracking-tighter ${log.score > 80 ? 'text-[var(--accent)]' : log.score > 60 ? 'text-[#C25A1A]' : 'text-red-500'}`}>{log.score}%</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* 🔥 Active High-Fidelity Interface */
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              key="active"
              className="max-w-4xl mx-auto py-8"
            >
              <div className="flex items-center justify-between mb-12 px-4">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse" />
                   <div className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">Audio Connection Stable</div>
                </div>
                <div className="h-px flex-1 mx-10 bg-border" />
                <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Question #01</div>
              </div>

              <div className="glass-card bg-bg-raised p-16 md:p-24 text-center mb-12 border-accent/20 group overflow-hidden relative shadow-[0_0_80px_rgba(var(--accent-rgb),0.05)]">
                {/* Hero Audio Waveform (Animated Background) */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-[0.05] pointer-events-none">
                  {[...Array(60)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: isRecording ? [20, 120, 20] : [20, 50, 20] }} 
                      transition={{ repeat: Infinity, duration: isRecording ? 0.3 : 2, delay: i * 0.01 }} 
                      className="w-1 bg-accent rounded-full" 
                    />
                  ))}
                </div>

                {/* Tactical Overlays */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                
                <div className="space-y-6 relative z-10">
                  <div className="text-accent font-black text-[9px] tracking-[0.4em] uppercase opacity-60">
                    Incoming Transmission // {currentQuestion?.difficulty || 'Standard'}
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={currentQuestion?.question_text}
                    className="text-2xl md:text-5xl font-display font-black text-text leading-[1.1] uppercase tracking-tighter"
                  >
                    {currentQuestion?.question_text || "Initializing Interview Node..."}
                  </motion.h2>
                </div>
              </div>

              {feedback && (
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="mb-12 p-8 bg-accent-soft border-l-4 border-accent rounded-xl flex gap-6 items-start"
                >
                   <Sparkles className="text-accent flex-shrink-0" size={24} />
                   <p className="text-[13px] font-bold text-text leading-relaxed tracking-tight">{feedback}</p>
                </motion.div>
              )}

              <div className="flex flex-col items-center gap-12">
                <div className="relative">
                  <AnimatePresence>
                    {isRecording && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 0.3 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -inset-8 bg-accent rounded-full blur-2xl pointer-events-none" 
                      />
                    )}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                       if(isRecording) submitAnswer("Simulated precision response with deep technical context.");
                       else setIsRecording(true);
                    }}
                    disabled={loading}
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-2xl relative z-10 border-2 ${
                      isRecording 
                        ? 'bg-accent text-bg-surface border-bg-surface/20 shadow-[0_0_80px_var(--accent)]' 
                        : 'bg-bg-surface text-accent border-accent/20 hover:border-accent/60'
                    }`}
                  >
                    {isRecording ? (
                      <Zap size={40} className="animate-pulse" />
                    ) : (
                      <Mic size={40} className="group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute -bottom-1 text-[8px] font-black tracking-widest opacity-40">
                      {isRecording ? "LIVE" : "PUSH"}
                    </div>
                  </motion.button>
                </div>

                <div className="text-center space-y-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-text-muted">
                    {isRecording ? "Audio stream active" : "Standby for Signal"}
                  </p>
                  
                  {isRecording && (
                    <div className="flex gap-1.5 justify-center h-5 items-end">
                      {[...Array(16)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 20, 4] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.03 }}
                          className="w-1 bg-accent rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {!isRecording && (
                  <button onClick={() => setInterviewActive(false)} className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted/20 hover:text-text-muted transition-colors pt-12">
                    Terminate Link :: Exit
                  </button>
                )}
              </div>

              {/* Real-time Oscilloscope Grid */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                 {[
                   { m: 'Linguistic Depth', val: 72, color: 'var(--accent)' },
                   { m: 'Cognitive Load', val: 45, color: '#C25A1A' },
                   { m: 'Emotional Resonance', val: 89, color: '#1A5C4B' }
                 ].map((metric) => (
                   <div key={metric.m} className="space-y-4">
                     <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{metric.m}</span>
                       <span className="text-[10px] font-black uppercase italic" style={{ color: metric.color }}>{metric.val}%MATCH</span>
                     </div>
                     <div className="h-0.5 w-full bg-border relative overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${metric.val}%` }}
                           transition={{ duration: 1.5, delay: 0.5 }}
                           className="absolute inset-y-0 bg-current"
                           style={{ color: metric.color }}
                        />
                     </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
