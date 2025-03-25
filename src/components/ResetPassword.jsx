import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cnctrax-logo.png';

const API = process.env.REACT_APP_API_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    try {
      const response = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email.');
        setError('');
      } else {
        setError(data.error || 'Failed to send reset email.');
        setMessage('');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#151319] flex items-center justify-center font-poppins">
      <div className="w-full max-w-md bg-[#1c1b22] p-8 rounded-3xl shadow-xl">
        <img src={logo} alt="CNC TRAX Logo" className="w-32 mx-auto mb-8" />
        <h2 className="text-white text-xl font-medium text-center mb-4">Reset Password</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your email address to receive a password reset link.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); handleReset(); }}>
          <label className="block text-gray-400 text-sm mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-6 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            Reset Password
          </button>
        </form>

        {/* ✅ Success or Error Messages */}
        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;