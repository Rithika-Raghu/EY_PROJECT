import React from "react";

export default function LoanCard({ loan }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md dark:shadow-gray-700">
      <h3 className="font-bold text-lg">₹{loan.amount}</h3>
      <p>Tenure: {loan.tenure} months</p>
      <p>Rate: {loan.rate}% p.a.</p>
      <p>Status: 
        <span className={
          loan.status === "APPROVED" ? "text-green-500" :
          loan.status === "PENDING" ? "text-yellow-400" :
          "text-red-500"
        }>
          {loan.status}
        </span>
      </p>
    </div>
  );
}
