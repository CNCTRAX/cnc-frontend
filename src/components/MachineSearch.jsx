import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cnctrax-logo.png';

const API = process.env.REACT_APP_API_URL;

const MachineSearch = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleSearch = async () => {
    if (!serialNumber.trim()) {
      setError('Please enter a serial number');
      return;
    }

    try {
      const response = await fetch(`${API}/machine-search?serial_number=${serialNumber.trim()}`);
      const data = await response.json();
      if (response.ok) {
        setMachine(data);
        setError('');
      } else {
        setMachine(null);
        setError(data.error || 'Machine not found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch machine data.');
      setMachine(null);
    }
  };

  const handleBuyReport = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ machine_id: machine.id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#151319] text-white flex flex-col items-center justify-center px-4 py-[30px] font-poppins relative">
      {/* ✅ Profile Icon if logged in */}
      {token && (
        <div className="absolute top-6 right-8 flex items-center gap-3 text-white">
          <div className="bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
            👤
          </div>
        </div>
      )}

      {/* ✅ Clickable Logo */}
      <img
        src={logo}
        alt="CNC TRAX Logo"
        className="w-40 mb-4 cursor-pointer"
        onClick={() => navigate('/')}
      />

      <h2 className="text-xl font-semibold mb-6 text-center">Search CNC Machine</h2>

      {/* ✅ Search Input - Mobile Friendly */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl mb-6">
        <input
          type="text"
          placeholder="Enter Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="flex-grow rounded-full bg-[#212530] text-white px-6 py-3 focus:outline-none w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Machine Details */}
      {machine && (
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#1a1d24] p-6 rounded-lg w-full max-w-4xl mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Machine Details</h3>
            <p>
              <strong>Model:</strong> {machine.model} | <strong>Manufacturer:</strong> {machine.manufacturer} | <strong>Year:</strong> {machine.year}
            </p>
          </div>

          <button
            onClick={handleBuyReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm w-full md:w-auto"
          >
            Buy Full Report
          </button>
        </div>
      )}

      {/* Links */}
      <hr className="border-gray-600 w-full max-w-3xl mb-6" />
      <div className="flex justify-center gap-8 mb-10">
        <a href="/signup" className="text-blue-400 hover:underline">Sign Up</a>
        <a href="/login" className="text-blue-400 hover:underline">Log In</a>
      </div>

      {/* Technician Links */}
      <div className="mt-16 flex flex-col items-center gap-3 text-blue-400">
        <span className="text-gray-400">Technician Access</span>
        <div className="flex gap-8">
          <a href="/tech-login" className="hover:underline">Technician Login</a>
          <a href="/tech-signup" className="hover:underline">Technician Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default MachineSearch;