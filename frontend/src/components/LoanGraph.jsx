import React from "react";
import { Bar } from "react-chartjs-2";

export default function LoanGraph({ loans }) {
  const data = {
    labels: loans.map((l) => `Loan ${l.id}`),
    datasets: [
      {
        label: "Loan Amount",
        data: loans.map((l) => l.amount),
        backgroundColor: loans.map((l) =>
          l.status === "APPROVED" ? "#34D399" :
          l.status === "PENDING" ? "#FBBF24" : "#F87171"
        ),
      },
    ],
  };

  return <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />;
}
