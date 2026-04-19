"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ExportDialog from "./ExportDialog";

interface ResumeEditorProps {
  resumeId: number;
  onSave?: () => void;
}

interface Resume {
  id: number;
  title: string;
  template?: string;
  summary?: string;
  skills: string[];
  education: any[];
  experience: any[];
  projects: any[];
  certifications: any[];
  version_number: number;
  parsed_skills?: string;
  parsed_education?: string;
  parsed_experience?: string;
  parsed_projects?: string;
  parsed_certifications?: string;
}

export default function ResumeEditor({ resumeId, onSave }: ResumeEditorProps) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "basic" | "skills" | "education" | "experience" | "projects"
  >("basic");

  // New item forms
  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    field_of_study: "",
  });
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    description: "",
  });

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/v1/resumes/${resumeId}/preview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to load resume");
      const data = await response.json();

      // Parse JSON fields from backend
      const resume = {
        ...data,
        skills: data.parsed_skills
          ? JSON.parse(data.parsed_skills)
          : data.skills || [],
        education: data.parsed_education
          ? JSON.parse(data.parsed_education)
          : data.education || [],
        experience: data.parsed_experience
          ? JSON.parse(data.parsed_experience)
          : data.experience || [],
        projects: data.parsed_projects
          ? JSON.parse(data.parsed_projects)
          : data.projects || [],
        certifications: data.parsed_certifications
          ? JSON.parse(data.parsed_certifications)
          : data.certifications || [],
        version_number: data.version_number || data.version || 1,
        template: data.template || "modern",
      };

      setResume(resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resume) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/v1/resumes/${resumeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: resume.title,
            summary: resume.summary,
            skills: resume.skills,
            education: resume.education,
            experience: resume.experience,
            projects: resume.projects,
            certifications: resume.certifications,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to save resume");
      const data = await response.json();

      alert("Resume saved successfully!");
      if (onSave) onSave();
    } catch (err: any) {
      setError(err.message);
      alert("Error saving resume: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Skill handlers
  const handleAddSkill = () => {
    if (newSkill.trim() && resume) {
      setResume((prev) =>
        prev ? { ...prev, skills: [...prev.skills, newSkill.trim()] } : null,
      );
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    if (resume) {
      setResume((prev) =>
        prev
          ? { ...prev, skills: prev.skills.filter((_, i) => i !== index) }
          : null,
      );
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    if (newEducation.school && newEducation.degree && resume) {
      setResume((prev) =>
        prev
          ? {
              ...prev,
              education: [...prev.education, newEducation],
            }
          : null,
      );
      setNewEducation({
        school: "",
        degree: "",
        field_of_study: "",
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    if (resume) {
      setResume((prev) =>
        prev
          ? {
              ...prev,
              education: prev.education.filter((_, i) => i !== index),
            }
          : null,
      );
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position && resume) {
      setResume((prev) =>
        prev
          ? {
              ...prev,
              experience: [...prev.experience, newExperience],
            }
          : null,
      );
      setNewExperience({
        company: "",
        position: "",
        description: "",
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    if (resume) {
      setResume((prev) =>
        prev
          ? {
              ...prev,
              experience: prev.experience.filter((_, i) => i !== index),
            }
          : null,
      );
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading resume...</div>;
  }

  if (error || !resume) {
    return (
      <div className="text-center text-red-400">
        {error || "Resume not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <input
            type="text"
            value={resume.title}
            onChange={(e) =>
              setResume((prev) =>
                prev ? { ...prev, title: e.target.value } : null,
              )
            }
            className="text-3xl font-bold text-white bg-transparent border-b-2 border-transparent hover:border-blue-500 focus:border-blue-500 outline-none px-2 py-1"
          />
          <p className="text-gray-400 text-sm mt-1">
            Template: {resume.template} • v{resume.version_number}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-600">
        {["basic", "skills", "education", "experience", "projects"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as
                    | "basic"
                    | "skills"
                    | "education"
                    | "experience"
                    | "projects",
                )
              }
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Content */}
      <div className="bg-slate-700 rounded-lg p-6">
        {/* Basic Info */}
        {activeTab === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professional Summary
              </label>
              <textarea
                value={resume.summary}
                onChange={(e) =>
                  setResume((prev) =>
                    prev ? { ...prev, summary: e.target.value } : null,
                  )
                }
                rows={4}
                className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                placeholder="Add a skill..."
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleAddSkill}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <input
                type="text"
                value={newEducation.school}
                onChange={(e) =>
                  setNewEducation((prev) => ({
                    ...prev,
                    school: e.target.value,
                  }))
                }
                placeholder="School/University"
                className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
              />
              <input
                type="text"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation((prev) => ({
                    ...prev,
                    degree: e.target.value,
                  }))
                }
                placeholder="Degree"
                className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
              />
              <button
                onClick={handleAddEducation}
                className="bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Add
              </button>
            </div>

            {resume.education.map((edu, index) => (
              <div
                key={index}
                className="bg-slate-600 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">{edu.degree}</p>
                  <p className="text-sm text-gray-300">{edu.school}</p>
                </div>
                <button
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Company"
                className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
              />
              <input
                type="text"
                value={newExperience.position}
                onChange={(e) =>
                  setNewExperience((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                placeholder="Position"
                className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
              />
              <button
                onClick={handleAddExperience}
                className="bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Add
              </button>
            </div>

            {resume.experience.map((exp, index) => (
              <div
                key={index}
                className="bg-slate-600 p-4 rounded flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-white">{exp.position}</p>
                  <p className="text-sm text-gray-300">{exp.company}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-400 mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {resume.projects.length === 0 ? (
              <p className="text-gray-400">No projects yet</p>
            ) : (
              resume.projects.map((project, index) => (
                <div key={index} className="bg-slate-600 p-4 rounded">
                  <p className="font-semibold text-white">{project.title}</p>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Back
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Export
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Export Dialog */}
      {showExport && resume && (
        <ExportDialog
          resumeId={resume.id}
          resumeTitle={resume.title}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
