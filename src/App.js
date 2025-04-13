// 🔼 Library Imports
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔼 Component Imports
import Header from './components/Header';
import MachineSearch from './components/MachineSearch';
import Login from './components/Login';
import Signup from './components/Signup';
import TechLogin from './components/TechLogin';
import TechSignup from './components/TechSignup';
import ResetPassword from './components/ResetPassword';
import SuccessLogic from './components/success-logic';
import ClientDashboard from './components/ClientDashboard';
import TechDashboard from './components/TechDashboard';
import MachineReport from './components/MachineReport';
import PurchaseReport from './components/PurchaseReport';
import MyReports from './components/MyReports';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound'; // 🔧 Create this component

// 🔼 Styles
import './index.css';

// 🔧 Optional: Centralized Roles (if using roles in multiple places)
const ROLES = {
  CUSTOMER: 'customer',
  TECHNICIAN: 'technician',
};

function App() {
  return (
    <div className="min-h-screen bg-[#151319] text-white w-full">
      <Router>
        <Header />
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<MachineSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tech-login" element={<TechLogin />} />
          <Route path="/tech-signup" element={<TechSignup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success-logic" element={<SuccessLogic />} />

          {/* ✅ Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={ROLES.CUSTOMER}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machine-report"
            element={
              <ProtectedRoute role={ROLES.CUSTOMER}>
                <MachineReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-report"
            element={
              <ProtectedRoute role={ROLES.CUSTOMER}>
                <PurchaseReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute role={ROLES.CUSTOMER}>
                <MyReports />
              </ProtectedRoute>
            }
          />

          {/* ✅ Technician Routes */}
          <Route
            path="/tech-dashboard"
            element={
              <ProtectedRoute role={ROLES.TECHNICIAN}>
                <TechDashboard />
              </ProtectedRoute>
            }
          />

          {/* ❌ Catch-all Route (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;