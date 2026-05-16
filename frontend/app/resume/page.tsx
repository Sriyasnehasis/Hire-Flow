"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, FileText, Sparkles, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ATSGauge } from "@/components/ATSGauge";
import { ResumeCard } from "@/components/ResumeCard";

export default function ResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [atsScore, setAtsScore] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);

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
          setSelectedResume(data[0]);
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
        setInsights([
          ...(data.missing_skills?.map((s: string) => ({ text: `Missing '${s}' keyword`, type: "error" })) || []),
          { text: data.feedback?.substring(0, 80) + "...", type: "info" }
        ].slice(0, 5));
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
      if (res.ok) await fetchResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h1 className="text-5xl font-display font-black tracking-tight">Resume <span className="italic font-serif-italic font-normal lowercase">Builder.</span></h1>
              <p className="text-text-muted text-sm max-w-lg">Manage your professional identity nodes and optimize for institutional ATS protocols.</p>
           </div>
           <div className="flex items-center gap-3">
              <button className="p-2.5 bg-bg-raised border border-border rounded-xl text-text-muted hover:text-accent transition-all">
                 <LayoutGrid size={18} />
              </button>
              <button className="p-2.5 bg-accent-soft border border-accent/20 rounded-xl text-accent transition-all">
                 <List size={18} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upload Zone */}
            <div 
              onClick={() => document.getElementById('resume-upload')?.click()}
              className="glass-card p-10 border-2 border-dashed border-border hover:border-accent/40 transition-all group flex flex-col items-center justify-center text-center cursor-pointer bg-bg-raised/30"
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
              <div className={`w-16 h-16 bg-accent-soft rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${uploading ? 'animate-pulse' : ''}`}>
                <Upload className="text-accent" size={28} />
              </div>
              <h3 className="text-lg font-display font-black mb-1">
                {uploading ? "Analyzing Node..." : "Drop your resume here"}
              </h3>
              <p className="text-text-muted text-xs font-medium uppercase tracking-widest">
                PDF or DOCX (Max 5MB)
              </p>
            </div>

            {/* List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">History Nodes</h3>
                  <span className="text-[10px] font-bold text-accent">{resumes.length} Found</span>
               </div>
               
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-muted/20">
                     <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Syncing mesh...</p>
                  </div>
               ) : resumes.length === 0 ? (
                  <div className="py-20 text-center glass-card border-dashed border-border">
                     <p className="text-sm font-bold text-text-muted">No resume nodes detected.</p>
                  </div>
               ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="grid grid-cols-1 gap-4"
                  >
                    {resumes.map((resume) => (
                      <ResumeCard 
                        key={resume.id} 
                        resume={resume} 
                        onSelect={() => {
                          setSelectedResume(resume);
                          fetchAnalysis(resume.id);
                        }}
                      />
                    ))}
                  </motion.div>
               )}
            </div>
          </div>

          {/* Sidebar Analysis */}
          <div className="lg:col-span-4">
             <AnimatePresence mode="wait">
                {selectedResume ? (
                   <motion.div
                     key={selectedResume.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="glass-card p-8 sticky top-32 space-y-10"
                   >
                      <div className="flex items-center justify-between">
                         <div className="p-3 bg-accent-soft rounded-2xl text-accent">
                            <Sparkles size={20} />
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Intelligence</p>
                            <p className="text-xs font-bold text-accent">Real-time Analysis</p>
                         </div>
                      </div>

                      <div className="flex justify-center py-4">
                         <ATSGauge score={atsScore} size={220} />
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">AI Insights</h4>
                         <div className="space-y-4">
                            {insights.map((insight, i) => (
                               <div key={i} className="flex gap-4 group">
                                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    insight.type === 'error' ? 'bg-red-500' : 'bg-accent'
                                  }`} />
                                  <p className="text-xs font-medium text-text leading-relaxed">{insight.text}</p>
                               </div>
                            ))}
                         </div>
                         <button className="w-full btn-premium !py-4 shadow-xl">
                            <Sparkles size={16} />
                            <span>Fix with AI</span>
                         </button>
                      </div>
                   </motion.div>
                ) : (
                   <div className="glass-card p-8 text-center text-text-muted h-[400px] flex flex-col items-center justify-center gap-4">
                      <FileText size={40} className="opacity-10" />
                      <p className="text-xs font-bold uppercase tracking-widest">Select a node to analyze</p>
                   </div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
