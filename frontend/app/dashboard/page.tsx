"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Sparkles,
  ArrowUpRight,
  Clock,
  Briefcase,
  Mic,
  Plus
} from "lucide-react";
import { ATSGauge } from "@/components/ATSGauge";

export default function Dashboard() {
  const [userName, setUserName] = useState("Professional");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) setUserName(JSON.parse(rawUser)?.full_name?.split(' ')[0] || "Professional");
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Career Intelligence Active</span>
            </div>
            <h1 className="text-5xl font-display font-black tracking-tight text-text">
              Welcome back, <span className="italic font-serif-italic font-normal lowercase">{userName}.</span>
            </h1>
          </div>
          <button className="btn-premium">
            <Plus size={18} />
            <span>New Resume</span>
          </button>
        </div>

        {/* Top Grid: Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ATS Performance */}
          <div className="glass-card p-8 flex flex-col items-center justify-between min-h-[300px]">
            <div className="w-full flex justify-between items-start mb-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Resume Performance</h3>
               <Link href="/resume" className="text-accent hover:underline flex items-center gap-1 text-[10px] font-bold">
                  View Detail <ArrowUpRight size={12} />
               </Link>
            </div>
            <ATSGauge score={82} size={200} />
            <p className="text-center text-[11px] text-text-muted max-w-[200px] mt-4">
              Your resume is in the <span className="text-accent font-bold">top 15%</span> of institutional candidates.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <MetricCard 
               label="Active Applications" 
               value="12" 
               sub="4 interviews scheduled" 
               icon={Briefcase} 
               trend="+2 this week"
             />
             <MetricCard 
               label="Interview Readiness" 
               value="74%" 
               sub="3 sessions completed" 
               icon={Mic} 
               trend="Improving"
             />
             <div className="md:col-span-2 glass-card p-8 flex items-center justify-between bg-accent text-bg-surface overflow-hidden relative">
                <div className="relative z-10">
                   <h3 className="text-xl font-display font-black mb-2">Ready for your next move?</h3>
                   <p className="text-bg-surface/80 text-sm max-w-sm mb-6">We&apos;ve found 8 new roles that match your profile and current skill set.</p>
                   <Link href="/jobs" className="px-6 py-2.5 bg-bg-surface text-accent rounded-full font-bold text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform">
                      View Matches <ArrowUpRight size={16} />
                   </Link>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                   <Briefcase size={200} />
                </div>
             </div>
          </div>
        </div>

        {/* Activity Feed & Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-display font-black uppercase tracking-tight">Recent Activity</h2>
                 <button className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-accent transition-colors">View All</button>
              </div>
              <div className="space-y-4">
                 <ActivityItem 
                   title="Resume Exported" 
                   desc="Software Engineer Template (PDF)" 
                   time="2 hours ago" 
                   icon={FileText} 
                 />
                 <ActivityItem 
                   title="Job Application Sent" 
                   desc="Frontend Developer at TechNova" 
                   time="5 hours ago" 
                   icon={Briefcase} 
                 />
                 <ActivityItem 
                   title="AI Interview Finished" 
                   desc="Session: Technical Round (Level 2)" 
                   time="Yesterday" 
                   icon={Mic} 
                 />
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-xl font-display font-black uppercase tracking-tight">Profile Completeness</h2>
              <div className="glass-card p-6 space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                       <span>Identity Mesh</span>
                       <span className="text-accent">90%</span>
                    </div>
                    <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-[90%]" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                       <span>Academic Node</span>
                       <span className="text-accent">100%</span>
                    </div>
                    <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-full" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                       <span>Technical Skills</span>
                       <span className="text-accent">65%</span>
                    </div>
                    <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-[65%]" />
                    </div>
                 </div>
                 <Link href="/profile" className="block text-center py-3 border border-dashed border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-accent hover:text-accent transition-all">
                    Finalize Your Profile
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ label, value, sub, icon: Icon, trend }: any) {
  return (
    <div className="glass-card p-6 space-y-4">
       <div className="flex justify-between items-start">
          <div className="p-3 bg-bg-raised rounded-xl text-text">
             <Icon size={20} />
          </div>
          <span className="text-[9px] font-black text-accent uppercase tracking-widest px-2 py-1 bg-accent-soft rounded-lg">{trend}</span>
       </div>
       <div>
          <h3 className="text-3xl font-display font-black">{value}</h3>
          <p className="text-xs font-bold text-text-muted uppercase tracking-tight mt-1">{label}</p>
          <p className="text-[10px] text-text-muted/60 mt-4 flex items-center gap-1">
             <Clock size={10} /> {sub}
          </p>
       </div>
    </div>
  );
}

function ActivityItem({ title, desc, time, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-bg-raised rounded-2xl transition-colors group">
       <div className="w-10 h-10 rounded-full bg-bg-raised flex items-center justify-center text-text-muted group-hover:text-accent group-hover:bg-accent-soft transition-colors">
          <Icon size={18} />
       </div>
       <div className="flex-1">
          <h4 className="text-sm font-bold text-text">{title}</h4>
          <p className="text-xs text-text-muted">{desc}</p>
       </div>
       <div className="text-[10px] font-medium text-text-muted/40 uppercase tracking-widest">
          {time}
       </div>
    </div>
  );
}

function FileText(props: any) {
  return <FileTextIcon {...props} />
}

import { FileText as FileTextIcon } from "lucide-react";
