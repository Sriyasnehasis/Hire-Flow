"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Mic, Briefcase, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function FloatingActionRing() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const actions = [
    { label: "Resume", icon: FileText, href: "/resume", color: "bg-blue-500" },
    { label: "Interview", icon: Mic, href: "/interviews", color: "bg-green-500" },
    { label: "Jobs", icon: Briefcase, href: "/jobs", color: "bg-amber-500" },
    { label: "Analysis", icon: Sparkles, href: "/skill-gap", color: "bg-purple-500" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[150]">
      <AnimatePresence>
        {open && (
          <>
            {actions.map((action, i) => {
              const angle = (i * (360 / actions.length)) * (Math.PI / 180);
              const radius = 80;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x: -x, y: -y }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25, delay: i * 0.05 }}
                  onClick={() => {
                    router.push(action.href);
                    setOpen(false);
                  }}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${action.color} hover:scale-110 transition-transform group`}
                >
                  <action.icon size={20} />
                  <span className="absolute right-14 bg-bg-surface border border-border px-2 py-1 rounded text-[10px] font-bold text-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          open ? "bg-text text-bg-surface rotate-45" : "bg-accent text-bg-surface"
        }`}
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
