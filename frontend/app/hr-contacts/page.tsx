"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Mail,
  Phone,
  Building2,
  Plus,
  Search,
  Globe,
} from "lucide-react";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = RAW_API_URL.endsWith("/api/v1")
  ? RAW_API_URL
  : `${RAW_API_URL}/api/v1`;

export default function HRContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    job_title: "",
    department: "",
    source: "manual",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch(`${API_URL}/hr-contacts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(data.contacts || []);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      setContacts([]);
    }
    setLoading(false);
  };

  const handleAddContact = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch(`${API_URL}/hr-contacts/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newContact),
        });
        if (res.ok) {
          await fetchContacts();
          setShowAdd(false);
          setNewContact({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            company_name: "",
            job_title: "",
            department: "",
            source: "manual",
          });
          return;
        }
      }
    } catch (e) {
      // Keep UI deterministic: no fake local-only contact creation.
    }
  };

  const statusColor = (status: string) => {
    if (status === "responded") return "text-emerald-400 bg-emerald-500/20";
    if (status === "contacted") return "text-amber-400 bg-amber-500/20";
    return "text-slate-400 bg-white/5";
  };

  return (
    <DashboardLayout title="HR Direct">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">HR Contacts</h1>
            <p className="text-slate-400 text-lg">
              Direct connections to hiring decision makers.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="btn-gradient !rounded-xl px-5 py-3 text-sm"
            >
              <Plus size={16} /> Add Contact
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search contacts by name, company, or email..."
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Add Contact Form */}
        {showAdd && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Add New Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { key: "first_name", placeholder: "First Name" },
                { key: "last_name", placeholder: "Last Name" },
                { key: "email", placeholder: "Email" },
                { key: "company_name", placeholder: "Company" },
                { key: "job_title", placeholder: "Job Title" },
                { key: "phone", placeholder: "Phone (optional)" },
              ].map((f) => (
                <input
                  key={f.key}
                  value={(newContact as any)[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      [f.key]: e.target.value,
                    }))
                  }
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="btn-gradient !rounded-xl !px-6 !py-2.5 text-sm"
              >
                Save Contact
              </button>
            </div>
          </div>
        )}

        {/* Contacts Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="glass-card p-12 text-center text-slate-500">
              Loading contacts...
            </div>
          ) : contacts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Users size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">
                No contacts yet. Add HR contacts manually or connect your
                LinkedIn.
              </p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="glass-card p-6 group hover:border-indigo-500/20"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center font-bold text-indigo-400 text-lg group-hover:scale-110 transition-transform">
                    {contact.first_name?.[0]}
                    {contact.last_name?.[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-lg">
                      {contact.first_name} {contact.last_name}
                    </h4>
                    <p className="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                      <Building2 size={14} /> {contact.company_name}
                      {contact.job_title && <> • {contact.job_title}</>}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${statusColor(contact.status)}`}
                  >
                    {contact.status}
                  </span>

                  {/* Source */}
                  {contact.source && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Globe size={12} /> {contact.source}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                      title="Send Email"
                    >
                      <Mail size={18} />
                    </a>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                        title="Call"
                      >
                        <Phone size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
