import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cnctrax-logo.png';
import { API } from '../config';

const TechSignup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch(`${API}/signup-technician`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/tech-login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#151319] flex items-center justify-center px-6 sm:px-8 py-[30px] font-poppins">
      <div className="w-full max-w-md bg-[#1c1b22] p-8 rounded-3xl shadow-xl">
        <img src={logo} alt="CNC TRAX Logo" className="w-32 mx-auto mb-8" />
        <h2 className="text-white text-xl font-medium text-center mb-2">Technician Sign Up</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Join the technician team!</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2930] text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2930] text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2930] text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
          >
            Continue
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-gray-500 text-xs text-center mt-6 leading-relaxed">
          By signing up, you agree to our Technician Terms & Privacy Policy
        </p>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have a technician account?{' '}
            <button onClick={() => navigate('/tech-login')} className="text-blue-400 hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechSignup;