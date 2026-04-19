"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, FileText, Download, Sparkles, FileSearch, ArrowRight } from "lucide-react";

export default function ResumePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [atsScore] = useState(78);

  const tips = [
    { text: "Missing 'Distributed Systems' keyword", type: "error" },
    { text: "Strong action verbs detected", type: "success" },
    { text: "Format is machine-readable", type: "success" },
    { text: "Quantify your achievements more", type: "warning" },
  ];

  return (
    <DashboardLayout title="Resume Intelligence">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-4xl font-bold text-white mb-2">Resume Intelligence</h1>
          <p className="text-slate-400 text-lg">Upload your document and let AI shield you from ATS rejection.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload & Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <div className="glass-card p-12 border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all group flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Drop your resume here</h3>
              <p className="text-slate-400 max-w-xs mb-6">PDF or DOCX. Our AI will analyze keywords, formatting, and relevance in real-time.</p>
              <button className="btn-gradient !rounded-xl px-6 py-3">Browse Files</button>
              <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Encrypted Upload</p>
            </div>

            {/* Draft History */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Draft History</h3>
                <button className="text-sm font-bold text-indigo-400 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "S_Snehasis_SWE_Resume.pdf", date: "Oct 12, 2023", score: 88 },
                  { name: "S_Snehasis_General.pdf", date: "Sep 28, 2023", score: 72 },
                ].map((file, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors border border-white/5">
                    <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center">
                      <FileText className="text-slate-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-400">{file.score}%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Match</p>
                    </div>
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            {/* ATS Score */}
            <div className="glass-card p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FileSearch size={18} className="text-indigo-400" /> ATS Readiness
              </h3>

              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="10"
                    strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - atsScore / 100)}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{atsScore}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Keyword Density", value: 82 },
                  { label: "Format Score", value: 94 },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      <span>{metric.label}</span>
                      <span className="text-white">{metric.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tips */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">AI Insights</h3>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${
                      tip.type === 'error' ? 'bg-red-500' :
                      tip.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <p className="text-sm text-slate-400">{tip.text}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 btn-gradient !rounded-xl !py-3 text-sm justify-center">
                <Sparkles size={16} /> Auto-fix Formatting
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
