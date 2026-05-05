"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Shield, Bell, Lock, Globe, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-12">
          INFRASTRUCTURE <span className="outline-text opacity-40">SETTINGS</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Security Protocol", icon: Shield, desc: "Manage authentication nodes and encryption" },
            { label: "Neural Alerts", icon: Bell, desc: "Configure real-time system notifications" },
            { label: "Access Keys", icon: Lock, desc: "Rotate API keys and session tokens" },
            { label: "Region Mesh", icon: Globe, desc: "Set institutional data residency" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 bg-white/[0.01] border-white/5 hover:border-[#00E5FF]/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
                  <item.icon size={20} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{item.label}</h3>
              </div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 glass-card border-amber-500/20 bg-amber-500/5 flex items-center gap-6">
           <Cpu className="text-amber-500" size={32} />
           <div>
              <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Advanced Diagnostics</h4>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">System running in high-fidelity mode. All nodes optimized.</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
