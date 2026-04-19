"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Template {
  id: string;
  name: string;
  description: string;
  color_scheme: string;
  preview_url: string;
}

interface TemplateSelectionProps {
  onSelect: (templateId: string) => void;
  isLoading?: boolean;
}

export default function TemplateSelection({
  onSelect,
  isLoading = false,
}: TemplateSelectionProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/v1/resumes/templates",
      );
      const data = await response.json();
      setTemplates(data.templates);
    } catch (err) {
      setError("Failed to load templates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400">Loading templates...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Choose Your Resume Template
        </h2>
        <p className="text-gray-400">
          Select a template and start building your professional resume
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template.id)}
            className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-500 bg-opacity-10"
                : "border-slate-600 hover:border-slate-500 bg-slate-700"
            }`}
          >
            <div className="text-left">
              <h3 className="text-lg font-bold text-white mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full`}
                  style={{
                    backgroundColor:
                      template.color_scheme === "blue"
                        ? "#3b82f6"
                        : template.color_scheme === "gray"
                          ? "#9ca3af"
                          : template.color_scheme === "purple"
                            ? "#a855f7"
                            : "#000000",
                  }}
                ></div>
                <span className="text-xs text-gray-500">
                  {template.color_scheme}
                </span>
              </div>
            </div>
            {selectedTemplate === template.id && (
              <div className="mt-4 text-blue-400 font-semibold">✓ Selected</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
