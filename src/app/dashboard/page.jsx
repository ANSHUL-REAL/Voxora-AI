"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  MessageSquare,
  PhoneCall,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Clock,
  CheckCircle2,
  Plus,
  Activity,
  Sparkles,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AIOrb3D from "@/components/AIOrb3D";

const ACTIVITY = [
  {
    id: 1,
    title: "AI replied to Aisha Verma on WhatsApp",
    time: "2m ago",
    type: "message",
    status: "completed",
    platform: "WhatsApp",
  },
  {
    id: 2,
    title: "Incoming call handled — SevaFix Plumbing",
    time: "8m ago",
    type: "call",
    status: "completed",
    platform: "Phone",
  },
  {
    id: 3,
    title: "New lead qualified: Arjun Nair",
    time: "21m ago",
    type: "lead",
    status: "new",
    platform: "LinkedIn",
  },
  {
    id: 4,
    title: "Booking confirmed: Hair Styling @ 3PM",
    time: "45m ago",
    type: "booking",
    status: "completed",
    platform: "Instagram",
  },
  {
    id: 5,
    title: "AI suggested reply — Facebook DM",
    time: "1h ago",
    type: "message",
    status: "pending",
    platform: "Facebook",
  },
  {
    id: 6,
    title: "Lead score updated: Kabir Malhotra → 94%",
    time: "2h ago",
    type: "lead",
    status: "completed",
    platform: "LinkedIn",
  },
  {
    id: 7,
    title: "Automation triggered: Welcome sequence",
    time: "3h ago",
    type: "automation",
    status: "completed",
    platform: "System",
  },
];

const WEEK_DATA = [
  { day: "Mon", leads: 45, conv: 32, calls: 12 },
  { day: "Tue", leads: 52, conv: 41, calls: 18 },
  { day: "Wed", leads: 49, conv: 38, calls: 16 },
  { day: "Thu", leads: 68, conv: 55, calls: 22 },
  { day: "Fri", leads: 74, conv: 61, calls: 28 },
  { day: "Sat", leads: 58, conv: 47, calls: 19 },
  { day: "Sun", leads: 63, conv: 52, calls: 24 },
];

const LIVE_STATS = [
  {
    label: "Total Leads",
    base: 1284,
    change: "+8.4%",
    icon: Users,
    color: "indigo",
    suffix: "",
  },
  {
    label: "Messages",
    base: 42,
    change: "+6.1%",
    icon: MessageSquare,
    color: "violet",
    suffix: "",
  },
  {
    label: "AI Calls",
    base: 156,
    change: "+12.8%",
    icon: PhoneCall,
    color: "purple",
    suffix: "h",
  },
  {
    label: "Conversion",
    base: 24.8,
    change: "+3.2%",
    icon: TrendingUp,
    color: "emerald",
    suffix: "%",
  },
];

const TEAM_ACTIVITY = {
  totalHours: 326.5,
  stats: [
    { label: "AI", value: 55, color: "bg-indigo-400" },
    { label: "Sales", value: 31, color: "bg-violet-400" },
    { label: "Support", value: 23, color: "bg-emerald-400" },
  ],
};

const TEAM_MEMBERS = [
  { id: "av", name: "Aisha Verma", color: "from-indigo-500 to-violet-600" },
  { id: "km", name: "Kabir Malhotra", color: "from-purple-500 to-pink-600" },
  { id: "mr", name: "Meera Rao", color: "from-blue-500 to-indigo-600" },
  { id: "rk", name: "Rohan Kapoor", color: "from-emerald-500 to-teal-600" },
];

const COLOR_MAP = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/20",
    grad: "from-indigo-500/10",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
    grad: "from-violet-500/10",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
    grad: "from-purple-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    grad: "from-emerald-500/10",
  },
};

function AnimatedCounter({ target, suffix }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(start * 10) / 10);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return (
    <span>
      {typeof target === "number" && target % 1 !== 0
        ? val.toFixed(1)
        : Math.round(val)}
      {suffix}
    </span>
  );
}

function StatCard({ stat, index }) {
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  const cardRef = useRef(null);
  const c = COLOR_MAP[stat.color];
  const Icon = stat.icon;

  const onMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const rx = ((cy / rect.height) - 0.5) * -6;
    const ry = ((cx / rect.width) - 0.5) * 6;
    setTilt({
      x: rx,
      y: ry,
      shine: { x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 },
    });
  };
  const onMouseLeave = () => {
    setHover(false);
    setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: "800px",
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hover ? -6 : 0}px)`,
        transition: hover
          ? "transform 0.08s ease-out"
          : "transform 0.4s ease-out",
      }}
      className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] backdrop-blur-xl relative overflow-hidden cursor-pointer group"
    >
      {/* Moving shine */}
      {hover && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)`,
          }}
        />
      )}
      <motion.div
        animate={{ opacity: hover ? 0.8 : 0 }}
        className={`absolute inset-0 bg-gradient-to-br ${c.grad} to-transparent`}
      />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon className={`${c.text} w-5 h-5`} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          <ArrowUpRight size={12} />
          <span>{stat.change}</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-medium text-zinc-500 mb-1">
          {stat.label}
        </p>
        <h3 className="text-2xl font-bold text-white">
          <AnimatedCounter target={stat.base} suffix={stat.suffix} />
        </h3>
      </div>
    </motion.div>
  );
}

function ActivityRow({ item, index }) {
  const typeStyles = {
    message: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      icon: MessageSquare,
    },
    call: { bg: "bg-purple-500/10", text: "text-purple-400", icon: PhoneCall },
    lead: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: Users },
    booking: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      icon: CheckCircle2,
    },
    automation: { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: Zap },
  };
  const statusStyles = {
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    new: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  const s = typeStyles[item.type] || typeStyles.message;
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0 group cursor-pointer hover:bg-white/[0.02] rounded-xl px-2 -mx-2 transition-colors"
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}
      >
        <Icon size={15} className={s.text} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate group-hover:text-white transition-colors">
          {item.title}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 mt-0.5">
          <Clock size={10} /> {item.time} · {item.platform}
        </div>
      </div>
      <span
        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[item.status]}`}
      >
        {item.status}
      </span>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f0f1e] border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">
          {label}
        </p>
        {payload.map((p, i) => (
          <p
            key={i}
            className="text-xs font-semibold"
            style={{ color: p.color }}
          >
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function MarketingDashboard({ onFilterClick, onBoostClick }) {
  const hoverTransition = { type: "spring", stiffness: 300, damping: 18 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0e0e1c]/80 p-5 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Marketing Activities</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            Team output and campaign workload
          </p>
        </div>
        <button
          onClick={onFilterClick}
          className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-2 text-zinc-500 transition-all hover:text-white"
          aria-label="Filter activities"
        >
          <Filter size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <motion.div
          whileHover={{ scale: 1.025, y: -4 }}
          transition={hoverTransition}
          className="rounded-xl border border-white/[0.06] bg-[#09091a]/80 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-zinc-400">
              Team Activities
            </p>
            <Clock className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-white">
              <AnimatedCounter target={TEAM_ACTIVITY.totalHours} suffix="" />
            </span>
            <span className="ml-1 text-xs font-semibold text-zinc-500">
              hours
            </span>
          </div>
          <div className="mb-3 flex h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            {TEAM_ACTIVITY.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={stat.color}
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 1, delay: 0.35 + index * 0.1 }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500">
            {TEAM_ACTIVITY.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${stat.color}`} />
                {stat.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.025, y: -4 }}
          transition={hoverTransition}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-200">Team</p>
            <Users className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-white">
              <AnimatedCounter target={TEAM_MEMBERS.length} suffix="" />
            </span>
            <span className="ml-1 text-xs font-semibold text-emerald-200/70">
              members
            </span>
          </div>
          <div className="flex -space-x-2">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.65 + index * 0.08 }}
                whileHover={{ scale: 1.16, y: -3, zIndex: 10 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#101022] bg-gradient-to-br ${member.color} text-xs font-bold text-white shadow-lg`}
                title={member.name}
              >
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={hoverTransition}
        className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-full bg-[#09091a] p-2">
            <Zap className="h-4 w-4 text-indigo-300" />
          </div>
          <p className="text-xs font-medium leading-snug text-zinc-400">
            Launch a quick nurture campaign for new high-intent leads.
          </p>
        </div>
        <button
          onClick={onBoostClick}
          className="shrink-0 rounded-xl bg-white px-3 py-2 text-[10px] font-bold text-black transition hover:bg-zinc-200"
        >
          Boost
          <ArrowRight className="ml-1 inline h-3 w-3" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardOverview() {
  const [refreshing, setRefreshing] = useState(false);
  const [liveActivity, setLiveActivity] = useState(ACTIVITY);
  const [chartData, setChartData] = useState(WEEK_DATA);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const boostMarketing = () => {
    setLiveActivity((prev) => [
      {
        id: Date.now(),
        title: "Marketing nurture campaign queued for hot leads",
        time: "just now",
        type: "automation",
        status: "completed",
        platform: "System",
      },
      ...prev.slice(0, 6),
    ]);
  };

  // Live activity simulation
  useEffect(() => {
    const LIVE = [
      {
        title: "AI auto-replied to Meera Rao on Instagram",
        type: "message",
        platform: "Instagram",
      },
      {
        title: "New booking confirmed: Dental Appt @ 2PM",
        type: "booking",
        platform: "Phone",
      },
      {
        title: "Lead captured: Rohan Kapoor (Score: 88%)",
        type: "lead",
        platform: "LinkedIn",
      },
      {
        title: "Automation workflow executed successfully",
        type: "automation",
        platform: "System",
      },
    ];
    let i = 0;
    const t = setInterval(() => {
      const item = {
        ...LIVE[i % LIVE.length],
        id: Date.now(),
        time: "just now",
        status: "completed",
      };
      setLiveActivity((prev) => [item, ...prev.slice(0, 6)]);
      i++;
    }, 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-1"
          >
            Good morning, Aarav
          </motion.h1>
          <p className="text-sm text-zinc-500">
            Your AI agents handled{" "}
            <span className="text-white font-semibold">147 interactions</span>{" "}
            while you were away.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refresh}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white transition-all"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <RefreshCw size={16} />
            </motion.div>
          </button>
          <Link
            to="/dashboard/automations"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus size={15} /> New Automation
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {LIVE_STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold">Conversation Volume</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Real-time performance across channels
              </p>
            </div>
            <div className="flex gap-2">
              {[
                ["Leads", "#6366f1"],
                ["Conv.", "#a78bfa"],
                ["Calls", "#10b981"],
              ].map(([label, color]) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-lg"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-semibold text-zinc-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  {[
                    ["leads", "#6366f1"],
                    ["conv", "#a78bfa"],
                    ["calls", "#10b981"],
                  ].map(([key, color]) => (
                    <linearGradient
                      key={key}
                      id={`g_${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff06"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52525b", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52525b", fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#g_leads)"
                />
                <Area
                  type="monotone"
                  dataKey="conv"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#g_conv)"
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#g_calls)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Health */}
        <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] backdrop-blur-xl relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.05] to-transparent pointer-events-none" />
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold">Agent Health</h3>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
              />
            </div>

            <div className="flex justify-center mb-3">
              <AIOrb3D speaking={true} active={true} size={118} />
            </div>

            <div className="space-y-3 flex-1">
              {[
                { label: "Intent Detection", val: 98.4 },
                { label: "Response Accuracy", val: 94.2 },
                { label: "Voice Clarity", val: 96.8 },
                { label: "Lead Scoring", val: 91.5 },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-[11px] font-semibold mb-1.5">
                    <span className="text-zinc-300">{label}</span>
                    <span className="text-white">{val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center gap-3">
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <span className="text-xs font-medium text-zinc-300">
                All systems operational. AI is actively learning.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Activity */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold">Activity Stream</h3>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-green-500"
                />
                <span className="text-[9px] font-bold text-green-400 uppercase">
                  Live
                </span>
              </span>
            </div>
            <Link
              to="/dashboard/inbox"
              className="text-[11px] text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div>
            <AnimatePresence mode="popLayout">
              {liveActivity.slice(0, 6).map((item, i) => (
                <ActivityRow key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <MarketingDashboard
          onFilterClick={refresh}
          onBoostClick={boostMarketing}
        />
      </div>
    </div>
  );
}
