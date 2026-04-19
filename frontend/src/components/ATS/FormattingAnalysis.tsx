"use client";

interface FormattingAnalysisProps {
  issues: string[];
  suggestions: string[];
}

export default function FormattingAnalysis({
  issues,
  suggestions,
}: FormattingAnalysisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formatting Issues */}
      {issues.length > 0 && (
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-red-400">✗</span> Formatting Issues
          </h3>

          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div
                key={index}
                className="flex gap-3 items-start p-3 bg-red-500/10 border border-red-500/30 rounded"
              >
                <span className="text-red-400 font-bold flex-shrink-0">•</span>
                <span className="text-gray-200 text-sm">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-blue-400">💡</span> Suggestions
          </h3>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex gap-3 items-start p-3 bg-blue-500/10 border border-blue-500/30 rounded"
              >
                <span className="text-blue-400 font-bold flex-shrink-0">→</span>
                <span className="text-gray-200 text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Practices */}
      <div className="md:col-span-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          ATS Best Practices
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "✓ Use Standard Fonts",
              description:
                "Use common fonts like Arial, Calibri, or Times New Roman",
            },
            {
              title: "✓ Clear Structure",
              description:
                "Use standard sections: Experience, Education, Skills",
            },
            {
              title: "✓ Avoid Graphics",
              description:
                "ATS systems cannot parse images, charts, or graphics",
            },
            {
              title: "✓ Use Keywords",
              description:
                "Include industry-specific keywords from job descriptions",
            },
            {
              title: "✓ Simple Formatting",
              description: "Avoid tables, columns, and complex formatting",
            },
            {
              title: "✓ Standard File Format",
              description: "Use PDF or Word format (.pdf, .docx)",
            },
          ].map((practice, index) => (
            <div
              key={index}
              className="p-3 bg-slate-800 rounded border-l-4 border-green-500"
            >
              <p className="font-semibold text-green-400 text-sm mb-1">
                {practice.title}
              </p>
              <p className="text-gray-400 text-xs">{practice.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
