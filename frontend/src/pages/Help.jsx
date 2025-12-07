import React, { useState } from "react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);

  // Help categories
  const categories = [
    {
      id: 1,
      name: "Loan Application",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "emerald",
      articles: 15
    },
    {
      id: 2,
      name: "Account & Security",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "cyan",
      articles: 12
    },
    {
      id: 3,
      name: "Payments & EMI",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: "purple",
      articles: 18
    },
    {
      id: 4,
      name: "Documents",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: "orange",
      articles: 10
    },
    {
      id: 5,
      name: "Technical Support",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "blue",
      articles: 8
    },
    {
      id: 6,
      name: "Other Issues",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "pink",
      articles: 14
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 1,
      category: "Loan Application",
      question: "How do I apply for a personal loan?",
      answer: "To apply for a personal loan, navigate to the 'Apply for Loan' section from your dashboard. Fill in the required details including loan amount, tenure, and purpose. Upload necessary documents like income proof, identity proof, and address proof. Our team will review your application within 2-3 business days."
    },
    {
      id: 2,
      category: "Loan Application",
      question: "What documents are required for loan application?",
      answer: "Required documents include: 1) PAN Card, 2) Aadhaar Card, 3) Latest 3 months salary slips, 4) Last 6 months bank statements, 5) Address proof (Electricity bill/Rent agreement), 6) Form 16 or IT Returns for last 2 years. All documents should be clear and readable."
    },
    {
      id: 3,
      category: "Loan Application",
      question: "How long does the loan approval process take?",
      answer: "Once you submit your complete application with all required documents, our team typically takes 2-3 business days to review and process your application. For pre-approved customers, instant approval is available. You'll receive updates via email and SMS at each stage of the process."
    },
    {
      id: 4,
      category: "Account & Security",
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page. Enter your registered email address. You'll receive a password reset link via email. Click the link and create a new strong password. Make sure your password is at least 8 characters long and includes uppercase, lowercase, numbers, and special characters."
    },
    {
      id: 5,
      category: "Account & Security",
      question: "How can I enable two-factor authentication?",
      answer: "Go to Settings > Security > Two-Factor Authentication. Choose your preferred method (SMS or Email). Click 'Enable 2FA' and follow the verification steps. Once enabled, you'll need to enter a verification code along with your password when logging in from a new device."
    },
    {
      id: 6,
      category: "Payments & EMI",
      question: "How can I make my EMI payment?",
      answer: "EMI payments can be made through: 1) Auto-debit from your linked bank account (recommended), 2) Online payment via net banking, 3) UPI payment, 4) Debit/Credit card payment. Visit the 'Payments' section to view your EMI schedule and make payments."
    },
    {
      id: 7,
      category: "Payments & EMI",
      question: "Can I prepay my loan?",
      answer: "Yes, you can prepay your loan partially or fully at any time. Go to 'Loan Overview' > 'Prepayment Options'. Enter the amount you wish to prepay and confirm. Part prepayment reduces your outstanding principal. Full prepayment closes your loan account. No prepayment charges for personal loans."
    },
    {
      id: 8,
      category: "Payments & EMI",
      question: "What happens if I miss an EMI payment?",
      answer: "Missing an EMI payment can affect your credit score and may incur late payment charges. If you anticipate difficulty in making a payment, contact our support team immediately. We offer grace periods and payment restructuring options for genuine cases."
    },
    {
      id: 9,
      category: "Documents",
      question: "How do I upload documents?",
      answer: "Go to 'Document Vault' from your dashboard. Click 'Upload Document', select the document type, and choose the file from your device. Supported formats are PDF, JPG, and PNG (max 10MB). Ensure documents are clear and all information is visible."
    },
    {
      id: 10,
      category: "Documents",
      question: "Are my documents stored securely?",
      answer: "Yes, all documents are encrypted using bank-grade security (AES-256 encryption). Documents are stored on secure servers with restricted access. Only you and authorized bank officials can view your documents. We comply with all data protection regulations."
    },
    {
      id: 11,
      category: "Technical Support",
      question: "The website is not loading properly. What should I do?",
      answer: "Try these steps: 1) Clear your browser cache and cookies, 2) Try a different browser (Chrome, Firefox, Safari), 3) Check your internet connection, 4) Disable browser extensions temporarily, 5) Try accessing from incognito/private mode. If the issue persists, contact our technical support."
    },
    {
      id: 12,
      category: "Technical Support",
      question: "I'm not receiving OTP. What should I do?",
      answer: "OTP issues can occur due to: 1) Network delays - wait 2-3 minutes, 2) DND (Do Not Disturb) enabled on your number - contact your telecom provider, 3) Incorrect mobile number - verify in Settings. If you still don't receive OTP, use 'Resend OTP' option or contact support."
    }
  ];

  // Popular articles
  const popularArticles = [
    { title: "Getting Started with Your Loan Application", views: "2.5K", category: "Loan Application" },
    { title: "Understanding Your EMI Schedule", views: "1.8K", category: "Payments & EMI" },
    { title: "Document Requirements Guide", views: "1.5K", category: "Documents" },
    { title: "Setting Up Auto-Debit for EMI Payments", views: "1.2K", category: "Payments & EMI" },
    { title: "Loan Approval Process Explained", views: "1.1K", category: "Loan Application" }
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Check Application Status",
      description: "Track your loan application",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      link: "/loan-status"
    },
    {
      title: "Make a Payment",
      description: "Pay your EMI online",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      link: "/payments"
    },
    {
      title: "Upload Documents",
      description: "Submit required documents",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      link: "/documents"
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E12] via-[#0D1216] to-black text-gray-200">
      
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-gray-900/50 border-b border-gray-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Help Center</h1>
                <p className="text-xs sm:text-sm opacity-70">
                  Find answers to your questions
                </p>
              </div>
            </div>
            <button 
              onClick={() => setContactFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="hidden sm:inline">Contact Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-b border-gray-700/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How can we help you?</h2>
          <p className="text-lg opacity-80 mb-8">Search our knowledge base or browse categories below</p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for help articles, FAQs, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-gray-800/50 border border-gray-600/30 rounded-2xl focus:border-emerald-500 focus:outline-none text-lg"
            />
            <svg className="w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-8 text-sm">
            <div>
              <span className="font-bold text-emerald-400">77</span> Articles
            </div>
            <div>
              <span className="font-bold text-cyan-400">12</span> Video Guides
            </div>
            <div>
              <span className="font-bold text-purple-400">24/7</span> Support
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Categories Grid */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.name);
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className={`flex items-start gap-4 p-6 rounded-2xl border transition-all text-left hover:scale-105 ${
                  selectedCategory === category.name
                    ? `bg-${category.color}-500/20 border-${category.color}-500/40`
                    : 'bg-gray-700/20 border-gray-600/20 hover:bg-gray-700/30'
                }`}
              >
                <div className={`w-12 h-12 bg-${category.color}-500/20 rounded-xl flex items-center justify-center text-${category.color}-400 flex-shrink-0`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{category.name}</h4>
                  <p className="text-sm opacity-70">{category.articles} articles</p>
                </div>
                <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filter
            </button>
          )}
        </div>

        {/* Popular Articles */}
        <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              Popular Articles
            </h3>
            <button className="text-sm text-emerald-400 hover:text-emerald-300">View all</button>
          </div>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-700/40 rounded-xl transition-all text-left group"
              >
                <div className="flex-1">
                  <h4 className="font-medium group-hover:text-emerald-400 transition-colors">{article.title}</h4>
                  <p className="text-xs opacity-60 mt-1">{article.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm opacity-70">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {article.views}
                  </div>
                  <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">
              {selectedCategory ? `${selectedCategory} FAQs` : 'Frequently Asked Questions'}
            </h3>
            <span className="text-sm opacity-70">{filteredFAQs.length} questions</span>
          </div>
          <div className="space-y-3">
            {filteredFAQs.map(faq => (
              <div
                key={faq.id}
                className="bg-gray-700/20 backdrop-blur-xl rounded-2xl border border-gray-600/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-700/30 transition-all text-left"
                >
                  <div className="flex-1">
                    <span className="text-xs opacity-60 mb-2 block">{faq.category}</span>
                    <h4 className="font-semibold text-lg">{faq.question}</h4>
                  </div>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-600/20">
                      <p className="opacity-80 leading-relaxed">{faq.answer}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Helpful
                        </button>
                        <button className="text-sm opacity-70 hover:opacity-100 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                          Not helpful
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.link}
                className="flex items-center gap-4 p-6 bg-gray-700/20 backdrop-blur-xl rounded-2xl border border-gray-600/20 hover:bg-gray-700/30 hover:border-gray-500/30 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{action.title}</h4>
                  <p className="text-sm opacity-70">{action.description}</p>
                </div>
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl p-8 rounded-2xl border border-emerald-500/30">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-2xl font-bold mb-3">Still need help?</h3>
            <p className="text-lg opacity-80 mb-6">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setContactFormOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Live Chat
              </button>
            </div>
            <p className="text-sm opacity-70 mt-4">
              Average response time: Under 5 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {contactFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Contact Support</h2>
              <button
                onClick={() => setContactFormOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="text-sm opacity-70 mb-2 block">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-gray-700/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm opacity-70 mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full bg-gray-700/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm opacity-70 mb-2 block">Issue Category</label>
                <select className="w-full bg-gray-700/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none">
                  <option>Loan Application</option>
                  <option>Account & Security</option>
                  <option>Payments & EMI</option>
                  <option>Documents</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm opacity-70 mb-2 block">Message</label>
                <textarea
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-gray-700/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setContactFormOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
