"use client";

interface SkillsAnalysisProps {
  matched: string[];
  missing: string[];
}

export default function SkillsAnalysis({
  matched,
  missing,
}: SkillsAnalysisProps) {
  const totalSkills = matched.length + missing.length;
  const matchPercentage =
    totalSkills > 0 ? Math.round((matched.length / totalSkills) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Matched Skills */}
      <div className="bg-slate-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-green-400">✓</span> Matched Skills
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {matched.length} skill{matched.length !== 1 ? "s" : ""} found in
            your resume
          </p>
        </div>

        {matched.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matched.map((skill, index) => (
              <div
                key={index}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 py-4">No matched skills found</p>
        )}
      </div>

      {/* Missing Skills */}
      <div className="bg-slate-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-orange-400">⚠</span> Missing Skills
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {missing.length} skill{missing.length !== 1 ? "s" : ""} to consider
            adding
          </p>
        </div>

        {missing.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missing.map((skill, index) => (
              <div
                key={index}
                className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 py-4">All skills covered!</p>
        )}
      </div>

      {/* Match Overview */}
      <div className="md:col-span-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Skill Match Overview
        </h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">Match Rate</span>
            <span className="font-bold text-white">{matchPercentage}%</span>
          </div>
          <div className="w-full bg-slate-500 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${
                matchPercentage >= 80
                  ? "bg-green-500"
                  : matchPercentage >= 60
                    ? "bg-yellow-500"
                    : "bg-orange-500"
              }`}
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {matched.length}
            </div>
            <div className="text-sm text-gray-400">Matched</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {missing.length}
            </div>
            <div className="text-sm text-gray-400">Missing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalSkills}
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-4 p-3 bg-slate-800 rounded border-l-4 border-blue-500">
          {matchPercentage >= 80 ? (
            <p className="text-sm text-gray-300">
              💡 Great job! You have excellent skill coverage. Consider adding
              any missing skills if relevant to your experience.
            </p>
          ) : matchPercentage >= 60 ? (
            <p className="text-sm text-gray-300">
              💡 Good coverage! Try to add a few more skills to improve your
              match rate and relevance.
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              💡 You could improve by adding more relevant skills to your
              resume. Focus on skills that match your experience.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
