"use client";

interface ATSScorecardProps {
  score: number;
}

export default function ATSScorecard({ score }: ATSScorecardProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-green-600 to-green-500";
    if (score >= 70) return "from-yellow-600 to-yellow-500";
    if (score >= 50) return "from-orange-600 to-orange-500";
    return "from-red-600 to-red-500";
  };

  // Determine status text
  const getScoreStatus = (score: number) => {
    if (score >= 85)
      return { text: "Excellent", subtext: "Highly optimized for ATS" };
    if (score >= 70) return { text: "Good", subtext: "Well-formatted for ATS" };
    if (score >= 50) return { text: "Fair", subtext: "Needs optimization" };
    return { text: "Poor", subtext: "Significant ATS issues" };
  };

  const status = getScoreStatus(score);

  return (
    <div
      className={`bg-gradient-to-br ${getScoreColor(score)} rounded-2xl p-1`}
    >
      <div className="bg-slate-800 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          {/* Score Circle */}
          <div className="flex-1">
            <div className="relative w-40 h-40 mx-auto">
              {/* Background circle */}
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={
                    score >= 85
                      ? "#22c55e"
                      : score >= 70
                        ? "#eab308"
                        : score >= 50
                          ? "#f97316"
                          : "#ef4444"
                  }
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 565.48} 565.48`}
                  strokeLinecap="round"
                />
              </svg>
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-white">{score}</div>
                <div className="text-gray-400 text-sm">out of 100</div>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="flex-1 pl-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {status.text}
            </h3>
            <p className="text-gray-400 mb-6">{status.subtext}</p>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    score >= 70 ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300 text-sm">
                  {score >= 70 ? "Format compliant" : "Format needs work"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    score >= 80 ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300 text-sm">
                  {score >= 80
                    ? "Skills well-matched"
                    : "Skills could be enhanced"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    score >= 85 ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300 text-sm">
                  {score >= 85 ? "ATS optimized" : "ATS optimization needed"}
                </span>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-6 p-3 bg-slate-700 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-300">
                {score >= 85
                  ? "✓ Your resume is well-optimized for ATS systems"
                  : score >= 70
                    ? "→ Consider the suggestions below to improve your score"
                    : "⚠ Follow the recommendations to improve ATS compatibility"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
