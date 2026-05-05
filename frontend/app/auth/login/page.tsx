"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        
        // Fetch user details to get the real name
        const userRes = await fetch(`${apiBase}/users/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });
        
        if (userRes.ok) {
          const userData = await userRes.json();
          localStorage.setItem("user", JSON.stringify(userData));
        }

        router.push("/dashboard");
      } else {
        const errData = await res.json();
        alert(errData.detail || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Connectivity failure. Verify local backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 font-sans selection:bg-cyan-500/30">
      <div className="mesh-bg absolute inset-0 opacity-40" />

      {/* 🧬 Branding */}
      <div className="absolute top-8 flex flex-col items-center z-20">
        <SiteLogo className="w-12 h-12 animate-float" />
        <span className="mt-3 text-[9px] font-black tracking-[0.6em] text-white/20 uppercase">Secure Node</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[380px] bg-black/40 backdrop-blur-3xl p-8 lg:p-10 rounded-[2.5rem] border border-white/5 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">Access Space</h1>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Initialize Neural Connection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-cyan-400 hover:text-white hover:shadow-[0_15px_30px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-all group mt-6"
          >
            {loading ? "Syncing..." : "Connect Node"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] font-bold text-white/30 tracking-tight">
            New trajectory? <Link href="/auth/signup" className="text-white hover:text-cyan-400 font-black transition-colors">Start identity initialization</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
