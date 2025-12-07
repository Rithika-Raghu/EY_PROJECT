import React, { useState } from "react";

const EMITools = () => {
  const [activeTab, setActiveTab] = useState("emi");

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(36);
  const [emiResult, setEmiResult] = useState(null);

  // Eligibility Calculator State
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [existingEMI, setExistingEMI] = useState(5000);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Prepayment Calculator State
  const [outstandingLoan, setOutstandingLoan] = useState(800000);
  const [currentEMI, setCurrentEMI] = useState(25000);
  const [prepaymentAmount, setPrepaymentAmount] = useState(100000);
  const [prepaymentResult, setPrepaymentResult] = useState(null);

  // Compare Loans State
  const [loan1Amount, setLoan1Amount] = useState(500000);
  const [loan1Rate, setLoan1Rate] = useState(10.5);
  const [loan1Tenure, setLoan1Tenure] = useState(36);
  const [loan2Amount, setLoan2Amount] = useState(500000);
  const [loan2Rate, setLoan2Rate] = useState(11.5);
  const [loan2Tenure, setLoan2Tenure] = useState(36);
  const [comparisonResult, setComparisonResult] = useState(null);

  // EMI Calculation Function
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / (12 * 100);
    const n = parseFloat(loanTenure);

    if (P <= 0 || r <= 0 || n <= 0) {
      alert("Please enter valid values");
      return;
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    setEmiResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: P,
      interestPercentage: ((totalInterest / totalAmount) * 100).toFixed(1),
    });
  };

  // Eligibility Calculation Function
  const calculateEligibility = () => {
    const income = parseFloat(monthlyIncome);
    const existing = parseFloat(existingEMI);

    // FOIR (Fixed Obligation to Income Ratio) - typically 50%
    const maxEMI = income * 0.5 - existing;
    
    // Assuming 10.5% interest for 36 months
    const r = 10.5 / (12 * 100);
    const n = 36;
    
    // Reverse EMI formula to find eligible loan amount
    const eligibleLoan = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));

    setEligibilityResult({
      maxEMI: Math.round(maxEMI),
      eligibleLoan: Math.round(eligibleLoan),
      disposableIncome: income - existing,
    });
  };

  // Prepayment Calculation Function
  const calculatePrepayment = () => {
    const outstanding = parseFloat(outstandingLoan);
    const emi = parseFloat(currentEMI);
    const prepay = parseFloat(prepaymentAmount);

    // Approximate interest rate from EMI (simplified)
    const newOutstanding = outstanding - prepay;
    const savingsPerMonth = emi * 0.15; // Approximate savings
    const monthsSaved = Math.round(prepay / emi);

    setPrepaymentResult({
      newOutstanding: Math.round(newOutstanding),
      interestSaved: Math.round(prepay * 0.105 * (monthsSaved / 12)),
      tenureReduced: monthsSaved,
    });
  };

  // Compare Loans Function
  const compareLoans = () => {
    // Loan 1
    const P1 = parseFloat(loan1Amount);
    const r1 = parseFloat(loan1Rate) / (12 * 100);
    const n1 = parseFloat(loan1Tenure);
    const emi1 = (P1 * r1 * Math.pow(1 + r1, n1)) / (Math.pow(1 + r1, n1) - 1);
    const total1 = emi1 * n1;
    const interest1 = total1 - P1;

    // Loan 2
    const P2 = parseFloat(loan2Amount);
    const r2 = parseFloat(loan2Rate) / (12 * 100);
    const n2 = parseFloat(loan2Tenure);
    const emi2 = (P2 * r2 * Math.pow(1 + r2, n2)) / (Math.pow(1 + r2, n2) - 1);
    const total2 = emi2 * n2;
    const interest2 = total2 - P2;

    setComparisonResult({
      loan1: {
        emi: Math.round(emi1),
        total: Math.round(total1),
        interest: Math.round(interest1),
      },
      loan2: {
        emi: Math.round(emi2),
        total: Math.round(total2),
        interest: Math.round(interest2),
      },
      savings: Math.round(Math.abs(interest1 - interest2)),
      betterOption: interest1 < interest2 ? "Loan 1" : "Loan 2",
    });
  };

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
                <h1 className="text-xl sm:text-2xl font-bold">Financial Calculators</h1>
                <p className="text-xs sm:text-sm opacity-70">
                  Plan your finances with our smart tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Banner */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold mb-1">Smart Financial Planning Tools</p>
            <p className="opacity-80">
              Use our calculators to estimate EMIs, check eligibility, plan prepayments, and compare loan options. All calculations are indicative and subject to final approval.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap gap-3">
          <TabButton
            active={activeTab === "emi"}
            onClick={() => setActiveTab("emi")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            label="EMI Calculator"
          />
          <TabButton
            active={activeTab === "eligibility"}
            onClick={() => setActiveTab("eligibility")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Eligibility Check"
          />
          <TabButton
            active={activeTab === "prepayment"}
            onClick={() => setActiveTab("prepayment")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Prepayment Calculator"
          />
          <TabButton
            active={activeTab === "compare"}
            onClick={() => setActiveTab("compare")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Compare Loans"
          />
        </div>

        {/* EMI Calculator Tab */}
        {activeTab === "emi" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h2 className="text-xl font-semibold mb-6">Calculate Your EMI</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm opacity-70 mb-2 block">Loan Amount</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter loan amount"
                  />
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs opacity-50 mt-1">
                    <span>₹10K</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-2 block">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter interest rate"
                  />
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs opacity-50 mt-1">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-2 block">Loan Tenure (Months)</label>
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter tenure"
                  />
                  <input
                    type="range"
                    min="6"
                    max="360"
                    step="6"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs opacity-50 mt-1">
                    <span>6 months</span>
                    <span>30 years</span>
                  </div>
                </div>

                <button
                  onClick={calculateEMI}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  Calculate EMI
                </button>
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h2 className="text-xl font-semibold mb-6">Your EMI Breakdown</h2>
              
              {emiResult ? (
                <div className="space-y-6">
                  {/* Monthly EMI */}
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-6 rounded-xl border border-emerald-500/30">
                    <p className="text-sm opacity-70 mb-2">Monthly EMI</p>
                    <h3 className="text-4xl font-bold text-emerald-400">
                      ₹ {emiResult.emi.toLocaleString('en-IN')}
                    </h3>
                  </div>

                  {/* Breakdown Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">Principal Amount</p>
                      <p className="text-lg font-semibold">₹ {emiResult.principal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">Total Interest</p>
                      <p className="text-lg font-semibold text-orange-400">₹ {emiResult.totalInterest.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">Total Amount</p>
                      <p className="text-lg font-semibold">₹ {emiResult.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">Interest %</p>
                      <p className="text-lg font-semibold">{emiResult.interestPercentage}%</p>
                    </div>
                  </div>

                  {/* Visual Breakdown */}
                  <div>
                    <p className="text-sm opacity-70 mb-3">Payment Breakdown</p>
                    <div className="flex h-8 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(emiResult.principal / emiResult.totalAmount) * 100}%` }}
                        className="bg-emerald-500"
                      />
                      <div
                        style={{ width: `${(emiResult.totalInterest / emiResult.totalAmount) * 100}%` }}
                        className="bg-orange-500"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                        Principal ({((emiResult.principal / emiResult.totalAmount) * 100).toFixed(1)}%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        Interest ({((emiResult.totalInterest / emiResult.totalAmount) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 py-2 rounded-xl text-sm transition-all">
                      Apply Now
                    </button>
                    <button className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 py-2 rounded-xl text-sm transition-all">
                      Download PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-center">Enter loan details and click Calculate to see your EMI breakdown</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Calculator Tab */}
        {activeTab === "eligibility" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h2 className="text-xl font-semibold mb-6">Check Loan Eligibility</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm opacity-70 mb-2 block">Monthly Income</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter monthly income"
                  />
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-2 block">Existing EMI (if any)</label>
                  <input
                    type="number"
                    value={existingEMI}
                    onChange={(e) => setExistingEMI(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter existing EMI"
                  />
                </div>

                <button
                  onClick={calculateEligibility}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  Check Eligibility
                </button>
              </div>
            </div>

            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h2 className="text-xl font-semibold mb-6">Eligibility Results</h2>
              
              {eligibilityResult ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 p-6 rounded-xl border border-cyan-500/30">
                    <p className="text-sm opacity-70 mb-2">Maximum Eligible Loan</p>
                    <h3 className="text-4xl font-bold text-cyan-400">
                      ₹ {eligibilityResult.eligibleLoan.toLocaleString('en-IN')}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-gray-800/50 rounded-xl">
                      <span className="opacity-70">Maximum EMI</span>
                      <span className="font-semibold">₹ {eligibilityResult.maxEMI.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-800/50 rounded-xl">
                      <span className="opacity-70">Disposable Income</span>
                      <span className="font-semibold text-emerald-400">₹ {eligibilityResult.disposableIncome.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl text-sm">
                    <p className="opacity-80">
                      Based on 50% FOIR (Fixed Obligation to Income Ratio). Actual eligibility subject to credit score and other factors.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-center">Enter your details to check loan eligibility</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prepayment Calculator Tab */}
        {activeTab === "prepayment" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h2 className="text-xl font-semibold mb-6">Prepayment Impact</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm opacity-70 mb-2 block">Outstanding Loan Amount</label>
                  <input
                    type="number"
                    value={outstandingLoan}
                    onChange={(e) => setOutstandingLoan(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter outstanding amount"
                  />
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-2 block">Current Monthly EMI</label>
                  <input
                    type="number"
                    value={currentEMI}
                    onChange={(e) => setCurrentEMI(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter current EMI"
                  />
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-2 block">Prepayment Amount</label>
                  <input
                    type="number"
                    value={prepaymentAmount}
                    onChange={(e) => setPrepaymentAmount(e.target.value)}
                    className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter prepayment amount"
                  />
                </div>

                <button
                  onClick={calculatePrepayment}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  Calculate Savings
                </button>
              </div>
            </div>

            <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
              <h2 className="text-xl font-semibold mb-6">Prepayment Benefits</h2>
              
              {prepaymentResult ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/10 p-6 rounded-xl border border-purple-500/30">
                    <p className="text-sm opacity-70 mb-2">Interest Saved</p>
                    <h3 className="text-4xl font-bold text-purple-400">
                      ₹ {prepaymentResult.interestSaved.toLocaleString('en-IN')}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-gray-800/50 rounded-xl">
                      <span className="opacity-70">New Outstanding</span>
                      <span className="font-semibold">₹ {prepaymentResult.newOutstanding.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-800/50 rounded-xl">
                      <span className="opacity-70">Tenure Reduced By</span>
                      <span className="font-semibold text-emerald-400">{prepaymentResult.tenureReduced} months</span>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-sm">
                    <p className="opacity-80">
                      💡 Prepaying your loan can save significant interest and help you become debt-free faster!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-center">Calculate how much you can save with prepayment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compare Loans Tab */}
        {activeTab === "compare" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loan 1 */}
              <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
                <h2 className="text-xl font-semibold mb-6 text-emerald-400">Loan Option 1</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm opacity-70 mb-2 block">Loan Amount</label>
                    <input
                      type="number"
                      value={loan1Amount}
                      onChange={(e) => setLoan1Amount(e.target.value)}
                      className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm opacity-70 mb-2 block">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loan1Rate}
                      onChange={(e) => setLoan1Rate(e.target.value)}
                      className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm opacity-70 mb-2 block">Tenure (Months)</label>
                    <input
                      type="number"
                      value={loan1Tenure}
                      onChange={(e) => setLoan1Tenure(e.target.value)}
                      className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Loan 2 */}
              <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
                <h2 className="text-xl font-semibold mb-6 text-orange-400">Loan Option 2</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm opacity-70 mb-2 block">Loan Amount</label>
                    <input
                      type="number"
                      value={loan2Amount}
                      onChange={(e) => setLoan2Amount(e.target.value)}
                      className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm opacity-70 mb-2 block">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loan2Rate}
                      onChange={(e) => setLoan2Rate(e.target.value)}
                      className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm opacity-70 mb-2 block">Tenure (Months)</label>
                    <input
                      type="number"
                      value={loan2Tenure}
                      onChange={(e) => setLoan2Tenure(e.target.value)}
                      className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-600/30 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={compareLoans}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
            >
              Compare Loans
            </button>

            {/* Comparison Results */}
            {comparisonResult && (
              <div className="bg-gray-700/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/20">
                <h2 className="text-xl font-semibold mb-6">Comparison Results</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600/30">
                        <th className="text-left p-3 opacity-70">Metric</th>
                        <th className="text-right p-3 text-emerald-400">Loan 1</th>
                        <th className="text-right p-3 text-orange-400">Loan 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-600/20">
                        <td className="p-3 opacity-70">Monthly EMI</td>
                        <td className="text-right p-3 font-semibold">₹ {comparisonResult.loan1.emi.toLocaleString('en-IN')}</td>
                        <td className="text-right p-3 font-semibold">₹ {comparisonResult.loan2.emi.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-b border-gray-600/20">
                        <td className="p-3 opacity-70">Total Interest</td>
                        <td className="text-right p-3 font-semibold">₹ {comparisonResult.loan1.interest.toLocaleString('en-IN')}</td>
                        <td className="text-right p-3 font-semibold">₹ {comparisonResult.loan2.interest.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td className="p-3 opacity-70">Total Payable</td>
                        <td className="text-right p-3 font-semibold">₹ {comparisonResult.loan1.total.toLocaleString('en-IN')}</td>
                        <td className="text-right p-3 font-semibold">₹ {comparisonResult.loan2.total.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-5 rounded-xl border border-emerald-500/30">
                  <p className="text-sm opacity-70 mb-2">Recommendation</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                    {comparisonResult.betterOption} is Better
                  </h3>
                  <p className="text-sm">
                    You can save ₹ {comparisonResult.savings.toLocaleString('en-IN')} in total interest with the better option!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
      active
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "bg-gray-700/20 text-gray-400 border border-gray-600/20 hover:bg-gray-700/30"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default EMITools;
