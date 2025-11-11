import React from "react";

export default function FileUpload({ onFileSelect }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please upload a valid PDF file!");
    }
  };

  return (
    <div className="my-2">
      <label className="block text-sm font-medium mb-1">Upload Salary Slip:</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="w-full text-sm border p-2 rounded-lg"
      />
    </div>
  );
}
