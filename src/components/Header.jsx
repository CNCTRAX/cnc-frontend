import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../assets/cnctrax-logo.png';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-[#1c1b22] shadow-md text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CNC TRAX Logo" className="w-32 sm:w-40" />
        </Link>

        {/* ✅ Auth Actions */}
        <div className="flex gap-4 items-center text-sm sm:text-base">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 transition font-medium"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-blue-400 hover:underline">
                Log In
              </Link>
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;