import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Moon, Bell, Search, ChevronRight, CreditCard, FileText, HelpCircle, Calculator, Upload, ShieldCheck, Wallet, TrendingUp, Users, Bot } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const languages = {
  en: {
    dashboard: "Dashboard",
    overview: "Loan Overview",
    apply: "Apply New Loan",
    tools: "EMI Tools",
    support: "Support",
    offers: "Offers & Recommendations",
    insurance: "Insurance",
    documents: "Document Vault",
    payments: "Payment & Transactions",
    help: "Help Center",
    status: "Loan Status Tracker",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    overview: "लोन अवलोकन",
    apply: "नया लोन आवेदन",
    tools: "ईएमआई उपकरण",
    support: "सहायता",
    offers: "ऑफर और अनुशंसा",
    insurance: "बीमा",
    documents: "दस्तावेज़ वॉल्ट",
    payments: "भुगतान और लेनदेन",
    help: "हेल्प सेंटर",
    status: "लोन स्थिति ट्रैकर",
  },
};

const emiData = [
  { month: "Jan", value: 35000 },
  { month: "Feb", value: 35000 },
  { month: "Mar", value: 35000 },
];

const CustomerDashboard = () => {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");
  const t = (key) => languages[lang][key];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen flex bg-gradient-to-br ${theme === "dark"
      ? "from-[#0A0E12] via-[#0D1216] to-black text-gray-200"
      : "from-gray-100 to-white text-gray-800"
      } transition-all`}>

      {/* SIDEBAR */}
      <aside className="w-72 border-r border-gray-700/40 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-black">
            FR
          </div>
          <h1 className="text-lg font-semibold">Finomic Elite</h1>
        </div>

        <nav className="flex-1 space-y-4 text-sm">
          <button className="flex items-center gap-3 px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CreditCard size={18} /> {t("dashboard")}
          </button>
            <NavItem link="/overview" label={t("overview")} icon={<TrendingUp size={18} />} />
            <NavItem link="/status" label={t("status")} icon={<Users size={18} />} />
            <NavItem link="/apply" label={t("apply")} icon={<Wallet size={18} />} />
            <NavItem link="/payments" label={t("payments")} icon={<CreditCard size={18} />} />
            <NavItem link="/emi-tools" label={t("tools")} icon={<Calculator size={18} />} />
            <NavItem link="/documents" label={t("documents")} icon={<FileText size={18} />} />
            <NavItem link="/insurance" label={t("insurance")} icon={<ShieldCheck size={18} />} />
            <NavItem label={t("offers")} icon={<TrendingUp size={18} />} />
            <NavItem label={t("help")} icon={<HelpCircle size={18} />} />
            <NavItem label={"Chatbot Assistant"} icon={<Bot size={18} />} />
        </nav>

        <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white mt-auto shadow-lg hover:opacity-90">
          🚀 Upgrade to Pro
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* TOP BAR */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
            <div>
              <p className="font-semibold">Hello, Rithika!</p>
              <p className="text-sm opacity-70">Welcome back 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 opacity-50" size={16} />
              <input
                placeholder="Search..."
                className="bg-gray-700/30 px-10 py-2 rounded-xl text-sm w-64"
              />
            </div>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-700/20 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>

            <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-700/20">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="p-2 rounded-xl bg-gray-700/20 relative">
              <Bell size={18} />
              <span className="h-2 w-2 bg-red-500 rounded-full absolute top-1 right-1" />
            </button>
          </div>
        </header>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <FeatureCard icon={<Wallet />} title="Active Loan" value="₹ 15,00,000" />
          <FeatureCard icon={<CreditCard />} title="Monthly EMI" value="₹ 47,000" />
          <FeatureCard icon={<TrendingUp />} title="Credit Score" value="750" />
          <FeatureCard icon={<Upload />} title="Pending KYC" value="2 docs" />
        </div>

        {/* EMI GRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20"
        >
          <h2 className="text-lg font-semibold mb-2">EMI vs Salary</h2>
          <div className="h-52">
            <ResponsiveContainer>
              <LineChart data={emiData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// COMPONENTS
const NavItem = ({ label, icon, link }) => (
  <Link to={link}>
    <button className="flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-xl w-full transition-all">
      <span className="flex gap-3">{icon} {label}</span>
      <ChevronRight size={16} className="opacity-50" />
    </button>
  </Link>
);


const FeatureCard = ({ icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-700/20 border border-gray-600/20 rounded-2xl p-6"
  >
    <div className="text-emerald-400 text-xl mb-2">{icon}</div>
    <p className="text-sm opacity-70">{title}</p>
    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
  </motion.div>
);

export default CustomerDashboard;
