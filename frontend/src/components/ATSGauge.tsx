"use client";

import { motion } from "framer-motion";

export function ATSGauge({ score, size = 160 }: { score: number, size?: number }) {
  const radius = (size / 2) - 10;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference / 2;
  const offset = arcLength - (score / 100) * arcLength;

  const getColor = (s: number) => {
    if (s < 50) return "#EF4444"; // red
    if (s < 80) return "#F59E0B"; // amber
    return "#1A5C4B"; // sage accent (green)
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size / 1.5 }}>
      <svg width={size} height={size / 2 + 10} className="transform -rotate-0">
        {/* Background Arc */}
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <motion.path
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arcLength}
        />
      </svg>
      <div className="absolute top-[40%] flex flex-col items-center">
        <span className="text-3xl font-display font-black leading-none">{score}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">ATS Score</span>
      </div>
    </div>
  );
}
