"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MessageSquare,
  PhoneCall,
  Calendar,
  Download,
  Zap,
  TrendingUp,
  RefreshCw,
  Filter,
  Sparkles,
} from "lucide-react";

const WEEK_DATA = [
  { day: "Mon", leads: 42, conv: 28, calls: 15, revenue: 4200 },
  { day: "Tue", leads: 65, conv: 44, calls: 22, revenue: 6500 },
  { day: "Wed", leads: 51, conv: 36, calls: 18, revenue: 5100 },
  { day: "Thu", leads: 89, conv: 61, calls: 31, revenue: 8900 },
  { day: "Fri", leads: 74, conv: 52, calls: 27, revenue: 7400 },
  { day: "Sat", leads: 38, conv: 24, calls: 12, revenue: 3800 },
  { day: "Sun", leads: 55, conv: 39, calls: 20, revenue: 5500 },
];

const MONTH_DATA = [
  { day: "W1", leads: 280, conv: 190, calls: 95, revenue: 28000 },
  { day: "W2", leads: 340, conv: 240, calls: 120, revenue: 34000 },
  { day: "W3", leads: 410, conv: 295, calls: 148, revenue: 41000 },
  { day: "W4", leads: 390, conv: 275, calls: 138, revenue: 39000 },
];

const CHANNEL_DATA = [
  { name: "WhatsApp", value: 38, color: "#22c55e" },
  { name: "Instagram", value: 24, color: "#ec4899" },
  { name: "LinkedIn", value: 20, color: "#3b82f6" },
  { name: "Voice AI", value: 11, color: "#a78bfa" },
  { name: "Facebook", value: 7, color: "#60a5fa" },
];

const SATISFACTION_DATA = [
  { month: "Jan", score: 82 },
  { month: "Feb", score: 85 },
  { month: "Mar", score: 88 },
  { month: "Apr", score: 84 },
  { month: "May", score: 91 },
  { month: "Jun", score: 94 },
];

const LIVE_EVENTS_FEED = [
  "New lead via WhatsApp — Meera Rao (Score: 91)",
  "AI booking confirmed — Dental Appt at 2PM",
  "Lead converted — Kabir Malhotra → Pro Plan",
  "AI auto-replied — 5 Instagram DMs in batch",
  "Voice call completed — 3:47 min · Outcome: Booked",
  "Automation triggered — Lead Nurture Sequence #3",
  "New lead from LinkedIn — Rohan Kapoor (Score: 88%)",
  "AI sentiment detected: Very Positive on FB thread",
];

const KPIS = [
  {
    title: "Total Revenue",
    value: "$42,500",
    change: "+12.5%",
    trend: "up",
    icon: Zap,
    color: "indigo",
  },
  {
    title: "New Leads",
    value: "1,482",
    change: "+5.2%",
    trend: "up",
    icon: Users,
    color: "emerald",
  },
  {
    title: "AI Conversations",
    value: "8,291",
    change: "+18.4%",
    trend: "up",
    icon: MessageSquare,
    color: "violet",
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    change: "-0.4s",
    trend: "up",
    icon: PhoneCall,
    color: "blue",
  },
];

const colorMap = {
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f0f1e] border border-white/10 rounded-xl p-3 shadow-2xl text-xs">
      <p className="font-bold text-zinc-400 uppercase mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          {p.name}:{" "}
          {typeof p.value === "number" && p.name === "revenue"
            ? `$${p.value.toLocaleString()}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

function AnimatedKPI({ kpi, idx }) {
  const [val, setVal] = useState(0);
  const numericVal = parseFloat(kpi.value.replace(/[^0-9.]/g, ""));
  useEffect(() => {
    let frame = 0;
    const total = 60;
    const t = setInterval(() => {
      frame++;
      setVal(Math.min(numericVal, (numericVal * frame) / total));
      if (frame >= total) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [numericVal]);

  const Icon = kpi.icon;
  const ic = colorMap[kpi.color];
  const prefix = kpi.value.startsWith("$") ? "$" : "";
  const suffix =
    kpi.value.endsWith("s") && !kpi.value.startsWith("$")
      ? "s"
      : kpi.value.includes(",") && !kpi.value.startsWith("$")
        ? ""
        : "";
  const displayVal =
    prefix +
    (numericVal > 1000
      ? Math.round(val).toLocaleString()
      : val.toFixed(numericVal < 10 ? 1 : 0)) +
    suffix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08 }}
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] relative overflow-hidden group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-xl border ${ic}`}>
          <Icon size={18} />
        </div>
        <div
          className={`flex items-center gap-0.5 text-[10px] font-bold ${kpi.trend === "up" ? "text-emerald-400" : "text-red-400"}`}
        >
          {kpi.trend === "up" ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
          {kpi.change}
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
        {kpi.title}
      </p>
      <h3 className="text-2xl font-bold">{displayVal}</h3>
    </motion.div>
  );
}

function MinimalProfessionalCard() {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLightMode, setIsLightMode] = useState(false);
  const progress = 75;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const handleMouseMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((y - centerY) / centerY) * -5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      setIsHovered(false);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const muted = isLightMode ? "text-slate-500" : "text-zinc-500";
  const title = isLightMode ? "text-slate-950" : "text-white";
  const panel = isLightMode
    ? "bg-white text-slate-950 border-slate-200"
    : "bg-[#0e0e1c]/90 text-white border-white/[0.06]";
  const inner = isLightMode
    ? "bg-slate-50 border-slate-100"
    : "bg-white/[0.04] border-white/[0.06]";

  return (
    <div
      ref={cardRef}
      data-no-tilt="true"
      className={`rounded-2xl border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out ${panel}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-sm font-bold ${title}`}>Performance Snapshot</h3>
          <p className={`mt-0.5 text-[11px] ${muted}`}>
            Compact analytics dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLightMode((value) => !value)}
            className={`relative h-7 w-14 rounded-full transition-colors ${
              isLightMode ? "bg-slate-300" : "bg-white/[0.08]"
            }`}
            aria-label="Toggle card mode"
          >
            <span
              className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] shadow-md transition-transform ${
                isLightMode ? "translate-x-0.5 text-amber-500" : "translate-x-7 text-slate-700"
              }`}
            >
              {isLightMode ? "☀" : "◐"}
            </span>
          </button>

          <div className="relative h-[60px] w-[60px]">
            <svg width="60" height="60" className="animate-[float_3s_ease-in-out_infinite]">
              <defs>
                <linearGradient id="snapshotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={isLightMode ? "text-slate-200" : "text-white/10"}
              />
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="none"
                stroke="url(#snapshotGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="-rotate-90 origin-center transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${title}`}>{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`relative mb-5 flex border-b ${isLightMode ? "border-slate-200" : "border-white/[0.08]"}`}>
        {["overview", "analytics", "reports"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative z-10 flex-1 px-2 py-2 text-xs font-bold capitalize transition-colors ${
              activeTab === tab
                ? "text-indigo-400"
                : isLightMode
                  ? "text-slate-500 hover:text-slate-900"
                  : "text-zinc-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{
            left:
              activeTab === "overview"
                ? "0%"
                : activeTab === "analytics"
                  ? "33.333%"
                  : "66.666%",
            width: "33.333%",
          }}
        />
      </div>

      <div className="min-h-[210px] space-y-3">
        {activeTab === "overview" && (
          <>
            <div className={`rounded-xl border p-4 ${inner}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-xs font-medium ${muted}`}>Monthly Revenue</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                  isLightMode
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  +12.5%
                </span>
              </div>
              <p className={`text-2xl font-bold ${title}`}>$24,780</p>
              <div className={`mt-3 h-1.5 overflow-hidden rounded-full ${isLightMode ? "bg-slate-200" : "bg-white/10"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
                  style={{ width: isHovered ? "85%" : "78%" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Users", value: "1,428" },
                { label: "Sessions", value: "3,942" },
                { label: "Convert", value: "4.2%" },
              ].map((metric) => (
                <div key={metric.label} className={`rounded-xl border p-3 ${inner}`}>
                  <p className={`mb-1 text-[10px] ${muted}`}>{metric.label}</p>
                  <p className={`text-sm font-bold ${title}`}>{metric.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-1">
            {[
              { color: "bg-blue-500", label: "Page Views", value: "45,293" },
              { color: "bg-purple-500", label: "Unique Visitors", value: "12,847" },
              { color: "bg-green-500", label: "Bounce Rate", value: "32.4%" },
              { color: "bg-amber-500", label: "Avg. Session", value: "3m 42s" },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between py-3 ${
                  index < 3 ? isLightMode ? "border-b border-slate-100" : "border-b border-white/[0.06]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className={`text-xs ${isLightMode ? "text-slate-700" : "text-zinc-300"}`}>{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${title}`}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-3">
            <div className={`rounded-xl border p-4 ${inner}`}>
              <h4 className={`mb-2 text-xs font-bold ${title}`}>Weekly Summary</h4>
              <p className={`text-xs leading-relaxed ${muted}`}>
                Performance increased by 23% compared to last week. Engagement
                trends remain positive across all channels.
              </p>
            </div>
            <div className={`rounded-xl border p-4 ${inner}`}>
              <h4 className={`mb-2 text-xs font-bold ${title}`}>Key Insights</h4>
              <ul className={`space-y-2 text-xs ${muted}`}>
                {["Mobile traffic up 18%", "Peak hours: 2-4 PM", "Top source: Organic search"].map((insight) => (
                  <li key={insight} className="flex gap-2">
                    <span>•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setActiveTab("analytics")}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
        >
          View Details
        </button>
        <button
          onClick={() => toast.success("Analytics snapshot exported.")}
          className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
            isLightMode
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07] hover:text-white"
          }`}
        >
          Export
        </button>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [range, setRange] = useState("week");
  const [refreshing, setRefreshing] = useState(false);
  const [liveData, setLiveData] = useState(WEEK_DATA);
  const [liveEvents, setLiveEvents] = useState(LIVE_EVENTS_FEED.slice(0, 3));
  const [liveIdx, setLiveIdx] = useState(3);
  const [pulse, setPulse] = useState(false);

  const data = range === "week" ? liveData : MONTH_DATA;

  const doRefresh = () => {
    setRefreshing(true);
    setPulse(true);
    setTimeout(() => {
      setLiveData(
        WEEK_DATA.map((d) => ({
          ...d,
          leads: d.leads + Math.floor(Math.random() * 10 - 5),
          conv: d.conv + Math.floor(Math.random() * 8 - 4),
        })),
      );
      setRefreshing(false);
      setPulse(false);
    }, 1000);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
      // nudge last data point
      setLiveData((prev) =>
        prev.map((d, i) =>
          i === prev.length - 1
            ? {
                ...d,
                leads: d.leads + Math.floor(Math.random() * 3),
                conv: d.conv + Math.floor(Math.random() * 2),
              }
            : d,
        ),
      );
      // add live event
      setLiveEvents((prev) => [
        LIVE_EVENTS_FEED[liveIdx % LIVE_EVENTS_FEED.length],
        ...prev.slice(0, 5),
      ]);
      setLiveIdx((i) => i + 1);
    }, 8000);
    return () => clearInterval(t);
  }, [liveIdx]);

  const totalLeads = data.reduce((s, d) => s + d.leads, 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-1">Performance Analytics</h1>
          <p className="text-xs text-zinc-500">
            Deep dive into automation ROI and customer interaction metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: pulse ? [1, 0.3, 1] : 1 }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl"
          >
            <motion.span
              animate={{ scale: pulse ? [1, 1.5, 1] : 1 }}
              transition={{ duration: 0.6 }}
              className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
            />
            <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">
              Live
            </span>
          </motion.div>
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.05]">
            {["week", "month"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg capitalize transition-all ${range === r ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={doRefresh}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white transition-all"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 0.7 }}
            >
              <RefreshCw size={14} />
            </motion.div>
          </button>
          <button className="px-3 py-2 bg-white text-black text-[11px] font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-lg">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {KPIS.map((kpi, i) => (
          <AnimatedKPI key={kpi.title} kpi={kpi} idx={i} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold">Lead Growth</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Daily leads, conversations & calls
              </p>
            </div>
            <div className="flex gap-2">
              {[
                ["leads", "#6366f1"],
                ["conv", "#10b981"],
                ["calls", "#a78bfa"],
              ].map(([k, c]) => (
                <div
                  key={k}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.04] rounded-lg"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                  <span className="text-[9px] font-bold text-zinc-500 capitalize">
                    {k}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 5, left: -22, bottom: 0 }}
              >
                <defs>
                  {[
                    ["leads", "#6366f1"],
                    ["conv", "#10b981"],
                    ["calls", "#a78bfa"],
                  ].map(([k, c]) => (
                    <linearGradient
                      key={k}
                      id={`ag_${k}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff06"
                />
                <XAxis
                  dataKey={range === "week" ? "day" : "day"}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52525b", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52525b", fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#ag_leads)"
                  name="leads"
                />
                <Area
                  type="monotone"
                  dataKey="conv"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#ag_conv)"
                  name="conv"
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#ag_calls)"
                  name="calls"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
          <h3 className="text-sm font-bold mb-1">Channel Mix</h3>
          <p className="text-[11px] text-zinc-500 mb-3">
            Lead source distribution
          </p>
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHANNEL_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CHANNEL_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f1e",
                    borderColor: "#ffffff10",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xl font-bold">{totalLeads}</p>
              <p className="text-[9px] text-zinc-500 uppercase font-bold">
                Total
              </p>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {CHANNEL_DATA.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[10px] text-zinc-400">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white w-6 text-right">
                    {c.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
          <h3 className="text-sm font-bold mb-4">Daily AI Call Volume</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 0, right: 0, left: -22, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff05"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52525b", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52525b", fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="calls"
                  fill="url(#barGrad)"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                  name="calls"
                />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live feed + efficiency */}
        <div className="flex flex-col gap-3">
          <MinimalProfessionalCard />

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-indigo-400" />
              <h3 className="text-xs font-bold">AI Efficiency</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">
              Saved{" "}
              <span className="text-white font-bold">1,240 human-hours</span> —
              equivalent to{" "}
              <span className="text-white font-bold">7 employees</span> this
              month.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 rounded-xl bg-black/30 border border-white/[0.05] text-center">
                <p className="text-base font-bold text-indigo-400">4m 12s</p>
                <p className="text-[8px] text-zinc-600 uppercase font-bold mt-0.5">
                  Avg Resolve
                </p>
              </div>
              <div className="flex-1 p-2.5 rounded-xl bg-black/30 border border-white/[0.05] text-center">
                <p className="text-base font-bold text-purple-400">4.2%</p>
                <p className="text-[8px] text-zinc-600 uppercase font-bold mt-0.5">
                  Handover
                </p>
              </div>
            </div>
          </div>

          {/* Live event feed */}
          <div className="p-4 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] flex-1">
            <div className="flex items-center gap-2 mb-3">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
              />
              <h4 className="text-xs font-bold">Live AI Events</h4>
            </div>
            <div className="space-y-1.5 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {liveEvents.slice(0, 5).map((e, i) => (
                  <motion.div
                    key={e + i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]"
                  >
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <p className="text-[9px] text-zinc-400 leading-snug">{e}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
