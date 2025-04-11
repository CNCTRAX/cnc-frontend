import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/cnctrax-logo.png";

const API = process.env.REACT_APP_API_URL;

function AuthForm({ setToken, initialMode = 'login', redirectTo = '/machine-search' }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? "/login"
      : role === "technician"
      ? "/signup-technician"
      : "/signup-customer";

    const body = isLogin
      ? { email, password }
      : { full_name: fullName, email, password };

    try {
      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        const decoded = jwtDecode(data.token);
        console.log("✅ Login success. Redirecting to:", redirectTo);
        if (decoded.role === "customer") {
          navigate(redirectTo);
        } else {
          setMessage("Access denied. Please use the technician login.");
        }
      } else if (!isLogin && response.status === 201) {
        console.log("✅ Signup successful. Logging in...");

        const loginResponse = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.token) {
          localStorage.setItem("token", loginData.token);
          setToken(loginData.token);

          const decoded = jwtDecode(loginData.token);
          console.log("✅ Auto-login success. Redirecting to:", redirectTo);
          if (decoded.role === "customer") {
            navigate(redirectTo);
          } else {
            setMessage("Access denied. Please use the technician login.");
          }
        } else {
          setMessage("Signup worked, but auto-login failed. Please log in manually.");
          setIsLogin(true);
        }
      } else {
        setMessage(data.error || "❌ Something went wrong.");
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            {isLogin ? "Login" : "Continue"}
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