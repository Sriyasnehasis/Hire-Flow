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
  User,
  Settings,
  Zap,
  Command as CommandIcon,
  Bell
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { CommandBar } from "@/components/CommandBar";
import { FloatingActionRing } from "@/components/FloatingActionRing";

const navSections = [
  {
    title: "Core Ecosystem",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/resume", label: "Resume Builder", icon: FileText, badge: "NEW" },
      { href: "/interviews", label: "Mock Interview", icon: Mic },
      { href: "/jobs", label: "Job Board", icon: Briefcase },
    ],
  },
  {
    title: "Optimization",
    items: [
      { href: "/skill-gap", label: "Skill Gap", icon: Sparkles },
      { href: "/hr-contacts", label: "HR Discovery", icon: Users },
    ],
  },
];

export default function DashboardLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("Professional");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const parsed = JSON.parse(raw);
      const name = parsed?.full_name?.split(" ")[0] || "Professional";
      setUserName(name);
      document.title = title ? `HireFlow | ${title}` : `HireFlow | Welcome, ${name}`;
    }
  }, [title]);

  const isActive = (href: string) => pathname === href;

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-bg border-r border-border">
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-bg font-black italic">H</div>
          <span className="text-xl font-display font-black tracking-tight text-text">
            Hire<span className="text-accent">Flow</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-8 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/60">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                      ${active 
                        ? 'bg-accent-soft text-accent font-bold' 
                        : 'text-text-muted hover:bg-bg-raised hover:text-text'}`}
                  >
                    <item.icon size={18} className={active ? "text-accent" : "text-text-muted group-hover:text-text"} />
                    <span className="text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[8px] font-black bg-accent text-bg px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Career Progress Mini Widget */}
      <div className="p-6 mt-auto">
         <div className="p-4 bg-bg-raised rounded-2xl border border-border">
            <div className="flex justify-between items-end mb-2">
               <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Career Health</span>
               <span className="text-[10px] font-bold text-accent">82%</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '82%' }}
                 className="h-full bg-accent"
               />
            </div>
         </div>
      </div>

      <div className="p-6 border-t border-border">
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/auth/login");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold"
        >
          <LogOut size={16} />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg text-text font-body">
      <CommandBar />
      <FloatingActionRing />
      
      <div className="hidden lg:block w-72 h-full shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-bg-surface border-b border-border z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 hover:bg-bg-raised rounded-lg"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-raised border border-border rounded-full text-[10px] font-bold text-text-muted">
                 <CommandIcon size={12} />
                 <span>Press <kbd className="text-text font-mono">⌘K</kbd> to search</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <ThemeSwitcher />
              <button className="p-2 text-text-muted hover:text-text transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-bg-surface" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-border">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-text-muted">Node_Verified</p>
                    <p className="text-xs font-bold">{userName}</p>
                 </div>
                 <Link href="/profile" className="w-10 h-10 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center text-accent font-black">
                    {userName.charAt(0).toUpperCase()}
                 </Link>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden bg-bg/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-72 h-full bg-bg shadow-2xl relative"
            >
              <Sidebar />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-8 -right-12 p-2 text-bg bg-text rounded-full"
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
