// Added light/dark mode support
// import { useState } from "react";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CreditCard,
  Settings,
  BarChart2,
  Activity,
  Bell,
  Search,
  CheckCircle,
  XCircle,
  Mail,
  DollarSign,
  Clipboard,
  UserPlus,
  ShieldCheck,
  Zap,
  FileArchive,
  AlertTriangle,
  Edit3,
  Trash2,
  MoreHorizontal,
  Sun, Moon
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// NOTE: This is a single-file React component meant as a drop-in admin dashboard.
// It focuses on UI & state for the requested admin features, using mock data and
// clear placeholders where integration with APIs should happen.

const mockCustomers = [
  { id: 1, name: "Asha Sharma", email: "asha@example.com", income: 85000, kyc: "pending", risk: 0.23, loans: 1 },
  { id: 2, name: "Ramesh Gupta", email: "ramesh@example.com", income: 42000, kyc: "approved", risk: 0.62, loans: 0 },
  { id: 3, name: "Pooja Singh", email: "pooja@example.com", income: 120000, kyc: "rejected", risk: 0.12, loans: 2 },
];

const mockApplications = [
  { id: "APP-001", customer: "Asha Sharma", amount: 500000, status: "Pending", appliedAt: "2025-11-28T10:12:00Z", assignedTo: null },
  { id: "APP-002", customer: "Ramesh Gupta", amount: 150000, status: "Under Review", appliedAt: "2025-11-20T09:00:00Z", assignedTo: "Officer 1" },
  { id: "APP-003", customer: "Pooja Singh", amount: 300000, status: "Approved", appliedAt: "2025-10-02T14:30:00Z", assignedTo: "Officer 2" },
];

const disbursementSeries = [
  { day: "01 Nov", value: 1200000 },
  { day: "08 Nov", value: 900000 },
  { day: "15 Nov", value: 1500000 },
  { day: "22 Nov", value: 800000 },
  { day: "29 Nov", value: 1700000 },
];

const productsMock = [
  { id: 1, name: "Home Loan - Standard", interest: 9.5, tenure: 240, min: 50000, max: 5000000 },
  { id: 2, name: "Personal Loan - Flex", interest: 14.0, tenure: 60, min: 10000, max: 1000000 },
];

const campaignsMock = [
  { id: 1, name: "Diwali Offer", sent: 45000, ctr: 2.5, active: true },
  { id: 2, name: "Salary Day EMI Reduce", sent: 12000, ctr: 3.2, active: false },
];

const documentsMock = [
  { id: 1, customer: "Asha Sharma", type: "PAN", filename: "asha_pan.pdf", expiry: "2030-01-01" },
  { id: 2, customer: "Ramesh Gupta", type: "Insurance", filename: "ramesh_ins.pdf", expiry: "2024-09-30" },
  { id: 3, customer: "Pooja Singh", type: "Agreement", filename: "loan_agree_pooya.pdf", expiry: null },
];

const transactionsMock = [
  { id: 1, txnId: "TXN-1001", customer: "Asha Sharma", amount: 47000, status: "Success", suspicious: false },
  { id: 2, txnId: "TXN-1002", customer: "Ramesh Gupta", amount: 20000, status: "Failed", suspicious: true },
];

const ticketsMock = [
  { id: 1, subject: "KYC failed to upload", customer: "Asha Sharma", status: "Open", assignedTo: null },
  { id: 2, subject: "EMI charged twice", customer: "Ramesh Gupta", status: "In Progress", assignedTo: "Agent 1" },
];

const rolesMock = [
  { id: 1, role: "customer", perms: ["view_self", "apply_loan"] },
  { id: 2, role: "loan_officer", perms: ["view_all_apps", "update_status"] },
  { id: 3, role: "auditor", perms: ["view_reports"] },
];


export default function AdminDashboard(props) {
  const [customers, setCustomers] = useState(mockCustomers);
  const [applications, setApplications] = useState(mockApplications);
  const [products, setProducts] = useState(productsMock);
  const [campaigns, setCampaigns] = useState(campaignsMock);
  const [documents, setDocuments] = useState(documentsMock);
  const [transactions, setTransactions] = useState(transactionsMock);
  const [tickets, setTickets] = useState(ticketsMock);
  const [roles, setRoles] = useState(rolesMock);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // KYC actions
  function handleKycAction(customerId, action) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, kyc: action === "approve" ? "approved" : "rejected" } : c))
    );
    // TODO: call API to persist
  }

  // Loan status change
  function changeLoanStatus(appId, status) {
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
  }

  // Assign officer
  function assignOfficer(appId, officerName) {
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, assignedTo: officerName } : a)));
  }

  // Product management
  function addProduct(product) {
    setProducts((p) => [...p, { ...product, id: Date.now() }] );
  }

  // Campaign create (basic)
  function createCampaign(c) {
    setCampaigns((old) => [{ ...c, id: Date.now(), sent: 0, ctr: 0, active: true }, ...old]);
  }

  // Ticket assignment
  function assignTicket(ticketId, agent) {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, assignedTo: agent, status: "In Progress" } : t)));
  }

  // Derived analytics
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  const overdueAmount = transactions.filter((t) => t.status === "Failed").reduce((s, t) => s + t.amount, 0);

  // small helper
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

//   const [theme, setTheme] = useState("light");
//   const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-800 p-6 hidden xl:flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-black">ADM</div>
          <div>
            <h2 className="text-lg font-semibold">Finomic Admin</h2>
            <p className="text-xs opacity-70">Super Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 text-sm">
          <button onClick={() => setActiveTab("overview")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="overview"?"bg-white/5":"hover:bg-white/3"}`}>
            <BarChart2 size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab("customers")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="customers"?"bg-white/5":"hover:bg-white/3"}`}>
            <Users size={18} /> Customer Management
          </button>
          <button onClick={() => setActiveTab("applications")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="applications"?"bg-white/5":"hover:bg-white/3"}`}>
            <Activity size={18} /> Loan Applications
          </button>
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="products"?"bg-white/5":"hover:bg-white/3"}`}>
            <Settings size={18} /> Product Management
          </button>
          <button onClick={() => setActiveTab("campaigns")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="campaigns"?"bg-white/5":"hover:bg-white/3"}`}>
            <Zap size={18} /> Campaigns
          </button>
          <button onClick={() => setActiveTab("documents")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="documents"?"bg-white/5":"hover:bg-white/3"}`}>
            <FileArchive size={18} /> Documents
          </button>
          <button onClick={() => setActiveTab("transactions")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="transactions"?"bg-white/5":"hover:bg-white/3"}`}>
            <DollarSign size={18} /> Transactions
          </button>
          <button onClick={() => setActiveTab("support")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="support"?"bg-white/5":"hover:bg-white/3"}`}>
            <Mail size={18} /> Support Tickets
          </button>
          <button onClick={() => setActiveTab("roles")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab==="roles"?"bg-white/5":"hover:bg-white/3"}`}>
            <UserPlus size={18} /> Role Management
          </button>
        </nav>

        <div className="mt-auto">
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">Create Report</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Topbar */}
        <header
  className={
    "p-4 flex justify-between items-center " +
    (theme === "dark"
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-gray-900")
  }
>
  <button
    onClick={toggleTheme}
    className="p-2 rounded-xl bg-gray-700/20"
  >
    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
  </button>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div>
              <p className="font-semibold">Hello, Admin</p>
              <p className="text-xs opacity-70">Overview & controls</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 opacity-50" size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers, apps, txns..." className="bg-gray-100 dark:bg-gray-900 px-10 py-2 rounded-xl text-sm w-72" />
            </div>
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900"><Bell size={18} /></button>
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Financial Analytics</h3>
                    <div className="text-sm opacity-70">Last 30 days</div>
                </div>
                <div className="h-48">
                    <ResponsiveContainer>
                    <LineChart data={disbursementSeries}>
                        <XAxis dataKey="day" stroke={theme==="dark"?"#ccc":"#555"} />
                        <YAxis stroke={theme==="dark"?"#ccc":"#555"} />
                        <Tooltip contentStyle={{ backgroundColor: theme==="dark"?"#1f2937":"#fff", border:"none", color: theme==="dark"?"#fff":"#000" }} />
                        <Line dataKey="value" stroke="#4f46e5" strokeWidth={3} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/30 dark:bg-gray-700/40 rounded-xl p-4 shadow-sm">
                    <p className="text-xs opacity-70">Approved</p>
                    <h4 className="font-semibold text-lg">{approvedCount}</h4>
                    </div>
                    <div className="bg-white/30 dark:bg-gray-700/40 rounded-xl p-4 shadow-sm">
                    <p className="text-xs opacity-70">Rejected</p>
                    <h4 className="font-semibold text-lg">{rejectedCount}</h4>
                    </div>
                    <div className="bg-white/30 dark:bg-gray-700/40 rounded-xl p-4 shadow-sm">
                    <p className="text-xs opacity-70">Overdue Amount</p>
                    <h4 className="font-semibold text-lg">₹ {overdueAmount.toLocaleString()}</h4>
                    </div>
                </div>
                </motion.div>

            <div className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
            <h3 className="font-semibold mb-3">Risk Snapshot</h3>
            <div className="h-48">
                <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={[
                        { name: "Low", value: 60 },
                        { name: "Medium", value: 30 },
                        { name: "High", value: 10 },
                    ]}
                    dataKey="value"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    >
                    {/* Assign colors to each slice */}
                    <Cell fill="#22c55e" /> {/* green for Low */}
                    <Cell fill="#facc15" /> {/* yellow for Medium */}
                    <Cell fill="#ef4444" /> {/* red for High */}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                        backgroundColor: "#1f2937", // dark gray background
                        border: "none",
                        color: "#fff", // white text
                    }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>
            </section>
          )}

          {activeTab === "customers" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Customer Management</h3>
                <div className="text-sm opacity-70">Total: {customers.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="text-left opacity-70">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Income</th>
                      <th className="px-3 py-2">KYC</th>
                      <th className="px-3 py-2">Risk Score</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map((c) => (
                      <tr key={c.id} className="border-t border-gray-700/10">
                        <td className="px-3 py-3">{c.name}</td>
                        <td className="px-3 py-3">{c.email}</td>
                        <td className="px-3 py-3">₹ {c.income.toLocaleString()}</td>
                        <td className="px-3 py-3">{c.kyc}</td>
                        <td className="px-3 py-3">{(c.risk*100).toFixed(0)}%</td>
                        <td className="px-3 py-3 flex gap-2">
                          {c.kyc === "pending" && <button onClick={() => handleKycAction(c.id, 'approve')} className="px-3 py-1 rounded-md bg-emerald-500 text-white text-xs">Approve</button>}
                          {c.kyc === "pending" && <button onClick={() => handleKycAction(c.id, 'reject')} className="px-3 py-1 rounded-md bg-red-500 text-white text-xs">Reject</button>}
                          <button className="px-3 py-1 rounded-md bg-gray-800 text-white text-xs">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white">Export CSV</button>
                <button className="px-4 py-2 rounded-xl border">Bulk KYC Approve</button>
              </div>
            </section>
          )}

          {activeTab === "applications" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Loan Applications Control Center</h3>
                <div className="text-sm opacity-70">Total: {applications.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="text-left opacity-70">
                    <tr>
                      <th className="px-3 py-2">App ID</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Assigned To</th>
                      <th className="px-3 py-2">TAT (days)</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.filter(a => a.customer.toLowerCase().includes(query.toLowerCase())).map((a) => {
                      const tat = Math.max(0, Math.floor((new Date() - new Date(a.appliedAt)) / (1000*60*60*24)));
                      return (
                        <tr key={a.id} className="border-t border-gray-700/10">
                          <td className="px-3 py-3">{a.id}</td>
                          <td className="px-3 py-3">{a.customer}</td>
                          <td className="px-3 py-3">₹ {a.amount.toLocaleString()}</td>
                          <td className="px-3 py-3">{a.status}</td>
                          <td className="px-3 py-3">{a.assignedTo || "-"}</td>
                          <td className={`px-3 py-3 ${tat>7? 'text-red-400':''}`}>{tat}</td>
                          <td className="px-3 py-3 flex gap-2">
                            <select defaultValue={a.status} onChange={(e) => changeLoanStatus(a.id, e.target.value)} className="text-sm rounded-md px-2 py-1">
                              <option>Pending</option>
                              <option>Under Review</option>
                              <option>Approved</option>
                              <option>Rejected</option>
                              <option>Disbursed</option>
                            </select>
                            <input placeholder="Assign officer" onKeyDown={(e) => { if(e.key==='Enter') assignOfficer(a.id, e.target.value) }} className="px-2 py-1 rounded-md text-sm" />
                            <button className="px-2 py-1 rounded-md bg-gray-800 text-white text-xs">Upload Doc</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "products" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Loan & Financial Products</h3>
                <div className="space-y-3">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-white/3 rounded-xl p-3">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs opacity-70">Interest: {p.interest}% • Tenure: {p.tenure} months</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-md border text-sm">Edit</button>
                        <button className="px-3 py-1 rounded-md border text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Create Product</h3>
                <ProductForm onCreate={addProduct} />
              </div>
            </section>
          )}

          {activeTab === "campaigns" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Campaign Management</h3>
                <button className="px-3 py-2 rounded-xl bg-emerald-500 text-white" onClick={() => createCampaign({ name: 'New Blast' })}>Create Campaign</button>
              </div>

              <div className="space-y-3">
                {campaigns.map(c => (
                  <div key={c.id} className="flex items-center justify-between bg-white/3 rounded-xl p-3">
                    <div>
                      <div className="font-semibold">{c.name} {c.active ? <span className="text-xs opacity-70">• Active</span> : <span className="text-xs opacity-50">• Inactive</span>}</div>
                      <div className="text-xs opacity-70">Sent: {c.sent.toLocaleString()} • CTR: {c.ctr}%</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-md border text-sm">View</button>
                      <button className="px-3 py-1 rounded-md border text-sm">Pause</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "documents" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <h3 className="font-semibold mb-3">Document Repository & Compliance</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="text-left opacity-70">
                    <tr>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">File</th>
                      <th className="px-3 py-2">Expiry</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(d => (
                      <tr key={d.id} className="border-t border-gray-700/10">
                        <td className="px-3 py-3">{d.customer}</td>
                        <td className="px-3 py-3">{d.type}</td>
                        <td className="px-3 py-3">{d.filename}</td>
                        <td className={`px-3 py-3 ${isExpired(d.expiry)? 'text-red-400':''}`}>{d.expiry || '-'}</td>
                        <td className="px-3 py-3 flex gap-2">
                          <button className="px-3 py-1 rounded-md border text-sm">Download</button>
                          <button className="px-3 py-1 rounded-md border text-sm">Audit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "transactions" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <h3 className="font-semibold mb-3">Transactions Monitoring</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="text-left opacity-70">
                    <tr>
                      <th className="px-3 py-2">TxnID</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} className="border-t border-gray-700/10">
                        <td className="px-3 py-3">{t.txnId}</td>
                        <td className="px-3 py-3">{t.customer}</td>
                        <td className="px-3 py-3">₹ {t.amount.toLocaleString()}</td>
                        <td className="px-3 py-3">{t.status}</td>
                        <td className="px-3 py-3">{t.suspicious ? <span className="text-red-400">Fraud Flag</span> : <span className="text-emerald-400">OK</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "support" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <h3 className="font-semibold mb-3">Support Tickets</h3>
              <div className="space-y-3">
                {tickets.map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-white/3 rounded-xl p-3">
                    <div>
                      <div className="font-semibold">{t.subject} <span className="text-xs opacity-70">• {t.status}</span></div>
                      <div className="text-xs opacity-70">Customer: {t.customer}</div>
                    </div>
                    <div className="flex gap-2">
                      <input placeholder="Assign agent" onKeyDown={(e) => { if(e.key==='Enter') assignTicket(t.id, e.target.value) }} className="px-2 py-1 rounded-md text-sm" />
                      <button className="px-3 py-1 rounded-md border text-sm">Close</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "roles" && (
            <section className="bg-white/5 rounded-2xl p-6 border border-gray-700/20">
              <h3 className="font-semibold mb-3">User Role Management</h3>
              <div className="space-y-3">
                {roles.map(r => (
                  <div key={r.id} className="flex items-center justify-between bg-white/3 rounded-xl p-3">
                    <div>
                      <div className="font-semibold">{r.role}</div>
                      <div className="text-xs opacity-70">Permissions: {r.perms.join(', ')}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-md border text-sm">Edit</button>
                      <button className="px-3 py-1 rounded-md border text-sm">Suspend</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// Small helper component: Product form
function ProductForm({ onCreate }) {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState(10);
  const [tenure, setTenure] = useState(60);
  const [min, setMin] = useState(10000);
  const [max, setMax] = useState(1000000);

  function submit(e) {
    e.preventDefault();
    onCreate({ name, interest: Number(interest), tenure: Number(tenure), min: Number(min), max: Number(max) });
    setName("");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="w-full px-3 py-2 rounded-md text-sm bg-transparent border" required />
      <div className="grid grid-cols-2 gap-3">
        <input value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Interest %" className="px-3 py-2 rounded-md text-sm bg-transparent border" />
        <input value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="Tenure (months)" className="px-3 py-2 rounded-md text-sm bg-transparent border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min amount" className="px-3 py-2 rounded-md text-sm bg-transparent border" />
        <input value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max amount" className="px-3 py-2 rounded-md text-sm bg-transparent border" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-white">Create</button>
      </div>
    </form>
  );
}
