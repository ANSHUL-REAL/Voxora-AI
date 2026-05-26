"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  MessageSquare,
  Play,
  Plus,
  Settings,
  MousePointer2,
  Clock,
  Database,
  Calendar,
  Sparkles,
  ChevronDown,
  Pause,
  Check,
  ToggleLeft,
  ToggleRight,
  Copy,
  Trash2,
  X,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const NODE_TYPES = {
  trigger: {
    color: "yellow",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/25",
    label: "TRIGGER",
  },
  action: {
    color: "indigo",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/25",
    label: "ACTION",
  },
  condition: {
    color: "emerald",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/25",
    label: "CONDITION",
  },
  delay: {
    color: "orange",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/25",
    label: "DELAY",
  },
};

const WORKFLOW_NODES = [
  {
    id: 1,
    type: "trigger",
    title: "WhatsApp Message",
    icon: MessageSquare,
    desc: "Trigger when message received from lead with score > 70",
    active: true,
  },
  {
    id: 2,
    type: "action",
    title: "AI Intent Analysis",
    icon: Sparkles,
    desc: "Analyze sentiment and intent using Voxora G4 Pro model",
    active: false,
  },
  {
    id: 3,
    type: "condition",
    title: "Intent Router",
    icon: ChevronRight,
    desc: "Route based on detected intent: booking, inquiry, support",
    active: false,
  },
  {
    id: 4,
    type: "action",
    title: "Book Appointment",
    icon: Calendar,
    desc: "Suggest available slots from connected calendar",
    active: false,
  },
  {
    id: 5,
    type: "action",
    title: "CRM Lead Sync",
    icon: Database,
    desc: "Update Salesforce with lead details and intent score",
    active: false,
  },
  {
    id: 6,
    type: "delay",
    title: "Wait 2 Hours",
    icon: Clock,
    desc: "Pause execution before sending follow-up message",
    active: false,
  },
  {
    id: 7,
    type: "action",
    title: "Auto Reply",
    icon: Zap,
    desc: "Send AI-generated response back to the customer",
    active: false,
  },
];

const TEMPLATES = [
  {
    name: "Lead Qualification",
    desc: "WhatsApp → Score → CRM sync",
    runs: "1,248",
    color: "indigo",
  },
  {
    name: "Booking Flow",
    desc: "Call → Intent → Book → Confirm",
    runs: "842",
    color: "emerald",
  },
  {
    name: "Welcome Sequence",
    desc: "New contact → 3-step nurture",
    runs: "2,105",
    color: "violet",
  },
  {
    name: "Support Escalation",
    desc: "Negative sentiment → Human handoff",
    runs: "318",
    color: "red",
  },
];

const ACTIVE_WORKFLOWS = [
  {
    name: "Main Sales Flow",
    status: "active",
    runs: "2,847",
    success: "94%",
    platform: "WhatsApp + LinkedIn",
  },
  {
    name: "Booking Automation",
    status: "active",
    runs: "1,032",
    success: "97%",
    platform: "Phone + Website",
  },
  {
    name: "Lead Nurture Drip",
    status: "paused",
    runs: "584",
    success: "88%",
    platform: "All Channels",
  },
];

/* ── SVG bezier connector between two nodes ── */
function BezierConnector({ animate, fromX, toX, y, color = "#6366f1" }) {
  const cx = (fromX + toX) / 2;
  const d = `M ${fromX} ${y} C ${cx} ${y}, ${cx} ${y}, ${toX} ${y}`;
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <path
        d={d}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeOpacity={0.25}
      />
      {animate && (
        <circle r="5" fill={color}>
          <animateMotion dur="1.4s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </svg>
  );
}

/* ── Expanded node types panel ── */
const ADD_NODE_OPTIONS = [
  {
    type: "trigger",
    icon: Zap,
    label: "Trigger",
    desc: "When something happens",
  },
  {
    type: "action",
    icon: Sparkles,
    label: "AI Action",
    desc: "Let AI handle it",
  },
  {
    type: "condition",
    icon: ChevronRight,
    label: "Condition",
    desc: "Branch the flow",
  },
  {
    type: "delay",
    icon: Clock,
    label: "Wait / Delay",
    desc: "Pause before next step",
  },
];

const NODE_ICONS = {
  trigger: Zap,
  action: Sparkles,
  condition: ChevronRight,
  delay: Clock,
};

function AddNodePanel({ onAdd, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-72 p-3 rounded-2xl bg-[#0f0f1e] border border-white/10 shadow-2xl"
    >
      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 px-1">
        Choose block type
      </p>
      <div className="space-y-1">
        {ADD_NODE_OPTIONS.map((opt) => {
          const t = NODE_TYPES[opt.type];
          const Icon = opt.icon;
          return (
            <button
              key={opt.type}
              onClick={() => {
                onAdd(opt);
                onClose();
              }}
              className={`w-full p-2.5 rounded-xl flex items-center gap-3 hover:bg-white/[0.06] transition-all group text-left border border-transparent hover:border-white/[0.06]`}
            >
              <div
                className={`p-2 rounded-xl ${t.bg} border ${t.border} shrink-0`}
              >
                <Icon size={14} className={t.text} />
              </div>
              <div>
                <p className="text-xs font-bold group-hover:text-white transition-colors">
                  {opt.label}
                </p>
                <p className="text-[10px] text-zinc-600">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function WorkflowNode({ node, isSelected, onClick }) {
  const t = NODE_TYPES[node.type];
  const Icon = node.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onClick}
      className={`w-64 p-4 rounded-2xl border cursor-pointer transition-all relative group ${
        isSelected
          ? `${t.bg} ${t.border} shadow-lg`
          : node.active
            ? "bg-indigo-500/8 border-indigo-500/25"
            : "bg-[#0f0f1c] border-white/[0.07] hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`p-2 rounded-xl ${t.bg} border ${t.border} shrink-0`}>
          <Icon size={15} className={t.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{node.title}</p>
          <p
            className={`text-[8px] font-bold uppercase tracking-widest ${t.text}`}
          >
            {t.label}
          </p>
        </div>
        <Settings
          size={12}
          className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        />
      </div>
      <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
        {node.desc}
      </p>
      {node.active && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
      )}
    </motion.div>
  );
}

export default function Automations() {
  const [selectedNode, setSelectedNode] = useState(WORKFLOW_NODES[0]);
  const [nodes, setNodes] = useState(() => {
    if (typeof window === "undefined") return WORKFLOW_NODES;
    try {
      const saved = JSON.parse(localStorage.getItem("voxora-workflow-nodes"));
      return Array.isArray(saved)
        ? saved.map((node) => ({ ...node, icon: NODE_ICONS[node.type] || Zap }))
        : WORKFLOW_NODES;
    } catch {
      return WORKFLOW_NODES;
    }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [workflows, setWorkflows] = useState(() => {
    if (typeof window === "undefined") return ACTIVE_WORKFLOWS;
    try {
      const saved = JSON.parse(localStorage.getItem("voxora-workflows"));
      return Array.isArray(saved) ? saved : ACTIVE_WORKFLOWS;
    } catch {
      return ACTIVE_WORKFLOWS;
    }
  });
  const [activeTab, setActiveTab] = useState("builder");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [runProgress, setRunProgress] = useState(-1); // active node index during simulation
  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    localStorage.setItem("voxora-workflow-nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("voxora-workflows", JSON.stringify(workflows));
  }, [workflows]);

  const toggleWorkflow = (i) => {
    setWorkflows((prev) =>
      prev.map((w, idx) =>
        idx === i
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w,
      ),
    );
    toast.success("Workflow status updated.");
  };

  // Simulate step-by-step execution
  useEffect(() => {
    if (!isRunning) {
      setRunProgress(-1);
      return;
    }
    let step = 0;
    const go = () => {
      setRunProgress(step);
      step++;
      if (step < nodes.length) {
        setTimeout(go, 1500);
      } else {
        setTimeout(() => {
          setRunProgress(-1);
          setIsRunning(false);
          toast.success("Workflow simulation completed.");
        }, 800);
      }
    };
    setTimeout(go, 400);
  }, [isRunning, nodes.length]);

  const addNode = (opt) => {
    const newNode = {
      id: Date.now(),
      type: opt.type,
      title: opt.label,
      icon: opt.icon,
      desc: "Click to configure this block.",
      active: false,
    };
    setNodes((prev) => [...prev, newNode]);
    toast.success("Workflow block added.");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-1">Workflow Builder</h1>
          <p className="text-xs text-zinc-500">
            Design customer journeys with AI-powered triggers, conditions, and
            actions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] text-xs font-bold rounded-xl hover:bg-white/[0.07] transition-all text-zinc-300"
          >
            Templates
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg ${
              isRunning
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:opacity-90"
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={13} /> Stop
              </>
            ) : (
              <>
                <Play size={13} fill="white" /> Simulate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05] w-fit">
        {["builder", "workflows", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-white"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Templates */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-4 rounded-2xl bg-[#0f0f1c] border border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => setShowTemplates(false)}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-indigo-500/5 text-left transition-all group"
              >
                <p className="text-xs font-bold mb-1 group-hover:text-indigo-400 transition-colors">
                  {t.name}
                </p>
                <p className="text-[10px] text-zinc-500 mb-2">{t.desc}</p>
                <p className="text-[9px] text-zinc-600">{t.runs} runs</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === "builder" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-310px)]">
          {/* Canvas */}
          <div
            ref={canvasRef}
            className="xl:col-span-3 relative bg-[#060610] rounded-2xl border border-white/[0.06] overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Running sweep line */}
            {isRunning && (
              <motion.div
                animate={{ x: ["0%", "100%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute top-0 left-0 h-0.5 w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent pointer-events-none"
              />
            )}

            <div
              className="relative z-10 flex items-start lg:items-center gap-0 overflow-x-auto p-8 h-full"
              style={{ scrollbarWidth: "none" }}
            >
              {nodes.map((node, i) => {
                const t = NODE_TYPES[node.type];
                const Icon = node.icon;
                const isRunningThis = runProgress === i;
                const isDone = runProgress > i;
                return (
                  <React.Fragment key={node.id}>
                    <div
                      ref={(el) => (nodeRefs.current[i] = el)}
                      className="shrink-0"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => setSelectedNode(node)}
                        animate={
                          isRunningThis
                            ? {
                                boxShadow: [
                                  "0 0 0 0 rgba(99,102,241,0.4)",
                                  "0 0 0 16px rgba(99,102,241,0)",
                                  "0 0 0 0 rgba(99,102,241,0.4)",
                                ],
                              }
                            : {}
                        }
                        transition={
                          isRunningThis ? { repeat: Infinity, duration: 1 } : {}
                        }
                        className={`w-56 p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                          selectedNode?.id === node.id
                            ? `${t.bg} ${t.border} shadow-lg`
                            : isDone
                              ? "bg-emerald-500/5 border-emerald-500/25"
                              : isRunningThis
                                ? "bg-indigo-500/15 border-indigo-500/40"
                                : "bg-[#0f0f1c] border-white/[0.07] hover:border-white/[0.12]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className={`p-2 rounded-xl ${t.bg} border ${t.border} shrink-0`}
                          >
                            <Icon
                              size={15}
                              className={
                                isRunningThis
                                  ? "text-white animate-pulse"
                                  : t.text
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">
                              {node.title}
                            </p>
                            <p
                              className={`text-[8px] font-bold uppercase tracking-widest ${t.text}`}
                            >
                              {t.label}
                            </p>
                          </div>
                          {isDone && (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-400 shrink-0"
                            />
                          )}
                          {isRunningThis && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="shrink-0"
                            >
                              <RefreshCw
                                size={13}
                                className="text-indigo-400"
                              />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                          {node.desc}
                        </p>
                        {node.active && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                        )}
                      </motion.div>
                    </div>

                    {/* Animated connector */}
                    {i < nodes.length - 1 && (
                      <div className="flex items-center justify-center w-10 shrink-0 relative">
                        <div className="w-full h-px bg-gradient-to-r from-indigo-500/30 to-indigo-500/30 relative">
                          {isRunning && runProgress >= i && (
                            <motion.div
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="absolute top-1/2 -translate-y-1/2"
                            >
                              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            </motion.div>
                          )}
                        </div>
                        <ChevronRight
                          size={12}
                          className="absolute text-indigo-400/50"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Add node button */}
              <div className="relative shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddPanel(!showAddPanel)}
                  className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-indigo-500/50 flex items-center justify-center text-zinc-600 hover:text-indigo-400 transition-all"
                >
                  <Plus size={20} />
                </motion.button>
                <AnimatePresence>
                  {showAddPanel && (
                    <AddNodePanel
                      onAdd={addNode}
                      onClose={() => setShowAddPanel(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Execution progress bar */}
            {isRunning && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.04]">
                <motion.div
                  animate={{
                    width: `${((runProgress + 1) / nodes.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            )}

            {/* Toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-[#0f0f1e]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-2xl">
                <button
                  onClick={() => toast.info("Select mode enabled.")}
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all"
                >
                <MousePointer2 size={15} />
              </button>
              <div className="w-px h-5 bg-white/[0.08]" />
              <button
                onClick={() => setShowAddPanel(!showAddPanel)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/15 text-indigo-400 text-[10px] font-bold hover:bg-indigo-500/25 transition-all"
              >
                <Plus size={13} /> Add Block
              </button>
              <div className="w-px h-5 bg-white/[0.08]" />
              <div className="flex items-center gap-1.5 px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                {isRunning ? (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                  />
                ) : (
                  <Clock size={11} />
                )}
                {isRunning
                  ? `Step ${Math.max(0, runProgress + 1)}/${nodes.length}`
                  : "Auto-Saved"}
              </div>
            </div>
          </div>

          {/* Node Settings panel — unchanged */}
          <div
            className="p-4 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {selectedNode ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold">Block Settings</h3>
                  <button
                    onClick={() => toast.info("Block settings active.")}
                    className="p-1.5 bg-white/[0.04] rounded-lg text-zinc-500 hover:text-white transition-all"
                  >
                    <Settings size={12} />
                  </button>
                </div>
                <div
                  className={`p-3 rounded-xl ${NODE_TYPES[selectedNode.type].bg} border ${NODE_TYPES[selectedNode.type].border} mb-4`}
                >
                  <div className="flex items-center gap-2">
                    <selectedNode.icon
                      size={14}
                      className={NODE_TYPES[selectedNode.type].text}
                    />
                    <span className="text-xs font-bold">
                      {selectedNode.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">
                    {selectedNode.desc}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-2">
                      Node Title
                    </p>
                    <input
                      defaultValue={selectedNode.title}
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/40 text-white"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-2">
                      Input Source
                    </p>
                    <select className="w-full bg-[#0f0f1e] border border-white/[0.07] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/40 text-zinc-300 appearance-none">
                      <option>WhatsApp Business API</option>
                      <option>Instagram DM</option>
                      <option>LinkedIn Messages</option>
                      <option>Voice Call</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-2">
                      Conditions
                    </p>
                    <div className="space-y-2">
                      {[
                        "Lead Score > 70",
                        "Platform = Mobile",
                        "Message contains keyword",
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] text-zinc-300 flex items-center justify-between group"
                        >
                          <span>{c}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toast.success("Condition duplicated.")}
                              className="text-zinc-600 hover:text-white"
                            >
                              <Copy size={11} />
                            </button>
                            <button
                              onClick={() => toast.success("Condition removed.")}
                              className="text-zinc-600 hover:text-red-400"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => toast.success("Demo condition added.")}
                        className="w-full p-2.5 rounded-xl border border-dashed border-white/[0.08] text-[10px] text-zinc-600 hover:text-white hover:border-white/[0.15] transition-all flex items-center justify-center gap-1"
                      >
                        <Plus size={11} /> Add condition
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toast.success("Block changes saved.")}
                  className="w-full mt-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setNodes((prev) =>
                      prev.filter((n) => n.id !== selectedNode.id),
                    );
                    setSelectedNode(null);
                  }}
                  className="w-full mt-2 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={12} /> Delete Block
                </button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full text-center">
                <div>
                  <MousePointer2
                    size={24}
                    className="text-zinc-700 mx-auto mb-2"
                  />
                  <p className="text-zinc-600 text-xs">Click a block to edit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "workflows" && (
        <div className="space-y-3">
          {workflows.map((wf, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] flex items-center gap-4 group"
            >
              <div
                className={`w-2 h-10 rounded-full ${wf.status === "active" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-zinc-700"}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold">{wf.name}</h4>
                  <span
                    className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-full ${wf.status === "active" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-zinc-800 text-zinc-500"}`}
                  >
                    {wf.status}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">{wf.platform}</p>
              </div>
              <div className="flex gap-6 text-center">
                {[
                  ["Runs", wf.runs],
                  ["Success", wf.success],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-sm font-bold">{val}</p>
                    <p className="text-[9px] text-zinc-600">{label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggleWorkflow(i)}
                className="p-2 rounded-xl hover:bg-white/[0.06] transition-all"
              >
                {wf.status === "active" ? (
                  <Pause size={16} className="text-zinc-400" />
                ) : (
                  <Play size={16} className="text-zinc-400" />
                )}
              </button>
            </motion.div>
          ))}
          <button
            onClick={() => {
              setWorkflows((prev) => [
                ...prev,
                {
                  name: "New Hackathon Workflow",
                  status: "paused",
                  runs: "0",
                  success: "—",
                  platform: "Demo Channels",
                },
              ]);
              toast.success("New workflow created.");
            }}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-white/[0.07] hover:border-indigo-500/40 text-zinc-600 hover:text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Create New Workflow
          </button>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Workflow Runs",
              value: "48,291",
              change: "+18%",
              color: "indigo",
            },
            {
              label: "Automations Saved",
              value: "1,240 hrs",
              change: "+12%",
              color: "emerald",
            },
            {
              label: "AI Response Rate",
              value: "94.5%",
              change: "+3%",
              color: "violet",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]"
            >
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">
                {s.label}
              </p>
              <p className="text-2xl font-bold mb-1">{s.value}</p>
              <p className="text-[10px] font-bold text-emerald-400">
                {s.change} this month
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
