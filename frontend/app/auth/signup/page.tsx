"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  Lock,
  User,
  Github,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1")
    ? rawApiUrl
    : `${rawApiUrl}/api/v1`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to create account.");
      }

      const data = await response.json();
      const token = data.access_token as string;
      setToken(token);

      const meResponse = await fetch(`${apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meResponse.ok) {
        const me = await meResponse.json();
        setUser(me);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-purple w-[500px] h-[500px] top-[-150px] right-[-100px] animate-pulse-glow" />
      <div
        className="orb orb-cyan w-[400px] h-[400px] bottom-[-100px] left-[-100px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/hireflow-logo.png"
            alt="HireFlow"
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-2xl font-bold text-white">
            Hire<span className="text-gradient">Flow</span>
          </span>
        </Link>

        <div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-8">
            Join the elite <br />
            hiring <span className="text-gradient italic">standard</span>.
          </h2>
          <div className="space-y-4">
            {[
              "Unlimited AI Resume generations",
              "Advanced voice analysis for interviews",
              "Personalized career gap analytics",
              "Direct access to real job boards",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 size={16} className="text-indigo-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card-strong p-4 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 border-2 border-slate-900"
              />
            ))}
          </div>
          <p className="text-sm text-slate-300 font-medium">
            Join 50k+ applicants today
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/hireflow-logo.png"
                alt="HireFlow"
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-2xl font-bold text-white">
                Hire<span className="text-gradient">Flow</span>
              </span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Create your account
          </h1>
          <p className="text-slate-400 mb-8">
            Begin your premium placement journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="Sriya Snehasis"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirm
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient !py-4 text-lg justify-center disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}{" "}
              <ArrowRight size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Or
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`${apiBase}/auth/github/login`}
                className="glass-card flex items-center justify-center gap-2 py-3 font-semibold text-slate-300 text-sm hover:text-white"
              >
                <Github size={18} /> GitHub
              </a>
              <button
                type="button"
                disabled
                className="glass-card flex items-center justify-center gap-2 py-3 font-semibold text-slate-500 text-sm opacity-60 cursor-not-allowed"
                title="Google OAuth coming soon"
              >
                Google
              </button>
            </div>

            <button
              type="button"
              disabled
              className="w-full glass-card py-3 font-semibold text-slate-500 text-sm opacity-60 cursor-not-allowed"
              title="LinkedIn OAuth coming soon"
            >
              LinkedIn
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Already a member?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-400 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
