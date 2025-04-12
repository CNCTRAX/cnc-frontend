import React, { useEffect, useState } from 'react';
import MachineReport from './MachineReport';
import { useAuth } from '../AuthContext';

const API = process.env.REACT_APP_API_URL;

const MyReports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      try {
        const res = await fetch(`${API}/my-reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Could not fetch reports.');
        } else {
          setReports(data.reports || []);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Server error fetching reports.');
      }
    };

    fetchReports();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#151319] text-white px-4 py-8 font-poppins">
      <h1 className="text-3xl font-bold text-center mb-10">My CNC Machine Reports</h1>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {reports.length === 0 && !error && (
        <p className="text-center text-gray-400">You don’t have any purchased reports yet.</p>
      )}

      {reports.map((report, index) => (
        <div key={index} className="mb-16">
          <MachineReport report={report} />
        </div>
      ))}
    </div>
  );
};

export default MyReports;