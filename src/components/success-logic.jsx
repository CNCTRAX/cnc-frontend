import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SuccessLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Optional dynamic message passed via location.state
  const message = location.state?.message || '✅ Thank you! Your full CNC machine report is now available.';

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto mt-20 text-center font-poppins">
      <h2 className="text-3xl font-bold mb-6 text-green-600">Success!</h2>
      <p className="text-gray-700 mb-6">{message}</p>

      <button
        onClick={() => navigate('/')}
        className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition"
      >
        🔍 Back to Search
      </button>
    </div>
  );
};

export default SuccessLogic;