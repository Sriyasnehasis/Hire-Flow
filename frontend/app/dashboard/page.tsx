"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  Target, 
  Mic, 
  Sparkles,
  Users,
  ChevronRight,
  ShieldCheck,
  Activity,
  Award
} from "lucide-react";

const CountUp = ({ value, suffix = "" }: { value: number | string, suffix?: string }) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const increment = numericValue / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= numericValue) {
                    setCount(numericValue);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, numericValue]);

    return <span ref={ref}>{Math.floor(count)}{suffix}</span>;
};

export default function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (rawUser) setUserName(JSON.parse(rawUser)?.full_name?.split(' ')[0] || "User");

        if (!token) return;

        const [appsRes, recsRes] = await Promise.all([
          fetch(`${apiBase}/applications`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBase}/jobs/recommendations`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (appsRes.ok) setApplications(await appsRes.json());
        if (recsRes.ok) {
          const data = await recsRes.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [apiBase]);

  const stats = useMemo(() => [
    { label: "Active Nodes", value: applications.length, icon: Activity, color: "#00E5FF" },
    { label: "Analysis Score", value: (recommendations[0]?.score || 88), suffix: "%", icon: Award, color: "#00FFB3" },
    { label: "Diagnostics", value: 12, icon: Mic, color: "#ffffff" },
    { label: "Network Mesh", value: 24, icon: Users, color: "#ffffff" },
  ], [applications, recommendations]);

  return (
    <DashboardLayout>
      <div className="space-y-16 py-12 pb-24 relative z-10">
        
        {/* 🏔️ Crazy Dashboard Header - REVERTED */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glow-text font-black text-[9px] tracking-[0.4em] uppercase mb-4 flex items-center gap-3"
            >
               <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
               Real-Time Institutional Mode
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none uppercase tracking-tighter">
              HELLO, <span className="outline-text !text-transparent">{userName.toUpperCase()}.</span>
            </h1>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="z-10">
            <Link href="/resume" className="glow-button px-10 py-4 shadow-[0_0_40px_rgba(0,229,255,0.15)] text-[11px]">
               OPTIMIZE ARCHITECTURE <Sparkles size={14} className="ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="shine-card glass-card p-6 flex flex-col gap-6 group hover:border-[#00E5FF]/40"
            >
              <div className="flex justify-between items-start">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center icon-grow shadow-2xl border border-white/5"
                  style={{ backgroundColor: `${stat.color}08`, color: stat.color }}
                >
                  <stat.icon size={22} />
                </div>
                <div className="badge-live glow-text animate-pulse">Active Node</div>
              </div>
              <div className="space-y-3">
                <div className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em] leading-none">{stat.label}</div>
                <div className="text-3xl font-black tracking-tighter text-white leading-none">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "65%" }}
                     transition={{ duration: 2, delay: 0.5 }}
                     className="h-full bg-gradient-to-r from-[#00E5FF] to-cyan-500/20" 
                   />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🧬 Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 relative h-[450px] glass-card overflow-hidden group shine-card">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/05 via-transparent to-transparent opacity-50" />
            <div className="relative z-10 h-full p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full glass-card border-white/10 text-[#00E5FF] text-[9px] font-bold tracking-[0.3em] uppercase mb-10 glow-text">
                   Institutional Alignment Ready
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter">
                  CAREER <br /> <span className="outline-text">ARCHITECT</span>
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <p className="max-w-xs text-white/30 font-bold text-[12px] uppercase tracking-tight leading-relaxed">
                  Your identity is <span className="glow-text">Synchronized</span>. <br />
                  <span className="text-[#00FFB3]/60">Accessible across 28 institutional nodes.</span>
                </p>
                <div className="text-[140px] font-black leading-none text-white tracking-tighter opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-105 pointer-events-none select-none">
                  88
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card h-[450px] p-12 flex flex-col justify-between relative overflow-hidden group shine-card shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/[0.02] to-transparent" />
            <div className="relative z-10 text-center flex flex-col items-center pt-8">
               <div className="w-20 h-20 glass-card border-white/10 rounded-2xl flex items-center justify-center mb-10 icon-grow shadow-2xl group-hover:glow-button transition-all">
                  <Mic className="text-[#00E5FF] group-hover:text-black transition-colors" size={36} />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 leading-none">PRACTICE <br /> LABS</h3>
               <p className="text-white/20 font-bold text-[12px] uppercase tracking-tight leading-relaxed max-w-[200px]">
                 Practice simulated institutional interviews with real-time feedback.
               </p>
            </div>
            <Link href="/interviews" className="relative z-10 mt-auto py-4 glow-button rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center shadow-2xl">
               OPEN TRAINING
            </Link>
          </div>
        </div>

        {/* 🌀 Recommended Nodes */}
        <div className="py-20">
          <div className="flex items-center justify-between mb-12 px-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Market Channels</h2>
            <div className="h-px flex-1 mx-10 bg-white/5" />
            <div className="glow-text text-[9px] font-black uppercase tracking-[0.4em]">Active Sync</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Matching Roles", count: applications.length + " Matches", icon: ShieldCheck, href: "/jobs", color: "#00E5FF", active: true },
              { title: "Talent Mesh", count: "Global Map", icon: Users, href: "/hr-contacts", color: "#00FFB3" },
              { title: "Strategic Plan", count: "Career Roadmap", icon: TrendingUp, href: "/skills", color: "#ffffff" },
            ].map((node, i) => (
              <a 
                key={i} 
                href={node.href}
                className={`shine-card glass-card p-10 flex items-center gap-8 border-white/10 hover:border-[#00E5FF]/30 transition-all group relative overflow-hidden ${node.active ? 'border-l-4 border-l-[#00E5FF]' : 'border-l-4 border-l-transparent'}`}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center icon-grow shadow-xl border border-white/5 group-hover:glow-button transition-all"
                  style={{ backgroundColor: `${node.color}05`, color: node.color }}
                >
                  <node.icon size={24} className="group-hover:text-black" />
                </div>
                <div>
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-[0.2em] mb-2 leading-none">{node.count}</div>
                  <div className="text-xl font-black tracking-tight text-white uppercase">{node.title}</div>
                </div>
                <div className="ml-auto relative w-8 h-8 flex items-center justify-center">
                  <ChevronRight 
                    className="text-white/10 group-hover:text-[#00E5FF] group-hover:translate-x-2 transition-all duration-300" 
                    size={24} 
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 📟 Neural Status Ticker - NEW */}
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-xl border-t border-white/5 z-50 flex items-center overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee px-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-8">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">
                  <Activity size={12} className="animate-pulse" /> Node_Status: Online
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  // Neural_Link: Encrypted
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00FFB3]">
                  // Talent_Mesh: Synchronized
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  // Session_Auth: DEV_TOKEN
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
