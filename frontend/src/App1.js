// src/App.jsx
import React, { useEffect, useState } from "react";
import { loginUser } from '../src/api/auth';
import { signupUser } from '../src/api/auth';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,useLocation
} from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "./useTheme";
import { useAuth } from './context/AuthContext';
import AdminDashboard from './admin_dashboard';        
import CustomerDashboard from './customer_dashboard'; 
import HelpCenter from "./pages/Help"; 


// ------------------ Small helpers ------------------

const quickReplies = [
  "Check my loan eligibility",
  "Explain my EMI schedule",
  "Help me choose a product",
];

function useTypingLoop(lines, speed = 40, hold = 1500) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const current = lines[index % lines.length];
    let i = 0;
    let active = true;

    const type = () => {
      if (!active) return;
      if (i <= current.length) {
        setTyped(current.slice(0, i));
        i += 1;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          if (!active) return;
          setTyped("");
          setIndex((prev) => prev + 1);
        }, hold);
      }
    };
    type();

    return () => {
      active = false;
    };
  }, [index, lines, speed, hold]);

  return typed;
}

// ------------------ Global chrome ------------------

function Logo() {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
      <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 text-white flex items-center justify-center text-xs shadow-md">
        ◦
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-slate-900 dark:text-slate-100">Tata Capital</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          ChatOS
        </span>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-1 transition-colors"
    >
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-slate-900 text-[11px] text-white shadow transition-transform dark:bg-amber-400 ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? "☾" : "☀︎"}
      </span>
    </button>
  );
}

function MainNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100/70 dark:border-slate-800/70 bg-white/75 dark:bg-slate-950/60 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <a
            href="#hero"
            className="text-slate-500 dark:text-slate-300 hover:text-indigo-500"
          >
            Product
          </a>
          <a
            href="#why"
            className="text-slate-500 dark:text-slate-300 hover:text-indigo-500"
          >
            Why this bot
          </a>
          <a
            href="#canvas"
            className="text-slate-500 dark:text-slate-300 hover:text-indigo-500"
          >
            Live canvas
          </a>
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:border-indigo-500"
          >
            Console
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white dark:bg-indigo-500 dark:text-white hover:bg-indigo-600 text-xs shadow-md"
          >
            Get started
          </Link>
          <ThemeToggle />
        </nav>
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-full bg-slate-900 text-white dark:bg-indigo-500 text-[11px] font-medium"
          >
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}

function MainFooter() {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
        <span>© {new Date().getFullYear()} Tata Capital ChatOS.</span>
        <span>Conversational interface layer for loans, cards and savings.</span>
      </div>
    </footer>
  );
}

// Floating chat dock bottom-right
function ChatDock() {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 16 }}
      className="fixed right-4 bottom-4 z-40"
    >
      <button className="group flex items-center gap-3 rounded-full bg-slate-900 text-white dark:bg-indigo-500 px-4 py-2 text-xs shadow-xl">
        <div className="relative h-7 w-7 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-500 to-sky-400 flex items-center justify-center text-[11px] font-semibold">
          AI
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 dark:border-slate-950 shadow-sm" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="font-semibold">Talk to Master Agent</span>
          <span className="text-[10px] text-slate-300/90 group-hover:text-slate-100">
            Shift + ⏎ to open full console
          </span>
        </div>
      </button>
    </motion.div>
  );
}

// ------------------ HERO: 3D orb + animated chat ------------------

function Hero() {
  const navigate = useNavigate();
  const typed = useTypingLoop(
    [
      "Understands RBI-style policy rules.",
      "Speaks natural Hinglish about money.",
      "Explains complex EMIs with charts.",
    ],
    35,
    1400
  );
  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 0.5], [0, 40]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-slate-100/70 dark:border-slate-900/70"
    >
      {/* BG blobs */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
      <div className="pointer-events-none absolute -top-40 -left-32 h-72 w-72 rounded-full bg-indigo-300/18 blur-3xl dark:bg-indigo-500/12" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-72 w-72 rounded-full bg-emerald-300/18 blur-3xl dark:bg-emerald-500/12" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-24">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-10 items-center">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/70 px-3 py-1 text-[11px] text-slate-600 dark:text-slate-300 shadow-sm mb-4">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[9px] dark:bg-emerald-500/10 dark:text-emerald-300">
                ●
              </span>
              AI chatbot OS for BFSI experiences
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-slate-50"
            >
              One chatbot UI <br className="hidden md:block" />
              to run every{" "}
              <span className="relative inline-block">
                <span className="relative z-10">money conversation</span>
                <span className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-indigo-300/80 via-sky-300/80 to-emerald-300/80 dark:from-indigo-500/80 dark:via-sky-500/80 dark:to-emerald-500/80 blur-[1px]" />
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
            >
              Tata Capital ChatOS lets your customers apply, upgrade and
              understand financial products through a single, fluid,
              personality‑driven chatbot that plugs into your real stack.
            </motion.p>

            {/* Typing line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-4 text-xs md:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white dark:bg-indigo-500">
                AI
              </span>
              <span className="relative">
                <span>{typed}</span>
                <span className="inline-block w-[2px] h-4 bg-slate-600 dark:bg-slate-200 ml-[1px] animate-pulse align-middle" />
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="mt-7 flex flex-wrap gap-3 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 rounded-full bg-slate-900 text-white dark:bg-indigo-500 text-xs md:text-sm font-semibold shadow-lg shadow-slate-900/30 hover:bg-indigo-600"
              >
                Launch full‑screen experience
              </button>
              <a
                href="#canvas"
                className="px-5 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950 text-xs md:text-sm text-slate-700 dark:text-slate-200 hover:border-indigo-400"
              >
                See how it thinks
              </a>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Works on web, in‑app widgets and WhatsApp.
              </span>
            </motion.div>

            {/* Micro metrics */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md text-xs">
              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                  NPS uplift
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  +24
                  <span className="text-[11px] ml-1 text-emerald-500">pts*</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  By replacing rigid menus with natural chat for support.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                  CS deflection
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  60
                  <span className="text-[11px] ml-1 text-slate-500">%</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  L1 queries routed to bot, not phone lines.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                  Time to yes
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  &lt; 3
                  <span className="text-[11px] ml-1 text-slate-500">min</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  From “Hi” to conditional approval for simple journeys.
                </p>
              </div>
            </div>
          </div>

          {/* Right: animated orb + chat UI */}
          <div className="relative">
            {/* 3D orb */}
            <motion.div
              style={{ y: orbY, scale: orbScale }}
              className="absolute -top-10 right-10 h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-[0_0_80px_rgba(79,70,229,0.55)] blur-[1px] opacity-80"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mx-auto w-full max-w-sm rounded-3xl bg-white/90 dark:bg-slate-950/90 border border-slate-100/90 dark:border-slate-800/80 shadow-soft backdrop-blur-xl p-4"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Tata Capital · ChatOS
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Unified Money Assistant
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live
                </div>
              </div>

              {/* Quick replies */}
              <div className="flex flex-wrap gap-2 mb-3 text-[10px]">
                {quickReplies.map((chip) => (
                  <button
                    key={chip}
                    className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 text-[11px]">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-900 text-white dark:bg-indigo-500 flex items-center justify-center text-[9px]">
                    AI
                  </div>
                  <div className="max-w-[80%] rounded-2xl bg-slate-900 text-white dark:bg-indigo-500/90 px-3 py-2">
                    Hey, I am your personal money guide. Want to{" "}
                    <span className="underline">borrow</span>,{" "}
                    <span className="underline">save</span> or{" "}
                    <span className="underline">understand</span>?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-50">
                    I want to check if I can get a 3L travel loan this month.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-900 text-white dark:bg-indigo-500 flex items-center justify-center text-[9px]">
                    AI
                  </div>
                  <div className="max-w-[80%] rounded-2xl bg-slate-50 dark:bg-slate-900/80 px-3 py-2 text-slate-800 dark:text-slate-100">
                    Perfect. I will read your income, obligations and credit via
                    connected systems, then show you a{" "}
                    <span className="font-semibold">“green / amber / red”</span>{" "}
                    decision with reasons.
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  <div className="h-5 w-5 rounded-full bg-slate-900 text-white dark:bg-indigo-500 flex items-center justify-center text-[8px]">
                    …
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
                  </div>
                  <span>ChatOS is thinking with underwriting rules…</span>
                </div>
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Type like WhatsApp. It will keep up."
                />
                <button className="h-8 px-3 rounded-full bg-slate-900 text-white dark:bg-indigo-500 text-[11px] font-medium hover:bg-indigo-600">
                  Send
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>Supports: text · voice · quick replies</span>
                <span>SDK · Web · Whatsapp</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------ Sections: Why, Canvas, CTA ------------------

function WhySection() {
  return (
    <section
      id="why"
      className="max-w-6xl mx-auto px-4 md:px-6 py-14 space-y-8"
    >
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
            Built like a product, not a demo bot
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Every interaction is designed like a real chatbot UI: clear
            hierarchy, quick actions, visual states, and micro‑interactions that
            make AI feel alive, not robotic. [web:37][web:40]
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>– Rich chat surface: chips, links, multi‑turn clarifications.</li>
            <li>– Domain‑aware journeys for loans, cards and savings.</li>
            <li>– Configurable personalities for retail vs. HNI vs. SMB.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              UX patterns
            </span>
            <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 px-2 py-0.5">
              Borrowed from best‑in‑class chat UIs
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Message layout</span>
              <span className="font-mono text-[11px]">
                One‑column, ChatGPT‑style [web:40]
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quick actions</span>
              <span className="font-mono text-[11px]">Quick‑reply chips</span>
            </div>
            <div className="flex justify-between">
              <span>Personality</span>
              <span className="font-mono text-[11px]">
                Warm, RBI‑aware tone
              </span>
            </div>
            <div className="flex justify-between">
              <span>Feedback</span>
              <span className="font-mono text-[11px]">
                Typing & thinking states
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CanvasSection() {
  return (
    <section
      id="canvas"
      className="max-w-6xl mx-auto px-4 md:px-6 pb-16 space-y-10"
    >
      <div className="grid md:grid-cols-[1.2fr,1fr] gap-8 items-start">
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Live canvas of a conversation
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                How ChatOS sees a chat under the hood.
              </p>
            </div>
            <span className="rounded-full bg-slate-900 text-white dark:bg-indigo-500 px-2 py-0.5 text-[10px]">
              JSON · events · tools
            </span>
          </div>
          <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 dark:bg-black/90 rounded-xl p-4 overflow-x-auto shadow-inner">
{`{
  "session_id": "rithika-travel-3L",
  "intent": "personal_loan_travel",
  "signals": {
    "channel": "web",
    "language": "en-IN",
    "risk_profile": "prime"
  },
  "timeline": [
    "user: I want 3L travel loan",
    "tool: check_offer_mart",
    "tool: run_eligibility",
    "ai: explain_decision_with_emis"
  ],
  "decision": {
    "traffic_light": "green",
    "max_amount": 500000,
    "reasons": ["stable_income", "clean_bureau", "low_obligations"]
  }
}`}
          </pre>
        </div>

        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Designed to plug into real stacks
          </h3>
          <p>
            Underneath the UI, ChatOS streams tokens, tools and decisions in a
            structured way so your risk, product and compliance teams can trust
            what the bot is doing. [web:43][web:52]
          </p>
          <ul className="space-y-2">
            <li>– Tools for offer mart, KYC, underwriting, collections.</li>
            <li>– Guardrails: policy prompts + rate‑limiters + PII filters.</li>
            <li>– Observability hooks for replaying entire conversations.</li>
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            The same engine can power RM co‑pilots and customer‑facing bots
            without rewriting flows.
          </p>
        </div>
      </div>

      {/* CTA stripe */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-700 to-sky-700 dark:from-slate-900 dark:via-indigo-600 dark:to-sky-600 px-5 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-slate-100">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-300">
            Next step
          </div>
          <div className="text-lg font-semibold">
            Put this chatbot on a big screen and walk judges through a full
            journey live.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/signup"
            className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100"
          >
            Create sandbox account
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-full border border-slate-300/70 text-xs font-semibold hover:bg-slate-50/10"
          >
            Open console
          </Link>
        </div>
      </div>
    </section>
  );
}

// ------------------ Auth pages ------------------

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800"
      >
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/customer';

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      const result = await loginUser(credentials);
      console.log('✅ Login success:', result.user.role);
      
      // ✅ Store ONLY in localStorage (no context needed)
      localStorage.setItem('user', JSON.stringify(result.user));

      console.log(result.user);
      
      // ✅ ROLE-BASED NAVIGATION
      if (result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });  // Customer default
      }
      
    } catch (err) {
      setError(err.message || 'Login failed');
      console.error('❌ Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to ChatOS"
      subtitle="Access projects, journeys and analytics."
    >
      <form onSubmit={handle} className="space-y-4 text-sm">
        {error && (
          <div className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Work email
          </label>
          <input
            required
            name="email"
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Password
          </label>
          <input
            required
            name="password"
            type="password"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <a
            href="#"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Forgot password?
          </a>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-indigo-500 rounded-full text-xs font-medium hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="mt-5 text-xs text-slate-600 dark:text-slate-300">
        New here?{" "}
        <Link
          to="/signup"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Create an account
        </Link>
      </div>
    </AuthShell>
  );
}


export function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('fullname'),
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      const result = await signupUser(userData);
      console.log('Signup success:', result);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your ChatOS space"
      subtitle="Spin up a sandbox for experiments."
    >
      <form onSubmit={handle} className="space-y-4 text-sm">
        {error && (
          <div className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Full name
          </label>
          <input
            required
            name="fullname"
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Rithika Sharma"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Work email
          </label>
          <input
            required
            name="email"
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Password
          </label>
          <input
            required
            name="password"
            type="password"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Create a strong password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-indigo-500 rounded-full text-xs font-medium hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </div>
      </form>

      <div className="mt-5 text-xs text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Login
        </Link>
      </div>
    </AuthShell>
  );
}


// ------------------ Home wrapper ------------------

export function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <CanvasSection />
      <MainFooter />
      <ChatDock />
    </>
  );
}


// ------------------ Root App ------------------

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-100 font-sans">
        <MainNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </main>
        <ChatDock />
      </div>
    </Router>
  );
}