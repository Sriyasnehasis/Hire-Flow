"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const logs = [
  "Initializing Career Assistant...",
  "Loading Profile Builder...",
  "Verifying Audio Setup...",
  "Connecting to Job Feeds...",
  "Accessing Recommendations...",
  "Connection Established.",
  "Ready for Analysis."
];

export const TerminalLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [currentLog, setCurrentLog] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (currentLog < logs.length) {
      const timeout = setTimeout(() => {
        setCurrentLog(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete, 800);
    }
  }, [currentLog, onComplete]);

  // Prevent hydration mismatch by not rendering time on server
  const getTimeString = () => {
    if (!mounted) return "00:00:00";
    return new Date().toLocaleTimeString();
  };

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-10 font-mono"
    >
      <div className="max-w-md w-full">
        <div className="flex gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-cyan-500/20 shadow-[0_0_10px_rgba(0,229,255,0.2)]" />
          <div className="w-3 h-3 rounded-full bg-[#FF5C1A]/20 shadow-[0_0_10px_rgba(255,92,26,0.2)]" />
          <div className="w-3 h-3 rounded-full bg-blue-500/20 shadow-[0_0_10px_rgba(0,153,204,0.2)]" />
        </div>
        <div className="space-y-1">
          {logs.slice(0, currentLog + 1).map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-[10px] ${i === logs.length - 1 ? 'text-[#00E5FF] font-black' : 'text-white/20'}`}
            >
              <span className="text-white/5 mr-2">[{getTimeString()}]</span>
              {log}
            </motion.div>
          ))}
          {currentLog < logs.length && (
            <motion.div 
              animate={{ opacity: [0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-1.5 h-3 bg-[#00E5FF] inline-block align-middle ml-1" 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface LiveTickerProps {
  data?: string[];
}

export const LiveTicker = ({ data }: LiveTickerProps) => {
    const defaultFeed = [
        "Tip: Highlight key metrics and results in your work experience.",
        "Tip: Tailor your resume summary to match the job description.",
        "Tip: Practice interview questions under simulated timing constraints.",
        "Tip: Include technical skills and soft skills in separate sections.",
        "Tip: Use the STAR method to structure your behavioral answers.",
        "Tip: Follow up with recruiters 3-5 days after applying.",
        "Tip: Keep your resume to one page if under 5 years of experience."
    ];

    const feed = data || defaultFeed;

    return (
        <div className="w-full bg-black/40 backdrop-blur-3xl border-y border-white/5 py-3.5 overflow-hidden whitespace-nowrap">
            <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="inline-block"
            >
                {[...feed, ...feed].map((item, i) => (
                    <span key={i} className="mx-14 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-[#00E5FF] transition-colors cursor-default">
                        <span className="text-[#00E5FF] mr-3 animate-pulse shadow-[0_0_10px_#00E5FF]">●</span> {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};
