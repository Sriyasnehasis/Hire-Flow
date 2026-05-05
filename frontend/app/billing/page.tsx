"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { CreditCard, Zap, ShieldCheck, Globe, Star } from "lucide-react";

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-12">
          SUBSCRIPTION <span className="outline-text opacity-40">MESH</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Standard Node", price: "0", color: "white", icon: Globe, current: true },
            { name: "Pro Cluster", price: "29", color: "#00E5FF", icon: Zap, popular: true },
            { name: "Institutional", price: "99", color: "#00FFB3", icon: ShieldCheck },
          ].map((plan, i) => (
            <div key={i} className={`glass-card p-10 flex flex-col items-center text-center relative overflow-hidden ${plan.popular ? 'border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.1)]' : 'border-white/5'}`}>
              {plan.popular && (
                <div className="absolute top-4 right-[-30px] rotate-45 bg-[#00E5FF] text-black text-[8px] font-black uppercase py-1 px-10 tracking-[0.2em] shadow-xl">
                  Popular
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-2xl" style={{ color: plan.color }}>
                <plan.icon size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                 <span className="text-3xl font-black text-white">${plan.price}</span>
                 <span className="text-[9px] font-black text-white/20 uppercase">/cycle</span>
              </div>
              <ul className="space-y-4 mb-10 w-full text-left">
                 {[1,2,3,4].map(f => (
                   <li key={f} className="flex items-center gap-3 text-[9px] font-bold text-white/40 uppercase tracking-tighter">
                      <Star size={10} className="text-[#00E5FF]" /> Active Feature Node {f}
                   </li>
                 ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all ${plan.current ? 'bg-white/5 text-white/20 cursor-default' : 'glow-button'}`}>
                 {plan.current ? "Current_Node" : "INITIALIZE_LINK"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
