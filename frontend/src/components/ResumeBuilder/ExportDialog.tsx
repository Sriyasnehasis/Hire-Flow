"use client";

import { useState } from "react";

interface ExportDialogProps {
  resumeId: number;
  resumeTitle?: string;
  onClose?: () => void;
}

export default function ExportDialog({
  resumeId,
  resumeTitle = "Resume",
  onClose,
}: ExportDialogProps) {
  const [exporting, setExporting] = useState<"docx" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: "docx" | "pdf") => {
    setExporting(format);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setExporting(null);
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/resumes/${resumeId}/export/${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to export as ${format.toUpperCase()}`,
        );
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeTitle}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      alert(`Resume exported as ${format.toUpperCase()} successfully!`);
    } catch (err: any) {
      setError(err.message || `Failed to export as ${format.toUpperCase()}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Export Resume</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-6">Download your resume as:</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* DOCX Option */}
          <button
            onClick={() => handleExport("docx")}
            disabled={exporting !== null}
            className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">📄</div>
              <div className="text-left">
                <div className="font-semibold text-white">
                  {exporting === "docx" ? "Exporting..." : "Download as Word"}
                </div>
                <div className="text-sm text-gray-400">.docx format</div>
              </div>
            </div>
          </button>

          {/* PDF Option */}
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="w-full p-4 border-2 border-red-500 rounded-lg hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors opacity-50 cursor-not-allowed"
            title="PDF export coming soon"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">📕</div>
              <div className="text-left">
                <div className="font-semibold text-white">Download as PDF</div>
                <div className="text-sm text-gray-400">Coming soon</div>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-600">
          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Tip: You can also print to PDF using your browser&apos;s print function
        </p>
      </div>
    </div>
  );
}
