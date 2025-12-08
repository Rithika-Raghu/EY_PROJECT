import React from "react";

const LoanOverview = () => {
  // Static loan data
  const loanData = {
    principal: 1500000,
    disbursedAmount: 1500000,
    outstandingAmount: 1125000,
    monthlyEMI: 47000,
    interestRate: 11.2,
    remainingTenure: 27,
    totalTenure: 36,
    nextDueDate: "15 Dec 2025",
    loanType: "Personal Loan",
    loanAccountNumber: "PL-2024-12345",
    disbursementDate: "15 Sep 2024",
    maturityDate: "15 Sep 2027",
    status: "Active",
  };

  // Calculate progress
  const progress = ((loanData.totalTenure - loanData.remainingTenure) / loanData.totalTenure) * 100;
  const paidAmount = loanData.principal - loanData.outstandingAmount;

  // Payment schedule (sample data)
  const upcomingPayments = [
    { date: "15 Dec 2025", amount: 47000, status: "Upcoming" },
    { date: "15 Jan 2026", amount: 47000, status: "Scheduled" },
    { date: "15 Feb 2026", amount: 47000, status: "Scheduled" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E12] via-[#0D1216] to-black text-gray-200">
      
      {/* Header with Back Button */}
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
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Loan Overview</h1>
                <p className="text-xs sm:text-sm opacity-70">
                  Account: {loanData.loanAccountNumber}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Download Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Status Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/30 flex items-center gap-4">
          <svg className="w-8 h-8 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Loan Status: Active & In Good Standing</h3>
            <p className="text-sm opacity-80">
              Your account is current. Next payment due on {loanData.nextDueDate}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Outstanding Amount */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/30">
            <div className="text-emerald-400 text-2xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-xs opacity-70 mb-1">Outstanding Amount</p>
            <h3 className="text-2xl font-bold mb-1">₹ {loanData.outstandingAmount.toLocaleString('en-IN')}</h3>
            <p className="text-xs opacity-60">of ₹ {loanData.principal.toLocaleString('en-IN')}</p>
          </div>

          {/* Monthly EMI */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur-xl p-5 rounded-2xl border border-cyan-500/30">
            <div className="text-cyan-400 text-2xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xs opacity-70 mb-1">Monthly EMI</p>
            <h3 className="text-2xl font-bold mb-1">₹ {loanData.monthlyEMI.toLocaleString('en-IN')}</h3>
            <p className="text-xs opacity-60">Auto-debit enabled</p>
          </div>

          {/* Interest Rate */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl p-5 rounded-2xl border border-purple-500/30">
            <div className="text-purple-400 text-2xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-xs opacity-70 mb-1">Interest Rate</p>
            <h3 className="text-2xl font-bold mb-1">{loanData.interestRate}%</h3>
            <p className="text-xs opacity-60">Fixed rate p.a.</p>
          </div>

          {/* Remaining Tenure */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-xl p-5 rounded-2xl border border-orange-500/30">
            <div className="text-orange-400 text-2xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs opacity-70 mb-1">Remaining Tenure</p>
            <h3 className="text-2xl font-bold mb-1">{loanData.remainingTenure} months</h3>
            <p className="text-xs opacity-60">of {loanData.totalTenure} months</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Repayment Progress
            </h2>
            <span className="text-2xl font-bold text-emerald-400">
              {progress.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden mb-4">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-1000"
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
              {loanData.totalTenure - loanData.remainingTenure} of {loanData.totalTenure} EMIs Paid
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="opacity-70">Amount Paid</span>
              <span className="font-semibold text-emerald-400">
                ₹ {paidAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="opacity-70">Amount Remaining</span>
              <span className="font-semibold text-orange-400">
                ₹ {loanData.outstandingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Loan Details */}
          <div className="lg:col-span-2 bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Loan Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Loan Type</span>
                <span className="font-semibold">{loanData.loanType}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Account Number</span>
                <span className="font-semibold">{loanData.loanAccountNumber}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Principal Amount</span>
                <span className="font-semibold">₹ {loanData.principal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Disbursed Amount</span>
                <span className="font-semibold">₹ {loanData.disbursedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Disbursement Date</span>
                <span className="font-semibold">{loanData.disbursementDate}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Maturity Date</span>
                <span className="font-semibold">{loanData.maturityDate}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Interest Type</span>
                <span className="font-semibold">Fixed Rate</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
                <span className="opacity-70">Repayment Mode</span>
                <span className="font-semibold">Auto-Debit</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-600/30">
              <h3 className="text-sm font-semibold mb-3 opacity-70">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Make Payment
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Statements
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  EMI Calculator
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upcoming Payments
            </h2>
            <div className="space-y-3">
              {upcomingPayments.map((payment, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    index === 0
                      ? "bg-emerald-500/10 border-emerald-500/40"
                      : "bg-gray-800/30 border-gray-700/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs opacity-70">{payment.date}</p>
                      <p className="text-lg font-bold mt-1">₹ {payment.amount.toLocaleString('en-IN')}</p>
                    </div>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                        Due Soon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {payment.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 text-sm font-medium transition-all">
              View All Payments
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold mb-1">Need Help?</p>
            <p className="opacity-80">
              Contact our loan assistance team at 1800-XXX-XXXX or visit the Help Center for FAQs about loan management, prepayment, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanOverview;
