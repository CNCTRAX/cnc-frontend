import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../assets/cnctrax-logo.png';

const API = process.env.REACT_APP_API_URL;

const MachineSearch = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  // Pre-fill serial from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serialFromUrl = params.get('serial');
    if (serialFromUrl && /^[a-zA-Z0-9\-]+$/.test(serialFromUrl)) {
      setSerialNumber(serialFromUrl);
    }
  }, [location.search]);

  // Auto search on serial prefill
  useEffect(() => {
    if (serialNumber) handleSearch();
  }, [serialNumber]);

  const handleSearch = useCallback(async () => {
    if (isSearching || !serialNumber.trim()) return;

    setIsSearching(true);
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
      setMachine(null);
      setError('Failed to fetch machine data.');
    } finally {
      setIsSearching(false);
    }
  }, [serialNumber, isSearching]);

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
          Authorization: `Bearer ${token}`,
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
      {/* Logo */}
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
          aria-label="Search machine by serial number"
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full w-full sm:w-auto disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Machine Result */}
      {machine && (
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#1a1d24] p-6 rounded-lg w-full max-w-4xl mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Machine Details</h3>
            <p>
              <strong>Model:</strong> {machine.model} |{' '}
              <strong>Manufacturer:</strong> {machine.manufacturer} |{' '}
              <strong>Year:</strong> {machine.year}
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

      {/* Technician Access */}
      <hr className="border-gray-600 w-full max-w-3xl mb-4 sm:mb-6" />
      <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2 sm:gap-3 text-blue-400">
        <span className="text-gray-400 text-sm sm:text-base">Technician Access</span>
        <div className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          <a href="/tech-signup" className="hover:underline">
            Sign Up
          </a>
          <a href="/tech-login" className="hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
};

export default MachineSearch;