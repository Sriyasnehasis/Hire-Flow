"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertTriangle, Github } from "lucide-react";
import { motion } from "framer-motion";

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Establishing connection with GitHub secure node...");

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBase = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;

  useEffect(() => {
    const code = searchParams.get("code");
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("error");
      setMessage("User authentication token not found. Please log in first.");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received from GitHub. Please try again.");
      return;
    }

    const exchangeCode = async () => {
      try {
        setStatus("loading");
        setMessage("Exchanging authorization credentials and syncing repository metadata...");

        const response = await fetch(`${apiBase}/github/auth/callback?code=${code}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(`Successfully linked GitHub account: @${data.github_username}! Syncing complete.`);
          
          // Redirect to profile page after 2 seconds
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Authentication handshake failed at server node.");
        }
      } catch (err) {
        console.error("GitHub callback exchange failed", err);
        setStatus("error");
        setMessage("Connection timeout while contacting HireFlow API gateway.");
      }
    };

    exchangeCode();
  }, [searchParams, router, apiBase]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans px-6 text-white overflow-hidden relative">
      {/* Visual Background Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] mesh-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-card p-12 max-w-md w-full text-center space-y-8 relative z-10 border border-white/5 bg-white/[0.01]"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-white relative">
              <Github size={36} className={status === "loading" ? "animate-pulse" : ""} />
            </div>
            
            {status === "loading" && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-xl flex items-center justify-center text-[#00E5FF]">
                <Loader2 className="animate-spin" size={14} />
              </div>
            )}

            {status === "success" && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-green-500/30 rounded-xl flex items-center justify-center text-green-400">
                <CheckCircle2 size={16} />
              </div>
            )}

            {status === "error" && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-red-500/30 rounded-xl flex items-center justify-center text-red-500">
                <AlertTriangle size={16} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            {status === "loading" ? "SECURE_CONNECTION_ESTABLISHING" : status === "success" ? "SYNC_TRAJECTORY_STABLE" : "CONNECTION_TERMINATED"}
          </h2>
          <p className="text-sm font-medium leading-relaxed text-white/70">
            {message}
          </p>
        </div>

        {status === "error" && (
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-4 border border-white/10 rounded-2xl bg-white/5 hover:bg-white hover:text-black font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
          >
            Return to Profile
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans px-6 text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] mesh-bg" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="glass-card p-12 max-w-md w-full text-center space-y-8 relative z-10 border border-white/5 bg-white/[0.01]">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-white relative">
              <Github size={36} className="animate-pulse" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-xl flex items-center justify-center text-[#00E5FF]">
                <Loader2 className="animate-spin" size={14} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              INITIALIZING_GITHUB_CALLBACK
            </h2>
            <p className="text-sm font-medium leading-relaxed text-white/70">
              Preparing callback handler...
            </p>
          </div>
        </div>
      </div>
    }>
      <GitHubCallbackContent />
    </Suspense>
  );
}
