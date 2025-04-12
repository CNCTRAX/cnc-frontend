import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../assets/cnctrax-logo.png';

const API = process.env.REACT_APP_API_URL;

const MachineSearch = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serialFromUrl = params.get('serial');
    if (serialFromUrl) setSerialNumber(serialFromUrl);
  }, [location.search]);

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
      navigate(`/signup?redirectTo=/machine-search?serial=${serialNumber}`);
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
      {/* Clickable Logo */}
      <img
        src={logo}
        alt="CNC TRAX Logo"
        className="w-40 mb-4 cursor-pointer"
        onClick={() => navigate('/')}
      />

      <h2 className="text-xl font-semibold mb-6 text-center">Search CNC Machine</h2>

      {/* Search Input */}
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

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Machine Details & Buy Report */}
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

      {/* Technician Access Section */}
      <hr className="border-gray-600 w-full max-w-3xl mb-4 sm:mb-6" />
      <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2 sm:gap-3 text-blue-400">
        <span className="text-gray-400 text-sm sm:text-base">Technician Access</span>
        <div className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          <a href="/tech-login" className="hover:underline">Login</a>
          <a href="/tech-signup" className="hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default MachineSearch;
