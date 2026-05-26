"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Send,
  Paperclip,
  Smile,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  MessageSquare,
  Sparkles,
  CheckCheck,
  User,
  ShieldCheck,
  Tag,
  Phone,
  MoreVertical,
  ArrowLeft,
  Mic,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const AI_REPLIES = {
  pricing:
    "Thanks for reaching out! 👋 Our packages start at **$299/mo** for small businesses. Could you share your team size and monthly message volume so I can recommend the perfect plan?",
  demo: "Absolutely! I'd love to schedule a personalized demo. We have slots available **Tuesday at 10AM** or **Thursday at 2PM**. Which works better for you? I'll send a calendar invite instantly! 📅",
  support:
    "I'm on it! 🔧 Let me look into this right away. Could you share your account email and a brief description of the issue? Our team typically resolves these within **2–4 hours**.",
  booking:
    "Perfect! To confirm your appointment I need: 1) Your preferred date & time 2) Contact number 3) Any special requirements. Reply with these and I'll lock it in immediately! ✅",
  hello:
    "Hi there! 👋 I'm Voxora AI, your intelligent business assistant. I can help with **pricing, demos, support, or booking appointments**. What can I do for you today?",
  default:
    "Thanks for your message! I've reviewed your query and our AI is processing the best response. A specialist will follow up shortly. Is there anything else I can assist with? 😊",
};

const getAIReply = (msg) => {
  const m = msg.toLowerCase();
  if (
    m.includes("price") ||
    m.includes("cost") ||
    m.includes("plan") ||
    m.includes("paid")
  )
    return AI_REPLIES.pricing;
  if (
    m.includes("demo") ||
    m.includes("trial") ||
    m.includes("show") ||
    m.includes("see")
  )
    return AI_REPLIES.demo;
  if (
    m.includes("help") ||
    m.includes("issue") ||
    m.includes("problem") ||
    m.includes("error")
  )
    return AI_REPLIES.support;
  if (
    m.includes("book") ||
    m.includes("appointment") ||
    m.includes("schedule") ||
    m.includes("meeting")
  )
    return AI_REPLIES.booking;
  if (
    m.includes("hi") ||
    m.includes("hello") ||
    m.includes("hey") ||
    m.includes("good")
  )
    return AI_REPLIES.hello;
  return AI_REPLIES.default;
};

const CHATS = [
  {
    id: 1,
    name: "Aisha Verma",
    company: "DesignWala Studio",
    platform: "whatsapp",
    lastMessage: "How can I book a demo for next Tuesday?",
    time: "2m",
    unread: 2,
    sentiment: "positive",
    score: 85,
    avatar: "AV",
    online: true,
    messages: [
      {
        id: 1,
        role: "user",
        text: "Hi there! I need pricing for your automation package.",
        time: "9:58 AM",
      },
      {
        id: 2,
        role: "ai",
        text: "Thanks for reaching out 👋 We'd love to help! Our Growth plan at $299/mo includes 1,000 AI messages, 3 channels, and full analytics. What's your team size?",
        time: "9:59 AM",
      },
      {
        id: 3,
        role: "user",
        text: "We're a small agency with 10 clients. Around 500 messages per month.",
        time: "10:03 AM",
      },
      {
        id: 4,
        role: "ai",
        text: "Perfect! The Growth plan is ideal for you. It includes WhatsApp, Instagram, and Facebook automation with real-time AI replies. Want me to set up a demo?",
        time: "10:04 AM",
      },
      {
        id: 5,
        role: "user",
        text: "How can I book a demo for next Tuesday?",
        time: "10:08 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Kabir Malhotra",
    company: "NivaraTech Pvt. Ltd.",
    platform: "linkedin",
    lastMessage: "We need enterprise-wide automation.",
    time: "12m",
    unread: 0,
    sentiment: "positive",
    score: 94,
    avatar: "KM",
    online: true,
    messages: [
      {
        id: 1,
        role: "user",
        text: "Hello, we're a 200-person company looking for AI automation.",
        time: "9:00 AM",
      },
      {
        id: 2,
        role: "ai",
        text: "That's exciting! Our Enterprise plan includes unlimited channels, custom AI training, dedicated support, and SSO. Shall I schedule a discovery call with our solutions team?",
        time: "9:02 AM",
      },
      {
        id: 3,
        role: "user",
        text: "We need enterprise-wide automation.",
        time: "9:15 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Meera Rao",
    company: "Gulab Boutique",
    platform: "instagram",
    lastMessage: "Is your API documentation public?",
    time: "1h",
    unread: 1,
    sentiment: "neutral",
    score: 58,
    avatar: "MR",
    online: false,
    messages: [
      {
        id: 1,
        role: "user",
        text: "Hey! Is your API documentation available publicly?",
        time: "8:30 AM",
      },
      {
        id: 2,
        role: "ai",
        text: "Hi Meera! Yes, our full API docs are at docs.voxora.ai 📚 We have REST & WebSocket APIs with SDKs for Node.js, Python, and PHP. Need help getting started?",
        time: "8:31 AM",
      },
      {
        id: 3,
        role: "user",
        text: "Is your API documentation public?",
        time: "8:45 AM",
      },
    ],
  },
  {
    id: 4,
    name: "Rohan Kapoor",
    company: "SevaFix Plumbing",
    platform: "facebook",
    lastMessage: "I need plumbing service tomorrow morning.",
    time: "2h",
    unread: 0,
    sentiment: "neutral",
    score: 45,
    avatar: "RK",
    online: false,
    messages: [
      {
        id: 1,
        role: "user",
        text: "Hi, I need plumbing service tomorrow morning.",
        time: "7:00 AM",
      },
      {
        id: 2,
        role: "ai",
        text: "Of course! We have availability at 8AM, 10AM, and 12PM tomorrow. What time works best, and what's your address?",
        time: "7:01 AM",
      },
    ],
  },
  {
    id: 5,
    name: "Tech Support",
    company: "NivaraTech Pvt. Ltd.",
    platform: "website",
    lastMessage: "LinkedIn account won't connect.",
    time: "4h",
    unread: 3,
    sentiment: "negative",
    score: 20,
    avatar: "TS",
    online: true,
    messages: [
      {
        id: 1,
        role: "user",
        text: "Help! I cannot connect my LinkedIn account to Voxora.",
        time: "5:00 AM",
      },
      {
        id: 2,
        role: "ai",
        text: "I'm sorry to hear that! Go to Settings → Integrations → LinkedIn and click 'Reconnect'. Still stuck?",
        time: "5:01 AM",
      },
      {
        id: 3,
        role: "user",
        text: "Still not working after trying that.",
        time: "5:10 AM",
      },
      {
        id: 4,
        role: "ai",
        text: "Got it — escalating to our technical team. Could you share your account email? We'll resolve within 2 hours.",
        time: "5:11 AM",
      },
      {
        id: 5,
        role: "user",
        text: "LinkedIn account won't connect.",
        time: "5:30 AM",
      },
    ],
  },
];

const PLATFORM_CFG = {
  whatsapp: {
    label: "WhatsApp",
    color: "text-green-400",
    bg: "bg-green-500/10",
    icon: MessageSquare,
  },
  instagram: {
    label: "Instagram",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    icon: Instagram,
  },
  facebook: {
    label: "Facebook",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    icon: Facebook,
  },
  linkedin: {
    label: "LinkedIn",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    icon: Linkedin,
  },
  website: {
    label: "Website",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    icon: Globe,
  },
};

const SUGGESTIONS = [
  "Recommend Pro plan",
  "Schedule a demo",
  "Ask about team size",
  "Send pricing guide",
  "Book appointment",
  "Free trial offer",
];

export default function UnifiedInbox() {
  const [chats, setChats] = useState(() => {
    if (typeof window === "undefined") return CHATS;
    const saved = localStorage.getItem("voxora-inbox-chats");
    if (!saved) return CHATS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : CHATS;
    } catch {
      return CHATS;
    }
  });
  const [selectedId, setSelectedId] = useState(1);
  const [messages, setMessages] = useState(() => chats[0]?.messages || []);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [activeTags, setActiveTags] = useState(["Hot Lead", "Demo Req."]);
  const chatEndRef = useRef(null);
  const { mode } = useAuthStore();

  const selectedChat = chats.find((c) => c.id === selectedId);

  useEffect(() => {
    localStorage.setItem("voxora-inbox-chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const selectChat = useCallback((chat) => {
    setSelectedId(chat.id);
    setMessages(chat.messages);
    setMobileView("chat");
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c)),
    );
  }, []);

  const updateChatMessages = useCallback((chatId, updater, lastMessage) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const nextMessages = updater(chat.messages);
        return {
          ...chat,
          messages: nextMessages,
          lastMessage,
          time: "now",
          unread: 0,
        };
      }),
    );
  }, []);

  const appendMessage = useCallback(
    (message, chatId = selectedId) => {
      setMessages((prev) => [...prev, message]);
      updateChatMessages(chatId, (prev) => [...prev, message], message.text);
    },
    [selectedId, updateChatMessages],
  );

  const updateMessageText = useCallback(
    (messageId, text, chatId = selectedId) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, text } : msg)),
      );
      updateChatMessages(
        chatId,
        (prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, text } : msg,
          ),
        text || "AI is writing...",
      );
    },
    [selectedId, updateChatMessages],
  );

  const generateAIResponse = useCallback(
    async (seedText, contextMessages = messages) => {
      if (aiTyping) return;
      const chatId = selectedId;
      const replyId = Date.now() + 1;
      const latest = seedText ||
        [...contextMessages]
          .reverse()
          .find((m) => m.role === "user" || m.role === "admin")?.text ||
        "";

      setAiTyping(true);

      if (mode !== "real") {
        const reply = latest ? getAIReply(latest) : AI_REPLIES.default;
        setTimeout(
          () => {
            appendMessage(
              {
                id: replyId,
                role: "ai",
                text: reply,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
              chatId,
            );
            setAiTyping(false);
            toast.success("AI response generated.");
          },
          1100 + Math.random() * 700,
        );
        return;
      }

      try {
        const response = await fetch("/api/ai/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: latest,
            conversation: contextMessages.slice(-8),
            mode,
            tone: "professional",
          }),
        });

        if (!response.ok) throw new Error("AI request failed");

        const aiMessage = {
          id: replyId,
          role: "ai",
          text: "",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setAiTyping(false);
        appendMessage(aiMessage, chatId);

        if (!response.body) {
          const text = await response.text();
          updateMessageText(replyId, text, chatId);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          updateMessageText(replyId, fullText.trim(), chatId);
        }
        toast.success("AI response generated.");
      } catch {
        const fallback = latest ? getAIReply(latest) : AI_REPLIES.default;
        setAiTyping(false);
        appendMessage(
          {
            id: replyId,
            role: "ai",
            text: fallback,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          chatId,
        );
        toast.error("AI service unavailable. Used smart mock fallback.");
      }
    },
    [
      aiTyping,
      appendMessage,
      messages,
      mode,
      selectedId,
      updateMessageText,
    ],
  );

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now(),
      role: "admin",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const nextMessages = [...messages, newMsg];
    appendMessage(newMsg);
    setInput("");
    toast.success("Message sent.");
    generateAIResponse(text, nextMessages);
  }, [appendMessage, generateAIResponse, input, messages]);

  const triggerAIReply = useCallback(async () => {
    if (aiTyping) return;
    const last = [...messages]
      .reverse()
      .find((m) => m.role === "user" || m.role === "admin");
    const latest = last?.text || selectedChat?.lastMessage || "";
    setAiTyping(true);
    try {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: latest,
          conversation: messages.slice(-8),
          mode,
          tone: "professional",
        }),
      });
      const suggestion = response.ok ? await response.text() : getAIReply(latest);
      setInput(suggestion.trim());
      toast.success("AI suggested a reply.");
    } catch {
      setInput(getAIReply(latest));
      toast.error("AI fallback suggestion inserted.");
    } finally {
      setAiTyping(false);
    }
  }, [messages, aiTyping, mode, selectedChat]);

  const filteredChats = chats.filter((c) => {
    const matchTab = activeTab === "all" || c.platform === activeTab;
    const matchSearch =
      !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const sentColors = {
    positive: "bg-emerald-500/10 text-emerald-400",
    negative: "bg-red-500/10 text-red-400",
    neutral: "bg-zinc-800 text-zinc-400",
  };
  const tabs = [
    { id: "all", label: "All" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "instagram", label: "IG" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "facebook", label: "FB" },
  ];
  const pCfg = selectedChat ? PLATFORM_CFG[selectedChat.platform] : null;
  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="flex h-[calc(100vh-108px)] w-full min-w-0 gap-3 overflow-hidden xl:gap-4">
      {/* ── CHAT LIST ── */}
      <div
        className={`${mobileView === "chat" ? "hidden lg:flex" : "flex"} flex-col w-full min-w-0 lg:w-72 lg:min-w-72 shrink-0 gap-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold">Inbox</h1>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => toast.info("Conversation filters are active.")}
              className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-500 hover:text-white transition-colors"
            >
              <Filter size={13} />
            </button>
            <button
              onClick={() => {
                const newChat = {
                  id: Date.now(),
                  name: "New Website Lead",
                  company: "Live Chat",
                  platform: "whatsapp",
                  lastMessage: "Hi, I am interested in Voxora AI.",
                  time: "now",
                  unread: 1,
                  sentiment: "positive",
                  score: 72,
                  avatar: "NL",
                  online: true,
                  messages: [
                    {
                      id: Date.now() + 1,
                      role: "user",
                      text: "Hi, I am interested in Voxora AI.",
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  ],
                };
                setChats((prev) => [newChat, ...prev]);
                toast.success("New demo conversation created.");
              }}
              className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-500 hover:text-white transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-3 h-3" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-indigo-500/40 placeholder:text-zinc-600"
          />
        </div>
        <div
          className="flex gap-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap shrink-0 transition-all ${activeTab === tab.id ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25" : "bg-white/[0.03] text-zinc-500 border border-transparent hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="flex-1 overflow-y-auto space-y-1.5 pr-0.5"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.04) transparent",
          }}
        >
          <AnimatePresence>
            {filteredChats.map((chat, i) => {
              const cfg = PLATFORM_CFG[chat.platform];
              const PIcon = cfg.icon;
              const isActive = selectedId === chat.id;
              return (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => selectChat(chat)}
                  data-no-hover-card="true"
                  className={`voxora-message-card p-3 rounded-xl cursor-pointer transition-colors border group ${isActive ? "bg-indigo-500/10 border-indigo-500/25" : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04]"}`}
                >
                  <div className="flex gap-2.5">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-[11px] text-indigo-300 border border-indigo-500/20">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#07070f]" />
                      )}
                      <div
                        className={`absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full ${cfg.bg} flex items-center justify-center border border-white/[0.06]`}
                      >
                        <PIcon size={7} className={cfg.color} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-[11px] font-bold truncate">
                          {chat.name}
                        </p>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {chat.unread > 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.7)]" />
                          )}
                          <span className="text-[9px] text-zinc-600">
                            {chat.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {chat.lastMessage}
                      </p>
                      <div className="flex gap-1 mt-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${sentColors[chat.sentiment]}`}
                        >
                          {chat.sentiment}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-bold">
                          {chat.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CHAT WINDOW ── */}
      <div
        className={`${mobileView === "list" ? "hidden lg:flex" : "flex"} flex-1 flex-col bg-[#0c0c1a]/80 rounded-2xl border border-white/[0.06] overflow-hidden min-w-0`}
      >
        {selectedChat && pCfg ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-[54px] border-b border-white/[0.06] bg-[#09091a]/80 backdrop-blur-sm shrink-0">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileView("list")}
                  className="lg:hidden text-zinc-500 hover:text-white mr-1"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-[11px] text-indigo-300">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#09091a]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-bold">
                      {selectedChat.name}
                    </h3>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${pCfg.bg} ${pCfg.color}`}
                    >
                      {pCfg.label}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 truncate text-[9px] text-zinc-600">
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    {selectedChat.company} · AI Active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toast.success("Voice call simulation opened.")}
                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  <Phone size={14} />
                </button>
                <button
                  onClick={() => toast.info("Search this conversation.")}
                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  <Search size={14} />
                </button>
                <button
                  onClick={() => toast.info("Conversation actions ready.")}
                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.04) transparent",
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div className="max-w-[82%] group relative">
                      {msg.role === "ai" && (
                        <div className="absolute -top-4 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Sparkles size={9} className="text-indigo-400" />
                          <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider">
                            AI Agent
                          </span>
                        </div>
                      )}
                      <div
                        data-no-hover-card="true"
                        className={`break-words px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "voxora-message-bubble bg-[#1c1c2e] text-zinc-200 rounded-tl-none border border-white/[0.06]"
                            : msg.role === "admin"
                              ? "voxora-message-bubble bg-white/[0.07] text-white rounded-tr-none border border-white/[0.08]"
                              : "voxora-message-bubble bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none shadow-lg shadow-indigo-500/20"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`flex items-center gap-1 mt-1 text-[9px] text-zinc-600 ${msg.role === "user" ? "pl-1" : "justify-end pr-1"}`}
                      >
                        {msg.time}{" "}
                        {msg.role === "ai" && (
                          <CheckCheck size={10} className="text-indigo-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <AnimatePresence>
                {aiTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-end"
                  >
                    <div
                      data-no-hover-card="true"
                      className="voxora-message-bubble flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600/80 to-purple-700/80 rounded-2xl rounded-tr-none border border-indigo-500/30"
                    >
                      <Sparkles size={10} className="text-indigo-300" />
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.7,
                            delay: d,
                          }}
                          className="w-1.5 h-1.5 bg-white/60 rounded-full"
                        />
                      ))}
                      <span className="text-[9px] text-indigo-200 font-medium">
                        AI writing...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            <div
              className="px-4 py-2 border-t border-white/[0.04] bg-indigo-500/[0.03] flex items-center gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-500/15 rounded-xl border border-indigo-500/20 shrink-0">
                <Sparkles size={10} className="text-indigo-400" />
                <span className="text-[9px] font-bold text-indigo-400">AI</span>
              </div>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-zinc-400 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-500/20 whitespace-nowrap transition-all shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-[#09091a]/80 border-t border-white/[0.05] shrink-0">
              <div className="flex min-w-0 items-center gap-2 bg-white/[0.04] rounded-xl p-2 border border-white/[0.06] focus-within:border-indigo-500/30 transition-all">
                <button
                  onClick={() => toast.success("Attachment uploaded to demo chat.")}
                  className="p-1.5 text-zinc-600 hover:text-white transition-colors shrink-0"
                >
                  <Paperclip size={14} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-600 text-white min-w-0"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toast.info("Voice note recorded in demo mode.")}
                    className="p-1.5 text-zinc-600 hover:text-white transition-colors"
                  >
                    <Mic size={14} />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={triggerAIReply}
                    disabled={aiTyping}
                    className="px-2 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-bold hover:bg-indigo-500/30 transition-all flex items-center gap-1 disabled:opacity-40"
                  >
                    <Sparkles size={10} /> AI
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`p-2 rounded-xl transition-all ${input.trim() ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600" : "bg-white/[0.05] text-zinc-600"}`}
                  >
                    <Send size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={36} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-600 text-sm">Select a conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* ── DETAILS ── */}
      {selectedChat && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden 2xl:flex flex-col w-[240px] shrink-0 gap-3 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="p-4 rounded-xl bg-[#0c0c1a]/80 border border-white/[0.06] text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-0.5 mx-auto mb-2 border border-indigo-500/20">
              <div className="w-full h-full rounded-full bg-[#09091a] flex items-center justify-center font-bold text-base text-indigo-300">
                {selectedChat.avatar}
              </div>
            </div>
            <h3 className="text-xs font-bold mb-0.5">{selectedChat.name}</h3>
            <p className="text-[9px] text-zinc-600">{selectedChat.company}</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 rounded-lg bg-[#09091a] border border-white/[0.05]">
                <p className="text-[8px] text-zinc-600 font-bold uppercase mb-0.5">
                  Score
                </p>
                <p className="text-sm font-bold text-indigo-400">
                  {selectedChat.score}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#09091a] border border-white/[0.05]">
                <p className="text-[8px] text-zinc-600 font-bold uppercase mb-0.5">
                  Mood
                </p>
                <p
                  className={`text-sm font-bold capitalize ${selectedChat.sentiment === "positive" ? "text-emerald-400" : selectedChat.sentiment === "negative" ? "text-red-400" : "text-zinc-400"}`}
                >
                  {selectedChat.sentiment}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c1a]/80 border border-white/[0.06]">
            <p className="text-[10px] font-bold text-white flex items-center gap-1.5 mb-2.5">
              <Tag size={11} className="text-indigo-400" /> Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Hot Lead", "Demo Req.", "Enterprise", "VIP", "Follow-up"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTags((p) =>
                        p.includes(tag)
                          ? p.filter((t) => t !== tag)
                          : [...p, tag],
                      )
                    }
                    className={`px-2 py-0.5 rounded-full text-[8px] font-bold border transition-all ${activeTags.includes(tag) ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" : "bg-white/[0.03] text-zinc-600 border-white/[0.05] hover:text-white"}`}
                  >
                    {tag}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={13} className="text-indigo-400" />
              <p className="text-[11px] font-bold">AI Insight</p>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">
              High purchase intent detected. Recommend sending booking link
              immediately.
            </p>
            <button
              onClick={triggerAIReply}
              className="w-full py-2 bg-indigo-500 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
            >
              Use AI Reply
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
