"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Database,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Radio,
  Users,
  Workflow,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import Globe3D from "@/components/Globe3D";
import { StarsBackground } from "@/components/StarsBackground";
import { useAuthStore } from "@/store/authStore";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function MagneticButton({ children, distance = 0.18, className = "" }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (event) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (event.clientX - centerX) * distance,
      y: (event.clientY - centerY) * distance,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
    >
      {children}
    </div>
  );
}

function MarkerHighlight({
  before = "",
  highlight,
  after = "",
  markerColor = "linear-gradient(90deg, rgba(99,102,241,0.92), rgba(168,85,247,0.86), rgba(59,130,246,0.8))",
  className = "",
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setActive(true), 250);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <span className={cn("marker-highlight", className)} style={{ display: "inline" }}>
      {before}
      <span
        className="marker-highlight__target"
        style={{
          display: "inline",
          position: "relative",
          padding: "0 0.08em",
          color: "#f8f7ff",
          background: markerColor,
          backgroundRepeat: "no-repeat",
          backgroundSize: active ? "100% 72%" : "0% 72%",
          backgroundPosition: "0 82%",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          transition:
            "background-size 1s cubic-bezier(0.22, 1, 0.36, 1), color 400ms ease",
          textShadow:
            "0 2px 18px rgba(0, 0, 0, 0.82), 0 0 22px rgba(139, 92, 246, 0.42)",
          filter: "drop-shadow(0 0 22px rgba(99,102,241,0.22))",
        }}
      >
        {highlight}
      </span>
      {after}
    </span>
  );
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.05 },
    { top: "24%", left: "50%", scale: 0.78 },
    { top: "18%", left: "88%", scale: 1.4 },
    { top: "52%", left: "50%", scale: 1.22 },
  ],
};

const parsePercent = (value) => parseFloat(String(value).replace("%", ""));

const toTransform = (position) =>
  `translate3d(${position.left}vw, ${position.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${position.scale}, ${position.scale}, 1)`;

function createPixel(ctx, canvas, x, y, color, baseSpeed, delay) {
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pixel = {
    x,
    y,
    color,
    ctx,
    speed: rand(0.1, 0.9) * baseSpeed,
    size: 0,
    sizeStep: Math.random() * 0.38,
    minSize: 0.45,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: Math.random() * 4 + (canvas.width + canvas.height) * 0.01,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = pixel.maxSizeInt * 0.5 - pixel.size * 0.5;
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x + offset, pixel.y + offset, pixel.size, pixel.size);
    },
    appear() {
      pixel.isIdle = false;
      if (pixel.counter <= pixel.delay) {
        pixel.counter += pixel.counterStep;
        return;
      }
      if (pixel.size >= pixel.maxSize) pixel.isShimmer = true;
      if (pixel.isShimmer) pixel.shimmer();
      else pixel.size += pixel.sizeStep;
      pixel.draw();
    },
    disappear() {
      pixel.isShimmer = false;
      pixel.counter = 0;
      if (pixel.size <= 0) {
        pixel.isIdle = true;
        return;
      }
      pixel.size -= 0.1;
      pixel.draw();
    },
    shimmer() {
      if (pixel.size >= pixel.maxSize) pixel.isReverse = true;
      else if (pixel.size <= pixel.minSize) pixel.isReverse = false;
      pixel.size += pixel.isReverse ? -pixel.speed : pixel.speed;
    },
  };

  return pixel;
}

function PixelCanvas({ colors, gap = 5, speed = 30 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(0);
  const lastFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current
      ? 0
      : Math.min(speed, 100) * 0.001;
    const pixels = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy);
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode) => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixels = pixelsRef.current;
      pixels.forEach((pixel) => pixel[mode]());

      if (pixels.every((pixel) => pixel.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    lastFrameRef.current = performance.now();
    init();

    const resizeObserver = new ResizeObserver(init);
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);

    const card = wrapRef.current?.parentElement;
    const handleEnter = () => animate("appear");
    const handleLeave = () => animate("disappear");
    card?.addEventListener("mouseenter", handleEnter);
    card?.addEventListener("mouseleave", handleLeave);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
      card?.removeEventListener("mouseenter", handleEnter);
      card?.removeEventListener("mouseleave", handleLeave);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

const FEATURE_TILES = [
  {
    title: "Unified Inbox",
    detail: "One shared workspace",
    color: "#8b5cf6",
    colors: ["#8b5cf6", "#a78bfa", "#c084fc"],
    icon: MessageSquare,
    row: 1,
    col: 1,
  },
  {
    title: "WhatsApp",
    detail: "Customer messages",
    color: "#22c55e",
    colors: ["#22c55e", "#4ade80", "#86efac"],
    icon: MessageCircle,
    row: 1,
    col: 2,
  },
  {
    title: "Instagram",
    detail: "DM automation",
    color: "#f472b6",
    colors: ["#f472b6", "#e879f9", "#fb7185"],
    icon: Instagram,
    row: 1,
    col: 3,
  },
  {
    title: "Facebook",
    detail: "Page inbox",
    color: "#60a5fa",
    colors: ["#60a5fa", "#38bdf8", "#93c5fd"],
    icon: Facebook,
    row: 1,
    col: 4,
  },
  {
    title: "LinkedIn",
    detail: "Lead conversations",
    color: "#38bdf8",
    colors: ["#38bdf8", "#0ea5e9", "#7dd3fc"],
    icon: Linkedin,
    row: 2,
    col: 1,
  },
  {
    title: "Website Chat",
    detail: "Live chat widget",
    color: "#14b8a6",
    colors: ["#14b8a6", "#2dd4bf", "#99f6e4"],
    icon: Radio,
    row: 3,
    col: 1,
  },
  {
    title: "AI Voice",
    detail: "Calls and transcripts",
    color: "#818cf8",
    colors: ["#818cf8", "#6366f1", "#a5b4fc"],
    icon: PhoneCall,
    row: 2,
    col: 4,
  },
  {
    title: "Automations",
    detail: "Workflow builder",
    color: "#fb7185",
    colors: ["#fb7185", "#fda4af", "#e11d48"],
    icon: Workflow,
    row: 3,
    col: 4,
  },
  {
    title: "Live Dashboard",
    detail: "Realtime metrics",
    color: "#c084fc",
    colors: ["#c084fc", "#a855f7", "#e879f9"],
    icon: BarChart3,
    row: 4,
    col: 1,
  },
  {
    title: "Knowledge Base",
    detail: "Docs and FAQs",
    color: "#f59e0b",
    colors: ["#f59e0b", "#fbbf24", "#fde68a"],
    icon: Database,
    row: 4,
    col: 2,
  },
  {
    title: "Lead CRM",
    detail: "Pipeline stages",
    color: "#a3e635",
    colors: ["#a3e635", "#bef264", "#84cc16"],
    icon: Users,
    row: 4,
    col: 3,
  },
  {
    title: "AI Training",
    detail: "Learn from docs",
    color: "#f97316",
    colors: ["#f97316", "#fb923c", "#fed7aa"],
    icon: Bot,
    row: 4,
    col: 4,
  },
];

function FeaturePixelTile({ feature, compact = false }) {
  const Icon = feature.icon;
  return (
    <div
      className="group relative isolate grid min-h-[92px] cursor-pointer place-items-center overflow-hidden bg-[#090912]/92 p-4 transition duration-300 hover:z-[2] hover:bg-[#101022] hover:shadow-[0_16px_42px_-18px_var(--feature-color),0_0_0_1px_color-mix(in_srgb,var(--feature-color)_45%,transparent)]"
      style={{
        "--feature-color": feature.color,
        gridRow: compact ? undefined : feature.row,
        gridColumn: compact ? undefined : feature.col,
      }}
    >
      <PixelCanvas colors={feature.colors} gap={5} speed={30} />
      <div className="relative z-[1] flex flex-col items-center gap-2 text-center transition duration-300 group-hover:scale-[1.05]">
        <Icon
          className="h-5 w-5 text-zinc-500 transition duration-300 group-hover:text-[var(--feature-color)]"
          strokeWidth={2}
        />
        <div>
          <p className="text-xs font-bold text-zinc-200 transition group-hover:text-white">
            {feature.title}
          </p>
          <p className="mt-1 text-[10px] font-medium text-zinc-600 transition group-hover:text-zinc-400">
            {feature.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeaturePixelGrid() {
  return (
    <div className="mx-auto mb-9 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.06] shadow-[0_26px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        className="hidden gap-px bg-white/[0.07] md:grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: "repeat(4, minmax(92px, auto))",
        }}
      >
        {FEATURE_TILES.map((feature) => (
          <FeaturePixelTile key={feature.title} feature={feature} />
        ))}
        <div
          className="flex min-h-[184px] flex-col items-center justify-center gap-4 bg-[#0b0b16]/95 p-6 text-center"
          style={{ gridColumn: "2 / span 2", gridRow: "2 / span 2" }}
        >
          <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
            Voxora Features
          </span>
          <h2 className="max-w-md text-2xl font-bold leading-tight text-white sm:text-3xl">
            Everything in the demo responds like a real AI workspace.
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
            Hover each capability to see the system light up, then enter the demo
            to test inboxes, calls, workflows, analytics, and AI training.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/[0.07] md:hidden">
        <div className="col-span-2 flex flex-col items-center justify-center gap-3 bg-[#0b0b16]/95 p-6 text-center">
          <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">
            Voxora Features
          </span>
          <h2 className="max-w-sm text-xl font-bold leading-tight text-white">
            Demo features that feel live.
          </h2>
        </div>
        {FEATURE_TILES.slice(0, 8).map((feature) => (
          <FeaturePixelTile key={feature.title} feature={feature} compact />
        ))}
      </div>
    </div>
  );
}

function ScrollGlobe({
  sections,
  globeConfig = defaultGlobeConfig,
  className = "",
}) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState(() =>
    toTransform({
      top: parsePercent(globeConfig.positions[0].top),
      left: parsePercent(globeConfig.positions[0].left),
      scale: globeConfig.positions[0].scale,
    }),
  );
  const sectionRefs = useRef([]);
  const animationFrameId = useRef();

  const calculatedPositions = useMemo(
    () =>
      globeConfig.positions.map((position) => ({
        top: parsePercent(position.top),
        left: parsePercent(position.left),
        scale: position.scale,
      })),
    [globeConfig.positions],
  );

  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      docHeight <= 0 ? 0 : Math.min(Math.max(scrollTop / docHeight, 0), 1);
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        newActiveSection = index;
      }
    });

    setScrollProgress(progress);
    setActiveSection(newActiveSection);
    setGlobeTransform(toTransform(calculatedPositions[newActiveSection]));
  }, [calculatedPositions]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      animationFrameId.current = requestAnimationFrame(() => {
        updateScrollPosition();
        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [updateScrollPosition]);

  return (
    <div
      className={cn(
        "relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#07070f] text-white [font-family:'Oreon_Demo','Oreon Demo',ui-sans-serif,system-ui,sans-serif]",
        className,
      )}
    >
      <StarsBackground
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[12] bg-transparent opacity-100 mix-blend-screen"
        speed={38}
        factor={0.045}
        starColor="#fff"
      />
      <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-white/[0.06]">
        <div
          className="h-full origin-left bg-gradient-to-r from-indigo-400 via-violet-500 to-fuchsia-500 shadow-[0_0_18px_rgba(139,92,246,0.65)]"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transition: "transform 150ms ease-out",
          }}
        />
      </div>

      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-white/[0.08] bg-[#07070f] shadow-[0_14px_46px_rgba(0,0,0,0.52)]">
        <div className="flex h-16 w-full items-center px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex min-w-fit shrink-0 items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0b0b16] px-2.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#090912] shadow-[0_0_22px_rgba(99,102,241,0.35)]">
              <img
                src="/assets/voxora-logo.png"
                alt="Voxora AI logo"
                className="h-8 w-8 object-contain"
              />
            </span>
            <span className="whitespace-nowrap bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-sm font-bold text-transparent sm:text-base">
              Voxora AI
            </span>
          </Link>

          <nav className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <MagneticButton className="hidden sm:block">
              <button
                onClick={() => {
                  toast.info(
                    "Account launch is coming soon. Use Demo User for the preview.",
                  );
                }}
                className="rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-bold text-zinc-200 transition hover:border-violet-300/35 hover:bg-white/[0.08] active:scale-[0.98] sm:text-sm"
              >
                Launching Soon
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={sections[0]?.actions?.[0]?.onClick}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-zinc-200 active:scale-[0.98] sm:text-sm"
              >
                Demo User
              </button>
            </MagneticButton>
          </nav>
        </div>
      </header>

      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="flex w-44 flex-col gap-1.5 rounded-2xl border border-white/[0.1] bg-[#090912]/92 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {sections.map((section, index) => (
            <div key={section.id} className="relative z-10">
              <button
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition",
                  activeSection === index
                    ? "bg-violet-400/15 text-white"
                    : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200",
                )}
                aria-label={`Go to ${section.badge}`}
              >
                <span className="truncate text-[10px] font-bold uppercase tracking-[0.12em]">
                  {section.badge}
                </span>
                <span
                  className={cn(
                    "block shrink-0 rounded-full transition-all",
                    activeSection === index
                      ? "h-2.5 w-2.5 bg-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.95)]"
                      : "h-1.5 w-1.5 bg-zinc-600",
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="fixed z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          opacity: activeSection === sections.length - 1 ? 0.38 : 0.86,
        }}
      >
        <div className="h-[460px] w-[460px] sm:h-[620px] sm:w-[620px] lg:h-[760px] lg:w-[760px]">
          <Globe3D className="h-full w-full" />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(217,70,239,0.12),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(7,7,15,0.92)_0%,rgba(7,7,15,0.62)_34%,rgba(7,7,15,0.18)_64%,rgba(7,7,15,0.72)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(element) => {
            sectionRefs.current[index] = element;
          }}
          className={cn(
            "relative z-20 flex min-h-screen w-full max-w-full flex-col overflow-hidden px-4 pb-24 sm:px-8 md:px-12 lg:px-20",
            index === 0
              ? "justify-start pt-28 sm:pt-32 lg:pt-36"
              : "justify-center pt-32",
            section.align === "center" && "items-center text-center",
            section.align === "right" && "items-end text-right",
            section.layout === "balanced" && "items-center text-center",
            (!section.align || section.align === "left") &&
              section.layout !== "balanced" &&
              "items-start text-left",
          )}
        >
          <div
            className={cn(
              "w-full transition-all duration-700",
              section.layout === "balanced" && "max-w-5xl",
              section.align === "center"
                ? "max-w-3xl"
                : "max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl",
            )}
          >
            <div
              className={cn(
                "mb-8 flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 shadow-[0_0_28px_rgba(124,58,237,0.18)]",
                index === 0 && "mb-5",
                (section.align === "center" || section.layout === "balanced") &&
                  "mx-auto",
                section.align === "right" && "ml-auto",
              )}
            >
              {section.badge}
            </div>

            <h1
              className={cn(
                "mb-6 font-black leading-[1.05] tracking-normal [text-shadow:_0_4px_34px_rgba(0,0,0,0.75)]",
                index === 0 && "mb-4 leading-[0.98]",
                index === 0
                  ? "text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl"
                  : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
              )}
            >
              {section.subtitle ? (
                <span className="block space-y-2">
                  <span className="block bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    {section.title}
                  </span>
                  <span className="block text-[0.58em] font-black text-violet-50 drop-shadow-[0_5px_26px_rgba(0,0,0,0.95)] [text-shadow:_0_0_22px_rgba(139,92,246,0.55),_0_3px_18px_rgba(0,0,0,0.95)]">
                    {index === 0 ? (
                      <MarkerHighlight highlight={section.subtitle} />
                    ) : (
                      section.subtitle
                    )}
                  </span>
                </span>
              ) : (
                <span className="block bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  {section.title}
                </span>
              )}
            </h1>

            <p
              className={cn(
                "mb-8 max-w-2xl text-base font-medium leading-relaxed text-zinc-200 sm:text-lg lg:text-xl [text-shadow:_0_2px_18px_rgba(0,0,0,0.85)]",
                index === 0 && "mb-4 lg:text-lg",
                section.align === "center" && "mx-auto",
                section.layout === "balanced" && "mx-auto",
                section.align === "right" && "ml-auto",
              )}
            >
              {section.description}
            </p>

            {section.metrics && (
              <div
                className={cn(
                  "mb-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3",
                  index === 0 && "mb-4",
                  section.align === "center" && "mx-auto",
                  section.align === "right" && "ml-auto",
                )}
              >
                {section.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/[0.1] bg-[#090912]/70 p-3 backdrop-blur-md sm:p-4"
                  >
                    <div className="text-lg font-bold text-white sm:text-2xl">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500 sm:text-xs">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {index === 0 && (
              <div className="pointer-events-none absolute left-[115%] top-1/2 z-10 hidden w-56 -translate-y-1/2 flex-col gap-3 2xl:flex">
                {[
                  ["Unified inbox", "4 channels synced"],
                  ["AI replies", "drafted in seconds"],
                  ["Launch status", "demo open now"],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/[0.12] bg-[#090912]/90 px-4 py-3 text-left shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(167,139,250,0.9)]" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-100">
                        {title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-zinc-400">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.features && (
              <div
                className={cn(
                  "mb-8 grid gap-3 sm:gap-4",
                  section.layout === "balanced"
                    ? "mx-auto max-w-5xl md:grid-cols-3"
                    : "max-w-xl",
                )}
              >
                {section.features.map((feature) => (
                  <div
                    key={feature.title}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0b16]/82 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#101022]/92 hover:shadow-[0_18px_50px_rgba(124,58,237,0.16)] sm:p-5",
                      section.layout === "balanced" && "text-left",
                    )}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-400 via-violet-400 to-fuchsia-400 opacity-60" />
                    <div className="flex items-start gap-4 pl-1">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-xs font-bold text-violet-200 shadow-[0_0_18px_rgba(124,58,237,0.18)]">
                        {String(feature.index).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {feature.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.pixelGrid && <FeaturePixelGrid />}

            {section.actions && (
              <div
                className={cn(
                  "flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-4",
                  section.align === "center" && "justify-center",
                  section.align === "right" && "justify-end",
                )}
              >
                {section.actions.map((action) => (
                  <MagneticButton key={action.label} className="w-full sm:w-auto">
                    <button
                      onClick={action.onClick}
                      className={cn(
                        "group relative w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition active:scale-[0.98] sm:w-auto sm:px-8 sm:py-4 sm:text-base",
                        action.variant === "primary"
                          ? "bg-white text-black shadow-[0_0_34px_rgba(255,255,255,0.16)] hover:bg-zinc-200"
                          : "border border-white/[0.12] bg-white/[0.045] text-white backdrop-blur-md hover:border-violet-300/35 hover:bg-white/[0.08]",
                      )}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        {action.label}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </button>
                  </MagneticButton>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { continueAsDemo, initializeAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => initializeAuth(), [initializeAuth]);

  const startDemo = useCallback(() => {
    continueAsDemo();
    toast.success("Demo mode enabled. Welcome to Voxora AI.");
    navigate("/dashboard");
  }, [continueAsDemo, navigate]);

  const sections = useMemo(
    () => [
      {
        id: "hero",
        badge: "Demo Preview",
        title: "Voxora AI",
        subtitle: "Customer Conversations",
        description:
          "An AI command center for inboxes, calls, leads, automations, analytics, and knowledge training. Try the demo now while the full product launch is coming soon.",
        align: "left",
        metrics: [
          { value: "24/7", label: "AI coverage" },
          { value: "4+", label: "channels" },
          { value: "0", label: "setup needed" },
        ],
        actions: [
          {
            label: "Continue as Demo User",
            variant: "primary",
            onClick: startDemo,
          },
          {
            label: "Launching Soon",
            variant: "secondary",
            onClick: () => {
              toast.info("Sign in is launching soon. Demo access is open now.");
            },
          },
        ],
      },
      {
        id: "inbox",
        badge: "Unified Inbox",
        title: "Connected Worldwide",
        description:
          "Bring WhatsApp, Instagram, Facebook, LinkedIn, website chat, and AI replies into one living workspace. The demo keeps every conversation interactive and ready to explore.",
        align: "center",
        metrics: [
          { value: "96%", label: "reply rate" },
          { value: "<3s", label: "AI draft" },
          { value: "Live", label: "updates" },
        ],
      },
      {
        id: "automation",
        badge: "Operations",
        title: "Automate",
        subtitle: "Every Touchpoint",
        description:
          "Voxora turns customer intent into action with voice calls, CRM stages, workflow blocks, notifications, and knowledge-base answers shown in demo mode.",
        align: "center",
        layout: "balanced",
        pixelGrid: true,
      },
      {
        id: "launch",
        badge: "Launching Soon",
        title: "Demo Today",
        subtitle: "Launch Soon",
        description:
          "Explore the working demo today. Full account access and production integrations are marked as launching soon.",
        align: "center",
        actions: [
          {
            label: "Launch Demo",
            variant: "primary",
            onClick: startDemo,
          },
          {
            label: "Launching Soon",
            variant: "secondary",
            onClick: () => {
              toast.info(
                "Full account creation is launching soon. Demo access is open now.",
              );
            },
          },
        ],
      },
    ],
    [startDemo],
  );

  return (
    <ScrollGlobe
      sections={sections}
      className="bg-gradient-to-br from-[#07070f] via-[#101023] to-[#07070f]"
    />
  );
}
