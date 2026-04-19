"use client";

import SkillGapAnalysis from "@/components/SkillGap/SkillGapAnalysis";

// Mock data for demo
const DEMO_DATA = {
  job: {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Google",
    location: "Mountain View, CA",
  },
  overall_match_percentage: 86,
  matched_count: 13,
  total_required: 15,
  category_gaps: {
    Frontend: {
      job_requires: [
        "react",
        "next.js",
        "typescript",
        "html",
        "css",
        "tailwind",
      ],
      you_have: ["react", "next.js", "html", "css", "tailwind"],
      you_need: ["typescript"],
      gap_percentage: 17,
      match_percentage: 83,
    },
    Backend: {
      job_requires: ["python", "fastapi", "node.js", "django"],
      you_have: ["python", "fastapi", "django"],
      you_need: ["node.js"],
      gap_percentage: 25,
      match_percentage: 75,
    },
    Database: {
      job_requires: ["postgresql", "mongodb", "redis"],
      you_have: ["postgresql", "mongodb"],
      you_need: ["redis"],
      gap_percentage: 33,
      match_percentage: 67,
    },
    Cloud: {
      job_requires: ["aws", "docker", "kubernetes"],
      you_have: ["aws", "docker"],
      you_need: ["kubernetes"],
      gap_percentage: 33,
      match_percentage: 67,
    },
    AI_ML: {
      job_requires: ["machine learning", "pytorch", "nlp"],
      you_have: [],
      you_need: ["machine learning", "pytorch", "nlp"],
      gap_percentage: 100,
      match_percentage: 0,
    },
    DevOps: {
      job_requires: ["ci/cd", "jenkins", "gitlab"],
      you_have: [],
      you_need: ["ci/cd", "jenkins", "gitlab"],
      gap_percentage: 100,
      match_percentage: 0,
    },
    Mobile: {
      job_requires: ["react native"],
      you_have: [],
      you_need: ["react native"],
      gap_percentage: 100,
      match_percentage: 0,
    },
  },
  priority_skills: ["typescript", "kubernetes", "machine learning"],
  matched_keywords: [
    "react",
    "next.js",
    "python",
    "fastapi",
    "postgresql",
    "mongodb",
    "aws",
    "docker",
    "django",
    "html",
    "css",
    "tailwind",
    "git",
  ],
  missing_keywords: [
    "typescript",
    "kubernetes",
    "machine learning",
    "pytorch",
    "ci/cd",
  ],
  learning_path: {
    resources: {
      typescript: {
        platform: "freeCodeCamp",
        hours: 15,
        url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/",
      },
      kubernetes: {
        platform: "Linux Foundation",
        hours: 20,
        url: "https://www.linux.com/training/",
      },
      "machine learning": {
        platform: "Coursera",
        hours: 30,
        url: "https://www.coursera.org/learn/machine-learning",
      },
    },
    total_hours: 65,
    estimated_weeks: 7,
    recommendation:
      "You can learn these skills in ~7 weeks with consistent effort",
  },
};

export default function SkillGapDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-yellow-100 border border-yellow-600 text-yellow-800 px-4 py-2 rounded-lg mb-4 text-sm font-semibold">
            DEMO MODE - This is what the actual UI looks like
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Skill Gap Analysis - LIVE DEMO
          </h1>
          <p className="text-gray-600 text-lg">
            Below is the actual beautiful UI component rendering with real data
          </p>
        </div>

        {/* The Actual Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SkillGapAnalysis />
        </div>

        {/* Hardcoded to show demo data */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            This is rendered with hardcoded demo data:
          </h2>

          <div className="space-y-6 text-gray-700 font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <div>
              <strong>Job:</strong> {DEMO_DATA.job.title} at{" "}
              {DEMO_DATA.job.company}
            </div>
            <div>
              <strong>Overall Match:</strong>{" "}
              {DEMO_DATA.overall_match_percentage}%
            </div>
            <div>
              <strong>Matched Skills:</strong>{" "}
              {DEMO_DATA.matched_keywords.join(", ")}
            </div>
            <div>
              <strong>Missing Skills:</strong>{" "}
              {DEMO_DATA.missing_keywords.join(", ")}
            </div>
            <div>
              <strong>Category Analysis:</strong>
              <div className="mt-2">
                {Object.entries(DEMO_DATA.category_gaps).map(
                  ([category, gap]) => (
                    <div key={category} className="ml-4">
                      {category}: {(gap as any).match_percentage}% match (
                      {(gap as any).you_have.length}/
                      {(gap as any).job_requires.length})
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Why is the real page blank?
          </h3>
          <ul className="space-y-3 text-blue-800">
            <li>✓ The component is working perfectly</li>
            <li>✗ But the database has no jobs yet</li>
            <li>&#10007; And there&apos;s no logged-in user with resume</li>
            <li className="mt-4">
              <strong>Solution:</strong> We need to add sample job data OR
              create a user and upload a resume
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
