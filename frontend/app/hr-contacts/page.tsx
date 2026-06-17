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
  Sparkles,
  Copy,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = RAW_API_URL.endsWith("/api/v1")
  ? RAW_API_URL
  : `${RAW_API_URL}/api/v1`;

export default function HRContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // AI Outreach states
  const [selectedContactForDraft, setSelectedContactForDraft] = useState<any | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [copied, setCopied] = useState(false);

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
      // Keep UI deterministic
    }
  };

  const handleGenerateDraft = async (contact: any) => {
    setSelectedContactForDraft(contact);
    setDraftLoading(true);
    setCopied(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/hr-contacts/${contact.id}/outreach-draft`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDraftSubject(data.subject || "");
        setDraftBody(data.body || "");
      } else {
        alert("Failed to generate outreach email draft.");
      }
    } catch (e) {
      console.error("Draft generation failed", e);
    } finally {
      setDraftLoading(false);
    }
  };

  const handleCopyDraft = () => {
    const text = `Subject: ${draftSubject}\n\n${draftBody}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = (status: string) => {
    if (status === "responded") return "text-emerald-500 bg-[var(--accent-soft)]";
    if (status === "contacted") return "text-[#C25A1A] bg-[#C25A1A]/10";
    return "text-[var(--text-muted)] bg-[var(--bg-raised)]";
  };

  const filteredContacts = contacts.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      (c.first_name || "").toLowerCase().includes(query) ||
      (c.last_name || "").toLowerCase().includes(query) ||
      (c.company_name || "").toLowerCase().includes(query) ||
      (c.email || "").toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout title="HR Direct">
      <div className="space-y-8 relative pb-20">
        {/* Header */}
        <div className="pb-6 border-b border-[var(--border)] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text)] mb-2">HR Contacts</h1>
            <p className="text-[var(--text-muted)] text-sm">
              Direct connections to hiring decision makers.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="btn-premium !rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider"
            >
              <Plus size={16} /> Add Contact
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, company, or email..."
            className="input-premium pl-12 py-4 placeholder-[var(--text-muted)]/50 focus:border-[var(--accent)] transition-all bg-[var(--bg-surface)] text-[var(--text)] border-[var(--border)]"
          />
        </div>

        {/* Add Contact Form */}
        {showAdd && (
          <div className="glass-card p-6 bg-[var(--bg-surface)] border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">
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
                  className="px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)]/40 focus:outline-none focus:border-[var(--accent)] transition-all"
                />
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="btn-premium !rounded-xl !px-6 !py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Save Contact
              </button>
            </div>
          </div>
        )}

        {/* Contacts Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="glass-card p-12 text-center text-[var(--text-muted)] bg-[var(--bg-surface)] border-[var(--border)] font-bold">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="glass-card p-12 text-center bg-[var(--bg-surface)] border-[var(--border)]">
              <Users size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-60" />
              <p className="text-[var(--text-muted)] font-medium">
                {searchQuery ? "No contacts match your query." : "No contacts yet. Add HR contacts manually."}
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="glass-card p-6 bg-[var(--bg-surface)] border-[var(--border)] group hover:border-[var(--accent)]/30"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center font-bold text-[var(--accent)] text-lg group-hover:scale-110 transition-transform">
                    {contact.first_name?.[0]}
                    {contact.last_name?.[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[var(--text)] text-lg leading-tight">
                      {contact.first_name} {contact.last_name}
                    </h4>
                    <p className="text-[var(--text-muted)] text-xs flex items-center gap-2 flex-wrap mt-1">
                      <Building2 size={13} /> {contact.company_name}
                      {contact.job_title && <> • {contact.job_title}</>}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-full ${statusColor(contact.status)}`}
                  >
                    {contact.status}
                  </span>

                  {/* Source */}
                  {contact.source && (
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-bold tracking-wider uppercase">
                      <Globe size={11} /> {contact.source}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGenerateDraft(contact)}
                      className="p-3 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all flex items-center justify-center"
                      title="Generate AI Outreach Email Draft"
                    >
                      <Sparkles size={18} />
                    </button>
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/20 transition-all flex items-center justify-center"
                      title="Send Email"
                    >
                      <Mail size={18} />
                    </a>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="p-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-emerald-500 hover:border-emerald-500/20 transition-all flex items-center justify-center"
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

        {/* Sliding AI Draft Panel */}
        <AnimatePresence>
          {selectedContactForDraft && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedContactForDraft(null)}
                className="fixed inset-0 bg-black z-40"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[var(--bg-surface)] border-l border-[var(--border)] shadow-2xl z-50 p-8 flex flex-col justify-between"
              >
                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                      <Sparkles size={20} />
                      <h3 className="text-sm font-black uppercase tracking-wider">AI Outreach Draft</h3>
                    </div>
                    <button
                      onClick={() => setSelectedContactForDraft(null)}
                      className="p-1.5 hover:bg-[var(--bg-raised)] rounded-lg text-[var(--text-muted)] transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">
                      Recipient: {selectedContactForDraft.first_name} {selectedContactForDraft.last_name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {selectedContactForDraft.job_title || "Recruiter"} at {selectedContactForDraft.company_name}
                    </p>
                  </div>

                  {draftLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
                      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Drafting message...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={draftSubject}
                          onChange={(e) => setDraftSubject(e.target.value)}
                          className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl py-3 px-4 text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                          Message Body
                        </label>
                        <textarea
                          value={draftBody}
                          onChange={(e) => setDraftBody(e.target.value)}
                          rows={12}
                          className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl py-3 px-4 text-xs font-medium text-[var(--text)] leading-relaxed focus:outline-none focus:border-[var(--accent)] transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!draftLoading && (
                  <div className="pt-6 border-t border-[var(--border)] flex gap-3">
                    <button
                      onClick={handleCopyDraft}
                      className="flex-1 btn-premium !rounded-xl !py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${selectedContactForDraft.email}?subject=${encodeURIComponent(draftSubject)}&body=${encodeURIComponent(draftBody)}`}
                      className="px-6 py-3.5 bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-white text-[var(--accent)] border border-[var(--accent)]/10 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all"
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
