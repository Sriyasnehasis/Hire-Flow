"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowRight,
  Target,
  Briefcase,
  TrendingUp,
  FileText,
  Sparkles,
  Zap,
  CheckCircle2,
  Mic,
  Bell,
  ChevronRight,
  Users,
  Shield,
} from "lucide-react";

export default function Dashboard() {
  const userName = "Sriya";

  const stats = [
    { label: "Applications", value: "12", icon: Briefcase, gradient: "from-blue-500 to-indigo-500" },
    { label: "AI Match", value: "82%", icon: Target, gradient: "from-indigo-500 to-purple-500" },
    { label: "Mock Trials", value: "5", icon: Mic, gradient: "from-cyan-500 to-blue-500" },
    { label: "Job Alerts", value: "24", icon: Bell, gradient: "from-emerald-500 to-teal-500" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Platform Overview</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Welcome back, {userName}.</h1>
            <p className="text-slate-400 mt-2 text-lg">
              Your placement pipeline is looking strong. <span className="text-white font-semibold">3 interviews</span> scheduled this week.
            </p>
          </div>
          <Link href="/resume" className="btn-gradient px-6 py-3 text-sm !rounded-xl">
            <Sparkles size={16} /> New Resume
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-5 flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="text-white" size={22} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Optimization - Large */}
          <div className="lg:col-span-2 glass-card p-8 md:p-10 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-6">
                <Zap size={12} className="fill-current" /> AI READINESS
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Resume Optimization</h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md">
                Your primary resume for <span className="text-white font-semibold">Software Engineer</span> roles is at 88% readiness. 3 missing keywords found.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-4 py-2 bg-white/5 rounded-full text-slate-300 text-sm font-medium border border-white/5">Distributed Systems</span>
                <span className="px-4 py-2 bg-white/5 rounded-full text-slate-300 text-sm font-medium border border-white/5">Kubernetes</span>
                <span className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-sm font-bold border border-red-500/20">+3 Missing</span>
              </div>

              <Link href="/resume" className="btn-gradient !rounded-xl">
                Improve Score <ArrowRight size={18} />
              </Link>
            </div>

            {/* Decorative Score */}
            <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <span className="text-[220px] font-bold leading-none text-white">88</span>
            </div>
          </div>

          {/* Voice Coach Widget */}
          <div className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-cyan-600/20" />
            <div className="relative z-10 p-8 flex flex-col h-full">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Voice Labs</h3>
              <p className="text-indigo-100/70 text-base mb-8 flex-1">
                Last session score grew by <span className="text-white font-bold">+14%</span>. Your technical depth is improving.
              </p>
              <Link href="/interviews" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-center transition-colors border border-white/10">
                Resume Practice
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: "/jobs", icon: Briefcase, title: "Job Board", desc: "2,400+ fresh openings", gradient: "from-blue-500 to-indigo-500" },
            { href: "/hr-contacts", icon: Users, title: "HR Direct", desc: "Contact decision makers", gradient: "from-emerald-500 to-teal-500" },
            { href: "/skills", icon: TrendingUp, title: "Career Map", desc: "Visualize your path", gradient: "from-amber-500 to-orange-500" },
          ].map((link, i) => (
            <Link key={i} href={link.href} className="glass-card p-5 group flex items-center gap-4">
              <div className={`w-11 h-11 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <link.icon className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{link.title}</h4>
                <p className="text-sm text-slate-400">{link.desc}</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={18} />
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
