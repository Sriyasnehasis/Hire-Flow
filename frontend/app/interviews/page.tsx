"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Mic, Sparkles, Target, BarChart3, Play, MessageSquare } from "lucide-react";

export default function InterviewsPage() {
  const [interviewActive, setInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const questions = [
    "Tell me about yourself and your background.",
    "What is your strongest technical skill and why?",
    "Describe a challenging project you worked on.",
    "How do you handle feedback and criticism?",
    "Where do you see yourself in 5 years?",
  ];

  const handleStartInterview = () => {
    setInterviewActive(true);
    setCurrentQuestion(0);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setInterviewActive(false);
    }
  };

  return (
    <DashboardLayout title="Voice Labs">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Voice Coach</h1>
            <p className="text-slate-400 text-lg">Real-time voice analysis for behavior and technical depth.</p>
          </div>
          {!interviewActive && (
            <button onClick={handleStartInterview} className="btn-gradient !rounded-xl px-6 py-3">
              <Play size={18} /> Begin Session
            </button>
          )}
        </div>

        {!interviewActive ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Prep Card */}
            <div className="lg:col-span-2 glass-card overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-cyan-600/10" />
              <div className="relative z-10 p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold mb-6">
                  <Sparkles size={12} /> LAB ENVIRONMENT
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to practice for <br /><span className="text-gradient">your dream role?</span>
                </h2>

                <div className="space-y-5 mb-10 max-w-sm">
                  {[
                    { icon: Target, title: "Real-time Feedback", desc: "AI analyzes your confidence and keywords." },
                    { icon: MessageSquare, title: "AI Follow-ups", desc: "Questions adapt to your answers." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <item.icon size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleStartInterview} className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-colors">
                  Start Full Interview
                </button>
              </div>

              <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-[0.05]">
                <Mic size={350} className="text-white" strokeWidth={0.5} />
              </div>
            </div>

            {/* History & Streak */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-5 flex items-center justify-between">
                  Recent Scores <BarChart3 size={18} className="text-slate-500" />
                </h3>
                <div className="space-y-3">
                  {[
                    { date: "Oct 12", score: 88, role: "SWE" },
                    { date: "Oct 09", score: 72, role: "Backend" },
                    { date: "Oct 05", score: 64, role: "Frontend" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-white">{s.role}</p>
                        <p className="text-xs text-slate-500">{s.date}</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-400">{s.score}%</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-semibold text-slate-300 transition-colors">
                  View Full Report
                </button>
              </div>

              <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent">
                <h3 className="text-lg font-bold text-white mb-2">Practice Streak</h3>
                <p className="text-sm text-slate-400 mb-4">Top 5% of active students this week.</p>
                <div className="flex gap-1">
                  {[1, 1, 1, 1, 0, 0, 0].map((active, i) => (
                    <div key={i} className={`flex-1 h-3 rounded-full ${active ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-white/5'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Interview */
          <div className="max-w-3xl mx-auto py-8">
            <div className="mb-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live AI Assessment</span>
              </div>
              <span className="text-sm font-bold text-indigo-400">Q{currentQuestion + 1} / {questions.length}</span>
            </div>

            <div className="glass-card-strong p-8 md:p-12 text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white italic leading-snug">
                "{questions[currentQuestion]}"
              </h2>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className={`relative transition-all duration-500 ${isRecording ? 'scale-110' : 'scale-100'}`}>
                {isRecording && (
                  <>
                    <div className="absolute inset-0 w-36 h-36 rounded-full bg-indigo-500/10 animate-ping" />
                    <div className="absolute inset-[-16px] rounded-full border border-indigo-500/20 animate-pulse" />
                  </>
                )}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                  isRecording ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white' : 'glass-card-strong text-slate-400'
                }`}>
                  <Mic size={48} className={isRecording ? 'animate-bounce' : ''} />
                </div>
              </div>

              <p className={`text-lg font-bold ${isRecording ? 'text-indigo-400' : 'text-slate-500'}`}>
                {isRecording ? "Analyzing voice..." : "Ready to listen"}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all ${
                    isRecording ? 'bg-white/10 text-white border border-white/10' : 'btn-gradient'
                  }`}
                >
                  {isRecording ? "Finish Answer" : "Start Recording"}
                </button>
                {!isRecording && (
                  <button onClick={handleNext} className="px-6 py-4 glass-card font-bold text-slate-300 hover:text-white">
                    Skip
                  </button>
                )}
              </div>
            </div>

            {/* Live Metrics */}
            <div className="mt-16 grid grid-cols-3 gap-6">
              {[
                { label: "Confidence", color: "from-emerald-500 to-teal-500", width: isRecording ? '75%' : '0%' },
                { label: "Keywords", color: "from-indigo-500 to-blue-500", width: isRecording ? '40%' : '0%' },
                { label: "Logic Depth", color: "from-purple-500 to-pink-500", width: isRecording ? '60%' : '0%' },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{m.label}</p>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-1000`} style={{ width: m.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
