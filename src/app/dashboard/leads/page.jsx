"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MessageSquare,
  TrendingUp,
  Tag,
  Star,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  X,
  CheckCircle2,
  Calendar,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";

const STAGE_CONFIG = {
  New: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    dot: "bg-blue-500",
  },
  Discovery: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
    dot: "bg-yellow-500",
  },
  Qualified: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  "In Discussion": {
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    dot: "bg-indigo-500",
  },
  Closed: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    dot: "bg-purple-500",
  },
};

const PLATFORM_ICONS = {
  LinkedIn: Linkedin,
  WhatsApp: MessageSquare,
  Instagram: Instagram,
  Facebook: Facebook,
  Website: Globe,
};

const ALL_LEADS = [
  {
    id: 1,
    name: "Arjun Nair",
    company: "NivaraTech Solutions",
    value: "$12,500",
    stage: "Qualified",
    score: 92,
    avatar: "AN",
    platform: "LinkedIn",
    email: "arjun@nivaratech.in",
    phone: "+91 98765 50182",
    location: "Bengaluru, KA",
    tags: ["Enterprise", "Hot"],
    notes: "Interested in full enterprise suite. Decision in Q3.",
  },
  {
    id: 2,
    name: "Neha Bansal",
    company: "GreenLife Organics",
    value: "$4,200",
    stage: "In Discussion",
    score: 65,
    avatar: "NB",
    platform: "WhatsApp",
    email: "neha@greenlife.in",
    phone: "+91 98100 50194",
    location: "Delhi, DL",
    tags: ["SMB"],
    notes: "Needs WhatsApp + Instagram automation.",
  },
  {
    id: 3,
    name: "Aisha Verma",
    company: "Retail Hub",
    value: "$8,900",
    stage: "New",
    score: 88,
    avatar: "AV",
    platform: "Instagram",
    email: "aisha@retailhub.in",
    phone: "+91 98765 50177",
    location: "Mumbai, MH",
    tags: ["Hot", "Retail"],
    notes: "Came via Instagram ad. Very responsive.",
  },
  {
    id: 4,
    name: "Kabir Malhotra",
    company: "FinEdge Bharat",
    value: "$25,000",
    stage: "Qualified",
    score: 95,
    avatar: "KM",
    platform: "LinkedIn",
    email: "kabir@finedgebharat.in",
    phone: "+91 98123 50165",
    location: "Gurugram, HR",
    tags: ["Enterprise", "Finance", "VIP"],
    notes: "CEO-level contact. Top priority.",
  },
  {
    id: 5,
    name: "Meera Rao",
    company: "Kala Creative Co.",
    value: "$2,100",
    stage: "Discovery",
    score: 45,
    avatar: "MR",
    platform: "Facebook",
    email: "meera@kalacreative.in",
    phone: "+91 98450 50148",
    location: "Jaipur, RJ",
    tags: ["SMB", "Creative"],
    notes: "Exploring options. Needs nurturing.",
  },
  {
    id: 6,
    name: "Rohan Kapoor",
    company: "DataPulse Labs",
    value: "$18,500",
    stage: "In Discussion",
    score: 78,
    avatar: "RK",
    platform: "LinkedIn",
    email: "rohan@datapulse.in",
    phone: "+91 98200 50133",
    location: "Pune, MH",
    tags: ["AI", "Enterprise"],
    notes: "Interested in API integration and custom model training.",
  },
  {
    id: 7,
    name: "Ananya Iyer",
    company: "ArogyaCloud",
    value: "$32,000",
    stage: "Closed",
    score: 100,
    avatar: "AI",
    platform: "Website",
    email: "ananya@arogyacloud.in",
    phone: "+91 98840 50121",
    location: "Chennai, TN",
    tags: ["Enterprise", "Healthcare", "Won"],
    notes: "Successfully closed. 12-month contract signed.",
  },
];

const STAGES = ["New", "Discovery", "Qualified", "In Discussion", "Closed"];

function LeadModal({ lead, onClose, onUpdate, onDelete }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [note, setNote] = useState("");
  const cfg = STAGE_CONFIG[lead.stage];
  const PlatformIcon = PLATFORM_ICONS[lead.platform] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0f0f1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] bg-[#0c0c18]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-300 border border-indigo-500/25 text-base">
                {lead.avatar}
              </div>
              <div>
                <h2 className="text-sm font-bold">{lead.name}</h2>
                <p className="text-[11px] text-zinc-500">
                  {lead.company} · {lead.location}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              <X size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
            >
              {lead.stage}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/[0.05] text-white border border-white/[0.08]">
              Score: {lead.score}%
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {lead.value}
            </span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 p-3 border-b border-white/[0.05]">
          {["overview", "notes", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${activeTab === tab ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20" : "text-zinc-500 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="p-5">
          {activeTab === "overview" && (
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: lead.email },
                { icon: Phone, label: "Phone", value: lead.phone },
                { icon: Globe, label: "Location", value: lead.location },
                { icon: PlatformIcon, label: "Source", value: lead.platform },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <Icon size={14} className="text-zinc-500 shrink-0" />
                  <span className="text-[10px] text-zinc-500 w-14 font-bold uppercase">
                    {label}
                  </span>
                  <span className="text-xs text-white">{value}</span>
                </div>
              ))}
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "notes" && (
            <div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-3 text-xs text-zinc-300 leading-relaxed">
                {lead.notes}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 resize-none h-20 focus:outline-none focus:border-indigo-500/40"
              />
              <button
                onClick={() => {
                  if (!note.trim()) return;
                  onUpdate({ ...lead, notes: `${lead.notes}\n${note.trim()}` });
                  setNote("");
                  toast.success("Note added to lead.");
                }}
                className="mt-2 px-3 py-2 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all"
              >
                Add Note
              </button>
            </div>
          )}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {[
                {
                  action: "AI auto-replied on " + lead.platform,
                  time: "2h ago",
                  icon: MessageSquare,
                  color: "text-indigo-400",
                },
                {
                  action: "Lead score updated to " + lead.score + "%",
                  time: "5h ago",
                  icon: TrendingUp,
                  color: "text-emerald-400",
                },
                {
                  action: "Added tag: " + lead.tags[0],
                  time: "1d ago",
                  icon: Tag,
                  color: "text-yellow-400",
                },
              ].map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                >
                  <a.icon size={13} className={a.color} />
                  <span className="text-xs text-zinc-300 flex-1">
                    {a.action}
                  </span>
                  <span className="text-[9px] text-zinc-600">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="p-4 border-t border-white/[0.06] flex gap-2">
          <button
            onClick={() => toast.success(`Demo message opened for ${lead.name}.`)}
            className="flex-1 py-2.5 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={12} /> Message
          </button>
          <button
            onClick={() => toast.success(`Follow-up scheduled for ${lead.name}.`)}
            className="flex-1 py-2.5 bg-white/[0.06] text-white text-xs font-bold rounded-xl hover:bg-white/[0.1] transition-all border border-white/[0.08] flex items-center justify-center gap-1.5"
          >
            <Calendar size={12} /> Schedule
          </button>
          <select
            value={lead.stage}
            onChange={(e) => {
              onUpdate({ ...lead, stage: e.target.value });
              toast.success(`Moved to ${e.target.value}.`);
            }}
            className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-2 text-[10px] text-white"
          >
            {STAGES.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
          <button
            onClick={() => {
              onDelete(lead.id);
              onClose();
            }}
            className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 hover:bg-red-500/15 transition-all"
          >
            <X size={13} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    value: "",
    stage: "New",
    platform: "LinkedIn",
    email: "",
    score: 70,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const submit = () => {
    if (!form.name || !form.company) return;
    onAdd({
      ...form,
      id: Date.now(),
      avatar: form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      tags: ["New"],
      notes: "",
      location: "—",
      phone: "—",
      value: form.value ? `$${form.value}` : "$0",
      score: Number(form.score),
    });
    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0f0f1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-5 border-b border-white/[0.06] bg-[#0c0c18] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Add New Lead</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Manually add a lead to your CRM pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Full Name", "name", "Aisha Verma"],
              ["Company", "company", "Acme Inc."],
            ].map(([label, key, ph]) => (
              <div key={key}>
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={ph}
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/40 text-white placeholder:text-zinc-600"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Deal Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                  $
                </span>
                <input
                  value={form.value}
                  onChange={(e) => set("value", e.target.value)}
                  placeholder="5,000"
                  type="number"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-7 pr-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/40 text-white placeholder:text-zinc-600"
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Lead Score
              </label>
              <input
                value={form.score}
                onChange={(e) => set("score", e.target.value)}
                type="range"
                min="0"
                max="100"
                className="w-full mt-2 accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-600">
                <span>Cold</span>
                <span className="text-indigo-400 font-bold">{form.score}%</span>
                <span>Hot</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Stage
              </label>
              <select
                value={form.stage}
                onChange={(e) => set("stage", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/40 appearance-none cursor-pointer text-white"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Source
              </label>
              <select
                value={form.platform}
                onChange={(e) => set("platform", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/40 appearance-none cursor-pointer text-white"
              >
                {[
                  "LinkedIn",
                  "WhatsApp",
                  "Instagram",
                  "Facebook",
                  "Website",
                ].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
              Email (optional)
            </label>
            <input
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="sarah@company.com"
              type="email"
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/40 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>
        <div className="p-4 border-t border-white/[0.06] flex gap-2">
          <button
            onClick={submit}
            className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
          >
            Add Lead to CRM
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/[0.05] text-white text-xs font-bold rounded-xl hover:bg-white/[0.09] border border-white/[0.08] transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeadManagement() {
  const [leads, setLeads] = useState(() => {
    if (typeof window === "undefined") return ALL_LEADS;
    const saved = localStorage.getItem("voxora-leads");
    if (!saved) return ALL_LEADS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : ALL_LEADS;
    } catch {
      return ALL_LEADS;
    }
  });
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [starredIds, setStarredIds] = useState([4, 7]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stageFilter, setStageFilter] = useState(null);

  useEffect(() => {
    localStorage.setItem("voxora-leads", JSON.stringify(leads));
  }, [leads]);

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const addLead = (lead) => {
    setLeads((prev) => [lead, ...prev]);
    toast.success("Lead added to CRM.");
  };
  const updateLead = (lead) => {
    setLeads((prev) => prev.map((item) => (item.id === lead.id ? lead : item)));
    setSelectedLead(lead);
  };
  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    toast.success("Lead deleted.");
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase());
    const matchStage = !stageFilter || l.stage === stageFilter;
    const matchFilter =
      activeFilter === "All Leads" ||
      (activeFilter === "Hot Leads" && l.score >= 80) ||
      (activeFilter === "Follow Up" && l.stage === "In Discussion") ||
      (activeFilter === "Starred" && starredIds.includes(l.id));
    return matchSearch && matchFilter && matchStage;
  });

  return (
    <>
      <AnimatePresence>
        {selectedLead && (
          <LeadModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={updateLead}
            onDelete={deleteLead}
          />
        )}
        {showAddModal && (
          <AddLeadModal
            onClose={() => setShowAddModal(false)}
            onAdd={addLead}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold mb-1">Lead CRM</h1>
          <p className="text-xs text-zinc-500">
            Organize and nurture every business opportunity captured by Voxora
            AI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-3 h-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search leads..."
              className="bg-white/[0.04] border border-white/[0.06] rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-indigo-500/40 placeholder:text-zinc-600 w-48"
            />
          </div>
          {stageFilter && (
            <button
              onClick={() => setStageFilter(null)}
              className="px-2.5 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded-xl flex items-center gap-1"
            >
              {stageFilter} <X size={11} />
            </button>
          )}
          <button
            onClick={() => toast.info("Lead filters are active.")}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white transition-all"
          >
            <Filter size={14} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Pipeline stages — clickable to filter */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {STAGES.map((stage) => {
          const cfg = STAGE_CONFIG[stage];
          const count = leads.filter((l) => l.stage === stage).length;
          const pct = (count / leads.length) * 100;
          const isActive = stageFilter === stage;
          return (
            <motion.div
              key={stage}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStageFilter(isActive ? null : stage)}
              className={`p-3 rounded-xl border relative overflow-hidden cursor-pointer transition-all ${isActive ? `${cfg.bg} ${cfg.border} shadow-lg` : "bg-[#0e0e1c]/80 border-white/[0.06] hover:border-white/[0.1]"}`}
            >
              <p
                className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isActive ? cfg.color : "text-zinc-500"}`}
              >
                {stage}
              </p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-xl font-bold">{count}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                >
                  {pct.toFixed(0)}%
                </span>
              </div>
              <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full ${cfg.dot} rounded-full`}
                />
              </div>
              {isActive && (
                <motion.div
                  layoutId="stage-indicator"
                  className="absolute top-0 right-0 w-1 h-full rounded-l opacity-60"
                  style={{ background: cfg.dot.replace("bg-", "") }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#0e0e1c]/80 rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* Filter tabs */}
        <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
          <div className="flex gap-1">
            {["All Leads", "Hot Leads", "Follow Up", "Starred"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeFilter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-600">
            Showing {filtered.length} of {leads.length} leads
          </p>
        </div>

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-white/[0.04]">
          {["Lead", "Stage", "Value", "Score", "Platform", "Actions"].map(
            (h, i) => (
              <div
                key={h}
                className={`text-[9px] font-bold text-zinc-600 uppercase tracking-wider ${i === 0 ? "col-span-4" : i === 4 ? "col-span-2" : "col-span-1"}`}
              >
                {h}
              </div>
            ),
          )}
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          <AnimatePresence mode="popLayout">
            {filtered.map((lead, i) => {
              const cfg = STAGE_CONFIG[lead.stage];
              const PIcon = PLATFORM_ICONS[lead.platform] || Globe;
              const isStarred = starredIds.includes(lead.id);
              return (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedLead(lead)}
                  className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 hover:bg-white/[0.025] cursor-pointer group transition-colors"
                >
                  <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 flex items-center justify-center font-bold text-[11px] text-indigo-300 border border-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
                      {lead.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate group-hover:text-indigo-400 transition-colors">
                        {lead.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 truncate">
                        {lead.company}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-[11px] text-zinc-300">
                      {lead.stage}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-1">
                    <span className="text-xs font-bold text-white">
                      {lead.value}
                    </span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center gap-1">
                    <TrendingUp size={11} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">
                      {lead.score}%
                    </span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center gap-1.5">
                    <PIcon size={12} className="text-zinc-500" />
                    <span className="text-[10px] text-zinc-500">
                      {lead.platform}
                    </span>
                  </div>
                  <div className="hidden md:flex col-span-1 items-center gap-1">
                    <button
                      onClick={(e) => toggleStar(lead.id, e)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-all"
                    >
                      <Star
                        size={13}
                        className={
                          isStarred
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-zinc-600"
                        }
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-all"
                    >
                      <ChevronRight
                        size={13}
                        className="text-zinc-600 group-hover:text-white transition-colors"
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between bg-black/20">
          <p className="text-[10px] text-zinc-600">
            Showing {filtered.length} of {leads.length} leads
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-500 hover:text-white text-[10px] font-bold transition-all">
              ← Prev
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-500 hover:text-white text-[10px] font-bold transition-all">
              Next →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
