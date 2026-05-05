"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import SkillGapAnalysis from "@/components/SkillGap/SkillGapAnalysis";

interface JobRecommendation {
  job_id: number;
  title: string;
  company: string;
  location: string;
  score?: number;
}

export default function SkillsPage() {
  const { user, token } = useAuth() as any;
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

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

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.detail || "Unable to fetch recommendations");
        }

        const data = await response.json();
        const recs = Array.isArray(data?.recommendations)
          ? data.recommendations
          : [];
        setJobs(recs);

        if (recs.length > 0) {
          setSelectedJobId(recs[0].job_id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load skill analysis",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <DashboardLayout title="Career Map">
      <div className="space-y-8">
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-4xl font-bold text-white mb-2">
            Skill Gap Analysis
          </h1>
          <p className="text-slate-400 text-lg">
            Live, job-specific insights based on your profile and resume.
          </p>
        </div>

        {!user ? (
          <div className="glass-card p-10 text-center text-slate-300">
            Please sign in to view your personalized skill gap analysis.
          </div>
        ) : loading ? (
          <div className="glass-card p-10 text-center text-slate-300">
            Loading recommendations...
          </div>
        ) : error ? (
          <div className="glass-card p-10 text-center text-red-300">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-300">
            No personalized jobs yet. Go to Job Board and sync live jobs first.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 glass-card p-4 max-h-[640px] overflow-y-auto">
              <h2 className="text-lg font-bold text-white mb-4">
                Recommended Jobs ({jobs.length})
              </h2>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <button
                    key={job.job_id}
                    onClick={() => setSelectedJobId(job.job_id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedJobId === job.job_id
                        ? "bg-indigo-500/20 border-indigo-500/40"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className="font-semibold text-white truncate">
                      {job.title}
                    </p>
                    <p className="text-sm text-slate-400 truncate">
                      {job.company}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {job.location}
                    </p>
                    {typeof job.score === "number" && (
                      <p className="text-xs text-indigo-300 mt-1">
                        Match: {job.score}%
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 glass-card p-6">
              {selectedJobId ? (
                <SkillGapAnalysis jobId={selectedJobId} />
              ) : (
                <div className="text-slate-300">
                  Select a job to see detailed analysis.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
