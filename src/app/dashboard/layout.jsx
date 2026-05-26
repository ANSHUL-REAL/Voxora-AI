"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  MessageSquare,
  PhoneCall,
  Users,
  BarChart2,
  Zap,
  Database,
  Settings,
  Bell,
  Search,
  Command,
  Menu,
  X,
  TrendingUp,
  Sparkles,
  ChevronRight,
  LogOut,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { StarsBackground } from "@/components/StarsBackground";

const TOASTS = [
  {
    id: 1,
    msg: "New lead from WhatsApp: Aisha Verma (+92%)",
    type: "lead",
    icon: Users,
  },
  {
    id: 2,
    msg: "AI closed a booking for SevaFix Plumbing.",
    type: "success",
    icon: Zap,
  },
  {
    id: 3,
    msg: "Instagram DM auto-replied (3 messages)",
    type: "info",
    icon: MessageSquare,
  },
  {
    id: 4,
    msg: "High-priority lead detected: Kabir Malhotra",
    type: "lead",
    icon: TrendingUp,
  },
  {
    id: 5,
    msg: "Voice call completed — summary ready",
    type: "success",
    icon: PhoneCall,
  },
];

function LiveToast({ toast, onDismiss }) {
  const Icon = toast.icon;
  useEffect(() => {
    const t = setTimeout(onDismiss, 5500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  const styles = {
    lead: {
      bg: "bg-indigo-950/90 border-indigo-500/40",
      icon: "bg-indigo-500/20 text-indigo-400",
      dot: "bg-indigo-500",
    },
    success: {
      bg: "bg-emerald-950/90 border-emerald-500/40",
      icon: "bg-emerald-500/20 text-emerald-400",
      dot: "bg-emerald-500",
    },
    info: {
      bg: "bg-blue-950/90 border-blue-500/40",
      icon: "bg-blue-500/20 text-blue-400",
      dot: "bg-blue-500",
    },
  };
  const s = styles[toast.type];
  return (
    <motion.div
      initial={{ opacity: 0, x: 120, scale: 0.88 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`flex items-center gap-3 p-4 rounded-2xl ${s.bg} border backdrop-blur-xl shadow-2xl w-[340px] cursor-pointer group`}
      onClick={onDismiss}
    >
      <div className={`p-2 rounded-xl shrink-0 ${s.icon}`}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
          Voxora AI
        </p>
        <p className="text-xs font-semibold text-white leading-snug truncate">
          {toast.msg}
        </p>
      </div>
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${s.dot} shadow-[0_0_8px_currentColor]`}
      />
    </motion.div>
  );
}

function SidebarItem({ icon: Icon, label, href, active, badge }) {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        active
          ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent"
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-bg"
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <Icon
        size={17}
        className={`relative z-10 shrink-0 ${active ? "text-indigo-400" : "group-hover:text-zinc-300"} transition-colors`}
      />
      <span className="text-[13px] font-medium relative z-10 flex-1">
        {label}
      </span>
      {badge && (
        <span className="relative z-10 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-10 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
        />
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const pageContentRef = useRef(null);
  const [toasts, setToasts] = useState([]);
  const [toastIdx, setToastIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(5);
  const [clockTime, setClockTime] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user, mode, status, setMode, signOut, initializeAuth } =
    useAuthStore();

  useEffect(() => initializeAuth(), [initializeAuth]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      status === "unauthenticated" &&
      !user
    ) {
      const next = encodeURIComponent(window.location.pathname);
      navigate(`/sign-in?redirect=${next}`, { replace: true });
    }
  }, [navigate, status, user]);

  useEffect(() => {
    const tick = () =>
      setClockTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(
        () => {
          const toast = {
            ...TOASTS[toastIdx % TOASTS.length],
            uid: Date.now(),
          };
          setToasts((prev) => [...prev.slice(-2), toast]);
          setToastIdx((i) => i + 1);
          setNotifCount((c) => c + 1);
          schedule();
        },
        7000 + Math.random() * 8000,
      );
    };
    schedule();
    return () => clearTimeout(t);
  }, [toastIdx]);

  useEffect(() => {
    const root = pageContentRef.current;
    if (!root) return undefined;

    let activeCard = null;

    const resetCard = (card) => {
      if (!card) return;
      card.style.transform = "";
      card.style.transition = "";
      card.style.willChange = "";
      card.style.transformStyle = "";
      card.style.boxShadow = "";
      card.style.zIndex = "";
    };

    const getTiltCard = (target) => {
      if (!(target instanceof Element)) return null;
      const card = target.closest(
        ".dashboard-workspace .rounded-2xl.border, .dashboard-workspace .rounded-xl.border, [data-hover-card='true']",
      );
      if (
        !card ||
        !root.contains(card) ||
        card.closest("[data-no-tilt='true']") ||
        card.closest("[data-no-hover-card='true']") ||
        card.closest("aside") ||
        card.closest("header")
      ) {
        return null;
      }
      return card;
    };

    const handlePointerMove = (event) => {
      if (window.matchMedia("(hover: none)").matches) return;
      const card = getTiltCard(event.target);

      if (!card) {
        resetCard(activeCard);
        activeCard = null;
        return;
      }

      if (activeCard && activeCard !== card) resetCard(activeCard);
      activeCard = card;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 9;
      const rotateX = ((y / rect.height) - 0.5) * -9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition =
        "transform 90ms ease-out, box-shadow 180ms ease-out";
      card.style.willChange = "transform";
      card.style.transformStyle = "preserve-3d";
      card.style.zIndex = "2";
      card.style.boxShadow =
        "0 20px 45px rgba(99,102,241,0.16), 0 12px 30px rgba(0,0,0,0.35)";
    };

    const handlePointerOut = (event) => {
      if (activeCard && !activeCard.contains(event.relatedTarget)) {
        resetCard(activeCard);
        activeCard = null;
      }
    };

    const handleScroll = () => {
      resetCard(activeCard);
      activeCard = null;
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerout", handlePointerOut);
    root.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerout", handlePointerOut);
      root.removeEventListener("scroll", handleScroll);
      resetCard(activeCard);
    };
  }, []);

  const dismiss = (uid) =>
    setToasts((prev) => prev.filter((t) => t.uid !== uid));

  const displayUser = user || {
    name: "Demo User",
    email: "demo@voxora.ai",
    avatar: "",
  };
  const initials = displayUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleModeChange = (nextMode) => {
    if (nextMode === "launching-soon") {
      setMode("launching-soon");
      toast.info("Production integrations are launching soon. Demo features stay active.");
      return;
    }
    setMode("demo");
    toast.success("Demo mode enabled. Mock APIs are active.");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out.");
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    {
      icon: MessageSquare,
      label: "Unified Inbox",
      href: "/dashboard/inbox",
      badge: "14",
    },
    {
      icon: PhoneCall,
      label: "AI Calls",
      href: "/dashboard/calls",
      badge: "3",
    },
    { icon: Users, label: "Leads", href: "/dashboard/leads" },
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Zap, label: "Automations", href: "/dashboard/automations" },
    { icon: Database, label: "Knowledge Base", href: "/dashboard/knowledge" },
  ];

  return (
    <div
      data-dashboard-shell="true"
      className="relative flex h-screen bg-black text-white font-sans overflow-hidden"
    >
      <StarsBackground
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        speed={36}
        factor={0.025}
        starColor="#fff"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_82%_8%,rgba(99,102,241,0.12),transparent_28%),radial-gradient(circle_at_12%_92%,rgba(168,85,247,0.08),transparent_30%)]" />
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.uid} className="pointer-events-auto">
              <LiveToast toast={t} onDismiss={() => dismiss(t.uid)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[264px] shrink-0 border-r border-white/[0.06] bg-[#080812]/80 backdrop-blur-2xl flex flex-col p-4 gap-0 z-40 fixed lg:relative h-full"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-8 mt-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                <img
                  src="/assets/voxora-logo.png"
                  alt="Voxora AI logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Voxora AI
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto lg:hidden text-zinc-500 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
              Main Menu
            </p>
            <div className="flex flex-col gap-0.5 flex-1">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                />
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/[0.05] flex flex-col gap-0.5">
              <SidebarItem
                icon={Settings}
                label="Settings"
                href="/dashboard/settings"
                active={pathname === "/dashboard/settings"}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/[0.06] bg-[#080812]/70 backdrop-blur-xl flex items-center justify-between px-4 z-20 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all shrink-0"
            >
              <Menu size={18} />
            </button>
            <div className="relative group hidden sm:flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-3.5 h-3.5 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-52 bg-black/20 border border-white/[0.06] rounded-xl py-2 pl-9 pr-14 text-xs focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-zinc-600"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/[0.06] bg-white/[0.03] text-[9px] text-zinc-600 font-mono">
                <Command size={9} />K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:block text-[11px] font-mono text-zinc-600">
              {clockTime}
            </span>
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/[0.06]">
              {[
                { id: "demo", label: "Demo" },
                { id: "launching-soon", label: "Launching Soon" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleModeChange(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                    mode === item.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {mode === "demo" ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Sparkles size={12} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Demo Mode
                </span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span className="text-[10px] font-semibold text-amber-200">
                  Launching Soon
                </span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-400">
                14 Active
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen) setNotifCount(0);
                }}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all relative"
              >
                <Bell size={17} />
                {notifCount > 0 && (
                  <motion.span
                    key={notifCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#07070f] shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#0b0b16] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden z-[120]"
                  >
                    <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                      <h3 className="text-sm font-bold">Notifications</h3>
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="overflow-y-auto max-h-72">
                      {TOASTS.map((n, i) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer group transition-colors"
                          >
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg mt-0.5 shrink-0">
                              <Icon size={12} className="text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-white leading-snug">
                                {n.msg}
                              </p>
                              <p className="text-[10px] text-zinc-600 mt-0.5">
                                {(i + 1) * 2}m ago
                              </p>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 text-center border-t border-white/[0.06]">
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/dashboard/analytics");
                        }}
                        className="text-[11px] text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                      >
                        View all →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-px h-5 bg-white/[0.08]" />
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(false);
                  setProfileOpen((v) => !v);
                }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-[11px] font-bold leading-tight group-hover:text-indigo-400 transition-colors">
                    {displayUser.name}
                  </p>
                  <p className="text-[9px] text-zinc-600">
                    {mode === "demo" ? "Demo Workspace" : "Launching Soon"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all">
                  {displayUser.avatar ? (
                    <img
                      src={displayUser.avatar}
                      alt=""
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-[#0b0b16] flex items-center justify-center text-[10px] font-bold">
                      {initials || "VU"}
                    </div>
                  )}
                </div>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 1, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 isolate w-72 overflow-hidden rounded-2xl border border-white/15 bg-[#05050b] shadow-[0_28px_90px_rgba(0,0,0,0.9)] z-[300]"
                    style={{ backgroundColor: "#05050b" }}
                  >
                    <div className="absolute inset-0 -z-10 bg-[#05050b]" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-purple-500/[0.06]" />
                    <div className="p-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <UserCircle className="text-indigo-400" size={28} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">
                            {displayUser.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {displayUser.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-2 bg-[#05050b]">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleModeChange("demo")}
                          className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${mode === "demo" ? "bg-indigo-500 text-white" : "bg-white/[0.04] text-zinc-500 hover:text-white"}`}
                        >
                          Demo Mode
                        </button>
                        <button
                          onClick={() => handleModeChange("launching-soon")}
                          className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${mode === "launching-soon" ? "bg-amber-500 text-black" : "bg-white/[0.04] text-zinc-500 hover:text-white"}`}
                        >
                          Launching Soon
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/dashboard/settings");
                        }}
                        className="w-full py-2 rounded-xl bg-white/[0.04] text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-all"
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-300 hover:bg-red-500/15 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page */}
        <div
          ref={pageContentRef}
          className="flex-1 overflow-y-auto relative"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.05) transparent",
          }}
        >
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-500/[0.03] blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-purple-500/[0.02] blur-[100px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="dashboard-workspace relative z-0 p-5 lg:p-6 min-h-full"
          >
            <div
              data-no-polish="true"
              className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-300"
            >
              {mode === "demo"
                ? "Demo Preview Active — explore the product with simulated conversations and workflows."
                : "Launching Soon — production integrations are preview-only, and demo workflows remain active."}
            </div>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
