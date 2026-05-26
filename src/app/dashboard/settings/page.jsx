"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Bell,
  Zap,
  Shield,
  CreditCard,
  Globe,
  Palette,
  MessageSquare,
  Phone,
  Key,
  ChevronRight,
  Check,
  X,
  Save,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai", label: "AI Settings", icon: Zap },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const INTEGRATIONS = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: MessageSquare,
    color: "bg-green-500",
    connected: true,
    plan: "Pro",
  },
  {
    id: "instagram",
    name: "Instagram DMs",
    icon: Instagram,
    color: "bg-gradient-to-br from-pink-500 to-purple-600",
    connected: true,
    plan: "Pro",
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    icon: Facebook,
    color: "bg-blue-600",
    connected: false,
    plan: "Pro",
  },
  {
    id: "linkedin",
    name: "LinkedIn Messages",
    icon: Linkedin,
    color: "bg-blue-700",
    connected: true,
    plan: "Enterprise",
  },
  {
    id: "phone",
    name: "AI Voice Calls",
    icon: Phone,
    color: "bg-indigo-600",
    connected: true,
    plan: "Pro",
  },
  {
    id: "website",
    name: "Website Chat Widget",
    icon: Globe,
    color: "bg-violet-600",
    connected: false,
    plan: "Growth",
  },
];

const TONES = [
  "Professional",
  "Friendly",
  "Casual",
  "Formal",
  "Empathetic",
  "Direct",
];
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Arabic",
];

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${on ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "bg-zinc-700"}`}
    >
      <motion.div
        animate={{ x: on ? 20 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

export default function Settings() {
  const { user, mode, setMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLanguage, setAiLanguage] = useState("English");
  const [profile, setProfile] = useState({
    name: "Aarav Mehta",
    email: "alex@techflow.io",
    company: "NivaraTech Pvt. Ltd.",
    timezone: "America/New_York",
  });
  const [notifs, setNotifs] = useState({
    newLead: true,
    aiReply: true,
    missed: false,
    weekly: true,
    booking: true,
  });
  const [aiSettings, setAiSettings] = useState({
    autoReply: true,
    leadScoring: true,
    voiceClone: false,
    multiLang: false,
  });

  useEffect(() => {
    const raw = localStorage.getItem("voxora-settings");
    if (raw) {
      try {
        const savedSettings = JSON.parse(raw);
        if (!savedSettings || typeof savedSettings !== "object") {
          localStorage.removeItem("voxora-settings");
          return;
        }
        if (savedSettings.profile && typeof savedSettings.profile === "object") {
          setProfile((prev) => ({ ...prev, ...savedSettings.profile }));
        }
        if (savedSettings.notifs && typeof savedSettings.notifs === "object") {
          setNotifs((prev) => ({ ...prev, ...savedSettings.notifs }));
        }
        if (
          savedSettings.aiSettings &&
          typeof savedSettings.aiSettings === "object"
        ) {
          setAiSettings((prev) => ({ ...prev, ...savedSettings.aiSettings }));
        }
        if (
          savedSettings.integrations &&
          typeof savedSettings.integrations === "object"
        ) {
          setIntegrations((prev) => ({ ...prev, ...savedSettings.integrations }));
        }
        if (typeof savedSettings.aiTone === "string") setAiTone(savedSettings.aiTone);
        if (typeof savedSettings.aiLanguage === "string") {
          setAiLanguage(savedSettings.aiLanguage);
        }
      } catch {
        localStorage.removeItem("voxora-settings");
      }
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        company: mode === "demo" ? "Demo Workspace" : prev.company,
      }));
    }
  }, [mode, user]);

  const handleSave = () => {
    localStorage.setItem(
      "voxora-settings",
      JSON.stringify({
        profile,
        notifs,
        aiSettings,
        integrations,
        aiTone,
        aiLanguage,
        mode,
      }),
    );
    setSaved(true);
    toast.success("Settings saved.");
    setTimeout(() => setSaved(false), 2500);
  };

  const resetDefaults = () => {
    localStorage.removeItem("voxora-settings");
    setIntegrations(INTEGRATIONS);
    setAiTone("Professional");
    setAiLanguage("English");
    setProfile({
      name: "Aarav Mehta",
      email: "alex@techflow.io",
      company: "NivaraTech Pvt. Ltd.",
      timezone: "America/New_York",
    });
    setNotifs({
      newLead: true,
      aiReply: true,
      missed: false,
      weekly: true,
      booking: true,
    });
    setAiSettings({
      autoReply: true,
      leadScoring: true,
      voiceClone: false,
      multiLang: false,
    });
    toast.success("Demo settings reset.");
  };

  const toggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((ig) =>
        ig.id === id ? { ...ig, connected: !ig.connected } : ig,
      ),
    );
    toast.success("Integration setting updated.");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold mb-1">Settings</h1>
          <p className="text-xs text-zinc-500">
            Manage your Voxora AI workspace, integrations, and preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {[
              { id: "demo", label: "Demo" },
              { id: "launching-soon", label: "Launching Soon" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id);
                  toast.success(
                    item.id === "demo"
                      ? "Demo mode enabled."
                      : "Launching soon preview enabled. Demo workflows remain active.",
                  );
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${mode === item.id ? "bg-indigo-500 text-white" : "text-zinc-500 hover:text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.96 }}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg ${saved ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:opacity-90"}`}
          >
            {saved ? (
              <>
                <Check size={13} /> Saved!
              </>
            ) : (
              <>
                <Save size={13} /> Save Changes
              </>
            )}
          </motion.button>
          <button
            onClick={resetDefaults}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-white/[0.04] border border-white/[0.07] text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-all"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)] overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-48 shrink-0 flex flex-col gap-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${activeTab === tab.id ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25" : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"}`}
              >
                <Icon size={15} />
                {tab.label}
                {activeTab === tab.id && (
                  <ChevronRight size={12} className="ml-auto" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto space-y-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.04) transparent",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">
                      Account Information
                    </h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/30">
                        AR
                      </div>
                      <div>
                        <p className="text-sm font-bold">Aarav Mehta</p>
                        <p className="text-[10px] text-zinc-500 mb-2">
                          NivaraTech Pvt. Ltd. · Pro Plan
                        </p>
                        <button
                          onClick={() => toast.success("Demo avatar refreshed.")}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Change Avatar
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(profile).map(([key, val]) => (
                        <div key={key}>
                          <label className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-1.5 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <input
                            value={val}
                            onChange={(e) =>
                              setProfile((p) => ({
                                ...p,
                                [key]: e.target.value,
                              }))
                            }
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/40 text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">API Key</h3>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
                        <Key size={13} className="text-zinc-600 shrink-0" />
                        <span className="text-xs font-mono text-zinc-400 flex-1">
                          {showKey
                            ? "vx-sk-a2b3c4d5e6f7g8h9i0j1k2l3m4n5"
                            : "vx-sk-••••••••••••••••••••••••"}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="p-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-zinc-400 hover:text-white transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText("demo-public-key");
                          toast.success("Demo API key copied.");
                        }}
                        className="p-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-zinc-400 hover:text-white transition-all"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => toast.success("Demo API key rotated.")}
                        className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI SETTINGS */}
              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">AI Personality</h3>
                    <div className="mb-4">
                      <label className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">
                        Response Tone
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TONES.map((tone) => (
                          <button
                            key={tone}
                            onClick={() => setAiTone(tone)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${aiTone === tone ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25 shadow-lg shadow-indigo-500/10" : "bg-white/[0.04] text-zinc-500 border-white/[0.06] hover:text-white"}`}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">
                        Primary Language
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setAiLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${aiLanguage === lang ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" : "bg-white/[0.04] text-zinc-500 border-white/[0.06] hover:text-white"}`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">AI Features</h3>
                    <div className="space-y-3">
                      {[
                        {
                          key: "autoReply",
                          label: "Auto-Reply Mode",
                          desc: "AI automatically responds to all incoming messages",
                        },
                        {
                          key: "leadScoring",
                          label: "AI Lead Scoring",
                          desc: "Automatically score and prioritize leads by purchase intent",
                        },
                        {
                          key: "voiceClone",
                          label: "Voice Cloning",
                          desc: "Clone your voice for AI phone calls (Pro+)",
                        },
                        {
                          key: "multiLang",
                          label: "Multi-Language Detection",
                          desc: "Auto-detect and reply in customer's language",
                        },
                      ].map(({ key, label, desc }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                        >
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {label}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              {desc}
                            </p>
                          </div>
                          <ToggleSwitch
                            on={aiSettings[key]}
                            onChange={(v) =>
                              setAiSettings((p) => ({ ...p, [key]: v }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* INTEGRATIONS */}
              {activeTab === "integrations" && (
                <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                  <h3 className="text-sm font-bold mb-4">
                    Connected Platforms
                  </h3>
                  {mode === "launching-soon" && (
                    <div className="mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 px-3 py-2 text-[11px] text-indigo-200 font-semibold">
                      Launching soon. These integrations are preview-only in the public demo.
                    </div>
                  )}
                  <div className="space-y-3">
                    {integrations.map((ig) => {
                      const Icon = ig.icon;
                      return (
                        <div
                          key={ig.id}
                          className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] group hover:border-white/[0.09] transition-all"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl ${ig.color} flex items-center justify-center shadow-lg shrink-0`}
                          >
                            <Icon size={18} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold">{ig.name}</p>
                            <p className="text-[9px] text-zinc-600 mt-0.5">
                              {ig.plan} plan ·{" "}
                              {ig.connected ? "Connected" : "Not connected"}
                            </p>
                          </div>
                          <div
                            className={`text-[9px] font-bold px-2 py-1 rounded-full ${ig.connected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500"}`}
                          >
                            {ig.connected ? "● Active" : "○ Inactive"}
                          </div>
                          <button
                            onClick={() => toggleIntegration(ig.id)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${ig.connected ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" : "bg-indigo-500/15 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/25"}`}
                          >
                            {ig.connected ? "Disconnect" : "Connect"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                  <h3 className="text-sm font-bold mb-4">
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: "newLead",
                        label: "New Lead Captured",
                        desc: "Get notified when AI captures a new lead",
                      },
                      {
                        key: "aiReply",
                        label: "AI Reply Sent",
                        desc: "Confirmation when AI sends an automated reply",
                      },
                      {
                        key: "missed",
                        label: "Missed Conversations",
                        desc: "Alert when AI couldn't handle a conversation",
                      },
                      {
                        key: "booking",
                        label: "Booking Confirmations",
                        desc: "Notify on every AI-booked appointment",
                      },
                      {
                        key: "weekly",
                        label: "Weekly Reports",
                        desc: "Weekly analytics summary via email",
                      },
                    ].map(({ key, label, desc }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {label}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            {desc}
                          </p>
                        </div>
                        <ToggleSwitch
                          on={notifs[key]}
                          onChange={(v) =>
                            setNotifs((p) => ({ ...p, [key]: v }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">
                      Password & Authentication
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Current Password",
                        "New Password",
                        "Confirm Password",
                      ].map((label) => (
                        <div key={label}>
                          <label className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-1.5">
                            {label}
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••••"
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/40 text-white"
                          />
                        </div>
                      ))}
                      <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all mt-2">
                        Update Password
                      </button>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <div>
                        <p className="text-xs font-bold">2FA Enabled</p>
                        <p className="text-[10px] text-zinc-500">
                          Authenticator app configured
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING */}
              {activeTab === "billing" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                          Current Plan
                        </span>
                        <h3 className="text-2xl font-bold mt-1">Pro Plan</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          $799/month · Billed monthly
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/30">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        ["AI Messages", "8,291 / 10,000"],
                        ["Channels", "4 / 5"],
                        ["Team Seats", "3 / 5"],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          className="p-3 rounded-xl bg-black/30 border border-white/[0.05] text-center"
                        >
                          <p className="text-xs font-bold">{val}</p>
                          <p className="text-[9px] text-zinc-500 mt-0.5">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20">
                      Upgrade to Enterprise →
                    </button>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#0e0e1c]/80 border border-white/[0.06]">
                    <h3 className="text-sm font-bold mb-4">Billing History</h3>
                    <div className="space-y-2">
                      {[
                        ["May 2026", "$799.00", "Paid"],
                        ["Apr 2026", "$799.00", "Paid"],
                        ["Mar 2026", "$799.00", "Paid"],
                      ].map(([date, amount, status]) => (
                        <div
                          key={date}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                        >
                          <span className="text-xs text-zinc-300">{date}</span>
                          <span className="text-xs font-bold">{amount}</span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
