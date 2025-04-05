import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cnctrax-logo.png';

const API = process.env.REACT_APP_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch('${API}/signup-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email: normalizedEmail, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#151319] flex items-center justify-center px-6 sm:px-8 py-[30px] font-poppins">
      <div className="w-full max-w-md bg-[#1c1b22] p-8 rounded-3xl shadow-xl">

        <img src={logo} alt="CNC TRAX Logo" className="w-32 mx-auto mb-8" />

        <h2 className="text-white text-xl font-medium text-center mb-2">Sign Up</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Join us today!</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label className="block text-gray-400 text-sm mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-6 focus:outline-none"
          />

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
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            Continue
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-gray-500 text-xs text-center mt-6 leading-relaxed">
          By signing up, you agree to our Terms and Conditions <br /> & Privacy Policy
        </p>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
