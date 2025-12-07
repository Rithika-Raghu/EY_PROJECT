import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext"; // Import useAuth
import { Sun, Moon, Bell, Search, ChevronRight, CreditCard, FileText, HelpCircle, Calculator, Upload, ShieldCheck, Wallet, TrendingUp, Users, Bot, LogOut, MessageCircle, Paperclip, Send } from "lucide-react";
import { useLocalStorage } from "../src/hooks/useLocalStorage";
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
    logout: "Logout",
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
    logout: "लॉगआउट",
  },
};

const emiData = [
  { month: "Jan", value: 35000 },
  { month: "Feb", value: 35000 },
  { month: "Mar", value: 35000 },
];

const CustomerDashboard = () => {
  const { user, logout } = useAuth(); // Get user from context
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useLocalStorage('finomic_chat_history', []);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
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

    const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage, timestamp: new Date() };
      const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      const botMessage = { 
        role: "bot", 
        content: data.reply, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...updatedMessages, botMessage]);
    } catch (error) {
      const errorMessage = { 
        role: "bot", 
        content: "Sorry, I'm having trouble connecting. Please try again.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const loadChatHistory = async () => {
  try {
    const response = await fetch("http://localhost:5000/chat/history");
    const data = await response.json();
    if (data.history) {
      setMessages(data.history.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      })));
    }
  } catch (error) {
    console.log("No history available");
  }
};


  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", file.name.split('.').slice(0, -1).join('.') || "document");

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const botMessage = { 
        role: "bot", 
        content: data.reply || `Document "${file.name}" uploaded successfully!`, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, botMessage]);
      setShowFileUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const errorMessage = { 
        role: "bot", 
        content: "File upload failed. Please try again.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-lg font-semibold">Finomic Elite</h1>
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
          <NavItem link="/offers"label={t("offers")} icon={<TrendingUp size={18} />} />
          <NavItem link="/help"label={t("help")} icon={<HelpCircle size={18} />} />
          
          {/* ✅ FIXED: Toggle button instead of NavItem */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl w-full transition-all ${
              isChatOpen 
                ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400/50' 
                : 'hover:bg-white/10'
            }`}
          >
            <span className="flex gap-3 items-center">
              <MessageCircle size={18} />
              {t("chatbot")}
              <span className="ml-2 text-[14px] opacity-100">
                {isChatOpen ? "Close Chat" : "Open Chat"}
              </span>
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

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* TOP BAR */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold">Hello, {user?.username || 'User'}!</p>
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

        {/* USER INFO CARD - NEW */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/30"
        >
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
            <div>
              <p className="opacity-70">User ID</p>
              <p className="font-semibold">#{user?.id || 'N/A'}</p>
            </div>
          </div>
        </motion.div>

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
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-6 bottom-24 w-96 h-[500px] bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col z-50"
        >
     {/* Chat Header */}
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
        
        {/* Header Buttons */}
        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          <button 
            onClick={async () => {
              if (window.confirm("Clear all chat history & context? This starts completely fresh.")) {
                // Clear Frontend (localStorage)
                setMessages([]);
                setInputMessage("");
                
                // Clear Backend Session + Context
                try {
                  await fetch("http://localhost:5000/chat/clear", { 
                    method: "POST",
                    credentials: 'include',  // ✅ Include cookies/session
                    headers: { "Content-Type": "application/json" }
                  });
                  console.log("✅ Backend session cleared!");
                } catch (error) {
                  console.log("Backend clear failed:", error);
                }
              }
            }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center group"
            title="Clear Chat History & Context"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 4h4a1 1 0 011 1v3" />
            </svg>
          </button>
          
          {/* Close Button */}
          <button 
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-all"
            title="Close Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <Bot size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">Ask me anything about your loans, payments, or documents!</p>
                <div className="mt-4 text-xs space-y-1">
                  <p className="block w-full p-2 hover:bg-gray-700/50 rounded-lg text-left transition-all">
                    Check my loan status
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${message.role === 'user' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-700/50 border border-gray-600/50'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl p-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <span className="text-sm opacity-70">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setShowFileUpload(!showFileUpload);
                  if (fileInputRef.current && !showFileUpload) fileInputRef.current.click();
                }}
                className="p-2 rounded-xl bg-gray-700/30 hover:bg-gray-600/30 transition-all flex items-center justify-center"
                title={t("uploadDoc")}
              >
                <Paperclip size={18} />
              </button>
              
              {showFileUpload && (
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              )}

              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("typeMessage")}
                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 resize-none"
                disabled={isLoading}
              />
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// COMPONENTS
const NavItem = ({ label, icon, link }) => (
  <Link to={link || '#'}>
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
