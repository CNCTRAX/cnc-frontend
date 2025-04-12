import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MachineSearch from './components/MachineSearch';
import Login from './components/Login';
import Signup from './components/Signup';
import TechLogin from './components/TechLogin';
import TechSignup from './components/TechSignup';
import ClientDashboard from './components/ClientDashboard';
import TechDashboard from './components/TechDashboard';
import ResetPassword from './components/ResetPassword';
import SuccessLogic from './components/success-logic';
import MachineReport from './components/MachineReport'; // ✅ newly added
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

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

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="customer">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machine-report"
            element={
              <ProtectedRoute role="customer">
                <MachineReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tech-dashboard"
            element={
              <ProtectedRoute role="technician">
                <TechDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;