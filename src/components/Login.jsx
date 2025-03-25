import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cnctrax-logo.png';
import { jwtDecode } from 'jwt-decode';

// ✅ Use .env variable
const API = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // ✅ Fetch from API domain in .env
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      console.log('Raw Response:', response);

      const data = await response.json();
      console.log('Server Response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);

        const decoded = jwtDecode(data.token);
        console.log('Decoded JWT:', decoded);

        if (decoded.role === 'customer') {
          navigate('/dashboard');
        } else {
          setError('Access denied. Please use the technician login.');
        }
      } else {
        console.error('Backend Error:', data.error);
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error (frontend catch):', err);
      setError('Failed to connect to the server. Please check your connection or URL.');
    }
  };

  return (
    <div className="min-h-screen bg-[#151319] flex items-center justify-center font-poppins">
      <div className="w-full max-w-md bg-[#1c1b22] p-8 rounded-3xl shadow-xl">
        <img src={logo} alt="CNC TRAX Logo" className="w-32 mx-auto mb-8" />

        <h2 className="text-white text-xl font-medium text-center mb-4">Welcome back</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Log in to continue</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label className="block text-gray-400 text-sm mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-6 focus:outline-none"
          />

          <label className="block text-gray-400 text-sm mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-6 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            Continue
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;