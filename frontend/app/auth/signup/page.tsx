"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, User, ShieldCheck } from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

    try {
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: "" // Optional in backend
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ 
          full_name: formData.full_name,
          email: formData.email 
        }));
        router.push("/dashboard");
      } else {
        const errData = await res.json();
        alert(errData.detail || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 font-sans selection:bg-cyan-500/30">
      <div className="mesh-bg absolute inset-0 opacity-40" />
      
      {/* 🧬 Refined Minimalist Logo */}
      <div className="absolute top-6 flex flex-col items-center z-20">
        <SiteLogo className="w-12 h-12 animate-float" />
        <span className="mt-2 text-[8px] font-black tracking-[0.6em] text-white/20 uppercase">Core Identity</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-black/40 backdrop-blur-3xl p-8 lg:p-10 rounded-[2.5rem] border border-white/5 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">Create Identity</h1>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">New Career Node Initialization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                required
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                required
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                required
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                type="password"
                placeholder="Confirm"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                required
                onChange={e => setFormData({...formData, confirm: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00B8D4] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-[0_15px_30px_rgba(0,184,212,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group mt-4"
          >
            {loading ? "Initializing..." : "Launch Node"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-white/30 tracking-tight">
            Already registered? <Link href="/auth/login" className="text-white hover:text-cyan-400 font-black transition-colors">Log in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
