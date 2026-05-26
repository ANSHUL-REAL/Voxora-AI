"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Upload,
  Search,
  Plus,
  Database,
  Globe,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Link as LinkIcon,
  Sparkles,
  X,
  RefreshCw,
  Brain,
  Zap,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_DOCS = [
  {
    id: 1,
    name: "Company_Overview_2026.pdf",
    size: "2.4 MB",
    type: "pdf",
    status: "Trained",
    date: "May 20, 2026",
    tokens: "48,200",
    accuracy: 99.1,
  },
  {
    id: 2,
    name: "Product_Pricing_Final.pdf",
    size: "1.2 MB",
    type: "pdf",
    status: "Trained",
    date: "May 22, 2026",
    tokens: "21,500",
    accuracy: 98.7,
  },
  {
    id: 3,
    name: "https://voxora.ai/docs",
    size: "142 pages",
    type: "url",
    status: "Trained",
    date: "May 23, 2026",
    tokens: "89,400",
    accuracy: 97.4,
  },
  {
    id: 4,
    name: "Customer_Support_FAQ.v2.docx",
    size: "4.8 MB",
    type: "doc",
    status: "Processing",
    date: "Today",
    tokens: "—",
    accuracy: null,
  },
  {
    id: 5,
    name: "Enterprise_Service_Agreement.pdf",
    size: "850 KB",
    type: "pdf",
    status: "Waiting",
    date: "Pending",
    tokens: "—",
    accuracy: null,
  },
];

const FAQS = [
  {
    q: "What are your pricing plans?",
    a: "We offer Growth ($299/mo), Pro ($799/mo), and Enterprise (custom). All plans include unlimited AI messages.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most businesses are fully set up within 48 hours. Our team provides hands-on support throughout.",
  },
  {
    q: "Do you support custom AI training?",
    a: "Yes! You can upload PDFs, connect URLs, and add FAQs to train the AI on your specific business context.",
  },
];

function DocRow({ doc, onDelete }) {
  const [hover, setHover] = useState(false);
  const typeColors = {
    pdf: { bg: "bg-red-500/10", text: "text-red-400", icon: FileText },
    url: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Globe },
    doc: { bg: "bg-indigo-500/10", text: "text-indigo-400", icon: Database },
  };
  const t = typeColors[doc.type] || typeColors.doc;
  const Icon = t.icon;
  const statusConfig = {
    Trained: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
    },
    Processing: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      icon: Clock,
    },
    Waiting: {
      bg: "bg-zinc-800",
      text: "text-zinc-500",
      border: "border-zinc-700",
      icon: AlertCircle,
    },
  };
  const sc = statusConfig[doc.status];
  const SIcon = sc.icon;

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="flex items-center gap-3 py-3.5 border-b border-white/[0.04] last:border-0 group"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.bg}`}
      >
        <Icon size={18} className={t.text} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold truncate group-hover:text-indigo-400 transition-colors">
          {doc.name}
        </h4>
        <div className="flex items-center gap-2 text-[9px] text-zinc-600 mt-0.5">
          <span>{doc.size}</span>
          <span>·</span>
          <span>{doc.date}</span>
          {doc.tokens !== "—" && (
            <>
              <span>·</span>
              <span className="text-indigo-400 font-bold">
                {doc.tokens} tokens
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {doc.accuracy && (
          <span className="text-[9px] font-bold text-emerald-400">
            {doc.accuracy}%
          </span>
        )}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
        >
          <SIcon size={10} />
          {doc.status === "Processing" && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ···
            </motion.span>
          )}
          {doc.status !== "Processing" && doc.status}
        </div>
        <AnimatePresence>
          {hover && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onDelete(doc.id)}
              className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function KnowledgeBase() {
  const [docs, setDocs] = useState(() => {
    if (typeof window === "undefined") return INITIAL_DOCS;
    try {
      const saved = JSON.parse(localStorage.getItem("voxora-knowledge-docs"));
      return Array.isArray(saved) ? saved : INITIAL_DOCS;
    } catch {
      return INITIAL_DOCS;
    }
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("sources");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [faqs, setFaqs] = useState(() => {
    if (typeof window === "undefined") return FAQS;
    try {
      const saved = JSON.parse(localStorage.getItem("voxora-knowledge-faqs"));
      return Array.isArray(saved) ? saved : FAQS;
    } catch {
      return FAQS;
    }
  });
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });
  const [showNewFaq, setShowNewFaq] = useState(false);
  const [creativity, setCreativity] = useState(70);
  const [toggles, setToggles] = useState({
    "Auto-Sync URLs": true,
    "Learn from Conversations": true,
    "Real-time Updates": false,
  });
  const fileRef = useRef();

  useEffect(() => {
    localStorage.setItem("voxora-knowledge-docs", JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem("voxora-knowledge-faqs", JSON.stringify(faqs));
  }, [faqs]);

  const deleteDoc = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document removed.");
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    const newDoc = {
      id: Date.now(),
      name: urlInput,
      size: "Scanning...",
      type: "url",
      status: "Processing",
      date: "Just now",
      tokens: "—",
      accuracy: null,
    };
    setDocs((prev) => [...prev, newDoc]);
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("URL added. Training started.");
    setTimeout(() => {
        setDocs((prev) =>
          prev.map((d) =>
            d.id === newDoc.id
              ? {
                  ...d,
                  status: "Trained",
                  size: "~80 pages",
                  tokens: "62,400",
                  accuracy: 96.8,
                }
              : d,
          ),
        );
        toast.success("URL training complete.");
      }, 4000);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Knowledge base synced.");
    }, 2000);
  };

  const mockUpload = (file) => {
    const newDoc = {
      id: Date.now(),
      name: file?.name || "Hackathon_Demo_Knowledge.txt",
      size: file?.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "18 KB",
      type: "doc",
      status: "Processing",
      date: "Just now",
      tokens: "—",
      accuracy: null,
    };
    setDocs((prev) => [newDoc, ...prev]);
    toast.success("Document uploaded. Training started.");
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? { ...d, status: "Trained", tokens: "18,900", accuracy: 97.9 }
            : d,
        ),
      );
      toast.success("Document training complete.");
    }, 2600);
  };

  const trainedDocs = docs.filter((d) => d.status === "Trained");
  const totalTokens = trainedDocs.reduce(
    (acc, d) => acc + parseInt(d.tokens?.replace(/,/g, "") || 0),
    0,
  );
  const filteredDocs = docs.filter(
    (d) => !search || d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-1">Knowledge Base</h1>
          <p className="text-xs text-zinc-500">
            Train your AI employee on your business documents, FAQs, and website
            content.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] text-xs font-bold rounded-xl hover:bg-white/[0.07] transition-all flex items-center gap-1.5 text-zinc-300"
          >
            <LinkIcon size={13} /> Add URL
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
          >
            <Upload size={13} /> Upload File
          </button>
          <input
            ref={fileRef}
            type="file"
            onChange={(e) => mockUpload(e.target.files?.[0])}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>

      {/* URL Input */}
      <AnimatePresence>
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-2 mb-4"
          >
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addUrl()}
              placeholder="https://yourwebsite.com/page"
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-indigo-500/40 placeholder:text-zinc-600"
            />
            <button
              onClick={addUrl}
              className="px-4 py-2.5 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all"
            >
              Scan URL
            </button>
            <button
              onClick={() => setShowUrlInput(false)}
              className="p-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-zinc-500 hover:text-white transition-all"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {
            label: "Total Tokens",
            value:
              totalTokens > 0 ? (totalTokens / 1000).toFixed(0) + "K" : "159K",
            pct: 60,
            color: "indigo",
          },
          {
            label: "Sources",
            value: docs.length,
            pct: (docs.length / 50) * 100,
            color: "emerald",
          },
          { label: "AI Accuracy", value: "98.9%", pct: 98.9, color: "violet" },
        ].map((s, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]"
          >
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">
              {s.label}
            </p>
            <p className="text-xl font-bold mb-2">{s.value}</p>
            <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className={`h-full rounded-full bg-${s.color}-500`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05] w-fit">
        {["sources", "faqs", "config"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2">
          {activeTab === "sources" && (
            <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">Training Sources</h3>
                <div className="relative">
                  <Search
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-black/40 border border-white/[0.08] rounded-xl py-1.5 pl-8 pr-3 text-[11px] focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
              </div>
              <div>
                {filteredDocs.map((doc) => (
                  <DocRow key={doc.id} doc={doc} onDelete={deleteDoc} />
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/15 rounded-xl">
                    <Brain size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">AI Brain Health</p>
                    <p className="text-[10px] text-zinc-500">
                      Fully trained on {trainedDocs.length} sources
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSync}
                  className="px-3 py-2 bg-indigo-500 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-1.5"
                >
                  <motion.div
                    animate={{ rotate: syncing ? 360 : 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <RefreshCw size={11} />
                  </motion.div>
                  {syncing ? "Syncing..." : "Re-Sync All"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">FAQ Training</h3>
                <button
                  onClick={() => setShowNewFaq(!showNewFaq)}
                  className="px-3 py-1.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-[10px] font-bold rounded-xl hover:bg-indigo-500/25 transition-all flex items-center gap-1"
                >
                  <Plus size={11} /> Add FAQ
                </button>
              </div>
              <AnimatePresence>
                {showNewFaq && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] space-y-2"
                  >
                    <input
                      value={newFaq.q}
                      onChange={(e) =>
                        setNewFaq((p) => ({ ...p, q: e.target.value }))
                      }
                      placeholder="Question..."
                      className="w-full bg-transparent border border-white/[0.08] rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500/40 placeholder:text-zinc-600"
                    />
                    <textarea
                      value={newFaq.a}
                      onChange={(e) =>
                        setNewFaq((p) => ({ ...p, a: e.target.value }))
                      }
                      placeholder="Answer..."
                      className="w-full bg-transparent border border-white/[0.08] rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500/40 resize-none h-16 placeholder:text-zinc-600"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (newFaq.q && newFaq.a) {
                            setFaqs((p) => [...p, newFaq]);
                            setNewFaq({ q: "", a: "" });
                            setShowNewFaq(false);
                            toast.success("FAQ added to training set.");
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-500 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-600 transition-all"
                      >
                        Save FAQ
                      </button>
                      <button
                        onClick={() => setShowNewFaq(false)}
                        className="px-3 py-1.5 bg-white/[0.05] text-zinc-400 text-[10px] font-bold rounded-xl hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {faq.q}
                      </p>
                      <button
                        onClick={() =>
                          setFaqs((p) => p.filter((_, idx) => idx !== i))
                        }
                        className="text-zinc-700 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] space-y-5">
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">
                  AI Model
                </label>
                <select className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/40 appearance-none cursor-pointer">
                  <option>Voxora G4 Pro (Recommended)</option>
                  <option>Voxora Light v2 (Fast)</option>
                  <option>Enterprise Custom LLM</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                    Creativity — {creativity}%
                  </label>
                  <span className="text-[9px] text-indigo-400 font-bold">
                    Balanced
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={creativity}
                  onChange={(e) => setCreativity(e.target.value)}
                  className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              {[
                ["Auto-Sync URLs", true],
                ["Learn from Conversations", true],
                ["Real-time Updates", false],
              ].map(([label], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.05]"
                >
                  <span className="text-xs font-medium text-zinc-300">
                    {label}
                  </span>
                  <button
                    onClick={() =>
                      setToggles((p) => ({ ...p, [label]: !p[label] }))
                    }
                    className={`w-9 h-5 rounded-full transition-all relative ${toggles[label] ? "bg-indigo-500" : "bg-zinc-700"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow ${toggles[label] ? "right-0.5" : "left-0.5"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload panel */}
        <div className="space-y-4">
          <div
            className="p-6 rounded-2xl bg-[#0c0c18]/80 border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/[0.03] transition-all"
            onClick={() => fileRef.current?.click()}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-4 group-hover:bg-indigo-500/15 transition-all"
            >
              <Upload
                size={26}
                className="text-zinc-600 group-hover:text-indigo-400 transition-colors"
              />
            </motion.div>
            <h3 className="text-sm font-bold mb-1">Upload Knowledge</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">
              PDF, TXT, or DOCX files.
              <br />
              Max 10MB per file.
            </p>
            <div className="px-4 py-2 bg-white text-black text-[10px] font-bold rounded-xl hover:bg-zinc-200 transition-all">
              Browse Files
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-400" />
              <p className="text-xs font-bold">Training Status</p>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            </div>
            <div className="space-y-2">
              {[
                { label: "Knowledge indexed", val: 98, color: "bg-indigo-500" },
                { label: "Context accuracy", val: 97, color: "bg-emerald-500" },
                { label: "FAQ coverage", val: 84, color: "bg-violet-500" },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-zinc-400">{label}</span>
                    <span className="text-white font-bold">{val}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1.2 }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSync}
              className="w-full mt-4 py-2.5 bg-indigo-500 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
            >
              Sync & Retrain AI
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
