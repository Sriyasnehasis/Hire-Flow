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
  const [resumes, setResumes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      setUserName(JSON.parse(rawUser)?.full_name?.split(' ')[0] || "Professional");
    }

    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [resumesRes, appsRes] = await Promise.all([
          fetch(`${apiBase}/resumes`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBase}/applications`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (resumesRes.ok) {
          const resumesData = await resumesRes.json();
          setResumes(resumesData || []);
        }
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiBase]);

  // Compute stats dynamically
  const latestResume = resumes.length > 0 ? resumes[0] : null;
  const atsScore = latestResume ? Math.round(latestResume.ats_score || 0) : 0;
  const activeAppsCount = applications.length;
  const interviewsCount = applications.filter((app: any) => app.status === "interview").length;
  const interviewReadiness = activeAppsCount > 0 ? "78%" : "0%";

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Career Dashboard Active</span>
            </div>
            <h1 className="text-5xl font-display font-black tracking-tight text-text">
              Welcome back, <span className="italic font-serif-italic font-normal lowercase">{userName}.</span>
            </h1>
          </div>
          <Link href="/resume" className="btn-premium flex items-center gap-2 px-6 py-3 bg-accent text-bg-surface rounded-xl font-bold text-sm">
            <Plus size={18} />
            <span>Go to Resume Builder</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-muted/20">
             <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest">Syncing analytics...</p>
          </div>
        ) : (
          <>
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
                {latestResume ? (
                  <>
                    <ATSGauge score={atsScore} size={200} />
                    <p className="text-center text-[11px] text-text-muted max-w-[200px] mt-4">
                      Your resume scored <span className="text-accent font-bold">{atsScore}/100</span>. Customize it for target roles to rank higher.
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-grow p-4 text-center">
                    <p className="text-sm font-bold text-text-muted mb-4">No resume uploaded yet.</p>
                    <Link href="/resume" className="text-xs font-bold text-accent hover:underline">
                      Upload your first resume →
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Metrics */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <MetricCard 
                   label="Active Applications" 
                   value={String(activeAppsCount)} 
                   sub={`${interviewsCount} interviews scheduled`} 
                   icon={Briefcase} 
                   trend={activeAppsCount > 0 ? `+${activeAppsCount} active` : "0 active"}
                 />
                 <MetricCard 
                   label="Interview Readiness" 
                   value={interviewReadiness} 
                   sub="Practice simulation active" 
                   icon={Mic} 
                   trend={activeAppsCount > 0 ? "Ready" : "Standby"}
                 />
                 <div className="md:col-span-2 glass-card p-8 flex items-center justify-between bg-accent text-bg-surface overflow-hidden relative">
                    <div className="relative z-10">
                       <h3 className="text-xl font-display font-black mb-2">Ready for your next move?</h3>
                       <p className="text-bg-surface/80 text-sm max-w-sm mb-6">Find real-time job listings matching your skills on our public job board.</p>
                       <Link href="/jobs" className="px-6 py-2.5 bg-bg-surface text-accent rounded-full font-bold text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform">
                          Browse Live Jobs <ArrowUpRight size={16} />
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
                  </div>
                  <div className="space-y-4">
                     {applications.length > 0 ? (
                       applications.slice(0, 3).map((app: any) => (
                         <ActivityItem 
                           key={app.id}
                           title="Job Application Sent" 
                           desc={`${app.job_title} at ${app.company}`} 
                           time={app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Just now"} 
                           icon={Briefcase} 
                         />
                       ))
                     ) : (
                       <div className="glass-card p-8 text-center text-text-muted">
                         <p className="text-xs font-bold uppercase tracking-widest">No recent applications.</p>
                         <Link href="/jobs" className="text-xs font-bold text-accent hover:underline mt-2 inline-block">
                           Browse and apply to jobs →
                         </Link>
                       </div>
                     )}
                  </div>
               </div>

               <div className="space-y-6">
                  <h2 className="text-xl font-display font-black uppercase tracking-tight">Profile Completeness</h2>
                  <div className="glass-card p-6 space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                           <span>Core Information</span>
                           <span className="text-accent">{latestResume ? "100%" : "20%"}</span>
                        </div>
                        <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                           <div className="h-full bg-accent" style={{ width: latestResume ? "100%" : "20%" }} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                           <span>Experience</span>
                           <span className="text-accent">{latestResume ? "100%" : "10%"}</span>
                        </div>
                        <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                           <div className="h-full bg-accent" style={{ width: latestResume ? "100%" : "10%" }} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                           <span>Technical Skills</span>
                           <span className="text-accent">{latestResume ? "100%" : "5%"}</span>
                        </div>
                        <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                           <div className="h-full bg-accent" style={{ width: latestResume ? "100%" : "5%" }} />
                        </div>
                     </div>
                     <Link href="/profile" className="block text-center py-3 border border-dashed border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-accent hover:text-accent transition-all">
                        Update Your Profile
                     </Link>
                  </div>
               </div>
            </div>
          </>
        )}
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
