// src/App.jsx
import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate, useLocation
} from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView
} from "framer-motion";
import {
  Bot,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  FileCheck,
  Zap,
  Database,
  Brain,
  Lock,
  CreditCard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
  Play,
  Users,
  Activity,
  Award,
  MessageSquare,
  Upload,
  RefreshCw,
  Send,
  Github,
  Twitter,
  Linkedin,
  Mail,
  User,
  Eye,
  EyeOff,
  Zap as ZapIcon
} from "lucide-react";
import { loginUser, signupUser } from "../src/api/auth";
import AdminDashboard from "./admin_dashboard";
import CustomerDashboard from "./customer_dashboard";
import HelpCenter from "./pages/Help";
//import { useTheme } from "./useTheme";
import { useAuth } from './context/AuthContext';


// ==================== THEME CONTEXT ====================

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// ==================== ANIMATION VARIANTS ====================

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

// ==================== LOGO ====================

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg"
      >
        <Bot className="w-6 h-6 text-white" strokeWidth={2.5} />
        <motion.div
          className="absolute inset-0 rounded-xl bg-indigo-500 opacity-0 group-hover:opacity-50 blur-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      <div className="flex flex-col leading-none">
        <span className="text-slate-900 dark:text-white font-black text-base tracking-tight">
          AURUM
        </span>
        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Aura
        </span>
      </div>
    </Link>
  );
}

// ==================== THEME TOGGLE ====================

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5 text-indigo-500" strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}


// ==================== MAIN NAV ====================

function MainNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { key: "product", label: "Product", href: "#product", icon: Bot },
    { key: "features", label: "Features", href: "#features", icon: Sparkles },
    { key: "demo", label: "Demo", href: "#demo", icon: Play },
    { key: "pricing", label: "Pricing", href: "#pricing", icon: CreditCard }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5"
          : "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-800/30 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.key}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all group"
              >
                <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {item.label}
              </motion.a>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:border-indigo-500 dark:hover:border-indigo-400 transition-all"
            >
              Sign In
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="flex items-center gap-3 py-3 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                );
              })}
              <div className="pt-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 font-semibold">
                    Sign In
                  </button>
                </Link>
                <Link
                  to="/signup"
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}


// ==================== 3D CHAT INTERFACE ====================

function Chat3DInterface() {
  const messages = [
    {
      role: "ai",
      text: "Hi! I can help with loans, KYC verification, and EMI calculations.",
      icon: Bot
    },
    { role: "user", text: "I need a ₹5L personal loan", icon: null },
    {
      role: "ai",
      text:
        "✓ Great! Based on your credit score (780), you're pre-approved. EMI options?",
      icon: CheckCircle2
    }
  ];

  return (
    <motion.div
      whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative max-w-md mx-auto"
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-5deg) rotateX(5deg)"
      }}
    >
      {/* Glow Effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -inset-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl blur-3xl"
      />

      <div className="relative bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg"
            >
              <Bot className="w-7 h-7 text-white" strokeWidth={2.5} />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-indigo-400 blur-md opacity-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <div className="font-black text-slate-900 dark:text-white text-lg">
                AURUM
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
                Online · Instant Response
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm font-medium ${
                  msg.role === "ai"
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                {msg.text}
              </motion.div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-3"
          >
            <div className="flex gap-1.5 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="w-2 h-2 rounded-full bg-indigo-500"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { icon: CheckCircle2, text: "Check Eligibility" },
            { icon: CreditCard, text: "Calculate EMI" },
            { icon: Upload, text: "Upload KYC" }
          ].map((chip, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
            >
              <chip.icon className="w-3.5 h-3.5" />
              {chip.text}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything about loans..."
            className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== HERO SECTION ====================

function Hero() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const capabilities = [
    { icon: Shield, text: "RBI-compliant KYC verification" },
    { icon: Brain, text: "Natural language understanding" },
    { icon: Zap, text: "Real-time credit score analysis" },
    { icon: FileCheck, text: "Automated document processing" }
  ];

  const [currentCapability, setCurrentCapability] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCapability((prev) => (prev + 1) % capabilities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="product"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Formal Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/20" />
        
        {/* Professional grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <motion.div
          style={{ y, opacity, scale }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="w-4 h-4 text-emerald-500" />
            </motion.div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              AI-Powered Loan Assistant · Live Now
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
              One AI Agent.
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                Every Loan Journey.
              </span>
              <motion.span
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-3 left-0 right-0 h-4 bg-indigo-200 dark:bg-indigo-500/30 -z-10 origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
          >
            AURUM understands intent, verifies documents, checks
            eligibility, and generates sanction letters — all in one natural
            conversation.
          </motion.p>

          {/* Animated Capability Showcase */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-10 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-lg"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCapability}
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg"
              >
                {React.createElement(capabilities[currentCapability].icon, {
                  className: "w-6 h-6 text-white",
                  strokeWidth: 2.5
                })}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentCapability}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                {capabilities[currentCapability].text}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mb-12"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg shadow-2xl overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Launch Experience
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
            </motion.button>

            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-3 gap-6"
          >
            {[
              {
                value: "60%",
                label: "Faster Approvals",
                icon: TrendingUp,
                color: "from-emerald-500 to-teal-500"
              },
              {
                value: "+24",
                label: "NPS Uplift",
                icon: BarChart3,
                color: "from-blue-500 to-cyan-500"
              },
              {
                value: "<3min",
                label: "Time to Approval",
                icon: Clock,
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative">
                  <stat.icon
                    className={`w-6 h-6 mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                    strokeWidth={2.5}
                  />
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - 3D Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: 100, rotateY: -25 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
          style={{ perspective: 2000 }}
        >
          <Chat3DInterface />
        </motion.div>
      </div>
    </section>
  );
}

// ==================== FEATURES SECTION ====================

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Bot,
      title: "Agentic AI Architecture",
      description:
        "Master Agent orchestrates specialized worker agents for sales, underwriting, verification, and sanction",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: FileCheck,
      title: "Smart Document Processing",
      description:
        "Extracts PAN, Aadhaar, and salary details from PDFs using advanced OCR and regex validation",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Real-Time Underwriting",
      description:
        "Instant credit score checks, eligibility calculation, and EMI computation in under 3 minutes",
      gradient: "from-violet-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "RBI-Compliant KYC",
      description:
        "Automated verification against CRM database with pattern matching for Indian documents",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Brain,
      title: "Natural Language Understanding",
      description:
        "Groq-powered Llama 3.3 70B for conversational sales, negotiation, and customer engagement",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Database,
      title: "Persistent Database",
      description:
        "10 pre-seeded dummy customers in SQLite with full loan application history tracking",
      gradient: "from-slate-500 to-slate-600"
    }
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-6 border-2 border-indigo-200 dark:border-indigo-800"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Cutting-Edge AI
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Built for{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              Instant & Intelligent Lending.
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Every feature designed Faster Responses, Faster Approvals
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
              />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-5 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==================== DEMO SECTION ====================

function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      id="demo"
      ref={ref}
      className="py-32 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 relative overflow-hidden"
    >
      {/* Animated Shapes */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/10 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold mb-8 border-2 border-white/30"
          >
            <Play className="w-4 h-4" />
            See It In Action
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Experience the Future of{" "}
            <span className="inline-block">
              <span className="relative">
                Loan Processing
                <motion.span
                  animate={{ scaleX: [0, 1] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-white/30 -z-10 origin-left rounded-full"
                />
              </span>
            </span>
          </h2>

          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Watch how AURUM transforms a complex loan journey into a
            simple conversation
          </p>

          {/* Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-white/20"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl group"
              >
                <Play className="w-10 h-10 text-indigo-600 ml-2 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
          </motion.div>

          {/* Stats Below Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "2.5min", label: "Average Processing Time" },
              { value: "98%", label: "Accuracy Rate" },
              { value: "10K+", label: "Loans Processed" },
              { value: "4.9★", label: "Customer Rating" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== CTA SECTION ====================

function CTASection() {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-8 border-2 border-indigo-200 dark:border-indigo-800"
          >
            <ZapIcon className="w-4 h-4" />
            Ready to Transform Your Loan Process?
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8">
            Start Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              SmartLoan Journey
            </span>{" "}
            Today
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
            Join thousands of satisfied customers who've experienced
            lightning-fast loan approvals with our AI-powered platform
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg shadow-2xl overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Get Started Free
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/help")}
              className="px-10 py-5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
            >
              Learn More
            </motion.button>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400 font-semibold"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              RBI Compliant
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              Bank-Grade Security
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              24/7 Support
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== FOOTER ====================

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 group mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg"
              >
                <Bot className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-slate-900 dark:text-white font-black text-base tracking-tight">
                  AURUM
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Aura
                </span>
              </div>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              AURUM Loan. Built with passion for EY Techathon 2025.
              Transforming loan experiences with cutting-edge AI technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {["Features", "Demo", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Help Center", href: "/help" }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © {currentYear} AURUM. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Mail, href: "#" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==================== LOGIN PAGE ====================

// ==================== AUTH SHELL ====================

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 p-8">
          {/* Icon Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white mb-4 shadow-lg"
            >
              <Lock className="w-8 h-8" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ==================== LOGIN ====================

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      
      localStorage.setItem('user', JSON.stringify(result.user));
      console.log(result.user);
      
      if (result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
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
      title="Welcome Back"
      subtitle="Sign in to continue to SmartLoan AI"
    >
      <form onSubmit={handle} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold"
          >
            {error}
          </motion.div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              required
              name="email"
              type="email"
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

// ==================== SIGNUP ====================

export function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      title="Create Account"
      subtitle="Start your SmartLoan journey today"
    >
      <form onSubmit={handle} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold"
          >
            {error}
          </motion.div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              required
              name="fullname"
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              required
              name="email"
              type="email"
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Creating account...</span>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}


// ==================== HOME COMPOSITION ====================

function Home() {
  return (
    <>
      <MainNav />
      <Hero />
      <FeaturesSection />
      <DemoSection />
      <CTASection />
      <Footer />
    </>
  );
}


// ==================== ROOT APP ====================

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/help" element={<HelpCenter />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}





// Export individual components if needed elsewhere
export { Home, Hero, FeaturesSection, DemoSection, CTASection, Footer, MainNav };
