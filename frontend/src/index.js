import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Add this import
import ProtectedRoute from "./components/ProtectedRoute"; // Add this import
import CustomerDashboard from "./customer_dashboard";
import AdminDashboard from "./admin_dashboard";
import LoanOverview from "./pages/LoanOverview";
import LoanStatusTracker from "./pages/LoanStatusTracker";
import ApplyNewLoan from "./pages/ApplyNewLoan";
import Payments from "./pages/Payments";
import EMITools from "./pages/EMITools";
import Documents from "./pages/Documents";
import Insurance from "./pages/Insurance";
import "./index.css";
import { Home, Login, Signup } from './App1';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap everything with AuthProvider */}
      <AuthProvider>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes - Require authentication */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/customer" 
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/overview" 
            element={
              <ProtectedRoute>
                <LoanOverview />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/status" 
            element={
              <ProtectedRoute>
                <LoanStatusTracker />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/apply" 
            element={
              <ProtectedRoute>
                <ApplyNewLoan />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/emi-tools" 
            element={
              <ProtectedRoute>
                <EMITools />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/insurance" 
            element={
              <ProtectedRoute>
                <Insurance />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);




// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import CustomerDashboard from "./customer_dashboard";
// import AdminDashboard from "./admin_dashboard";    // ← added
// import LoanOverview from "./pages/LoanOverview";
// import LoanStatusTracker from "./pages/LoanStatusTracker";
// import ApplyNewLoan from "./pages/ApplyNewLoan";
// import Payments from "./pages/Payments";
// import EMITools from "./pages/EMITools";
// import Documents from "./pages/Documents";
// import Insurance from "./pages/Insurance";
// import "./index.css";
// import { Home,Login, Signup } from './App1';

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>


//         <Route path="/" element={<Home />} /> 
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/admin" element={<AdminDashboard />} />


//         <Route path="/customer" element={<CustomerDashboard />} />
//         <Route path="/overview" element={<LoanOverview />} />
//         <Route path="/status" element={<LoanStatusTracker />} />
//         <Route path="/apply" element={<ApplyNewLoan />} />
//         <Route path="/payments" element={<Payments />} />
//         <Route path="/emi-tools" element={<EMITools />} />
//         <Route path="/documents" element={<Documents />} />
//         <Route path="/insurance" element={<Insurance />} />

//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );