"use client";

import { useState } from "react";
import { useRouter } from "next/router";

interface ResumeBuilderFormProps {
  selectedTemplate: string;
  onSuccess?: (resumeId: number) => void;
}

export default function ResumeBuilderForm({
  selectedTemplate,
  onSuccess,
}: ResumeBuilderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIGenerate = async () => {
    if (!formData.title) {
      setError("Please enter a Target Job in the Resume Title field to generate content");
      return;
    }
    
    setError(null);
    setGeneratingAI(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/resumes/generate-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_job: formData.title,
          template_style: selectedTemplate
        }),
      });

      if (!res.ok) throw new Error("Failed to generate AI content");
      
      const data = await res.json();
      
      setFormData(prev => ({
        ...prev,
        summary: data.professional_summary || prev.summary,
        skills: [...new Set([...prev.skills, ...(data.enhanced_skills || []), ...(data.ats_keywords || [])])],
        experience: data.experience_bullets?.map((exp: any) => ({
             company: exp.company,
             position: exp.title,
             start_date: "",
             end_date: "",
             is_current: false,
             description: exp.bullets?.join("\n") || ""
        })) || prev.experience
      }));
      
    } catch (err: any) {
      setError(err.message || "Error generating AI content");
    } finally {
      setGeneratingAI(false);
    }
  };

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    skills: [] as string[],
    education: [] as any[],
    experience: [] as any[],
    projects: [] as any[],
    certifications: [] as any[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [currentEducation, setCurrentEducation] = useState({
    school: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
  });

  const [currentExperience, setCurrentExperience] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  // Handle title and summary
  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle skill addition
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Handle education
  const handleAddEducation = () => {
    if (
      currentEducation.school &&
      currentEducation.degree &&
      currentEducation.field_of_study
    ) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, currentEducation],
      }));
      setCurrentEducation({
        school: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Handle experience
  const handleAddExperience = () => {
    if (currentExperience.company && currentExperience.position) {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, currentExperience],
      }));
      setCurrentExperience({
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Submit resume
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title) {
        setError("Please enter a resume title");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const payload = {
        template: selectedTemplate,
        ...formData,
      };

      const response = await fetch(
        "http://localhost:8000/api/v1/resumes/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create resume");
      }

      const data = await response.json();
      console.log("Resume created:", data);

      if (onSuccess) {
        onSuccess(data.resume_id);
      } else {
        router.push(`/resume?id=${data.resume_id}`);
      }
    } catch (err: any) {
      setError(err.message || "Error creating resume");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-slate-700 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Job Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleBasicChange}
            placeholder="e.g., Full Stack Developer Resume"
            className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Professional Summary
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleBasicChange}
            placeholder="Brief overview of your professional background..."
            rows={3}
            className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={generatingAI || !formData.title}
          className="w-full mt-4 btn-secondary bg-brand-500/20 text-brand-300 border-brand-500/30 hover:bg-brand-500/30 hover:border-brand-500/50 disabled:opacity-50 !py-3 flex items-center justify-center gap-2"
        >
          {generatingAI ? "✨ Generating using Gemini AI..." : "✨ Auto-Fill Content with Gemini AI"}
        </button>
      </div>

      {/* Skills */}
      <div className="bg-slate-700 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Skills</h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Add a skill..."
            className="flex-1 bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-slate-700 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Education</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={currentEducation.school}
            onChange={(e) =>
              setCurrentEducation((prev) => ({
                ...prev,
                school: e.target.value,
              }))
            }
            placeholder="School/University"
            className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          />
          <input
            type="text"
            value={currentEducation.degree}
            onChange={(e) =>
              setCurrentEducation((prev) => ({
                ...prev,
                degree: e.target.value,
              }))
            }
            placeholder="Degree"
            className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          />
          <input
            type="text"
            value={currentEducation.field_of_study}
            onChange={(e) =>
              setCurrentEducation((prev) => ({
                ...prev,
                field_of_study: e.target.value,
              }))
            }
            placeholder="Field of Study"
            className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          />
          <button
            type="button"
            onClick={handleAddEducation}
            className="bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Add Education
          </button>
        </div>

        <div className="space-y-2">
          {formData.education.map((edu, index) => (
            <div
              key={index}
              className="bg-slate-600 p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-white">{edu.degree}</p>
                <p className="text-sm text-gray-300">{edu.school}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="bg-slate-700 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Experience</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={currentExperience.company}
            onChange={(e) =>
              setCurrentExperience((prev) => ({
                ...prev,
                company: e.target.value,
              }))
            }
            placeholder="Company"
            className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          />
          <input
            type="text"
            value={currentExperience.position}
            onChange={(e) =>
              setCurrentExperience((prev) => ({
                ...prev,
                position: e.target.value,
              }))
            }
            placeholder="Position"
            className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          />
          <textarea
            value={currentExperience.description}
            onChange={(e) =>
              setCurrentExperience((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Job description"
            rows={2}
            className="col-span-2 bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          />
          <button
            type="button"
            onClick={handleAddExperience}
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white rounded py-2"
          >
            Add Experience
          </button>
        </div>

        <div className="space-y-2">
          {formData.experience.map((exp, index) => (
            <div
              key={index}
              className="bg-slate-600 p-4 rounded flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-white">{exp.position}</p>
                <p className="text-sm text-gray-300">{exp.company}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Resume"}
        </button>
      </div>
    </form>
  );
}
