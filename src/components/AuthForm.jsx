import React, { useState } from "react";

// ✅ Pull API URL from .env
const API = process.env.REACT_APP_API_URL;

function AuthForm({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Adjust routes based on backend setup
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
        setMessage("✅ Login successful!");
      } else if (!isLogin && response.status === 201) {
        setMessage("✅ Registration successful! Now log in.");
        setIsLogin(true);
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