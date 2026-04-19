"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Target, Mic, Briefcase, Sparkles, Map, Users, Shield, FileText, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Floating Orbs */}
      <div className="orb orb-blue w-[600px] h-[600px] top-[-200px] left-[-100px] animate-pulse-glow" />
      <div className="orb orb-cyan w-[500px] h-[500px] top-[20%] right-[-150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="orb orb-purple w-[400px] h-[400px] bottom-[30%] left-[10%] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-nav h-20 flex items-center">
        <div className="container-wide flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-3">
            <img src="/hireflow-logo.png" alt="HireFlow" className="w-10 h-10 rounded-lg" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Hire<span className="text-gradient">Flow</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="nav-link">Features</a>
            <a href="#stats" className="nav-link">Stats</a>
            <Link href="/auth/login" className="nav-link">Sign In</Link>
            <Link href="/auth/signup" className="btn-gradient px-6 py-2.5 text-sm !rounded-xl">
              Get Started Free <Zap size={14} className="fill-current" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 md:pt-56 md:pb-32 relative">
        <div className="container-wide text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-strong text-indigo-300 text-sm font-semibold mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={14} className="text-indigo-400" /> Powered by Gemini 2.0 Flash AI
          </div>
          <h1 className="text-hero mb-8 animate-reveal" style={{ animationDelay: '0.2s' }}>
            Craft your future, one <br />
            <span className="text-gradient italic">intelligent</span> line at a time.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed animate-reveal" style={{ animationDelay: '0.3s' }}>
            The AI-powered ecosystem built for the modern applicant.
            Automate your job search, score your resume, and practice interviews with high-end AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth/signup" className="btn-gradient text-lg">
              Analyze My Resume <ArrowRight size={20} />
            </Link>
            <Link href="/interviews" className="btn-outline-glass text-lg">
              Mock Interview Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section id="stats" className="py-20 relative z-10">
        <div className="container-wide">
          <div className="glass-card-strong p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "99%", label: "ATS Accuracy" },
              { value: "2k+", label: "Monthly Hires" },
              { value: "4.9/5", label: "User Rating" },
              { value: "15s", label: "Analysis Time" },
            ].map((stat, i) => (
              <div key={i} className="animate-reveal" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="text-4xl font-bold text-white mb-1 glow-text">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <div className="container-wide">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything to get <br /><span className="text-gradient">unfairly</span> hired.
            </h2>
            <p className="text-xl text-slate-400 max-w-xl mx-auto">A unified AI platform to manage your entire career trajectory.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Resume - Large */}
            <div className="md:col-span-2 glass-card p-10 group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-indigo-400" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Resume Composer</h3>
                <p className="text-slate-400 text-lg max-w-md mb-8">
                  Our algorithm writes professional summaries and bullet points that actually resonate with recruiters and ATS systems.
                </p>
                <Link href="/resume" className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Start Building <ArrowRight size={18} />
                </Link>
              </div>
              {/* Decorative */}
              <div className="absolute right-[-50px] bottom-[-50px] w-64 h-64 orb orb-blue opacity-20" />
            </div>

            {/* ATS Shield */}
            <div className="glass-card p-8 group">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-red-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ATS Shield</h3>
              <p className="text-slate-400 mb-8">Real-time analysis against any job description with actionable keyword suggestions.</p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Readiness</span>
                  <span className="text-indigo-400 font-bold">88%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full w-[88%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Voice Coach */}
            <div className="glass-card p-8 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Voice Coach</h3>
              <p className="text-slate-400 mb-6">Practice with a live AI interviewer that listens, analyzes, and critiques your verbal answers.</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 h-8 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
              </div>
            </div>

            {/* Job Board - Wide */}
            <div className="md:col-span-2 glass-card p-10 group relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase className="text-emerald-400" size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Smart Job Board</h3>
                  <p className="text-slate-400 text-lg mb-6">Curated opportunities matched to your profile with AI-powered relevance scoring.</p>
                  <Link href="/jobs" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                    Browse Jobs <ArrowRight size={18} />
                  </Link>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {["Amazon", "Google", "Microsoft", "Meta"].map((company, i) => (
                    <div key={i} className="glass-card-strong p-4 text-center group-hover:border-emerald-500/20 transition-colors">
                      <div className="text-2xl font-bold text-white mb-1">{company[0]}</div>
                      <div className="text-xs text-slate-400">{company}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-[-80px] top-[-80px] w-64 h-64 orb orb-cyan opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="py-32 relative z-10 overflow-hidden">
        <div className="container-wide text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-10 leading-tight">
            Ready to start <br />your <span className="text-gradient">success</span> story?
          </h2>
          <Link href="/auth/signup" className="btn-gradient text-xl px-12 py-5">
            Get Hired Now — It's Free
          </Link>
          <p className="mt-10 text-slate-500">Join 50,000+ applicants using HireFlow.</p>
        </div>
        <div className="orb orb-purple w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
      </footer>
    </div>
  );
}
