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
import './index.css'; // ✅ Tailwind CSS and custom styles

function App() {
  return (
    <div className="min-h-screen bg-black text-white w-full">
      <Router>
        <Routes>
          {/* ✅ Public Search */}
          <Route path="/" element={<MachineSearch />} />

          {/* ✅ Client Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Technician Authentication */}
          <Route path="/tech-login" element={<TechLogin />} />
          <Route path="/tech-signup" element={<TechSignup />} />

          {/* ✅ Client and Technician Dashboards */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/tech-dashboard" element={<TechDashboard />} />

          {/* ✅ Password Reset */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ✅ Stripe / Purchase Success Logic */}
          <Route path="/success-logic" element={<SuccessLogic />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;