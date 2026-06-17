"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import SkillGapAnalysis from "@/components/SkillGap/SkillGapAnalysis";
import DashboardLayout from "@/components/DashboardLayout";

interface Job {
  job_id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  score?: number;
}

export default function SkillGapPage() {
  const { user, token } = useAuth() as any;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;

    const fetchJobs = async () => {
      try {
        const rawApiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const apiBase = rawApiUrl.endsWith("/api/v1")
          ? rawApiUrl
          : `${rawApiUrl}/api/v1`;
        const response = await fetch(`${apiBase}/jobs/recommendations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setJobs(data.recommendations || []);
          if (data.recommendations && data.recommendations.length > 0) {
            setSelectedJobId(data.recommendations[0].job_id);
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [mounted, token]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Skill Gap">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-4xl font-bold text-white mb-2">
            Skill Gap Analysis
          </h1>
          <p className="text-slate-400">
            Identify the skills you need to improve your chances for each job.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card shadow-md overflow-hidden bg-bg-surface border-border">
              <div className="bg-accent-soft text-text p-4 border-b border-border">
                <h2 className="text-lg font-semibold uppercase text-xs font-black tracking-widest text-text-muted">
                  Recommended Jobs ({jobs.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>Loading jobs...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm font-semibold">
                  No jobs found. Use the chrome extension to scrape jobs first.
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-[450px] overflow-y-auto">
                  {jobs.map((job) => (
                    <button
                      key={job.job_id}
                      onClick={() => setSelectedJobId(job.job_id)}
                      className={`w-full text-left p-4 hover:bg-white/[0.02] transition-colors ${
                        selectedJobId === job.job_id
                          ? "bg-accent-soft border-l-4 border-accent"
                          : ""
                      }`}
                    >
                      <h3 className="font-bold text-text truncate uppercase text-sm">
                        {job.title}
                      </h3>
                      <p className="text-xs text-text-muted truncate mt-1">
                        {job.company}
                      </p>
                      <p className="text-[10px] text-text-muted/60 mt-2 font-bold tracking-wider">
                        📍 {job.location}
                      </p>
                      {typeof job.score === "number" && (
                        <p className="text-[10px] text-accent font-black mt-2 uppercase tracking-widest">
                          Match: {job.score}%
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="lg:col-span-2">
            <div className="glass-card shadow-md p-6 bg-bg-surface border-border">
              {selectedJobId ? (
                <SkillGapAnalysis jobId={selectedJobId} />
              ) : (
                <div className="text-center text-slate-500 py-12 font-semibold">
                  Select a job on the left to see the skill gap analysis report
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-accent-soft border border-accent/10 rounded-2xl p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-accent mb-4">
            💡 Quick Tips
          </h3>
          <ul className="space-y-2 text-text-muted text-[13px] font-semibold">
            <li>
              ✓ Focus on learning the &apos;Priority Skills&apos; to
              improve your match
            </li>
            <li>✓ Use the provided learning resources to bridge skill gaps</li>
            <li>✓ Update your resume after learning new skills</li>
            <li>
              ✓ Target jobs where you have 70% skill match for best results
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
