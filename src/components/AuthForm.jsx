import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API = process.env.REACT_APP_API_URL;

function AuthForm({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo") || "/machine-search";

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
        if (decoded.role === "customer") {
          navigate(redirectTo); // ✅ go back to machine search or whatever redirectTo was
        } else {
          setMessage("Access denied. Please use the technician login.");
        }
      } else if (!isLogin && response.status === 201) {
        // ✅ Auto-login immediately after successful signup
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
          if (decoded.role === "customer") {
            navigate(redirectTo); // ✅ send them right back to machine search with serial
          } else {
            setMessage("Access denied. Please use the technician login.");
          }
        } else {
          setMessage("Sign up worked, but auto-login failed. Please log in manually.");
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
    <div className="auth-container text-white p-8 max-w-md mx-auto bg-[#1c1b22] rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-3 rounded bg-[#2a2930] text-white"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-[#2a2930] text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-[#2a2930] text-white"
        />

        {!isLogin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2930] text-white"
          >
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-green-400 mt-4">{message}</p>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 text-blue-400 hover:underline"
      >
        {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default AuthForm;