import React from "react";

const Payments = () => {
  const transactions = [
    { date: "10 Jan 2025", amount: "₹47,000", status: "Success" },
    { date: "10 Dec 2024", amount: "₹47,000", status: "Success" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Payments & Transactions</h1>
      {transactions.map((t, i) => (
        <div key={i} className="bg-gray-700/20 p-4 rounded-xl mb-2">
          <p>{t.date}</p>
          <p>{t.amount}</p>
          <p>{t.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Payments;
