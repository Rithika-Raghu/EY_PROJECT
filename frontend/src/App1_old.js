// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "./useTheme";

// Simple Logo
function Logo() {
  return (
    <div className="text-xl font-extrabold tracking-tight flex items-center gap-1">
      <span className="px-2 py-1 rounded-md bg-indigo-600 text-white text-sm">
        TC
      </span>
      <span className="font-semibold">Tata</span>
      <span className="text-indigo-500 font-semibold">Capital</span>
    </div>
  );
}

// Theme toggle button
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1 transition-colors"
      aria-label="Toggle theme"
    >
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-slate-900 text-xs text-white shadow transition-transform dark:bg-amber-400 ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? "☾" : "☀︎"}
      </span>
    </button>
  );
}

function Nav() {
  return (
    <nav className="w-full border-b border-slate-100/80 dark:border-slate-800/80 backdrop-blur bg-white/70 dark:bg-slate-950/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Logo />
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          <Link
            to="/"
            className="text-slate-700 dark:text-slate-200 hover:text-indigo-600"
          >
            Home
          </Link>
          <a
            href="#products"
            className="text-slate-500 dark:text-slate-300 hover:text-indigo-600"
          >
            Products
          </a>
          <a
            href="#how"
            className="text-slate-500 dark:text-slate-300 hover:text-indigo-600"
          >
            How it works
          </a>
          <Link
            to="/login"
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-indigo-600 hover:shadow-md text-sm"
          >
            Get started
          </Link>
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/signup"
            className="px-3 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-medium"
          >
            Start
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 dark:border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <div>© {new Date().getFullYear()} Tata Capital — Demo experience</div>
        <div>Built for BFSI Agentic AI Challenge</div>
      </div>
    </footer>
  );
}

// Chat floating button
function ChatFab() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed right-5 bottom-5 z-40"
    >
      <a
        href="#chat"
        className="flex items-center gap-2 shadow-xl bg-slate-900 dark:bg-indigo-500 text-white px-4 py-2.5 rounded-full text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-5-5H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3l-5 5z"
          />
        </svg>
        <span className="font-semibold">Chat with Agent</span>
      </a>
    </motion.div>
  );
}

// Hero section
function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
      <div className="absolute -top-40 -left-40 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
      <div className="absolute -bottom-40 -right-40 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl dark:bg-pink-500/10" />

      <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left column */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm mb-4">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] dark:bg-emerald-500/10 dark:text-emerald-300">
                ●
              </span>
              Live demo of Agentic AI for personal loans
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white"
            >
              Conversational personal loans, built for{" "}
              <span className="underline decoration-4 decoration-indigo-400/70 underline-offset-4">
                Bharat
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed"
            >
              A demo agentic assistant that chats with your customers, gathers
              KYC, evaluates eligibility, and issues sanction letters — all in a
              single streamlined experience.
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium shadow-lg shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-2xl text-sm"
              >
                Start loan application
              </button>
              <a
                href="#how"
                className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-950 hover:border-indigo-400"
              >
                See how it works
              </a>
            </motion.div>

            <div className="mt-7 grid grid-cols-2 gap-3 max-w-md text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  Pre-approved journeys
                </div>
                <div className="mt-1 text-[11px] leading-snug">
                  Plug into offer mart & CRM mock APIs for instant limits.
                </div>
              </div>
              <div className="p-3.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  KYC & verification
                </div>
                <div className="mt-1 text-[11px] leading-snug">
                  Simulated PAN, Aadhaar, bank statement checks for demo users.
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center text-white border-2 border-white dark:border-slate-900">
                  TC
                </div>
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-[10px] flex items-center justify-center text-white border-2 border-white dark:border-slate-900">
                  AI
                </div>
              </div>
              <span>Prototype for hackathons. Not a real lending product.</span>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full max-w-md lg:max-w-lg" id="chat">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="relative rounded-3xl bg-white dark:bg-slate-950 shadow-soft border border-slate-100/80 dark:border-slate-800/80 p-4 md:p-5"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Tata Capital · Master Agent
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Personal Loan Assistant
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live demo
                </div>
              </div>

              {/* Recent chat */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-900 text-white dark:bg-indigo-500 flex items-center justify-center text-[11px] font-semibold">
                    AI
                  </div>
                  <div className="rounded-2xl bg-slate-900 text-white dark:bg-indigo-500/90 px-3 py-2 max-w-[80%]">
                    Hi, I can help you with a quick personal loan journey. To
                    begin, may I know your name?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 max-w-[75%] text-slate-800 dark:text-slate-100">
                    Customer: Rithika, salaried, looking for 3L for travel.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-900 text-white dark:bg-indigo-500 flex items-center justify-center text-[11px] font-semibold">
                    AI
                  </div>
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-900/80 px-3 py-2 max-w-[80%] text-slate-800 dark:text-slate-100">
                    Thanks, Rithika. I see a pre-approved limit of ₹5,00,000
                    based on your profile. Shall we proceed with KYC?
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="mt-5 flex gap-2 items-center">
                <input
                  className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Type a message…"
                />
                <button className="h-9 px-4 rounded-full bg-slate-900 text-white dark:bg-indigo-500 text-xs font-medium hover:bg-indigo-600">
                  Send
                </button>
              </div>

              {/* Small status pill */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>Worker agents: Sales · Verification · Underwriting</span>
                <span>v0.1 · Sandbox only</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div>
      <Hero />

      <section
        id="how"
        className="max-w-6xl mx-auto px-5 py-16 border-t border-slate-100 dark:border-slate-900"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          How the agentic flow works
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
          The Master Agent orchestrates specialised worker agents to take the
          user from intent to sanction letter in minutes.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-5 text-sm">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              01 · Conversation
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Master Agent
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Handles natural language chat, collects details, and delegates to
              worker agents as needed.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              02 · Evaluation
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Sales & underwriting
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Sales, verification and underwriting agents talk to mocked APIs to
              validate KYC and compute eligibility.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              03 · Fulfilment
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Sanction letter
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Generates a downloadable sanction letter using template + agent
              output, ready to plug into your LOS.
            </p>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="max-w-6xl mx-auto px-5 py-14 space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Offer mart & CRM integrations
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Mock servers simulate pre-approved limits, bureau data, and KYC
              responses so you can demo journeys without hitting real systems.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm text-sm text-slate-500 dark:text-slate-300">
            <div className="mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
              Mock APIs · Console
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px]">GET /offer-mart</span>
                <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 px-2 py-0.5">
                  200 OK
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px]">POST /kyc/verify</span>
                <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 px-2 py-0.5">
                  201 Created
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px]">
                  POST /sanction-letter
                </span>
                <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 px-2 py-0.5">
                  Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Auth wrapper
function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800"
      >
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">
              {subtitle}
            </div>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <AuthCard title="Login" subtitle="Access the demo agentic chatbot">
      <form onSubmit={handle} className="space-y-4 text-sm">
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Email
          </label>
          <input
            required
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Password
          </label>
          <input
            required
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
            className="px-4 py-2 bg-slate-900 text-white dark:bg-indigo-500 rounded-full text-xs font-medium hover:bg-indigo-600"
          >
            Login
          </button>
        </div>
      </form>

      <div className="mt-5 text-xs text-slate-600 dark:text-slate-300">
        Do not have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}

function Signup() {
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Join the demo and try the Master Agent"
    >
      <form onSubmit={handle} className="space-y-4 text-sm">
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Full name
          </label>
          <input
            required
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Phone
          </label>
          <input
            required
            type="tel"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Email
          </label>
          <input
            required
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-300 text-xs">
            Password
          </label>
          <input
            required
            type="password"
            className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Create a password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white dark:bg-indigo-500 rounded-full text-xs font-medium hover:bg-indigo-600"
          >
            Create account
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
    </AuthCard>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-100">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <ChatFab />
      </div>
    </Router>
  );
}
