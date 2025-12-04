import React, { useState } from "react";

const EMITools = () => {
  const [loan, setLoan] = useState(0);
  const [rate, setRate] = useState(0);
  const [months, setMonths] = useState(0);
  const [emi, setEmi] = useState(null);

  const calculateEMI = () => {
    const r = rate / (12 * 100);
    const emiCalc = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    setEmi(Math.round(emiCalc));
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">EMI Calculator</h1>

      <input placeholder="Loan Amount" onChange={(e) => setLoan(e.target.value)} className="bg-gray-700/20 p-3 rounded-xl" />
      <input placeholder="Interest Rate" onChange={(e) => setRate(e.target.value)} className="bg-gray-700/20 p-3 rounded-xl" />
      <input placeholder="Tenure (months)" onChange={(e) => setMonths(e.target.value)} className="bg-gray-700/20 p-3 rounded-xl" />

      <button onClick={calculateEMI} className="bg-emerald-600 px-6 py-3 rounded-xl text-white">Calculate</button>

      {emi && <h2 className="text-xl font-semibold">EMI: ₹{emi}</h2>}
    </div>
  );
};

export default EMITools;
