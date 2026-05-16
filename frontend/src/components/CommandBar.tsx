"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Briefcase, FileText, LayoutDashboard, Mic, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const actions = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "AI Resume Builder", icon: FileText, href: "/resume" },
    { label: "Job Search", icon: Briefcase, href: "/jobs" },
    { label: "Interview Coach", icon: Mic, href: "/interviews" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] bg-bg/80 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center px-4 py-4 border-b border-border">
            <Search className="text-text-muted mr-3" size={18} />
            <input
              autoFocus
              placeholder="What do you need?"
              className="flex-1 bg-transparent border-none outline-none text-text text-base placeholder:text-text-muted"
            />
            <div className="flex items-center gap-1 px-2 py-1 bg-bg-raised border border-border rounded-md">
              <span className="text-[10px] font-bold text-text-muted">ESC</span>
            </div>
          </div>
          
          <div className="p-2">
            <p className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Suggestions</p>
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  router.push(action.href);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent/5 text-text hover:text-accent transition-all group"
              >
                <action.icon size={18} className="text-text-muted group-hover:text-accent" />
                <span className="text-sm font-medium">{action.label}</span>
                <Command className="ml-auto opacity-0 group-hover:opacity-20" size={14} />
              </button>
            ))}
          </div>
        </motion.div>
        <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
      </div>
    </AnimatePresence>
  );
}
