"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  TrendingUp,
  Briefcase,
  Mic,
  Users,
  LogOut,
  Menu,
  X,
  Zap,
  User,
  Settings,
  CreditCard,
  ChevronDown
} from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";

const navSections = [
  {
    title: "Intelligence",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/resume", label: "AI Resume", icon: Sparkles, badge: "NEW" },
      { href: "/cover-letter", label: "Letter Lab", icon: FileText },
      { href: "/interviews", label: "Voice Coach", icon: Mic, badge: "LIVE" },
    ],
  },
  {
    title: "Optimization",
    items: [{ href: "/skills", label: "Career Map", icon: TrendingUp }],
  },
  {
    title: "Networking",
    items: [
      { href: "/jobs", label: "Job Board", icon: Briefcase },
      { href: "/hr-contacts", label: "HR Direct", icon: Users },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const name = parsed?.full_name || parsed?.name || "User";
        setUserName(name);
        setUserEmail(parsed?.email || "candidate@hireflow.ai");
        document.title = title ? `HireFlow | ${title}` : `HireFlow | Welcome, ${name.split(' ')[0]}`;
      }
    } catch {}
  }, [title]);

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black border-r border-white/5">
      <div className="p-8 pb-10">
        <Link href="/" className="group flex items-center justify-center">
          <SiteLogo className="w-12 h-12" animated={true} />
        </Link>
      </div>

      <nav className="flex-1 px-5 space-y-12 overflow-y-auto hide-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="px-4 text-[7px] font-black uppercase tracking-[0.5em] text-white/20 pt-6"
            >
              {section.title}
            </motion.p>
            <div className="space-y-1">
              {section.items.map((item, iIdx) => {
                const ActiveIcon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sIdx * 0.1) + (iIdx * 0.05) }}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-300 group border-l-2
                      ${active 
                        ? 'bg-white/[0.03] text-white border-[#00E5FF]' 
                        : 'text-white/20 hover:text-white hover:bg-white/[0.01] border-transparent hover:border-[#00E5FF]/40'}`}
                  >
                    <div className={`transition-all duration-300 ${active ? 'text-[#00E5FF]' : 'group-hover:text-white'}`}>
                      <ActiveIcon size={15} strokeWidth={active ? 2.5 : 1.5} />
                    </div>
                    <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto ${item.badge === 'LIVE' ? 'badge-live animate-pulse' : 'badge-new'}`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/auth/login");
          }}
          className="flex items-center justify-center gap-3 w-full p-3 rounded-lg text-white/30 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-white/5 hover:border-white/20"
        >
          <LogOut size={14} />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-xs selection:bg-cyan-500/30">
      <div className="hidden lg:block w-64 h-full shrink-0">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Subtle Background Differentiation for Content Area */}
        <div className="absolute inset-0 bg-[#050505] -z-10" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Global Toolbar */}
        <header className="h-16 flex items-center justify-between px-8 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
           <div className="hidden lg:block text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
               HireFlow Professional Console // <span className="text-white/40">v2.0.4</span>
           </div>
           
           <div className="lg:hidden">
              <button onClick={() => setMobileOpen(true)} className="text-white">
                <Menu size={20} />
              </button>
           </div>

           <div className="flex items-center gap-6">
               <button className="hidden md:flex px-5 py-1.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                  Quick Actions <Zap size={10} className="ml-2 text-[#00B8D4]" />
               </button>
               <div className="relative">
                 <button 
                   onClick={() => setProfileOpen(!profileOpen)}
                   className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center text-white font-black text-[10px] hover:border-[#00E5FF]/40 transition-all shadow-2xl relative group"
                 >
                    {userName.charAt(0).toUpperCase()}
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#00FFB3] border-2 border-black rounded-full" />
                 </button>

                 <AnimatePresence>
                   {profileOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 mt-4 w-72 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
                     >
                       <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-cyan-800 flex items-center justify-center text-black font-black text-xl">
                               {userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <p className="text-xs font-black text-white uppercase tracking-tight">{userName}</p>
                               <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter truncate max-w-[140px]">{userEmail}</p>
                            </div>
                         </div>
                         <div className="px-3 py-1 rounded-full bg-[#00FFB3]/10 border border-[#00FFB3]/20 inline-flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#00FFB3] animate-pulse" />
                            <span className="text-[8px] font-black text-[#00FFB3] uppercase tracking-widest">Node_Verified</span>
                         </div>
                       </div>

                       <div className="p-2">
                         {[
                           { label: "Identity Profile", icon: User, href: "/profile" },
                           { label: "Infrastructure Settings", icon: Settings, href: "/settings" },
                           { label: "Subscription Mesh", icon: CreditCard, href: "/billing" },
                         ].map((item, idx) => (
                           <Link 
                             key={idx} 
                             href={item.href}
                             className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.05] text-white/40 hover:text-white transition-all group"
                           >
                             <item.icon size={14} className="group-hover:text-[#00E5FF]" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                           </Link>
                         ))}
                       </div>

                       <div className="p-2 border-t border-white/5">
                         <button 
                           onClick={() => {
                             localStorage.removeItem("token");
                             localStorage.removeItem("user");
                             window.location.href = "/auth/login";
                           }}
                           className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-all group"
                         >
                           <LogOut size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Disconnect Session</span>
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 hide-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-72 h-full bg-black relative"
            >
              <SidebarContent />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-8 right-[-50px] w-10 h-10 flex items-center justify-center bg-black/60 rounded-xl text-white"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
