import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/cnctrax-logo.png";
import { API } from "../config";

function AuthForm({ setToken, initialMode = 'login', redirectTo = '/machine-search' }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.role === 'customer') navigate(redirectTo);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, [navigate, redirectTo]);

  const performLogin = async () => {
    const loginRes = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();

    if (loginRes.ok && loginData.token) {
      localStorage.setItem("token", loginData.token);
      setToken(loginData.token);
      const decoded = jwtDecode(loginData.token);

      if (decoded.role === "customer") {
        navigate(redirectTo);
      } else {
        setMessage("Access denied. Please use the technician login.");
      }
      return true;
    } else {
      setMessage(loginData.error || "❌ Login failed.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (isLogin) {
      await performLogin();
    } else {
      const endpoint = role === "technician" ? "/signup-technician" : "/signup-customer";
      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        const loginSuccess = await performLogin();
        if (!loginSuccess) setIsLogin(true);
      } else {
        setMessage(data.error || "❌ Signup failed.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#151319] flex items-center justify-center px-6 sm:px-8 py-[30px] font-poppins">
      <div className="w-full max-w-md bg-[#1c1b22] p-8 rounded-3xl shadow-xl">
        <img src={logo} alt="CNC TRAX Logo" className="w-32 mx-auto mb-8" />

        <h2 className="text-white text-xl font-medium text-center mb-2">
          {isLogin ? "Welcome back" : "Sign Up"}
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          {isLogin ? "Log in to continue" : "Join us today!"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#2a2930] text-white"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#2a2930] text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#2a2930] text-white"
          />

          {!isLogin && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2a2930] text-white"
            >
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-full font-medium`}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Continue'}
          </button>
        </form>

        {message && <p className="text-green-400 text-center mt-4">{message}</p>}

        <p className="text-gray-500 text-xs text-center mt-6 leading-relaxed">
          By signing up, you agree to our Terms and Conditions <br /> & Privacy Policy
        </p>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="text-blue-400 hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;