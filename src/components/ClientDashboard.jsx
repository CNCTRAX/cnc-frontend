import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cnctrax-logo.png';
import { API } from '../config';
import { jwtDecode } from 'jwt-decode';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('User');
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.role !== 'customer') throw new Error('Unauthorized');
        setClientName(decoded.full_name || 'User');
        setUserId(decoded.user_id);
        setProfileImage(decoded.profile_image_url ? `${API}${decoded.profile_image_url}` : null);
        setToken(storedToken);
      } catch (err) {
        console.error('Invalid token:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAutoUpload = async (e) => {
    const newFile = e.target.files[0];
    if (!newFile || !userId) return;

    const formData = new FormData();
    formData.append('profile', newFile);

    try {
      const response = await fetch(`${API}/upload-profile/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Profile photo updated!');
        setProfileImage(`${API}${data.profile_image_url}`);
      } else {
        alert(data.error || 'Failed to update photo.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Error uploading photo');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#151319] text-white font-poppins relative">
      {/* Logo */}
      <div className="absolute top-6 left-8">
        <img src={logo} alt="CNC TRAX Logo" className="w-28 object-contain" />
      </div>

      {/* Logout */}
      <div className="absolute top-6 right-8 cursor-pointer" onClick={handleLogout}>
        <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-2xl hover:bg-gray-500 transition">
          👤
        </div>
      </div>

      {/* Left - Profile */}
      <div className="lg:w-1/3 w-full bg-[#1c1b22] flex flex-col items-center justify-center p-8 shadow-lg min-h-screen">
        <div className="relative text-center">
          <label htmlFor="profileUpload" className="cursor-pointer">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-6 object-cover border-2 border-white mx-auto"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-400 mb-6 flex items-center justify-center text-5xl mx-auto">
                👤
              </div>
            )}
            <p className="text-blue-400 text-sm hover:underline">Change Image</p>
          </label>
          <input
            type="file"
            id="profileUpload"
            accept="image/*"
            onChange={handleAutoUpload}
            className="hidden"
          />
        </div>
        <h2 className="text-2xl font-semibold">{clientName}</h2>
        <p className="text-gray-400 mt-2">Premium User</p>
      </div>

      {/* Right - Dashboard */}
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-semibold mb-4">Welcome back, {clientName} 👋</h1>
        <p className="text-gray-400 mb-8">Manage your machine reports and search new machines.</p>

        {/* Search */}
        <div className="bg-[#1c1b22] p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-medium mb-4">Search a Machine</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Serial Number or Model"
              className="flex-1 p-4 rounded-lg bg-[#2a2930] text-white focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-medium">
              Search
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-[#1c1b22] p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-medium mb-4">Recent Machine Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="pb-3">Serial #</th>
                  <th className="pb-3">Model</th>
                  <th className="pb-3">Year</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Static rows for now — replace with dynamic report data later */}
                <tr className="border-t border-gray-700 hover:bg-[#2a2930]">
                  <td className="py-4">ABC12345</td>
                  <td>Haas VF-2</td>
                  <td>2019</td>
                  <td>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full">Available</span>
                  </td>
                  <td>
                    <button className="text-blue-400 hover:underline">View Report</button>
                  </td>
                </tr>
                <tr className="border-t border-gray-700 hover:bg-[#2a2930]">
                  <td className="py-4">XYZ98765</td>
                  <td>Mazak 300</td>
                  <td>2020</td>
                  <td>
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full">Pending</span>
                  </td>
                  <td>
                    <button className="text-blue-400 hover:underline">Purchase</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase History */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/purchase-history')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-medium"
          >
            View Purchase History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;