import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const OffersRecommendations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/offers/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations(getStaticOffers());
    } finally {
      setLoading(false);
    }
  };

  const getStaticOffers = () => [
    {
      id: 1,
      title: "Pre-Approved Personal Loan",
      type: "personal",
      amount: "₹5,00,000",
      interest: "10.99%",
      tenure: "24-60 months",
      description: "Get instant approval based on your credit profile",
      badge: "Pre-Approved",
      badgeColor: "emerald",
      features: ["Instant Disbursal", "No Hidden Charges", "Flexible Tenure"],
      savings: "Save ₹15,000 in interest",
      recommended: true,
      eligibility: 95
    },
    {
      id: 2,
      title: "Home Loan Special Offer",
      type: "home",
      amount: "Up to ₹75 Lakhs",
      interest: "8.40%",
      tenure: "Up to 30 years",
      description: "Lowest interest rate for salaried professionals",
      badge: "Limited Time",
      badgeColor: "orange",
      features: ["Zero Processing Fee", "Top-up Available", "Balance Transfer"],
      savings: "Processing fee waived (₹10,000)",
      recommended: true,
      eligibility: 88
    },
    {
      id: 3,
      title: "Car Loan - New Vehicle",
      type: "auto",
      amount: "Up to ₹20 Lakhs",
      interest: "8.75%",
      tenure: "12-84 months",
      description: "Finance your dream car with attractive rates",
      badge: "Popular",
      badgeColor: "blue",
      features: ["90% On-Road Financing", "Quick Approval", "Doorstep Service"],
      savings: "",
      recommended: false,
      eligibility: 82
    },
    {
      id: 4,
      title: "Business Loan for MSMEs",
      type: "business",
      amount: "₹10 Lakhs - ₹50 Lakhs",
      interest: "12.50%",
      tenure: "12-60 months",
      description: "Grow your business with collateral-free loans",
      badge: "New",
      badgeColor: "purple",
      features: ["Collateral Free", "Minimal Documentation", "Fast Approval"],
      savings: "",
      recommended: false,
      eligibility: 75
    },
    {
      id: 5,
      title: "Education Loan",
      type: "education",
      amount: "Up to ₹1 Crore",
      interest: "9.15%",
      tenure: "Up to 15 years",
      description: "Fund your higher education dreams",
      badge: "Special Rate",
      badgeColor: "cyan",
      features: ["Moratorium Period", "100% Finance", "Tax Benefits"],
      savings: "",
      recommended: false,
      eligibility: 90
    },
    {
      id: 6,
      title: "Loan Against Property",
      type: "property",
      amount: "₹10 Lakhs - ₹5 Crores",
      interest: "9.50%",
      tenure: "Up to 15 years",
      description: "Unlock the value of your property",
      badge: "",
      badgeColor: "",
      features: ["High Loan Amount", "Long Tenure", "Multi-Purpose Use"],
      savings: "",
      recommended: false,
      eligibility: 70
    }
  ];

  const categories = [
    { 
      id: "all", 
      name: "All Offers", 
      count: 6,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      id: "personal", 
      name: "Personal Loans", 
      count: 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: "home", 
      name: "Home Loans", 
      count: 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: "auto", 
      name: "Vehicle Loans", 
      count: 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: "business", 
      name: "Business Loans", 
      count: 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: "education", 
      name: "Education Loans", 
      count: 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: "property", 
      name: "Loan Against Property", 
      count: 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  const filteredOffers = selectedCategory === "all" 
    ? recommendations 
    : recommendations.filter(offer => offer.type === selectedCategory);

  const userProfile = {
    creditScore: 780,
    income: "₹8,50,000/year",
    existingLoans: 1,
    eligibility: "Excellent"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E12] via-[#0D1216] to-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading personalized offers...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl sm:text-2xl font-bold">Offers & Recommendations</h1>
                <p className="text-xs sm:text-sm opacity-70">
                  Personalized loan offers based on your profile
                </p>
              </div>
            </div>
            <button 
              onClick={fetchRecommendations}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh Offers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 backdrop-blur-xl p-8 rounded-2xl border border-emerald-500/30">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3">Welcome back, {user?.username}!</h2>
                <p className="text-lg opacity-90 mb-6">
                  Based on your profile, we found <span className="text-emerald-400 font-bold">{recommendations.length} exclusive offers</span> tailored for you
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Credit Score</p>
                      <p className="font-bold text-emerald-400">{userProfile.creditScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Annual Income</p>
                      <p className="font-bold text-cyan-400">{userProfile.income}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Eligibility</p>
                      <p className="font-bold text-purple-400">{userProfile.eligibility}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Browse by Category</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 scale-105"
                    : "bg-gray-700/20 text-gray-400 border border-gray-600/20 hover:bg-gray-700/30"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedCategory === category.id ? 'bg-emerald-500/20' : 'bg-gray-800/50'
                }`}>
                  {category.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs opacity-70">{category.count} offers</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        {filteredOffers.some(offer => offer.recommended) && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Recommended for You</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredOffers.filter(offer => offer.recommended).map(offer => (
                <OfferCard key={offer.id} offer={offer} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Offers */}
        <div>
          <h3 className="text-2xl font-bold mb-6">
            {selectedCategory === "all" ? "All Available Offers" : `${categories.find(c => c.id === selectedCategory)?.name}`}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOffers.filter(offer => !offer.recommended).map(offer => (
              <OfferCard key={offer.id} offer={offer} featured={false} />
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Need a Custom Loan Solution?</h3>
            <p className="text-lg opacity-90 mb-6">
              Speak with our loan experts to find the perfect solution for your needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Expert
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Offer Card Component
const OfferCard = ({ offer, featured }) => {
  const getBadgeColor = (color) => {
    const colors = {
      emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      orange: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/40",
      cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
    };
    return colors[color] || "bg-gray-500/20 text-gray-400 border-gray-500/40";
  };

  return (
    <div className={`relative bg-gray-700/20 backdrop-blur-xl rounded-2xl border overflow-hidden group hover:scale-[1.02] transition-all ${
      featured 
        ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent" 
        : "border-gray-600/20 hover:border-gray-500/30"
    }`}>
      {featured && (
        <div className="absolute top-0 right-0">
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            RECOMMENDED
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">{offer.title}</h4>
            {offer.badge && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(offer.badgeColor)}`}>
                {offer.badge}
              </span>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="text-xs opacity-70 mb-1">Loan Amount</p>
            <p className="text-2xl font-bold text-emerald-400">{offer.amount}</p>
          </div>
        </div>

        <p className="text-sm opacity-80 mb-4">{offer.description}</p>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-800/30 rounded-xl">
            <p className="text-xs opacity-70 mb-1">Interest Rate</p>
            <p className="font-bold text-cyan-400">{offer.interest}</p>
          </div>
          <div className="p-3 bg-gray-800/30 rounded-xl">
            <p className="text-xs opacity-70 mb-1">Tenure</p>
            <p className="font-bold text-purple-400">{offer.tenure}</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {offer.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Savings Badge */}
        {offer.savings && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-400">{offer.savings}</span>
            </div>
          </div>
        )}

        {/* Eligibility Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="opacity-70">Your Eligibility</span>
            <span className="font-bold text-emerald-400">{offer.eligibility}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              style={{ width: `${offer.eligibility}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 transition-all font-semibold">
            Apply Now
          </button>
          <button className="px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffersRecommendations;
