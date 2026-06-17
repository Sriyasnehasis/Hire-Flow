"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, FileText, Sparkles, LayoutGrid, List, Loader2 } from "lucide-react";
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
  
  // AI Synthesis state
  const [synthesizing, setSynthesizing] = useState(false);
  const [targetJob, setTargetJob] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [enrichGithub, setEnrichGithub] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);

  const templates = [
    {
      id: "professional",
      name: "Professional",
      desc: "Structured layout with a clear experience timeline. Ideal for engineering, finance, and corporate roles.",
      preview: (
        <div className="w-full h-full flex flex-col gap-1 p-1.5 opacity-80">
          <div className="w-full h-2 bg-[var(--text)] opacity-30 rounded-sm" />
          <div className="flex gap-1.5 flex-1">
            <div className="w-2/3 flex flex-col gap-1">
              <div className="w-full h-1 bg-[var(--text)] opacity-20 rounded-sm" />
              <div className="w-5/6 h-1 bg-[var(--text)] opacity-15 rounded-sm" />
              <div className="w-full h-1 bg-[var(--text)] opacity-15 rounded-sm" />
            </div>
            <div className="w-1/3 flex flex-col gap-1">
              <div className="w-full h-1 bg-[var(--text)] opacity-20 rounded-sm" />
              <div className="w-full h-1 bg-[var(--text)] opacity-15 rounded-sm" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "modern",
      name: "Modern",
      desc: "Features a sleek sidebar for core credentials and technical skills, optimizing scanning speed.",
      preview: (
        <div className="w-full h-full flex gap-1.5 p-1.5 opacity-80">
          <div className="w-1/3 bg-[var(--text)] opacity-10 rounded-sm h-full flex flex-col gap-1 p-1">
            <div className="w-full h-1 bg-[var(--text)] opacity-25 rounded-sm" />
            <div className="w-2/3 h-0.5 bg-[var(--text)] opacity-20 rounded-sm" />
            <div className="w-3/4 h-0.5 bg-[var(--text)] opacity-20 rounded-sm" />
          </div>
          <div className="w-2/3 flex flex-col gap-1">
            <div className="w-3/4 h-1.5 bg-[var(--text)] opacity-30 rounded-sm" />
            <div className="w-full h-1 bg-[var(--text)] opacity-15 rounded-sm" />
            <div className="w-5/6 h-1 bg-[var(--text)] opacity-15 rounded-sm" />
          </div>
        </div>
      )
    },
    {
      id: "creative",
      name: "Creative",
      desc: "Combines elegant header accents and dynamic font weights. Great for startups, marketing, and design.",
      preview: (
        <div className="w-full h-full flex flex-col gap-1.5 p-1.5 opacity-80">
          <div className="w-full h-3 bg-[var(--accent)] opacity-25 rounded-sm flex items-center px-1">
            <div className="w-1/3 h-1 bg-[var(--text)] opacity-40 rounded-sm" />
          </div>
          <div className="flex flex-col gap-1 mt-0.5">
            <div className="w-full h-1 bg-[var(--text)] opacity-15 rounded-sm" />
            <div className="w-4/5 h-1 bg-[var(--text)] opacity-15 rounded-sm" />
          </div>
        </div>
      )
    },
    {
      id: "minimal",
      name: "Minimal",
      desc: "A timeless, distraction-free typography layout that puts the focus purely on content impact.",
      preview: (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1.5 opacity-80">
          <div className="w-1/2 h-1.5 bg-[var(--text)] opacity-30 rounded-sm" />
          <div className="w-3/4 h-1 bg-[var(--text)] opacity-15 rounded-sm" />
          <div className="w-2/3 h-1 bg-[var(--text)] opacity-15 rounded-sm" />
        </div>
      )
    }
  ];


  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    fetchResumes();
    checkGithubConnection();
  }, []);

  const checkGithubConnection = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/github/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGithubConnected(data.connected);
      }
    } catch (err) {
      console.error("Failed to check github connection", err);
    }
  };

  const handleSynthesizeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJob.trim()) return;

    setSynthesizing(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiBase}/resumes/synthesize-ai`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target_job: targetJob,
          template: selectedTemplate,
          enrich_github: enrichGithub
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTargetJob("");
        await fetchResumes();
        
        // Auto-select the newly generated resume if ID returned
        if (data.resume_id) {
          const resList = await fetch(`${apiBase}/resumes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resList.ok) {
            const dataList = await resList.json();
            setResumes(dataList);
            const newlyCreated = dataList.find((r: any) => r.id === data.resume_id);
            if (newlyCreated) {
              setSelectedResume(newlyCreated);
              setAtsScore(data.ats_score);
            }
          }
        }
      }
    } catch (err) {
      console.error("Synthesis failed", err);
    } finally {
      setSynthesizing(false);
    }
  };

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
              <p className="text-text-muted text-sm max-w-lg">Manage your professional resumes and optimize for standard Applicant Tracking Systems (ATS).</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Zone */}
              <div 
                onClick={() => document.getElementById('resume-upload')?.click()}
                className="glass-card p-8 border-2 border-dashed border-border hover:border-[#00E5FF]/40 transition-all group flex flex-col items-center justify-center text-center cursor-pointer bg-bg-raised/10"
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
                <div className={`w-14 h-14 bg-accent-soft rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${uploading ? 'animate-pulse' : ''}`}>
                  <Upload className="text-[#00E5FF]" size={24} />
                </div>
                <h3 className="text-md font-display font-black mb-1">
                  {uploading ? "Analyzing..." : "Upload Existing Resume"}
                </h3>
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-widest">
                  PDF or DOCX (Max 5MB)
                </p>
              </div>

              {/* AI Synthesizer Zone */}
              <form onSubmit={handleSynthesizeResume} className="glass-card p-8 flex flex-col justify-between space-y-6 bg-[var(--bg-surface)] border-[var(--border)] hover:translate-y-0 hover:shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-[var(--accent)] mb-3">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Synthesis</span>
                  </div>
                  <h3 className="text-md font-display font-black mb-2 text-[var(--text)]">Generate Resume with AI</h3>
                  <p className="text-[10px] text-[var(--text-muted)] mb-4">Combine your profile qualifications and GitHub repositories into an ATS-optimized resume.</p>
                  
                  <div className="space-y-4">
                    <input 
                      type="text"
                      placeholder="e.g. Frontend Developer"
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      className="input-premium py-2.5 text-xs placeholder:text-[var(--text-muted)]/50 focus:border-[var(--accent)] transition-all font-medium bg-[var(--bg)]"
                      required
                    />
                    
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Select Layout Style
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {templates.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`group/item border rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all ${
                              selectedTemplate === t.id
                                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                                : "border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--bg-surface)]"
                            }`}
                          >
                            <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg mb-2 overflow-hidden border border-[var(--border)] group-hover/item:border-[var(--accent)]/20 transition-colors">
                              {t.preview}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[var(--text)] capitalize leading-none">{t.name}</p>
                              <p className="text-[8px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                                {t.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border border-[var(--border)] rounded-xl px-3.5 py-2.5 bg-[var(--bg-surface)]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text)]">Enrich with GitHub</span>
                        <span className="text-[8px] text-[var(--text-muted)]">Include repository insights in your resume</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={enrichGithub && githubConnected}
                        disabled={!githubConnected}
                        onChange={(e) => setEnrichGithub(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border)] accent-[var(--accent)] focus:ring-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={synthesizing || !targetJob.trim()}
                  className="btn-premium w-full rounded-xl !py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {synthesizing ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      <span>Synthesize Resume</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Saved Resumes</h3>
                  <span className="text-[10px] font-bold text-accent">{resumes.length} Found</span>
               </div>
               
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-muted/20">
                     <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Syncing resumes...</p>
                  </div>
               ) : resumes.length === 0 ? (
                  <div className="py-20 text-center glass-card border-dashed border-border">
                     <p className="text-sm font-bold text-text-muted">No resumes found.</p>
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
