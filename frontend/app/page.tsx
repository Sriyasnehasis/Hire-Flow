"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Mic, 
  Globe,
  Database,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";
import { ParticleEntity } from "@/components/ParticleEntity";
import { KineticText } from "@/components/KineticText";
import { LiveTicker } from "@/components/InteractiveElements";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AmbientGlow, TiltContainer, MagneticButton } from "@/components/AdvancedAnimations";

const CountUp = ({ value, suffix = "" }: { value: number | string, suffix?: string }) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const increment = numericValue / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= numericValue) {
                    setCount(numericValue);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, numericValue]);

    return <span ref={ref}>{Math.floor(count)}{suffix}</span>;
};

export default function Home() {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden font-sans selection:bg-cyan-500/30">
      
      {/* 🔮 High-Impact Visual: Ambient Cursor Glow */}
      <AmbientGlow />

      {/* 💠 Pillar 4 Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] mesh-bg" />
      <div className="opacity-[0.1]">
        <ParticleEntity />
      </div>

      {/* 🧭 Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 h-20 z-[100] flex items-center px-10 bg-black/50 backdrop-blur-3xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <Link href="/" className="group flex items-center gap-4">
            <SiteLogo className="w-11 h-11 relative z-10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 group-hover:text-white transition-all">HireFlow</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            {['Strategy', 'Data', 'Network', 'Practice'].map(item => (
              <a key={item} href="#" className="relative text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all cursor-pointer group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00B8D4] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          
          <Link href="/auth/login" className="px-6 py-2.5 bg-white text-black font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-white/90 transition-all border border-white/10 shadow-sm">
            Access Portal
          </Link>
        </div>
      </motion.nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.5
                }
              }
            }}
            className="text-center space-y-10 z-10 w-full max-w-5xl"
        >
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="text-slate-500 text-[9px] font-bold tracking-[0.4em] uppercase"
            >
                AI-Powered Career Companion for Job Seekers
            </motion.div>

            {/* 🏔️ High-Impact: 3D Tilt Headline Container */}
            <TiltContainer className="py-6">
              <motion.div 
                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                className="flex flex-col items-center gap-1 relative"
              >
                   <h1 className="text-huge flex flex-wrap justify-center gap-x-5">
                     <span className="text-white">PREPARE</span>
                     <span className="outline-text">WITH</span>
                   </h1>
                   <h1 className="text-huge flex flex-wrap justify-center gap-x-5">
                     <span className="text-white">REAL</span>
                     <span className="highlight-accent">
                        <KineticText text="CONFIDENCE." />
                     </span>
                   </h1>
                   <div className="absolute inset-x-0 -bottom-6 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              </motion.div>
            </TiltContainer>

            <div className="space-y-6">
                <motion.p 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-white/40 text-[13px] font-medium max-w-2xl mx-auto leading-relaxed normal-case"
                >
                    An all-in-one career platform designed to guide you through every step of your job hunt. Build ATS-optimized resumes, practice realistic mock interviews, and organize your applications seamlessly.
                </motion.p>
                
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-xl md:text-3xl font-bold text-white tracking-tight leading-snug"
                >
                    Prepare with guidance. <br />
                    <span className="text-[#00B8D4]">Apply with confidence.</span>
                </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 relative">
                {/* 🧲 High-Impact: Magnetic CTA Buttons */}
                <MagneticButton>
                  <Link href="/auth/signup" className="glow-button px-10 py-4 text-[10px] tracking-[0.2em]">
                      GET STARTED NOW →
                  </Link>
                </MagneticButton>
                
                <MagneticButton>
                  <Link href="/interviews" className="px-10 py-4 bg-white/[0.03] border border-white/10 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                      PRACTICE MOCK INTERVIEW
                  </Link>
                </MagneticButton>
            </div>

            {/* 📊 Animated Stats - Minimalist Pills */}
            <motion.div 
               variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
               className="flex flex-wrap items-center justify-center gap-3 py-16"
            >
                 {[
                   { label: "Avg ATS Match", val: "85", suffix: "%" },
                   { label: "Jobs Aggregated", val: "10", suffix: "K+" },
                   { label: "Confidence Boost", val: "95", suffix: "%" },
                   { label: "Mock Interviews", val: "500", suffix: "+" }
                 ].map((stat, i) => (
                    <motion.div 
                       key={i}
                       variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                       className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-3 hover:border-[#00B8D4]/30 transition-all cursor-default group"
                    >
                       <span className="text-[#00B8D4] text-[10px] font-bold group-hover:scale-110 transition-transform">
                           {stat.val === "∞" ? "∞" : <CountUp value={stat.val} suffix={stat.suffix} />}
                       </span>
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
                    </motion.div>
                 ))}
            </motion.div>
        </motion.div>

        <div className="mt-auto w-full pb-10">
             <LiveTicker data={[
                "Tip: Customize your resume summary for each individual job description to rank higher.",
                "Tip: Use strong action verbs in your bullet points (e.g. Led, Designed, Optimized).",
                "Tip: Quantify your results on your resume (e.g., 'Improved load times by 24%').",
                "Tip: Practice mock interviews under simulated constraints to boost your spoken confidence.",
                "Tip: Keep your resume to a clean 1-page layout if you have less than 5 years of experience."
             ]} />
        </div>
      </section>

      {/* 📦 Features */}
      <section className="py-52 px-8 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            { [
              { title: "AI Resume Builder", desc: "Build customized, ATS-friendly resumes using professional modern templates.", icon: ShieldCheck },
              { title: "Interview Coach", desc: "Practice technical and behavioral mock interviews with live transcription and real-time feedback.", icon: Mic },
              { title: "Outreach CRM", desc: "Track your job applications and auto-generate personalized email drafts for recruiters.", icon: Globe }
            ].map((feature, i) => (
                <SpotlightCard 
                   key={i}
                   className="p-12 group hover:border-[#00B8D4]/20 transition-all duration-500"
                 >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 text-white/40 group-hover:text-[#00B8D4] group-hover:bg-[#00B8D4]/10 group-hover:border-[#00B8D4]/20 transition-all shadow-sm">
                      <feature.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-5 text-white group-hover:text-[#00B8D4] transition-colors">{feature.title}</h3>
                    <p className="text-[14px] text-white/30 leading-relaxed font-medium group-hover:text-white/50 transition-colors">{feature.desc}</p>
                </SpotlightCard>
            ))}
        </div>
      </section>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="py-24 border-t border-white/10 bg-black/80 relative z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 px-10">
          <div className="flex items-center gap-6">
             <SiteLogo className="w-8 h-8" />
             <div className="text-[11px] font-bold tracking-widest text-white/20 uppercase">© 2026 HireFlow — Empowering Your Career Journey</div>
          </div>
          <div className="flex gap-20 text-[11px] font-bold tracking-widest text-white/20 uppercase">
            <a href="#" className="hover:text-white transition-colors relative group">
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00B8D4] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#" className="hover:text-white transition-colors relative group">
              Terms
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00B8D4] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
