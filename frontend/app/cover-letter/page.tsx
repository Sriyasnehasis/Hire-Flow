"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  Sparkles, 
  Send, 
  Download, 
  Copy, 
  Check, 
  Loader2,
  Briefcase,
  User,
  Wand2
} from "lucide-react";

export default function CoverLetterPage() {
  const { token, user } = useAuth() as any;
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    profession: "",
    company_name: "",
    job_title: "",
    job_description: "",
    tone: "professional",
    skills: ""
  });
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").endsWith("/api/v1")
    ? process.env.NEXT_PUBLIC_API_URL
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1`;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/cover-letter/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setGeneratedLetter(data.cover_letter);
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Letter Lab">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-100">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">AI Cover Letter</h1>
          <p className="text-slate-500 text-base">
            Generate high-conversion cover letters tailored to specific job descriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="pro-card p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User size={14} className="text-slate-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-400" /> Profession
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Google"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Target Role</label>
                  <input
                    type="text"
                    required
                    placeholder="Senior Developer"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Key Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, AWS"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Job Description (Paste here)</label>
                <textarea
                  rows={4}
                  placeholder="Paste the job requirements to tailor the letter..."
                  value={formData.job_description}
                  onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Writing Tone</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="professional">Professional & Direct</option>
                    <option value="creative">Creative & Enthusiastic</option>
                    <option value="casual">Friendly & Formal</option>
                    <option value="bold">Bold & Confident</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-7 flex-1 !py-3 rounded-xl gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                  Generate Letter
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="pro-card bg-white h-full min-h-[600px] flex flex-col relative">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  <FileText size={14} /> Resulting Manuscript
                </div>
                {generatedLetter && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto">
                {generatedLetter ? (
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm">
                    {generatedLetter}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-600">Your AI-generated letter will appear here</p>
                      <p className="text-sm">Complete the form to start the creative process.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
