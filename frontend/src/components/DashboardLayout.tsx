"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Target,
  Briefcase,
  Mic,
  Mail,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Files,
  Shield
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Intelligence",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/resume", label: "AI Resume", icon: Sparkles, badge: "NEW" },
      { href: "/interviews", label: "Voice Coach", icon: Mic, badge: "LIVE" },
    ],
  },
  {
    title: "Optimization",
    items: [
      { href: "/skills", label: "Career Map", icon: TrendingUp },
    ],
  },
  {
    title: "Networking",
    items: [
      { href: "/jobs", label: "Job Board", icon: Briefcase },
      { href: "/hr-contacts", label: "HR Direct", icon: Users },
    ],
  },
];

export default function DashboardLayout({
  children,
  title = "HireFlow",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userName = "Sriya";

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/hireflow-logo.png" alt="HireFlow" className="w-9 h-9 rounded-lg" />
          <span className="text-xl font-bold tracking-tight text-white">
            Hire<span className="text-gradient">Flow</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-6 px-4 space-y-8">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const ActiveIcon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      active
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <ActiveIcon
                      size={20}
                      className={active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                        item.badge === "LIVE" ? "bg-red-500/20 text-red-400" : "bg-indigo-500/20 text-indigo-400"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Area */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-card-strong p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles size={10} className="text-indigo-400" /> Premium
            </p>
          </div>
        </div>
        <button
          onClick={() => { localStorage.removeItem("token"); router.push("/auth/login"); }}
          className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-xl"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 w-72 glass-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <aside className="w-72 h-full glass-sidebar shadow-2xl" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-6 glass-nav lg:hidden flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-400">
            <Menu size={24} />
          </button>
          <span className="text-lg font-bold text-white">Hire<span className="text-gradient">Flow</span></span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{userName.charAt(0)}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-wide py-8 md:py-12">
            {children}
          </div>
        </main>
      </div>

      {/* Background Orbs */}
      <div className="orb orb-blue w-[400px] h-[400px] fixed top-[-100px] right-[-100px] animate-pulse-glow pointer-events-none" />
      <div className="orb orb-purple w-[300px] h-[300px] fixed bottom-[-100px] left-[30%] animate-pulse-glow pointer-events-none" style={{ animationDelay: '3s' }} />
    </div>
  );
}
