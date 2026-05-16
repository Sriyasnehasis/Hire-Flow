"use client";

import { motion } from "framer-motion";
import { FileText, Download, MoreVertical, Sparkles } from "lucide-react";

export function ResumeCard({ resume, onSelect }: { resume: any, onSelect: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      className="glass-card p-6 flex items-center gap-6 group cursor-pointer border-transparent hover:border-accent/30"
      onClick={onSelect}
    >
      <div className="w-14 h-14 bg-accent-soft rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform relative">
         <FileText size={24} />
         {resume.ats_score > 80 && (
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-bg-surface rounded-full flex items-center justify-center border-2 border-bg-surface">
              <Sparkles size={10} />
           </div>
         )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-text truncate uppercase tracking-tight">{resume.original_filename}</h4>
        <div className="flex items-center gap-3 mt-1.5">
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {new Date(resume.uploaded_at).toLocaleDateString()}
           </span>
           <span className="w-1 h-1 rounded-full bg-border" />
           <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
              ATS: {resume.ats_score}%
           </span>
        </div>
      </div>

      {/* Vitals Tooltip (Simplified for now, visible on group hover) */}
      <div className="hidden md:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-bg-raised rounded-lg text-text-muted hover:text-accent transition-colors">
               <Download size={16} />
            </button>
            <button className="p-2 hover:bg-bg-raised rounded-lg text-text-muted hover:text-accent transition-colors">
               <MoreVertical size={16} />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
