"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  FileText,
  Settings,
  Phone,
  Clock,
  CheckCircle2,
  User,
  Star,
  MessageSquare,
  Calendar,
  ChevronRight,
  Wifi,
  Signal,
  Battery,
  AlertCircle,
  Download,
  Copy,
  Plus,
  X,
  Voicemail,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import AIOrb3D from "@/components/AIOrb3D";
import { toast } from "sonner";

/* ─── Demo conversation data ─────────────────────────────────── */
const CONVERSATIONS = {
  1: [
    {
      role: "customer",
      text: "Hi, I need a plumbing service for tomorrow morning.",
      delay: 800,
    },
    {
      role: "ai",
      text: "Hi there! I'm Voxora AI. I'd be happy to help you schedule a plumber. We have slots at 9:00 AM or 11:30 AM tomorrow — which works better for you?",
      delay: 2200,
    },
    {
      role: "customer",
      text: "9:00 AM please. I'm near Bandra West, Mumbai.",
      delay: 4000,
    },
    {
      role: "ai",
      text: "Perfect! Bandra West, Mumbai — got it. May I have your full name and best contact number to confirm the booking?",
      delay: 6200,
    },
    { role: "customer", text: "Aisha Verma, 98765-40198.", delay: 8800 },
    {
      role: "ai",
      text: "Thank you Aisha! I've confirmed a plumber for 9:00 AM tomorrow at your location. You'll receive an SMS with the plumber's details shortly. Anything else I can help with?",
      delay: 11000,
    },
    { role: "customer", text: "No, that's all. Thank you!", delay: 13500 },
    {
      role: "ai",
      text: "You're welcome, Aisha! Have a great evening. Goodbye!",
      delay: 15000,
    },
  ],
  2: [
    {
      role: "customer",
      text: "Hello? I'm calling about my dental appointment.",
      delay: 800,
    },
    {
      role: "ai",
      text: "Hello! You've reached Voxora AI for Bright Smile Dental. I can help with scheduling. Are you looking to book, reschedule, or cancel?",
      delay: 2000,
    },
    {
      role: "customer",
      text: "I'd like to reschedule my cleaning for next week.",
      delay: 4500,
    },
    {
      role: "ai",
      text: "Of course! I have openings Monday at 2 PM, Tuesday at 10 AM, and Thursday at 4 PM next week. Which do you prefer?",
      delay: 6800,
    },
    { role: "customer", text: "Monday at 2 works great.", delay: 9200 },
    {
      role: "ai",
      text: "Excellent! I've rescheduled your dental cleaning to Monday at 2:00 PM. You'll receive a confirmation text and a reminder the day before. See you then!",
      delay: 11500,
    },
  ],
  3: [
    {
      role: "customer",
      text: "Yes, I'm inquiring about your commercial lease rates.",
      delay: 800,
    },
    {
      role: "ai",
      text: "Great, thank you for calling. Our commercial spaces range from 500 to 5,000 sq ft with rates starting at $28/sq ft annually. What size are you looking for?",
      delay: 2400,
    },
    {
      role: "customer",
      text: "Probably around 1,200 square feet for an office.",
      delay: 5000,
    },
    {
      role: "ai",
      text: "A 1,200 sq ft office would be approximately $33,600 per year or $2,800/month, including utilities. Would you like to schedule an in-person viewing this week?",
      delay: 7200,
    },
    {
      role: "customer",
      text: "Yes, Thursday afternoon if possible.",
      delay: 9800,
    },
    {
      role: "ai",
      text: "Thursday at 3 PM works — I'll book you in with our property manager. You'll receive a confirmation email within 5 minutes. See you Thursday!",
      delay: 12000,
    },
  ],
};

const CALL_HISTORY = [
  {
    id: 1,
    name: "Aisha Verma",
    initials: "AV",
    status: "live",
    duration: 0,
    summary: "Scheduling plumbing service near Bandra, Mumbai.",
    score: 88,
    outcome: null,
    number: "+91 98765 40198",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: 2,
    name: "Neha Bansal",
    initials: "NB",
    status: "completed",
    duration: 197,
    summary: "Rescheduled dental cleaning to Monday 2 PM.",
    score: 92,
    outcome: "Booked",
    number: "+91 98100 50121",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    name: "Meera Rao",
    initials: "MR",
    status: "completed",
    duration: 344,
    summary: "Inquired commercial lease — Thursday viewing booked.",
    score: 65,
    outcome: "Follow-up",
    number: "+91 98450 50087",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: 4,
    name: "Arjun Nair",
    initials: "AN",
    status: "completed",
    duration: 128,
    summary: "Resolved support ticket #4421 — refund processed.",
    score: 45,
    outcome: "Resolved",
    number: "+91 98765 50334",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: 5,
    name: "Ananya Iyer",
    initials: "AI",
    status: "missed",
    duration: 0,
    summary: "No answer. AI left callback link via SMS.",
    score: 0,
    outcome: "Missed",
    number: "+91 98840 50076",
    gradient: "from-zinc-500 to-zinc-600",
  },
  {
    id: 6,
    name: "Kabir Malhotra",
    initials: "KM",
    status: "completed",
    duration: 281,
    summary: "Enterprise pricing inquiry — demo call scheduled Friday.",
    score: 95,
    outcome: "Demo Booked",
    number: "+91 98123 50219",
    gradient: "from-violet-500 to-purple-600",
  },
];

const INCOMING_CALL = {
  name: "Rohan Kapoor",
  number: "+91 98200 50147",
  initials: "RK",
  gradient: "from-pink-500 to-rose-600",
  avatar: "RK",
};

const SUMMARY_FIELDS = {
  1: [
    { label: "Customer Name", value: "Aisha Verma" },
    { label: "Intent", value: "Schedule plumbing service" },
    { label: "Location", value: "Bandra West, Mumbai" },
    { label: "Booking Time", value: "Tomorrow at 9:00 AM" },
    { label: "Contact", value: "212-555-0198" },
    { label: "Outcome", value: "✅ Booking Confirmed" },
    { label: "AI Confidence", value: "97.4% — High" },
    { label: "Lead Score", value: "88 / 100" },
  ],
};

/* ─── Waveform ────────────────────────────────────────────────── */
function LiveWaveform({ active, speaking }) {
  const N = 36;
  const [bars, setBars] = useState(() => Array.from({ length: N }, () => 8));
  const raf = useRef(null);

  useEffect(() => {
    if (!active) {
      setBars(Array.from({ length: N }, () => 4));
      return;
    }
    let frame = 0;
    const tick = () => {
      frame++;
      setBars((prev) =>
        prev.map((_, i) => {
          const wave = Math.sin(frame * 0.12 + i * 0.35) * 0.4;
          const noise = Math.random() * 0.6;
          const base = speaking ? 28 : 12;
          const amp = speaking ? 44 : 16;
          return Math.max(4, base + amp * (wave + noise));
        }),
      );
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, speaking]);

  return (
    <div className="flex items-center gap-[2px] h-16 justify-center px-2">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: h }}
          transition={{ duration: 0.08, ease: "linear" }}
          style={{ width: 3, borderRadius: 99, minHeight: 4 }}
          className={`${active ? (speaking ? "bg-gradient-to-t from-indigo-600 via-purple-500 to-pink-400" : "bg-gradient-to-t from-indigo-600 to-indigo-400") : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

/* ─── Typing text ─────────────────────────────────────────────── */
function TypingText({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        setDone(true);
        onDone?.();
      }
    }, 22);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="inline-block w-0.5 h-3 bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

/* ─── Call Timer ──────────────────────────────────────────────── */
function CallTimer({ running, startFrom = 0, className = "" }) {
  const [secs, setSecs] = useState(startFrom);
  useEffect(() => {
    setSecs(startFrom);
  }, [startFrom]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <span className={`font-mono ${className}`}>
      {mm}:{ss}
    </span>
  );
}

/* ─── Incoming call modal ────────────────────────────────────── */
function IncomingCallModal({ caller, onAccept, onDecline }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-80 rounded-3xl bg-[#0d0d1e] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Animated top bar */}
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1)",
            backgroundSize: "200% 100%",
          }}
        />

        <div className="p-8 flex flex-col items-center text-center">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(99,102,241,0.4)",
                "0 0 0 20px rgba(99,102,241,0)",
                "0 0 0 0 rgba(99,102,241,0.4)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative mb-5"
          >
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${caller.gradient} flex items-center justify-center text-3xl font-bold text-white shadow-xl`}
            >
              {caller.initials}
            </div>
            {/* 3 layered rings */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.35, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-indigo-400"
            />
            <motion.div
              animate={{ scale: [1, 1.9], opacity: [0.2, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border border-purple-400"
            />
            <motion.div
              animate={{ scale: [1, 2.3], opacity: [0.1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                delay: 0.6,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border border-pink-400"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0d0d1e] flex items-center justify-center shadow-lg">
              <Phone size={12} className="text-white" />
            </div>
          </motion.div>

          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
            Incoming Call
          </p>
          <h2 className="text-2xl font-bold mb-1">{caller.name}</h2>
          <p className="text-sm text-zinc-500 mb-1">{caller.number}</p>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            />
            <span className="text-[10px] font-bold text-indigo-400">
              Voxora AI ready to handle
            </span>
          </div>

          <div className="flex gap-4 w-full">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onDecline}
              className="flex-1 py-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/30 transition-all flex flex-col items-center gap-1"
            >
              <PhoneOff size={22} />
              <span className="text-[10px]">Decline</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onAccept}
              className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 flex flex-col items-center gap-1"
            >
              <Phone size={22} />
              <span className="text-[10px]">Accept</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function AICalls() {
  const [activeCallId, setActiveCallId] = useState(1);
  const [callState, setCallState] = useState("active"); // "active" | "ended"
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [typingIdx, setTypingIdx] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [historyTab, setHistoryTab] = useState("live");
  const [incomingCall, setIncomingCall] = useState(null);
  const [callTime, setCallTime] = useState(0);
  const [aISpeaking, setAISpeaking] = useState(false);
  const [callHistory, setCallHistory] = useState(CALL_HISTORY);
  const [newCallNum, setNewCallNum] = useState("");
  const [showDialpad, setShowDialpad] = useState(false);
  const [synced, setSynced] = useState(false);
  const endRef = useRef(null);
  const timeoutsRef = useRef([]);

  const activeCall = callHistory.find((c) => c.id === activeCallId);
  const conv = CONVERSATIONS[activeCallId] || CONVERSATIONS[1];

  /* Clear all timeouts */
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  /* Start transcript playback for a call */
  const startTranscript = useCallback(
    (convData) => {
      setTranscript([]);
      setTypingIdx(null);
      setShowSummary(false);
      setSynced(false);
      clearAllTimeouts();

      convData.forEach((line, i) => {
        const t1 = setTimeout(() => {
          const isAI = line.role === "ai";
          if (isAI) setAISpeaking(true);
          setTranscript((prev) => [
            ...prev,
            { ...line, id: Date.now() + i, typing: true },
          ]);
          setTypingIdx(i);
          const t2 = setTimeout(
            () => {
              setTranscript((prev) =>
                prev.map((m, idx) =>
                  idx === prev.length - 1 ? { ...m, typing: false } : m,
                ),
              );
              if (isAI) setAISpeaking(false);
            },
            line.text.length * 22 + 400,
          );
          timeoutsRef.current.push(t2);
        }, line.delay);
        timeoutsRef.current.push(t1);
      });

      // End call after last line
      const lastDelay =
        convData[convData.length - 1].delay +
        convData[convData.length - 1].text.length * 22 +
        2000;
      const tEnd = setTimeout(() => endCall(true), lastDelay);
      timeoutsRef.current.push(tEnd);
    },
    [clearAllTimeouts],
  );

  /* Init */
  useEffect(() => {
    startTranscript(conv);
    setCallTime(0);
    setCallState("active");
    return clearAllTimeouts;
  }, [activeCallId]);

  /* Auto-scroll transcript */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  /* Simulate incoming call after 20s */
  useEffect(() => {
    const t = setTimeout(() => {
      setIncomingCall(INCOMING_CALL);
    }, 20000);
    return () => clearTimeout(t);
  }, []);

  const endCall = (auto = false) => {
    clearAllTimeouts();
    setCallState("ended");
    setAISpeaking(false);
    setSummaryLoading(true);
    setTimeout(() => {
      setSummaryLoading(false);
      setShowSummary(true);
    }, 2200);
    if (!auto) {
      setCallHistory((prev) =>
        prev.map((c) =>
          c.id === activeCallId
            ? {
                ...c,
                status: "completed",
                duration: callTime,
                outcome: "Completed",
              }
            : c,
        ),
      );
    }
  };

  const acceptIncoming = () => {
    const newCall = {
      id: Date.now(),
      name: INCOMING_CALL.name,
      initials: INCOMING_CALL.initials,
      status: "live",
      duration: 0,
      summary: "New incoming call…",
      score: 0,
      outcome: null,
      number: INCOMING_CALL.number,
      gradient: INCOMING_CALL.gradient,
    };
    setCallHistory((prev) => [newCall, ...prev]);
    setIncomingCall(null);
    setActiveCallId(newCall.id);
    setCallTime(0);
    setCallState("active");
    setShowSummary(false);
    setTranscript([]);
    startTranscript(CONVERSATIONS[2]);
  };

  const declineIncoming = () => {
    setIncomingCall(null);
    toast.info("Incoming call declined.");
  };

  const selectCall = (call) => {
    if (call.id === activeCallId) return;
    clearAllTimeouts();
    setActiveCallId(call.id);
    setCallTime(0);
    if (call.status === "live") {
      setCallState("active");
      setShowSummary(false);
      startTranscript(CONVERSATIONS[call.id] || CONVERSATIONS[1]);
    } else {
      setCallState("ended");
      setShowSummary(false);
      setTranscript(
        (CONVERSATIONS[call.id] || CONVERSATIONS[1]).map((l, i) => ({
          ...l,
          id: i,
          typing: false,
        })),
      );
    }
  };

  const formatDur = (s) => {
    if (!s) return "—";
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  const liveList = callHistory.filter((c) => c.status === "live");
  const historyList = callHistory.filter((c) => c.status !== "live");
  const displayList = historyTab === "live" ? liveList : historyList;
  const summaryData = SUMMARY_FIELDS[activeCallId] || SUMMARY_FIELDS[1];

  return (
    <>
      {/* ── Incoming call overlay ── */}
      <AnimatePresence>
        {incomingCall && (
          <IncomingCallModal
            caller={incomingCall}
            onAccept={acceptIncoming}
            onDecline={declineIncoming}
          />
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-1">AI Voice Assistant</h1>
          <p className="text-xs text-zinc-500">
            Real-time call management, live transcription, and AI-powered
            booking.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDialpad(!showDialpad)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] text-xs font-bold rounded-xl hover:bg-white/[0.07] transition-all flex items-center gap-1.5 text-zinc-300"
          >
            <Plus size={13} /> Dial Out
          </button>
          <button
            onClick={() => setIncomingCall(INCOMING_CALL)}
            className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
          >
            <Phone size={13} /> Simulate Call
          </button>
        </div>
      </div>

      {/* Dial pad panel */}
      <AnimatePresence>
        {showDialpad && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] flex gap-3 items-center">
              <input
                value={newCallNum}
                onChange={(e) => setNewCallNum(e.target.value)}
                placeholder="+91 90000 00000"
                className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500/40 text-white placeholder:text-zinc-600"
              />
              <button
                onClick={() => {
                  setShowDialpad(false);
                  setIncomingCall({
                    ...INCOMING_CALL,
                    number: newCallNum || INCOMING_CALL.number,
                  });
                }}
                className="px-4 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <PhoneCall size={14} /> Call
              </button>
              <button
                onClick={() => setShowDialpad(false)}
                className="p-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-zinc-400 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          {
            label: "Calls Today",
            value: "47",
            sub: "+12 from yesterday",
            color: "indigo",
          },
          {
            label: "AI Bookings",
            value: "23",
            sub: "+8 confirmed",
            color: "emerald",
          },
          {
            label: "Avg Duration",
            value: "3:42",
            sub: "−18s vs last week",
            color: "violet",
          },
          {
            label: "Success Rate",
            value: "91%",
            sub: "+3% this week",
            color: "blue",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-xl bg-[#0e0e1c]/80 border border-white/[0.06] group hover:border-white/[0.1] transition-all cursor-default"
          >
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">
              {s.label}
            </p>
            <p className="text-xl font-bold mb-0.5">{s.value}</p>
            <p className="text-[10px] text-emerald-400 font-medium">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        style={{ height: "calc(100vh - 300px)", minHeight: 480 }}
      >
        {/* ── LEFT: Call list ── */}
        <div className="lg:col-span-4 flex flex-col gap-2 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.05]">
            {["live", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setHistoryTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${historyTab === tab ? "bg-white text-black shadow" : "text-zinc-500 hover:text-white"}`}
              >
                {tab === "live" ? (
                  <>
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-red-500"
                    />
                    Live ({liveList.length})
                  </>
                ) : (
                  `History (${historyList.length})`
                )}
              </button>
            ))}
          </div>

          {/* Call cards */}
          <div
            className="flex-1 overflow-y-auto space-y-2 pr-0.5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.04) transparent",
            }}
          >
            <AnimatePresence mode="popLayout">
              {displayList.map((call, i) => {
                const isActive = call.id === activeCallId;
                return (
                  <motion.div
                    key={call.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => selectCall(call)}
                    whileHover={{ x: 3 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${isActive ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10" : "bg-white/[0.025] border-white/[0.05] hover:border-white/[0.09] hover:bg-white/[0.04]"}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${call.gradient} flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0`}
                      >
                        {call.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold truncate">
                            {call.name}
                          </h4>
                          {call.status === "live" ? (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full shrink-0">
                              <motion.span
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-1 h-1 rounded-full bg-white"
                              />
                              LIVE
                            </span>
                          ) : call.status === "missed" ? (
                            <span className="text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              Missed
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold text-zinc-500 shrink-0">
                              {formatDur(call.duration)}
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-zinc-600 font-mono mt-0.5">
                          {call.number}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                      "{call.summary}"
                    </p>
                    {call.outcome && (
                      <div className="mt-2 flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-emerald-400" />
                        <span className="text-[9px] text-emerald-400 font-bold">
                          {call.outcome}
                        </span>
                        {call.score > 0 && (
                          <span className="ml-auto text-[9px] font-bold text-indigo-400">
                            {call.score}%
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {displayList.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <PhoneCall size={24} className="text-zinc-700 mb-2" />
                <p className="text-zinc-600 text-xs">
                  No {historyTab === "live" ? "live" : "past"} calls
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Live monitor ── */}
        <div className="lg:col-span-8 bg-[#0a0a18] rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col relative">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#08081a]/80 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeCall?.gradient || "from-indigo-500 to-purple-600"} flex items-center justify-center text-xs font-bold text-white shadow-lg`}
              >
                {activeCall?.initials}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">
                  {activeCall?.name}
                </p>
                <p className="text-[10px] text-zinc-600 font-mono">
                  {activeCall?.number}
                </p>
              </div>
              {callState === "active" && (
                <div className="ml-2 flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                  />
                  <span className="text-[10px] font-bold text-red-400">
                    LIVE
                  </span>
                  <CallTimer
                    running={callState === "active"}
                    startFrom={callTime}
                    className="text-[10px] text-red-300 ml-1"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
                <Star size={14} />
              </button>
              <button className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
                <Settings size={14} />
              </button>
            </div>
          </div>

          {/* Caller hero */}
          <div className="flex flex-col items-center pt-5 pb-4 px-5 border-b border-white/[0.06] bg-gradient-to-b from-indigo-500/[0.04] to-transparent shrink-0 relative overflow-hidden">
            {/* BG aura */}
            {callState === "active" && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-indigo-500/10 blur-[60px] pointer-events-none"
              />
            )}
            <div className="relative mb-3 z-10">
              <AIOrb3D
                speaking={aISpeaking}
                active={callState === "active"}
                size={104}
              />
              {callState === "active" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-bold rounded-full whitespace-nowrap shadow-lg">
                  VOXORA AI
                </div>
              )}
              {callState === "ended" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-700 text-zinc-300 text-[8px] font-bold rounded-full whitespace-nowrap">
                  CALL ENDED
                </div>
              )}
            </div>

            {/* Waveform */}
            <div className="w-full z-10">
              <LiveWaveform
                active={callState === "active"}
                speaking={aISpeaking}
              />
            </div>

            {/* Speaking label */}
            <div className="flex items-center gap-2 z-10 mb-3 h-5">
              <AnimatePresence mode="wait">
                {callState === "active" && (
                  <motion.div
                    key="speaking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    {aISpeaking ? (
                      <>
                        <Sparkles size={11} className="text-indigo-400" />
                        <span className="text-[10px] text-indigo-400 font-bold">
                          Voxora AI speaking...
                        </span>
                      </>
                    ) : (
                      <>
                        <User size={11} className="text-zinc-500" />
                        <span className="text-[10px] text-zinc-500">
                          Customer speaking...
                        </span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-3 z-10">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border text-sm font-medium ${micMuted ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-lg shadow-red-500/10" : "bg-white/[0.05] border-white/[0.08] text-zinc-300 hover:bg-white/[0.09]"}`}
              >
                {micMuted ? <MicOff size={17} /> : <Mic size={17} />}
              </button>

              {callState === "active" ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => endCall(false)}
                  className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-2xl shadow-red-500/40"
                >
                  <PhoneOff size={22} />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setCallState("active");
                    setShowSummary(false);
                    startTranscript(conv);
                  }}
                  className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/40"
                >
                  <PhoneCall size={22} />
                </motion.button>
              )}

              <button
                onClick={() => setSpeakerMuted(!speakerMuted)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border ${speakerMuted ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/[0.05] border-white/[0.08] text-zinc-300 hover:bg-white/[0.09]"}`}
              >
                {speakerMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>
          </div>

          {/* Transcript / Summary */}
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <AnimatePresence mode="wait">
              {/* Summary loading */}
              {summaryLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Sparkles size={28} className="text-indigo-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-bold mb-1">
                      Generating AI Summary
                    </p>
                    <p className="text-xs text-zinc-500">
                      Analysing transcript, intent, and outcomes...
                    </p>
                  </div>
                  <div className="w-48 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                      className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              {showSummary && !summaryLoading && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 overflow-y-auto space-y-2"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-indigo-400" />
                    <h4 className="text-sm font-bold">AI Call Summary</h4>
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold rounded-full border border-indigo-500/20 ml-1">
                      Auto-Generated
                    </span>
                  </div>
                  {summaryData.map(({ label, value }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                    >
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider w-28 shrink-0 mt-0.5">
                        {label}
                      </span>
                      <span className="text-xs text-white leading-relaxed">
                        {value}
                      </span>
                    </motion.div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSynced(true);
                        toast.success("Call summary synced to CRM.");
                      }}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${synced ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"}`}
                    >
                      {synced ? (
                        <>
                          <CheckCircle2 size={13} /> Synced to CRM
                        </>
                      ) : (
                        <>
                          <ArrowUpRight size={13} /> Sync to CRM
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toast.success("Follow-up appointment booked.")}
                      className="flex-1 py-2.5 bg-white/[0.05] text-white text-xs font-bold rounded-xl hover:bg-white/[0.08] border border-white/[0.07] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar size={13} /> Book Follow-up
                    </button>
                    <button
                      onClick={() => toast.success("Summary downloaded in demo mode.")}
                      className="px-3 py-2.5 bg-white/[0.05] border border-white/[0.07] rounded-xl text-zinc-400 hover:text-white transition-all"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Live transcript */}
              {!showSummary && !summaryLoading && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className="text-indigo-400" />
                      <h4 className="text-xs font-bold">Live Transcript</h4>
                      <span className="text-[8px] font-bold text-zinc-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                        AI-Powered
                      </span>
                    </div>
                    {callState === "active" && (
                      <motion.div
                        className="flex items-center gap-1"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[9px] text-red-400 font-bold uppercase">
                          Recording
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <div
                    className="flex-1 overflow-y-auto space-y-3 pr-0.5"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(255,255,255,0.04) transparent",
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {transcript.map((line, i) => (
                        <motion.div
                          key={line.id || i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-3 ${line.role === "ai" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold ${line.role === "ai" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-white/[0.08] text-zinc-400"}`}
                          >
                            {line.role === "ai" ? (
                              <Sparkles size={10} />
                            ) : (
                              activeCall?.initials?.charAt(0)
                            )}
                          </div>
                          <div
                            className={`max-w-[80%] ${line.role === "ai" ? "items-end" : ""} flex flex-col`}
                          >
                            <p
                              className={`text-[9px] font-bold mb-1 ${line.role === "ai" ? "text-indigo-400 text-right" : "text-zinc-400"}`}
                            >
                              {line.role === "ai"
                                ? "Voxora AI"
                                : activeCall?.name}
                            </p>
                            <div
                              className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                line.role === "ai"
                                  ? "bg-gradient-to-br from-indigo-600/80 to-purple-700/80 text-white rounded-tr-none shadow-lg shadow-indigo-500/15"
                                  : "bg-white/[0.06] text-zinc-200 rounded-tl-none border border-white/[0.06]"
                              }`}
                            >
                              {line.typing ? (
                                <TypingText text={line.text} />
                              ) : (
                                line.text
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {transcript.length === 0 && callState === "active" && (
                      <div className="flex items-center gap-2 text-zinc-600 text-xs">
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-zinc-600"
                        />
                        Waiting for first message...
                      </div>
                    )}
                    <div ref={endRef} />
                  </div>

                  {/* AI Intent bar */}
                  {callState === "active" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 flex items-center justify-between gap-3 shrink-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-indigo-400" />
                          AI Intent Detection
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {aISpeaking
                            ? "Generating response..."
                            : "Listening & processing customer intent..."}
                        </p>
                      </div>
                      <button
                        onClick={() => endCall(false)}
                        className="px-3 py-1.5 bg-indigo-500 text-white text-[9px] font-bold rounded-xl hover:bg-indigo-600 transition-all whitespace-nowrap shadow-lg shadow-indigo-500/20"
                      >
                        Take Over
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ringing {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
      `}</style>
    </>
  );
}
