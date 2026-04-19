"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SkillGap {
  category: string;
  job_requires: string[];
  you_have: string[];
  you_need: string[];
  gap_percentage: number;
  match_percentage: number;
}

interface SkillGapAnalysisProps {
  jobId?: number;
  resumeText?: string;
  jobDescription?: string;
}

export default function SkillGapAnalysis({
  jobId,
  resumeText,
  jobDescription,
}: SkillGapAnalysisProps) {
  const { user, token } = useAuth() as any;
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSkillGap = useCallback(async () => {
    if (!mounted || !token) return;

    setLoading(true);
    setError(null);

    try {
      let url = "";
      const rawApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiBase = rawApiUrl.endsWith("/api/v1")
        ? rawApiUrl
        : `${rawApiUrl}/api/v1`;

      if (jobId && user) {
        // Fetch skill gap for specific job
        url = `${apiBase}/jobs/skill-gap/${jobId}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch skill gap");
        const data = await response.json();
        setAnalysis(data);
      } else if (resumeText && jobDescription) {
        // Analyze custom resume vs job
        url = `${apiBase}/jobs/analyze-resume-vs-job`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        });

        if (!response.ok) throw new Error("Failed to analyze");
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [jobId, resumeText, jobDescription, user, token, mounted]);

  useEffect(() => {
    if (mounted && (jobId || (resumeText && jobDescription))) {
      fetchSkillGap();
    }
  }, [jobId, resumeText, jobDescription, mounted, fetchSkillGap]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No data available. Please select a job.</p>
      </div>
    );
  }

  const categoryGaps = analysis.category_gaps || {};
  const matchPercentage =
    analysis.overall_match_percentage || analysis.overall_match || 0;
  const matchedKeywords =
    analysis.matched_keywords || analysis.matched_skills || [];
  const missingKeywords =
    analysis.missing_keywords || analysis.missing_skills || [];
  const prioritySkills = analysis.priority_skills || [];
  const learningPath = analysis.learning_path || {};

  return (
    <div className="space-y-6">
      {/* Overall Match Score */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Skill Gap Analysis
        </h2>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-slate-300">
              Overall Match
            </span>
            <span className="text-3xl font-bold text-blue-600">
              {matchPercentage}%
            </span>
          </div>
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                matchPercentage >= 75
                  ? "bg-green-500"
                  : matchPercentage >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {matchPercentage >= 75 ? (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Check Excellent Match
              </span>
              <p className="text-sm text-green-300">
                You are well-qualified for this position!
              </p>
            </>
          ) : matchPercentage >= 50 ? (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ~ Moderate Match
              </span>
              <p className="text-sm text-yellow-300">
                A few more skills could improve your chances.
              </p>
            </>
          ) : (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                X Skills Gap Detected
              </span>
              <p className="text-sm text-red-300">
                Focus on the suggested skills to improve fit.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Matched & Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/10">
          <h3 className="text-lg font-semibold text-green-300 mb-3">
            ✓ Matched Skills ({matchedKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-green-300">
                No directly matched skills found
              </p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/10">
          <h3 className="text-lg font-semibold text-red-300 mb-3">
            ✗ Missing Skills ({missingKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-red-300">
                All required skills matched!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category-wise Breakdown */}
      <div className="border border-white/10 rounded-lg p-6 bg-white/5">
        <h3 className="text-xl font-semibold text-white mb-4">
          Category Breakdown
        </h3>
        <div className="space-y-4">
          {Object.entries(categoryGaps).map(
            ([category, gap]: [string, any]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-300">{category}</span>
                  <span className="text-sm font-semibold text-slate-400">
                    {gap.match_percentage}%
                  </span>
                </div>
                <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      gap.match_percentage >= 75
                        ? "bg-green-500"
                        : gap.match_percentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${gap.match_percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  You have {gap.you_have.length}/{gap.job_requires.length}{" "}
                  skills
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Priority Skills to Learn */}
      {prioritySkills.length > 0 && (
        <div className="border border-purple-500/30 rounded-lg p-6 bg-purple-500/10">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">
            Priority Skills to Learn
          </h3>
          <div className="space-y-2">
            {prioritySkills.map((skill: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded-full bg-purple-600 text-white text-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="text-slate-300">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Resources */}
      {learningPath.resources &&
        Object.keys(learningPath.resources).length > 0 && (
          <div className="border border-blue-500/30 rounded-lg p-6 bg-blue-500/10">
            <h3 className="text-xl font-semibold text-blue-200 mb-2">
              📚 Learning Resources
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              {learningPath.recommendation}
            </p>
            <div className="space-y-3">
              {Object.entries(learningPath.resources).map(
                ([skill, resource]: [string, any]) => (
                  <div
                    key={skill}
                    className="bg-white/5 rounded p-3 border border-white/10"
                  >
                    <h4 className="font-semibold text-white">{skill}</h4>
                    <p className="text-sm text-slate-300">
                      {resource.platform}
                    </p>
                    <p className="text-xs text-slate-500">
                      ⏱️ {resource.hours} hours
                    </p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                    >
                      View Course →
                    </a>
                  </div>
                ),
              )}
            </div>
            {learningPath.total_hours && (
              <div className="mt-4 p-3 bg-blue-500/20 rounded text-sm text-blue-100">
                💡 <strong>Total Learning Time:</strong> ~
                {learningPath.total_hours} hours ({learningPath.estimated_weeks}{" "}
                weeks with consistent effort)
              </div>
            )}
          </div>
        )}
    </div>
  );
}
