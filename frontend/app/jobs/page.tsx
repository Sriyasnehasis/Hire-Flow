"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, MapPin, Bookmark, Target, ArrowUpRight, Filter, Loader2, ExternalLink, RefreshCw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  match?: number;
  posted: string;
  url?: string;
  description?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("Software Developer");
  const [searchLocation, setSearchLocation] = useState("India");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (query?: string, location?: string) => {
    setLoading(true);
    const searchQ = query || searchQuery;
    const searchL = location || searchLocation;
    
    try {
      // Try real Adzuna API via backend
      const res = await fetch(
        `${API_URL}/jobs/search?keyword=${encodeURIComponent(searchQ)}&location=${encodeURIComponent(searchL)}`
      );
      
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs.map((j: any) => ({
            id: j.id || String(Math.random()),
            title: j.title,
            company: j.company?.display_name || j.company || "Unknown",
            location: j.location?.display_name || j.location || "Remote",
            salary: j.salary_min && j.salary_max
              ? `₹${Math.round(j.salary_min/100000)}L - ₹${Math.round(j.salary_max/100000)}L`
              : j.salary || "",
            type: j.contract_type || j.type || "Full-time",
            posted: j.created ? new Date(j.created).toLocaleDateString() : "Recently",
            url: j.redirect_url || j.url || "#",
            description: j.description || "",
          })));
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.log("Backend search unavailable, using direct Adzuna");
    }

    // Fallback: Call Adzuna directly from frontend
    try {
      const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=1854ccc4&app_key=53f089784bfee3005e6ceffa6b8f2333&what=${encodeURIComponent(searchQ)}&where=${encodeURIComponent(searchL)}&results_per_page=15&content-type=application/json`;
      const res = await fetch(adzunaUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          setJobs(data.results.map((j: any) => ({
            id: j.id || String(Math.random()),
            title: j.title,
            company: j.company?.display_name || "Unknown",
            location: j.location?.display_name || "India",
            salary: j.salary_min && j.salary_max
              ? `₹${Math.round(j.salary_min/100000)}L - ₹${Math.round(j.salary_max/100000)}L`
              : "",
            type: j.contract_type || "Full-time",
            posted: j.created ? new Date(j.created).toLocaleDateString() : "Recently",
            url: j.redirect_url || "#",
            description: j.description || "",
          })));
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.log("Adzuna direct also failed");
    }

    // Final fallback
    setJobs([]);
    setLoading(false);
  };

  const handleSearch = () => {
    fetchJobs(searchQuery, searchLocation);
  };

  const toggleSave = (id: string) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);
  };

  return (
    <DashboardLayout title="Jobs">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-4xl font-bold text-white mb-2">Job Board</h1>
          <p className="text-slate-400 text-lg">Live job listings from Adzuna, LinkedIn, and partner APIs.</p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Search by title, stack, or company..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text" value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Location..."
              className="w-full md:w-48 pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button onClick={handleSearch} className="btn-gradient !rounded-xl px-6 py-4">
            <Search size={18} /> Search
          </button>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">{jobs.length} jobs found</p>
            <button onClick={() => fetchJobs()} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        )}

        {/* Job Listings */}
        {loading ? (
          <div className="glass-card p-16 flex flex-col items-center justify-center gap-4">
            <Loader2 size={32} className="text-indigo-400 animate-spin" />
            <p className="text-slate-400 font-medium">Fetching live jobs from Adzuna...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <p className="text-slate-400 text-lg mb-4">No jobs found. Try different keywords.</p>
            <button onClick={() => { setSearchQuery("Developer"); fetchJobs("Developer"); }}
              className="text-indigo-400 font-semibold hover:underline">Search "Developer"</button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="glass-card p-6 md:p-8 group hover:border-indigo-500/20">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center font-bold text-2xl text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    {job.company?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium flex items-center gap-2 text-sm flex-wrap">
                      {job.company} • <MapPin size={14} /> {job.location}
                      {job.salary && <> • {job.salary}</>}
                    </p>
                    {job.description && (
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">{job.description.replace(/<[^>]+>/g, '').slice(0, 150)}...</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-500">{job.posted}</span>
                    {job.url && job.url !== "#" ? (
                      <a href={job.url} target="_blank" rel="noopener noreferrer"
                        className="btn-gradient !rounded-xl !px-5 !py-3 text-sm whitespace-nowrap">
                        Apply <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button className="btn-gradient !rounded-xl !px-5 !py-3 text-sm whitespace-nowrap">
                        Apply <ArrowUpRight size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`p-3 rounded-xl transition-all border ${
                        savedJobs.includes(job.id)
                          ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                      }`}>
                      <Bookmark size={18} className={savedJobs.includes(job.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
