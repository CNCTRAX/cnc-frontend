import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/cnctrax-logo.png';
import { API } from '../config';

const TechDashboard = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [form, setForm] = useState({ model: '', manufacturer: '', year: '', serial_number: '' });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');

  // ✅ Fetch machines
  const fetchMachines = useCallback(async () => {
    try {
      const res = await fetch(`${API}/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMachines(data);
    } catch (err) {
      console.error('Failed to fetch machines:', err);
    }
  }, [token]);

  // ✅ Check auth + fetch on mount
  useEffect(() => {
    const checkAuth = () => {
      if (!token) return navigate('/tech-login');
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'technician') navigate('/tech-login');
      } catch {
        navigate('/tech-login');
      }
    };
    checkAuth();
    fetchMachines();
  }, [navigate, token, fetchMachines]);

  // ✅ Handle add/edit machine
  const handleSubmit = async () => {
    const { model, manufacturer, year, serial_number } = form;
    if (!model || !manufacturer || !year || !serial_number) {
      alert('Please fill in all fields');
      return;
    }

    const url = editingId ? `${API}/machines/${editingId}` : `${API}/machines`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      setForm({ model: '', manufacturer: '', year: '', serial_number: '' });
      setEditingId(null);
      fetchMachines();
    } catch (err) {
      console.error('Failed to submit machine:', err);
    }
  };

  const handleEdit = (machine) => {
    setForm(machine);
    setEditingId(machine.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/tech-login');
  };

  return (
    <div className="min-h-screen bg-[#151319] text-white flex flex-col items-center p-8 font-poppins">
      <img src={logo} alt="CNC TRAX Logo" className="w-32 mb-8" />
      <h1 className="text-3xl font-bold mb-4">Technician Dashboard</h1>

      {/* ✅ Machine List */}
      <h2 className="text-xl font-semibold mb-4">Active Machines</h2>
      <ul className="mb-8 w-full max-w-2xl">
        {machines.map((machine) => (
          <li
            key={machine.id}
            className="bg-[#2a2930] p-4 rounded-lg mb-4 flex justify-between items-start"
          >
            <div>
              <p><strong>Model:</strong> {machine.model}</p>
              <p><strong>Manufacturer:</strong> {machine.manufacturer}</p>
              <p><strong>Year:</strong> {machine.year}</p>
              <p><strong>Serial:</strong> {machine.serial_number}</p>
            </div>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              onClick={() => handleEdit(machine)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* ✅ Add/Edit Form */}
      <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Machine' : 'Add Machine'}</h2>
      <div className="w-full max-w-2xl mb-8">
        <input
          type="text"
          placeholder="Model"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-4"
        />
        <input
          type="text"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-4"
        />
        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-4"
        />
        <input
          type="text"
          placeholder="Serial Number"
          value={form.serial_number}
          onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
          className="w-full p-3 rounded-lg bg-[#2a2930] text-white mb-4"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          onClick={handleSubmit}
        >
          {editingId ? 'Update Machine' : 'Add Machine'}
        </button>
      </div>

      <button
        className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full font-medium"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default TechDashboard;