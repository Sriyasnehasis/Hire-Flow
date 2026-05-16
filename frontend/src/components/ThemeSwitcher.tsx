"use client";

import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeSwitcher() {
  const { theme: currentTheme, setTheme } = useTheme();

  const themes = [
    { id: "sage", color: "#1A5C4B", label: "Sage" },
    { id: "midnight", color: "#4CAF88", label: "Midnight" },
    { id: "ember", color: "#C25A1A", label: "Ember" },
    { id: "blueprint", color: "#2856A0", label: "Blueprint" },
  ] as const;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-bg-raised border border-border">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          className="relative w-4 h-4 group"
        >
          <div
            className="w-full h-full rounded-full transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: t.color }}
          />
          {currentTheme === t.id && (
            <motion.div
              layoutId="theme-ring"
              className="absolute -inset-1 border border-text/20 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
