import React from "react";

const LoanOverview = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Loan Overview</h1>
      <div className="bg-gray-700/20 p-6 rounded-xl">
        <p>Active Loan Amount: ₹15,00,000</p>
        <p>Monthly EMI: ₹47,000</p>
        <p>Interest Rate: 11.2%</p>
        <p>Remaining Tenure: 27 months</p>
      </div>
    </div>
  );
};

export default LoanOverview;
