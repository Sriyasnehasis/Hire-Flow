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
  Cpu
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

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [userRes, dataRes] = await Promise.all([
          fetch(`${apiBase}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBase}/users/me/profile-data`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (userRes.ok) setProfile(await userRes.json());
        if (dataRes.ok) setExtendedData(await dataRes.json());
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBase]);

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
    { id: "identity", label: "Core Identity", icon: User },
    { id: "academic", label: "Academic Node", icon: GraduationCap },
    { id: "technical", label: "Technical Mesh", icon: Cpu },
    { id: "trajectory", label: "Trajectory", icon: Target },
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
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Institutional Node: {profile.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput 
                        label="Full Legal Name" 
                        value={profile.full_name} 
                        onChange={(v) => setProfile({...profile, full_name: v})} 
                      />
                      <ProfileInput 
                        label="Professional Alias" 
                        value={profile.profession || ""} 
                        placeholder="e.g. Senior Software Engineer"
                        onChange={(v) => setProfile({...profile, profession: v})} 
                      />
                      <div className="md:col-span-2">
                         <ProfileTextArea 
                           label="Identity Narrative (Bio)" 
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
                       <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Active Skill Mesh</label>
                       <div className="flex flex-wrap gap-3">
                          {extendedData.primary_skills?.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-[#00FFB3]">
                               {skill}
                            </span>
                          ))}
                          <button className="px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-[10px] font-bold text-white/20 hover:border-[#00E5FF] hover:text-white transition-all">
                             + Add Node
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
                             <option className="bg-slate-900" value="Contractual Node">Contractual Node</option>
                          </select>
                       </div>
                       <ProfileInput 
                         label="Years in Industry" 
                         value={extendedData.years_of_experience?.toString() || "0"} 
                         onChange={(v) => setExtendedData({...extendedData, years_of_experience: parseFloat(v) || 0})} 
                       />
                       <div className="md:col-span-2">
                          <ProfileInput 
                            label="Current/Last Institutional Mesh (Company)" 
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
