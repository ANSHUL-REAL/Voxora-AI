"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AuthShell({ mode = "sign-in" }) {
  const isSignUp = mode === "sign-up";
  const navigate = useNavigate();
  const {
    loading,
    error,
    signInEmail,
    signUpEmail,
    signInGoogle,
    continueAsDemo,
    resetPassword,
    initializeAuth,
  } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (window.location.hostname === "127.0.0.1") {
      window.location.replace(
        `http://localhost:${window.location.port}${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  useEffect(() => initializeAuth(), [initializeAuth]);

  const goDashboard = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        await signUpEmail(name, email, password);
        toast.success("Account created. Welcome to Voxora AI.");
      } else {
        await signInEmail(email, password);
        toast.success("Login successful.");
      }
      goDashboard();
    } catch (error) {
      toast.error(
        error?.message ||
          "Authentication failed. Check your details and try again.",
      );
    }
  };

  const handleGoogle = async () => {
    try {
      await signInGoogle();
      const user = useAuthStore.getState().user;
      if (user) {
        toast.success("Google login successful.");
        goDashboard();
      } else {
        toast.info("Opening Google sign in...");
      }
    } catch (error) {
      const message =
        error?.code === "auth/popup-blocked"
          ? "Popup was blocked. Switching to redirect sign in."
          : error?.code === "auth/unauthorized-domain"
          ? "Firebase blocked this domain. Use localhost:5173 or add 127.0.0.1 in Firebase Authorized domains."
          : "Google sign in could not be completed.";
      toast.error(message);
    }
  };

  const handleDemo = () => {
    continueAsDemo();
    toast.success("Demo mode enabled.");
    goDashboard();
  };

  const handleReset = async () => {
    if (!email.trim()) {
      toast.error("Enter your email first.");
      return;
    }
    try {
      await resetPassword(email.trim());
      toast.success("Password reset email sent.");
    } catch {
      toast.error("Could not send reset email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-white font-sans overflow-hidden relative">
      <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-180px] right-[-120px] w-[520px] h-[520px] bg-purple-500/10 blur-[120px] rounded-full" />
      <header className="relative z-10 h-16 flex items-center justify-between px-5 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="text-white w-4 h-4 fill-white" />
          </div>
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Voxora AI
          </span>
        </Link>
        <button
          onClick={handleDemo}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-bold text-indigo-300 hover:bg-indigo-500/15 transition-all"
        >
          <Sparkles size={13} /> Continue Demo
        </button>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-64px)] flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0e0e1c]/85 backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-7 border-b border-white/[0.06]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">
                {isSignUp ? "Create Workspace" : "Secure Access"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isSignUp ? "Start your AI workspace" : "Welcome back"}
            </h1>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              {isSignUp
                ? "Create an account or launch the complete demo instantly."
                : "Sign in with Firebase or enter the offline demo workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            {isSignUp && (
              <label className="block">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Name
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.07] px-3 py-2.5 focus-within:border-indigo-500/40">
                  <User size={15} className="text-zinc-600" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-700"
                    placeholder="Aarav Mehta"
                  />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Email
              </span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.07] px-3 py-2.5 focus-within:border-indigo-500/40">
                <Mail size={15} className="text-zinc-600" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-700"
                  placeholder="you@company.com"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Password
              </span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.07] px-3 py-2.5 focus-within:border-indigo-500/40">
                <ShieldCheck size={15} className="text-zinc-600" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  required
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </button>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-white hover:bg-white/[0.07] transition-all"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className="h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all"
              >
                Continue as Demo User
              </button>
            </div>

            <p className="text-center text-xs text-zinc-500">
              {isSignUp ? "Already have an account?" : "New to Voxora?"}{" "}
              <Link
                to={isSignUp ? "/sign-in" : "/sign-up"}
                className="font-bold text-indigo-400 hover:text-indigo-300"
              >
                {isSignUp ? "Sign in" : "Create account"}
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
