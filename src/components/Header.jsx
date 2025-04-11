import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#1c1b22] shadow-md text-white">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        CNCTRAX
      </Link>

      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-gray-300">Welcome 👋</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 transition font-medium"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-400 hover:underline transition text-sm"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-blue-400 hover:underline transition text-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;