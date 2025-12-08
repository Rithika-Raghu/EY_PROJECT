import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import { Sun, Moon, Bell, Search,ShieldCheck, ChevronRight, CreditCard, FileText, HelpCircle, Calculator, Upload, Wallet, TrendingUp, Users, Bot, LogOut, MessageCircle, Paperclip, Send } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const languages = {
  en: {
    dashboard: "Dashboard",
    overview: "Loan Overview",
    tools: "EMI Tools",
    offers: "Offers & Recommendations",
    documents: "Document Vault",
    payments: "Payment & Transactions",
    help: "Help Center",
    status: "Loan Status Tracker",
    logout: "Logout",
    chatbot: "AI Assistant",
    typeMessage: "Type your message...",
    uploadDoc: "Upload Document",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    overview: "लोन अवलोकन",
    tools: "ईएमआई उपकरण",
    offers: "ऑफर और अनुशंसा",
    documents: "दस्तावेज़ वॉल्ट",
    payments: "भुगतान और लेनदेन",
    help: "हेल्प सेंटर",
    status: "लोन स्थिति ट्रैकर",
    logout: "लॉगआउट",
    chatbot: "एआई सहायक",
    typeMessage: "अपना संदेश टाइप करें...",
    uploadDoc: "दस्तावेज़ अपलोड करें",
  },
};

const loanTrendData = [
  { month: "Jan", loans: 120, target: 150 },
  { month: "Feb", loans: 150, target: 160 },
  { month: "Mar", loans: 180, target: 170 },
  { month: "Apr", loans: 200, target: 190 },
  { month: "May", loans: 220, target: 210 }
];

const paymentData = [
  { name: "EMI Paid", value: 47000, color: "#10b981" },
  { name: "Principal", value: 35000, color: "#3b82f6" },
  { name: "Interest", value: 12000, color: "#f59e0b" }
];

const creditScoreData = [
  { category: "Payment History", score: 85, full: 100 },
  { category: "Credit Utilization", score: 78, full: 100 },
  { category: "Length of Credit", score: 92, full: 100 },
  { category: "New Credit", score: 88, full: 100 }
];

const kycProgressData = [45, 75, 90]; // Pending, In Review, Completed

const savingsData = [
  { month: "Jan", saved: 25000 },
  { month: "Feb", saved: 32000 },
  { month: "Mar", saved: 45000 },
  { month: "Apr", saved: 38000 },
  { month: "May", saved: 52000 }
];

const emiData = [
  { month: "Jan", value: 35000 },
  { month: "Feb", value: 35000 },
  { month: "Mar", value: 35000 },
];

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // ✅ FIX: Use regular useState instead of useLocalStorage
  const [messages, setMessages] = useState([]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const t = (key) => languages[lang][key];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClearChat = async () => {
    if (!window.confirm("Clear all chat history & start fresh?")) return;

    try {
      setMessages([]);
      setInputMessage("");
      
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "reset" }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages([{
          role: "bot",
          content: data.reply,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("Clear failed:", error);
      setMessages([{
        role: "bot",
        content: "🔄 Conversation reset!\n\nHi! Welcome to Tata Capital SmartLoan 🏦\nWhat's your name?",
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const sendMessage = async () => {
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg = { 
      role: "user", 
      content: text, 
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: "bot",
        content: data.reply,
        timestamp: new Date().toISOString(),
        agent: data.agent || "AI Assistant"
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "bot",
        content: "Connection error. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMessages(prev => [...prev, {
      role: "user",
      content: `📎 Uploading: ${file.name}`,
      timestamp: new Date().toISOString()
    }]);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: "bot",
        content: data.reply || `✅ "${file.name}" uploaded!`,
        timestamp: new Date().toISOString()
      }]);
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "bot",
        content: "Upload failed. Try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className={`min-h-screen flex bg-gradient-to-br ${theme === "dark" ? "from-[#0A0E12] via-[#0D1216] to-black text-gray-200" : "from-gray-100 to-white text-gray-800"} transition-all`}>

    {/* SIDEBAR (Unchanged) */}
    <aside className="w-72 border-r border-gray-700/40 p-6 hidden lg:flex flex-col">
       {/* ... existing sidebar code ... */}
       <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-black">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-lg font-semibold">AURUM</h1>
            <p className="text-xs opacity-70">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4 text-sm">
          <button className="flex items-center gap-3 px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-full">
            <CreditCard size={18} /> {t("dashboard")}
          </button>
          <NavItem link="/overview" label={t("overview")} icon={<TrendingUp size={18} />} />
          <NavItem link="/status" label={t("status")} icon={<Users size={18} />} />
          <NavItem link="/payments" label={t("payments")} icon={<CreditCard size={18} />} />
          <NavItem link="/emi-tools" label={t("tools")} icon={<Calculator size={18} />} />
          <NavItem link="/documents" label={t("documents")} icon={<FileText size={18} />} />
          <NavItem link="/offers" label={t("offers")} icon={<TrendingUp size={18} />} />
          <NavItem link="/help" label={t("help")} icon={<HelpCircle size={18} />} />
          
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl w-full transition-all ${isChatOpen ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400/50' : 'hover:bg-white/10'}`}
          >
            <span className="flex gap-3 items-center">
              <MessageCircle size={18} />
              {t("chatbot")}
            </span>
            <ChevronRight size={16} className={`opacity-50 transition-transform ${isChatOpen ? 'rotate-90' : ''}`} />
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400 rounded-xl w-full transition-all mt-4"
          >
            <LogOut size={18} /> {t("logout")}
          </button>
        </nav>
    </aside>

    {/* MAIN CONTENT AREA */}
    <div className="flex-1 p-6 h-screen overflow-y-auto">
      
      {/* 1. HEADER & TOP STATS SECTION */}
      <div className="space-y-6 mb-10">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold">Hello, {user?.username || 'User'}!</p>
              <p className="text-sm opacity-70">Welcome back</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-700/20 text-sm">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-700/20">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Account Info Box */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/30">
          <h2 className="text-lg font-semibold mb-3">Account Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-70">Username</p>
              <p className="font-semibold">{user?.username || 'N/A'}</p>
            </div>
            <div>
              <p className="opacity-70">Email</p>
              <p className="font-semibold">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid (Top) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <FeatureCard icon={<Wallet />} title="Active Loan" value="₹ 15,00,000" />
          <FeatureCard icon={<CreditCard />} title="Monthly EMI" value="₹ 47,000" />
          <FeatureCard icon={<TrendingUp />} title="Credit Score" value="750" />
          <FeatureCard icon={<Upload />} title="Pending KYC" value="2 docs" />
        </div>
      </div>

      {/* 2. VISUALIZATION SECTION (BOTTOM) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold opacity-90 border-l-4 border-emerald-500 pl-3">Financial Analytics</h2>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          
          {/* Chart 1: Loan Applications */}
          <motion.div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-80 flex flex-col min-w-0">
            <h3 className="font-semibold mb-4">Loan Applications</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loanTrendData}>
                  <XAxis dataKey="month" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                  <Line type="monotone" dataKey="loans" stroke="#10b981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: EMI Breakdown */}
          <motion.div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-80 flex flex-col min-w-0">
            <h3 className="font-semibold mb-4">EMI Breakdown</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 3: Credit Score */}
          <motion.div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-80 flex flex-col min-w-0">
            <h3 className="font-semibold mb-4">Credit Score Analysis</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditScoreData}>
                   <XAxis dataKey="category" hide />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                   <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 4: KYC Progress */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-80 flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-6">
              <Upload size={20} className="text-orange-400" />
              <h3 className="font-semibold text-lg">KYC Progress</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700/30 rounded-full h-3">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full" style={{ width: "45%" }} />
                </div>
                <span className="text-sm font-semibold text-orange-400">45%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700/30 rounded-full h-3">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full" style={{ width: "75%" }} />
                </div>
                <span className="text-sm font-semibold text-emerald-400">75%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700/30 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full" style={{ width: "90%" }} />
                </div>
                <span className="text-sm font-semibold text-blue-400">90%</span>
              </div>
            </div>
            <p className="text-xs opacity-70 mt-auto text-center">2 documents pending</p>
          </motion.div>
          
          {/* Chart 5: Savings Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-80 flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={20} className="text-green-400" />
              <h3 className="font-semibold text-lg">Savings Growth</h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsData}>
                  <XAxis dataKey="month" tick={{fill: '#9ca3af'}} />
                  <YAxis tick={{fill: '#9ca3af'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                  <Line type="monotone" dataKey="saved" stroke="#059669" strokeWidth={4} dot={{ fill: "#059669", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </div>

    {/* CHATBOT WINDOW (Unchanged) */}
    {isChatOpen && (
       <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} className="fixed right-6 bottom-6 w-96 h-[500px] bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col z-50">
         {/* ... existing chatbot code ... */}
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Bot size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Assistant</h3>
                <p className="text-xs opacity-70">Online • {messages.length} messages</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleClearChat} className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <button onClick={() => setIsChatOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <Bot size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">Ask me anything about loans!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-gray-700/50 border border-gray-600/50'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && <div className="flex justify-start"><div className="bg-gray-700/50 p-3 rounded-2xl">...</div></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700/50">
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl bg-gray-700/30 hover:bg-gray-600/30"><Paperclip size={18} /></button>
              <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept=".pdf" />
              <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} placeholder={t("typeMessage")} className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50" disabled={isLoading} />
              <button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"><Send size={18} /></button>
            </div>
          </div>
       </motion.div>
    )}

  </div>
);
}
const NavItem = ({ label, icon, link }) => (
  <Link to={link || '#'}>
    <button className="flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-xl w-full transition-all">
      <span className="flex gap-3">{icon} {label}</span>
      <ChevronRight size={16} className="opacity-50" />
    </button>
  </Link>
);

const FeatureCard = ({ icon, title, value }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-700/20 border border-gray-600/20 rounded-2xl p-6">
    <div className="text-emerald-400 text-xl mb-2">{icon}</div>
    <p className="text-sm opacity-70">{title}</p>
    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
  </motion.div>
);

export default CustomerDashboard;
