"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Target, 
  ShieldCheck, 
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  Cpu,
  Github,
  RefreshCw,
  Star,
  Trash2
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    profession: "",
    bio: "",
    phone: "",
    linkedin_url: "",
    github_url: ""
  });

  const [extendedData, setExtendedData] = useState({
    educational_qualification: "",
    years_of_experience: 0,
    current_company: "",
    primary_skills: [] as string[],
    preferred_roles: [] as string[],
    current_status: "Looking for Job" 
  });

  const [githubStats, setGithubStats] = useState<any>(null);
  const [githubConnected, setGithubConnected] = useState(false);
  const [syncingGithub, setSyncingGithub] = useState(false);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [userRes, dataRes] = await Promise.all([
          fetch(`${apiBase}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBase}/users/me/profile-data`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (userRes.ok) setProfile(await userRes.json());
        if (dataRes.ok) setExtendedData(await dataRes.json());

        // Load GitHub stats
        try {
          const githubRes = await fetch(`${apiBase}/github/stats`, { headers: { Authorization: `Bearer ${token}` } });
          if (githubRes.ok) {
            const githubData = await githubRes.json();
            if (githubData.connected) {
              setGithubConnected(true);
              setGithubStats(githubData.stats);
            }
          }
        } catch (githubErr) {
          console.error("Failed to load GitHub stats", githubErr);
        }

      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBase]);

  const handleConnectGithub = async () => {
    try {
      const response = await fetch(`${apiBase}/github/auth/url`);
      if (response.ok) {
        const data = await response.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        }
      }
    } catch (err) {
      console.error("Failed to fetch GitHub OAuth URL", err);
    }
  };

  const handleDisconnectGithub = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiBase}/github/disconnect`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setGithubConnected(false);
        setGithubStats(null);
      }
    } catch (err) {
      console.error("Failed to disconnect GitHub", err);
    }
  };

  const handleSyncGithub = async () => {
    setSyncingGithub(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiBase}/github/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGithubStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to sync GitHub data", err);
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const [res1, res2] = await Promise.all([
        fetch(`${apiBase}/users/me`, {
          method: "PATCH",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            full_name: profile.full_name,
            profession: profile.profession,
            bio: profile.bio,
            phone: profile.phone,
            linkedin_url: profile.linkedin_url,
            github_url: profile.github_url
          })
        }),
        fetch(`${apiBase}/users/me/profile-data`, {
          method: "PATCH",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            educational_qualification: extendedData.educational_qualification,
            years_of_experience: extendedData.years_of_experience,
            current_company: extendedData.current_company,
            primary_skills: extendedData.primary_skills,
            preferred_roles: extendedData.preferred_roles
          })
        })
      ]);

      if (res1.ok && res2.ok) {
        setSuccess(true);
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...localUser, full_name: profile.full_name }));
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "identity", label: "Core Profile", icon: User },
    { id: "academic", label: "Education", icon: GraduationCap },
    { id: "technical", label: "Technical Skills", icon: Cpu },
    { id: "trajectory", label: "Work Experience", icon: Target },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[#00E5FF]" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Profile Data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[8px] font-black text-[#00E5FF] uppercase tracking-widest animate-pulse">
                Identity_Control_Active
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              PROFILE <span className="outline-text opacity-40">ARCHITECT</span>
            </h1>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="glow-button px-10 py-4 flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : success ? <CheckCircle2 size={16} /> : <Save size={16} />}
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              {saving ? "ENCRYPTING..." : success ? "SYNC_COMPLETE" : "SYNC_TO_CLOUD"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border ${
                  activeTab === tab.id 
                    ? 'bg-white/[0.05] border-[#00E5FF] text-white shadow-[0_0_20px_rgba(0,229,255,0.1)]' 
                    : 'border-transparent text-white/30 hover:bg-white/[0.02] hover:text-white'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-[#00E5FF]" : ""} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-10 bg-white/[0.01] border-white/5"
              >
                {activeTab === "identity" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-8 mb-10">
                      <div className="relative group">
                         <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00E5FF] to-cyan-900 flex items-center justify-center text-black font-black text-3xl shadow-2xl">
                           {profile.full_name?.charAt(0).toUpperCase()}
                         </div>
                         <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-xl flex items-center justify-center text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all">
                           <Camera size={14} />
                         </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{profile.full_name || "New Candidate"}</h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Primary Email: {profile.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput 
                        label="Full Name" 
                        value={profile.full_name} 
                        onChange={(v) => setProfile({...profile, full_name: v})} 
                      />
                      <ProfileInput 
                        label="Professional Title" 
                        value={profile.profession || ""} 
                        placeholder="e.g. Senior Software Engineer"
                        onChange={(v) => setProfile({...profile, profession: v})} 
                      />
                      <div className="md:col-span-2">
                         <ProfileTextArea 
                           label="Professional Bio" 
                           value={profile.bio || ""} 
                           onChange={(v) => setProfile({...profile, bio: v})} 
                         />
                      </div>
                      <ProfileInput 
                        label="LinkedIn Link" 
                        value={profile.linkedin_url || ""} 
                        onChange={(v) => setProfile({...profile, linkedin_url: v})} 
                      />
                      <ProfileInput 
                        label="GitHub Link" 
                        value={profile.github_url || ""} 
                        onChange={(v) => setProfile({...profile, github_url: v})} 
                      />
                      
                      <div className="md:col-span-2 mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                              <Github size={24} />
                            </div>
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest text-white">GitHub OAuth Sync</h4>
                              <p className="text-[10px] text-white/40 mt-1">Connect your account to synchronize technical repositories and skill metadata.</p>
                            </div>
                          </div>
                          
                          {githubConnected ? (
                            <div className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={handleSyncGithub}
                                disabled={syncingGithub}
                                className="px-5 py-2.5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:border-[#00E5FF] hover:text-[#00E5FF] disabled:opacity-50 transition-all flex items-center gap-2"
                              >
                                <RefreshCw className={syncingGithub ? "animate-spin" : ""} size={12} />
                                <span>{syncingGithub ? "Syncing..." : "Sync Metadata"}</span>
                              </button>
                              <button 
                                type="button"
                                onClick={handleDisconnectGithub}
                                className="px-5 py-2.5 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
                              >
                                <Trash2 size={12} />
                                <span>Disconnect</span>
                              </button>
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={handleConnectGithub}
                              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                            >
                              <Github size={14} />
                              <span>Link Account</span>
                            </button>
                          )}
                        </div>

                        {githubConnected && githubStats && (
                          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4">
                              <img src={githubStats.avatar_url} alt="avatar" className="w-10 h-10 rounded-xl border border-white/10" />
                              <div>
                                <h5 className="text-xs font-bold text-white">@{githubStats.username}</h5>
                                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Connected Account</p>
                              </div>
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="text-xl font-black text-[#00E5FF]">{githubStats.repositories_count}</span>
                              <span className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Repositories Extracted</span>
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="flex items-center gap-1 text-[#00FFB3]">
                                <Star size={14} />
                                <span className="text-xl font-black">{githubStats.total_stars}</span>
                              </div>
                              <span className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Total Stars Captured</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "academic" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      <ProfileInput 
                        label="Highest Educational Qualification" 
                        value={extendedData.educational_qualification || ""} 
                        placeholder="e.g. Master of Science in AI"
                        onChange={(v) => setExtendedData({...extendedData, educational_qualification: v})} 
                      />
                    </div>
                  </div>
                )}

                {activeTab === "technical" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Active Skills</label>
                        <div className="flex flex-wrap gap-3">
                           {extendedData.primary_skills?.map((skill, i) => (
                             <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-[#00FFB3]">
                                {skill}
                             </span>
                           ))}
                           <button className="px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-[10px] font-bold text-white/20 hover:border-[#00E5FF] hover:text-white transition-all">
                              + Add Skill
                           </button>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === "trajectory" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Current Status</label>
                          <select 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/50 transition-all font-bold appearance-none"
                            value={extendedData.current_status}
                            onChange={(e) => setExtendedData({...extendedData, current_status: e.target.value})}
                          >
                             <option className="bg-slate-900" value="Looking for Job">Looking for Job</option>
                             <option className="bg-slate-900" value="Open for Internship">Open for Internship</option>
                             <option className="bg-slate-900" value="Freelancing">Freelancing</option>
                             <option className="bg-slate-900" value="Contract / Freelance">Contract / Freelance</option>
                          </select>
                       </div>
                       <ProfileInput 
                         label="Years in Industry" 
                         value={extendedData.years_of_experience?.toString() || "0"} 
                         onChange={(v) => setExtendedData({...extendedData, years_of_experience: parseFloat(v) || 0})} 
                       />
                       <div className="md:col-span-2">
                          <ProfileInput 
                            label="Current/Last Company" 
                            value={extendedData.current_company || ""} 
                            onChange={(v) => setExtendedData({...extendedData, current_company: v})} 
                          />
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileInput({ label, value, onChange, placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">{label}</label>
      <input 
        type="text" 
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-[#00E5FF]/50 transition-all font-bold shadow-inner"
      />
    </div>
  );
}

function ProfileTextArea({ label, value, onChange, placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">{label}</label>
      <textarea 
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-[#00E5FF]/50 transition-all font-bold resize-none shadow-inner"
      />
    </div>
  );
}
