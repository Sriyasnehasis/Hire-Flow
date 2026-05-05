"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuth();
  const [message, setMessage] = useState("Completing sign-in...");

  useEffect(() => {
    const run = async () => {
      const token = new URLSearchParams(window.location.search).get(
        "access_token",
      );
      if (!token) {
        setMessage("OAuth sign-in failed. Please try again.");
        return;
      }

      try {
        setToken(token);

        const rawApiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const apiBase = rawApiUrl.endsWith("/api/v1")
          ? rawApiUrl
          : `${rawApiUrl}/api/v1`;

        const meResponse = await fetch(`${apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (meResponse.ok) {
          const me = await meResponse.json();
          setUser(me);
        }

        router.replace("/dashboard");
      } catch {
        setMessage("Unable to complete sign-in. Please try again.");
      }
    };

    run();
  }, [router, setToken, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="glass-card p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">OAuth Sign-In</h1>
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
}
