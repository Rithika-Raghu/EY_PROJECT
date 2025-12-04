import React from "react";

const steps = ["Application Submitted", "Document Verification", "Underwriting", "Approved", "Disbursed"];

const LoanStatusTracker = () => {
  const current = 3;

  return (
    <div className="p-8 space-y-5">
      <h1 className="text-2xl font-bold mb-4">Loan Status Tracker</h1>
      {steps.map((step, index) => (
        <div key={index} className={`p-4 rounded-xl ${index <= current ? "bg-emerald-600/40" : "bg-gray-700/20"}`}>
          {step}
        </div>
      ))}
    </div>
  );
};

export default LoanStatusTracker;
