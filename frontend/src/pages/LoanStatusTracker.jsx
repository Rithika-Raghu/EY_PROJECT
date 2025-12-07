import React, { useState } from "react";

const LoanStatusTracker = () => {
  const [selectedLoan, setSelectedLoan] = useState(0);

  // Sample loan applications data
  const loanApplications = [
    {
      id: "PL-2024-12345",
      type: "Personal Loan",
      amount: 500000,
      appliedDate: "25 Nov 2024",
      expectedDisbursal: "20 Dec 2024",
      currentStep: 3,
      status: "In Progress",
      statusColor: "emerald",
    },
    {
      id: "HL-2024-67890",
      type: "Home Loan",
      amount: 3500000,
      appliedDate: "15 Nov 2024",
      expectedDisbursal: "15 Jan 2025",
      currentStep: 2,
      status: "Under Review",
      statusColor: "yellow",
    },
    {
      id: "AL-2024-11223",
      type: "Auto Loan",
      amount: 800000,
      appliedDate: "10 Oct 2024",
      expectedDisbursal: "Disbursed",
      currentStep: 5,
      status: "Completed",
      statusColor: "blue",
    },
  ];

  const currentLoan = loanApplications[selectedLoan];

  // Loan process steps
  const steps = [
    {
      id: 1,
      name: "Application Submitted",
      description: "Your loan application has been received",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      date: "25 Nov 2024, 10:30 AM",
      duration: "Completed",
    },
    {
      id: 2,
      name: "Document Verification",
      description: "KYC and income documents are being verified",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      date: "26 Nov 2024, 2:15 PM",
      duration: "Completed in 1 day",
    },
    {
      id: 3,
      name: "Credit Assessment",
      description: "Evaluating creditworthiness and risk profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      date: "28 Nov 2024, 11:00 AM",
      duration: "In Progress (2 days)",
    },
    {
      id: 4,
      name: "Final Approval",
      description: "Senior management approval pending",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      date: "Pending",
      duration: "Expected: 1-2 days",
    },
    {
      id: 5,
      name: "Loan Disbursement",
      description: "Amount will be credited to your account",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      date: "Expected: 20 Dec 2024",
      duration: "2-3 days after approval",
    },
  ];

  // Calculate progress percentage
  const progressPercentage = (currentLoan.currentStep / steps.length) * 100;

  // Documents status
  const documents = [
    { name: "PAN Card", status: "Verified", icon: "✓" },
    { name: "Aadhaar Card", status: "Verified", icon: "✓" },
    { name: "Salary Slips (3 months)", status: "Verified", icon: "✓" },
    { name: "Bank Statements", status: "Under Review", icon: "⏱" },
    { name: "Address Proof", status: "Verified", icon: "✓" },
  ];

  // Activity timeline
  const activities = [
    { date: "28 Nov 2024", time: "11:00 AM", action: "Credit assessment started", type: "process" },
    { date: "27 Nov 2024", time: "3:30 PM", action: "Additional salary slip uploaded", type: "document" },
    { date: "26 Nov 2024", time: "2:15 PM", action: "All documents verified successfully", type: "success" },
    { date: "26 Nov 2024", time: "9:00 AM", action: "Document verification initiated", type: "process" },
    { date: "25 Nov 2024", time: "10:30 AM", action: "Application submitted", type: "success" },
  ];

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
                <h1 className="text-xl sm:text-2xl font-bold">Loan Application Tracker</h1>
                <p className="text-xs sm:text-sm opacity-70">
                  Real-time status of your loan applications
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Application</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Loan Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loanApplications.map((loan, index) => (
            <button
              key={loan.id}
              onClick={() => setSelectedLoan(index)}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selectedLoan === index
                  ? "bg-emerald-500/20 border-emerald-500/50"
                  : "bg-gray-700/20 border-gray-600/20 hover:bg-gray-700/30"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs opacity-70 mb-1">{loan.type}</p>
                  <h3 className="text-lg font-bold">₹ {loan.amount.toLocaleString('en-IN')}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  loan.statusColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                  loan.statusColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {loan.status}
                </span>
              </div>
              <p className="text-xs opacity-60">Application ID: {loan.id}</p>
              <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(loan.currentStep / 5) * 100}%` }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                />
              </div>
              <p className="text-xs opacity-60 mt-2">Step {loan.currentStep} of 5</p>
            </button>
          ))}
        </div>

        {/* Status Overview Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentLoan.type}</h2>
              <p className="text-sm opacity-80 mb-4">
                Application ID: {currentLoan.id} • Applied: {currentLoan.appliedDate}
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs opacity-70">Loan Amount</p>
                  <p className="text-xl font-bold text-emerald-400">₹ {currentLoan.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="h-10 w-px bg-gray-600/30" />
                <div>
                  <p className="text-xs opacity-70">Expected Disbursal</p>
                  <p className="text-xl font-bold">{currentLoan.expectedDisbursal}</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 3.51} 351`}
                    className="text-emerald-400"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress Timeline - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Steps Progress */}
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Application Progress
              </h3>

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const isCompleted = index < currentLoan.currentStep;
                  const isCurrent = index + 1 === currentLoan.currentStep;
                  const isPending = index + 1 > currentLoan.currentStep;

                  return (
                    <div key={step.id} className="relative">
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className={`absolute left-6 top-14 w-0.5 h-12 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-gray-700'
                        }`} />
                      )}

                      <div className={`flex gap-4 p-4 rounded-xl transition-all ${
                        isCurrent ? 'bg-emerald-500/20 border border-emerald-500/40' :
                        isCompleted ? 'bg-gray-800/30' :
                        'bg-gray-800/10 opacity-50'
                      }`}>
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-emerald-500 text-white' :
                          isCurrent ? 'bg-emerald-500/30 text-emerald-400 animate-pulse' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {step.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{step.name}</h4>
                              <p className="text-sm opacity-70 mt-1">{step.description}</p>
                            </div>
                            {isCompleted && (
                              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {isCurrent && (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                                In Progress
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs opacity-60">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {step.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {step.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      activity.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                      activity.type === 'document' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {activity.type === 'success' ? '✓' : activity.type === 'document' ? '📄' : '⏱'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs opacity-60 mt-1">{activity.date} at {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Documents & Info */}
          <div className="space-y-6">
            
            {/* Documents Status */}
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </h3>

              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{doc.icon}</span>
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === 'Verified' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-sm transition-all">
                Upload Additional Document
              </button>
            </div>

            {/* Loan Officer Contact */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30">
              <h3 className="text-lg font-semibold mb-4">Your Loan Officer</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  RM
                </div>
                <div>
                  <p className="font-semibold">Rajesh Mehta</p>
                  <p className="text-xs opacity-70">Senior Loan Officer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 opacity-80">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 98765 43210
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  rajesh.m@tatacapital.com
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-sm transition-all">
                  Call
                </button>
                <button className="flex-1 py-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-sm transition-all">
                  Email
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/40 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View FAQs
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/40 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Chat Support
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/40 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Track via SMS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold mb-1">Track in Real-Time</p>
            <p className="opacity-80">
              Your application status is updated in real-time. You'll receive SMS and email notifications at each milestone. Expected processing time: 5-7 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatusTracker;
