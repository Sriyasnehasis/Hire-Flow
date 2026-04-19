"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { TrendingUp, BookOpen, Target, Sparkles, ArrowUpRight, ChevronRight } from "lucide-react";

export default function SkillGapPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const skills = [
    {
      category: "Frontend",
      items: [
        { name: "React", level: "Advanced", gap: 0 },
        { name: "TypeScript", level: "Intermediate", gap: 20 },
        { name: "Tailwind CSS", level: "Advanced", gap: 0 },
        { name: "Next.js", level: "Beginner", gap: 40 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: "Intermediate", gap: 25 },
        { name: "Python", level: "Advanced", gap: 0 },
        { name: "PostgreSQL", level: "Intermediate", gap: 30 },
        { name: "Docker", level: "Beginner", gap: 50 },
      ],
    },
  ];

  const resources: Record<string, { title: string; platform: string; duration: string; url: string }[]> = {
    "Next.js": [
      { title: "Next.js Official Course", platform: "Vercel", duration: "6 hours", url: "https://nextjs.org/learn" },
      { title: "Next.js App Router Mastery", platform: "Udemy", duration: "12 hours", url: "#" },
    ],
    Docker: [
      { title: "Docker for Developers", platform: "LinkedIn Learning", duration: "4 hours", url: "#" },
      { title: "Docker & K8s Complete Guide", platform: "Udemy", duration: "22 hours", url: "#" },
    ],
    TypeScript: [
      { title: "TypeScript Deep Dive", platform: "Udemy", duration: "8 hours", url: "#" },
      { title: "Matt Pocock's Total TS", platform: "TotalTypeScript", duration: "10 hours", url: "#" },
    ],
  };

  const levelColor = (level: string) => {
    if (level === "Advanced") return "text-emerald-400 bg-emerald-500/20";
    if (level === "Intermediate") return "text-amber-400 bg-amber-500/20";
    return "text-red-400 bg-red-500/20";
  };

  return (
    <DashboardLayout title="Career Map">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-4xl font-bold text-white mb-2">Skill Gap Analysis</h1>
          <p className="text-slate-400 text-lg">Identify your gaps and get AI-curated learning paths.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Categories */}
          <div className="lg:col-span-2 space-y-6">
            {skills.map((category) => (
              <div key={category.category} className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-400" /> {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((skill) => (
                    <div
                      key={skill.name}
                      onClick={() => setSelectedSkill(skill.name)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedSkill === skill.name
                          ? "bg-indigo-500/10 border-indigo-500/30"
                          : "bg-white/5 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-white">{skill.name}</h4>
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${levelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            skill.gap === 0
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : skill.gap > 30
                              ? "bg-gradient-to-r from-amber-500 to-red-500"
                              : "bg-gradient-to-r from-amber-500 to-yellow-500"
                          }`}
                          style={{ width: `${100 - skill.gap}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-slate-500">Gap: {skill.gap}%</p>
                        <p className="text-xs text-slate-500">{100 - skill.gap}% mastered</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Profile Overview */}
            <div className="glass-card p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-6">Your Profile</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#skillGrad)" strokeWidth="10"
                    strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0.72)}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">72%</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">Better than <span className="text-indigo-400 font-bold">68%</span> of candidates</p>
            </div>

            {/* Learning Resources */}
            {selectedSkill && resources[selectedSkill] && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-400" /> Learn {selectedSkill}
                </h3>
                <div className="space-y-3">
                  {resources[selectedSkill].map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
                      <p className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                        {res.title} <ArrowUpRight size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs text-slate-500">{res.platform}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-full">
                        {res.duration}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Top Skills */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Skills in Demand</h3>
              <div className="space-y-2">
                {["System Design", "DSA", "Cloud (AWS/GCP)", "DevOps", "Microservices"].map((skill) => (
                  <div key={skill} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <TrendingUp size={16} className="text-indigo-400" />
                    <span className="text-sm text-slate-300 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
