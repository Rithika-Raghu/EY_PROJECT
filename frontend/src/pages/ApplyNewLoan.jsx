import React from "react";
import { useNavigate } from "react-router-dom";

const ApplyNewLoan = () => {
  const navigate = useNavigate();

  const openChat = () => {
    navigate("/chatbot"); // wherever your chatbot route is
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Apply for New Loan</h1>
      <button
        onClick={openChat}
        className="px-6 py-3 bg-emerald-600 rounded-xl text-white text-lg"
      >
        Open Chatbot 💬
      </button>
    </div>
  );
};

export default ApplyNewLoan;
