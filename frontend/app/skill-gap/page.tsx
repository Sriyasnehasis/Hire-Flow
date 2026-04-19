"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import SkillGapAnalysis from "@/components/SkillGap/SkillGapAnalysis";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
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
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/jobs/recommendations`, {
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

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Skill Gap Analysis
          </h1>
          <p className="text-gray-600">
            Identify the skills you need to improve your chances for each job
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-lg font-semibold">
                  Recommended Jobs ({jobs.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading jobs...
                </div>
              ) : jobs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No jobs found. Use the chrome extension to scrape jobs first.
                </div>
              ) : (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${
                        selectedJobId === job.id
                          ? "bg-blue-100 border-l-4 border-blue-600"
                          : ""
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {job.company}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {job.location}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {selectedJobId ? (
                <SkillGapAnalysis jobId={selectedJobId} />
              ) : (
                <div className="text-center text-gray-500">
                  Select a job to see the skill gap analysis
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            💡 Quick Tips
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>
              &#10003; Focus on learning the &apos;Priority Skills&apos; to improve your match
            </li>
            <li>✓ Use the provided learning resources to bridge skill gaps</li>
            <li>✓ Update your resume after learning new skills</li>
            <li>
              ✓ Target jobs where you have 70% skill match for best results
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
