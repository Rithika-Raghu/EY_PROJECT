import React, { useState } from "react";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Sample documents data
  const documents = [
    {
      id: 1,
      name: "Loan Agreement - Personal Loan",
      type: "Agreement",
      category: "loan",
      size: "2.4 MB",
      uploadDate: "15 Nov 2024",
      status: "Verified",
      loanId: "PL-2024-12345",
      fileType: "pdf",
      downloadable: true,
    },
    {
      id: 2,
      name: "Sanction Letter - Personal Loan",
      type: "Sanction Letter",
      category: "loan",
      size: "1.8 MB",
      uploadDate: "20 Nov 2024",
      status: "Verified",
      loanId: "PL-2024-12345",
      fileType: "pdf",
      downloadable: true,
    },
    {
      id: 3,
      name: "PAN Card - ABCDE1234F",
      type: "Identity Proof",
      category: "kyc",
      size: "850 KB",
      uploadDate: "10 Nov 2024",
      status: "Verified",
      fileType: "jpg",
      downloadable: true,
    },
    {
      id: 4,
      name: "Aadhaar Card",
      type: "Identity Proof",
      category: "kyc",
      size: "1.2 MB",
      uploadDate: "10 Nov 2024",
      status: "Verified",
      fileType: "jpg",
      downloadable: true,
    },
    {
      id: 5,
      name: "Salary Slip - November 2024",
      type: "Income Proof",
      category: "income",
      size: "650 KB",
      uploadDate: "28 Nov 2024",
      status: "Under Review",
      fileType: "pdf",
      downloadable: true,
    },
    {
      id: 6,
      name: "Bank Statement - 6 Months",
      type: "Financial Proof",
      category: "financial",
      size: "3.2 MB",
      uploadDate: "22 Nov 2024",
      status: "Verified",
      fileType: "pdf",
      downloadable: true,
    },
  ];

  // Document categories
  const categories = [
    { 
      id: "all", 
      name: "All Documents", 
      count: documents.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    { 
      id: "loan", 
      name: "Loan Documents", 
      count: documents.filter(d => d.category === "loan").length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: "kyc", 
      name: "KYC Documents", 
      count: documents.filter(d => d.category === "kyc").length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    { 
      id: "income", 
      name: "Income Proofs", 
      count: documents.filter(d => d.category === "income").length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: "financial", 
      name: "Financial", 
      count: documents.filter(d => d.category === "financial").length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
  ];

  // Filter documents
  const filteredDocuments = activeTab === "all" 
    ? documents 
    : documents.filter(doc => doc.category === activeTab);

  // Document stats
  const totalSize = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size);
    return acc + size;
  }, 0).toFixed(1);

  const verifiedCount = documents.filter(d => d.status === "Verified").length;
  const pendingCount = documents.filter(d => d.status === "Under Review").length;

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
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
                <h1 className="text-xl sm:text-2xl font-bold">Document Vault</h1>
                <p className="text-xs sm:text-sm opacity-70">
                  Securely store and manage your documents
                </p>
              </div>
            </div>
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700/20 backdrop-blur-xl p-5 rounded-2xl border border-gray-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs opacity-70">Total</p>
                <h3 className="text-2xl font-bold">{documents.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/20 backdrop-blur-xl p-5 rounded-2xl border border-gray-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs opacity-70">Verified</p>
                <h3 className="text-2xl font-bold">{verifiedCount}</h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/20 backdrop-blur-xl p-5 rounded-2xl border border-gray-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs opacity-70">Pending</p>
                <h3 className="text-2xl font-bold">{pendingCount}</h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/20 backdrop-blur-xl p-5 rounded-2xl border border-gray-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div>
                <p className="text-xs opacity-70">Storage</p>
                <h3 className="text-2xl font-bold">{totalSize}<span className="text-sm ml-1">MB</span></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold mb-1">Bank-Grade Security</p>
            <p className="opacity-80">
              Your documents are encrypted and stored securely. Only you and authorized personnel can access them.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === category.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-gray-700/20 text-gray-400 border border-gray-600/20 hover:bg-gray-700/30"
              }`}
            >
              {category.icon}
              <div className="text-left">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs opacity-70">{category.count} files</p>
              </div>
            </button>
          ))}
        </div>

        {/* Documents List/Table View */}
        <div className="bg-gray-700/20 backdrop-blur-xl rounded-2xl border border-gray-600/20 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-600/20 text-xs font-semibold opacity-70">
            <div className="col-span-5">Document Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2 hidden md:block">Upload Date</div>
            <div className="col-span-1 hidden lg:block">Size</div>
            <div className="col-span-2">Status</div>
          </div>

          {/* Document Rows */}
          <div className="divide-y divide-gray-600/20">
            {filteredDocuments.map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-700/30 transition-all cursor-pointer group"
              >
                {/* Name Column */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center text-emerald-400 flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate group-hover:text-emerald-400 transition-colors">{doc.name}</h3>
                    <p className="text-xs opacity-60">{doc.type}</p>
                  </div>
                </div>

                {/* Type Column */}
                <div className="col-span-2 flex items-center">
                  <span className="px-2 py-1 bg-gray-800/50 rounded text-xs uppercase">{doc.fileType}</span>
                </div>

                {/* Date Column */}
                <div className="col-span-2 hidden md:flex items-center text-sm opacity-70">
                  {doc.uploadDate}
                </div>

                {/* Size Column */}
                <div className="col-span-1 hidden lg:flex items-center text-sm opacity-70">
                  {doc.size}
                </div>

                {/* Status Column */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    doc.status === "Verified"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {doc.status === "Verified" ? "Verified" : "Pending"}
                  </span>
                  
                  {/* Quick Actions */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download action
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-gray-800/50 hover:bg-emerald-500/20 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="bg-gray-700/20 backdrop-blur-xl p-12 rounded-2xl border border-gray-600/20 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Documents Found</h3>
            <p className="text-sm opacity-70 mb-6">Upload your first document to get started</p>
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
            >
              Upload Document
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-4 p-5 bg-gray-700/20 backdrop-blur-xl rounded-2xl border border-gray-600/20 hover:bg-gray-700/30 transition-all text-left">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Required Documents</h3>
              <p className="text-xs opacity-70">View guidelines</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-5 bg-gray-700/20 backdrop-blur-xl rounded-2xl border border-gray-600/20 hover:bg-gray-700/30 transition-all text-left">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Bulk Upload</h3>
              <p className="text-xs opacity-70">Upload multiple files</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-5 bg-gray-700/20 backdrop-blur-xl rounded-2xl border border-gray-600/20 hover:bg-gray-700/30 transition-all text-left">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Download All</h3>
              <p className="text-xs opacity-70">Export as ZIP</p>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upload Document</h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Document Type Selection */}
              <div>
                <label className="text-sm opacity-70 mb-2 block">Document Type</label>
                <select className="w-full bg-gray-700/50 p-3 rounded-xl border border-gray-600/30 focus:border-emerald-500 focus:outline-none">
                  <option>Identity Proof</option>
                  <option>Address Proof</option>
                  <option>Income Proof</option>
                  <option>Bank Statement</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center hover:border-emerald-500 transition-all cursor-pointer">
                <input type="file" id="file-upload" className="hidden" multiple />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
                  <p className="text-sm opacity-70 mb-4">
                    Support for PDF, JPG, PNG up to 10MB
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Select Files
                  </div>
                </label>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Upload Guidelines
                </h4>
                <ul className="text-xs opacity-80 space-y-1 ml-6 list-disc">
                  <li>Ensure document is clear and all text is readable</li>
                  <li>Upload original or certified copies only</li>
                  <li>File size should not exceed 10MB</li>
                  <li>Accepted formats: PDF, JPG, PNG</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 transition-all">
                  Upload Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                  {getFileIcon(selectedDoc.fileType)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDoc.name}</h2>
                  <p className="text-sm opacity-70">{selectedDoc.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="opacity-70 mb-1">File Size</p>
                  <p className="font-semibold">{selectedDoc.size}</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="opacity-70 mb-1">Upload Date</p>
                  <p className="font-semibold">{selectedDoc.uploadDate}</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="opacity-70 mb-1">Status</p>
                  <p className="font-semibold">{selectedDoc.status}</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="opacity-70 mb-1">Category</p>
                  <p className="font-semibold capitalize">{selectedDoc.category}</p>
                </div>
              </div>

              {selectedDoc.loanId && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-sm opacity-70 mb-1">Associated Loan</p>
                  <p className="font-semibold">{selectedDoc.loanId}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Document
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button className="px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
