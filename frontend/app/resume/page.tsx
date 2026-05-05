"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, FileText, Download, Sparkles, FileSearch, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${apiBase}/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
        if (data.length > 0) {
          fetchAnalysis(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (resumeId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiBase}/resumes/${resumeId}/ats-analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAtsScore(data.ats_score);
        
        // Transform backend feedback into tips
        const tips = [
          ...(data.missing_skills?.map((s: string) => ({ text: `Missing '${s}' keyword`, type: "error" })) || []),
          ...(data.matched_skills?.slice(0, 2).map((s: string) => ({ text: `Found '${s}' keyword`, type: "success" })) || []),
          { text: data.feedback?.substring(0, 60) + "...", type: "warning" }
        ].slice(0, 4);
        setInsights(tips);

        setMetrics([
          { label: "Keyword Density", value: data.ats_score - 5 },
          { label: "Format Score", value: 92 },
        ]);
      }
    } catch (err) {
      console.error("Analysis failed", err);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBase}/resumes/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        await fetchResumes();
      } else {
        const errData = await res.json();
        alert(`Upload failed: ${errData.detail || "Check file format (PDF/DOCX)."}`);
      }
    } catch (err) {
      alert("System Offline. Check backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

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
            <div 
              onClick={() => document.getElementById('resume-upload')?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="glass-card p-12 border-2 border-dashed border-white/10 hover:border-[#00E5FF]/30 transition-all group flex flex-col items-center justify-center text-center cursor-pointer relative"
            >
              <input 
                id="resume-upload"
                type="file" 
                className="hidden" 
                accept=".pdf,.docx" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }} 
              />
              
              <div className={`w-20 h-20 bg-gradient-to-br from-[#00E5FF]/20 to-[#FF5C1A]/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${uploading ? 'animate-pulse' : ''}`}>
                <Upload className="text-[#00E5FF]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {uploading ? "ANALYZING_CORE..." : "DROP_RESUME_NODE"}
              </h3>
              <p className="text-slate-400 max-w-xs mb-6 text-sm font-bold uppercase tracking-tight">
                PDF or DOCX. AI will extract structural biometrics and keyword density in real-time.
              </p>
              <button className="glow-button px-8 py-3 text-[10px]">
                {uploading ? "PROCESS_RUNNING" : "SELECT_SOURCE"}
              </button>
              <p className="mt-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Encrypted Uplink Protocol</p>
            </div>

            {/* Draft History */}
            <div className="glass-card p-8 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">RESUME_VERSION_NODES</h3>
                <div className="h-px flex-1 mx-10 bg-white/5" />
              </div>
              <div className="space-y-4">
                {loading ? (
                   <div className="py-12 text-center text-white/10 font-black uppercase tracking-[0.2em]">Synching Mesh...</div>
                ) : resumes.length === 0 ? (
                   <div className="py-12 text-center text-white/20 font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                     No resumes detected in local cluster.
                   </div>
                ) : resumes.map((file, i) => (
                  <div 
                    key={i} 
                    onClick={() => fetchAnalysis(file.id)}
                    className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all border border-white/5 cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="text-white/40" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white uppercase text-xs tracking-wider">{file.original_filename}</p>
                      <p className="text-[10px] text-white/20 font-bold uppercase mt-1">UPLINKED: {new Date(file.uploaded_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#00E5FF] tracking-tighter">{file.ats_score || 0}%</p>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Confidence</p>
                    </div>
                    <button className="p-3 text-white/10 hover:text-[#00E5FF] hover:bg-white/5 rounded-xl transition-all">
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
            <div className="glass-card p-8 relative overflow-hidden bg-white/[0.01]">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <FileSearch size={14} className="text-[#00E5FF]" /> ATS_READINESS_LEVEL
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

              <div className="space-y-6">
                {(metrics.length > 0 ? metrics : [
                  { label: "Keyword Density", value: 0 },
                  { label: "Format Score", value: 0 },
                ]).map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">
                      <span>{metric.label}</span>
                      <span className="text-white">{metric.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        className="h-full bg-gradient-to-r from-[#00E5FF] to-cyan-500/20 rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tips */}
            <div className="glass-card p-8 bg-white/[0.01]">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8">AI_NEURAL_INSIGHTS</h3>
              <div className="space-y-5">
                {insights.length > 0 ? insights.map((tip, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full shadow-[0_0_8px] ${
                      tip.type === 'error' ? 'bg-red-500 shadow-red-500/50' :
                      tip.type === 'warning' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-[#00FFB3] shadow-[#00FFB3]/50'
                    }`} />
                    <p className="text-xs font-bold text-white/60 leading-relaxed tracking-tight group-hover:text-white transition-colors">{tip.text}</p>
                  </div>
                )) : (
                  <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest text-center py-8">
                    Awaiting Source Data...
                  </div>
                )}
              </div>
              <button className="w-full mt-10 glow-button !py-4 text-[10px] shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                <Sparkles size={14} className="mr-2" /> AUTO_OPTIMIZE_STRUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
