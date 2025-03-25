import React, { useEffect, useState } from "react";
import PurchaseReport from "./PurchaseReport";

const API = process.env.REACT_APP_API_URL;

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API}/my-reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setReports(data.reports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center mt-8">Loading your reports...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#1c1b22] rounded-2xl shadow text-white">
      <h2 className="text-2xl font-semibold mb-6">📄 My Paid Reports</h2>

      {reports.length === 0 ? (
        <p className="text-gray-400">No paid reports found.</p>
      ) : (
        <ul className="space-y-6">
          {reports.map((report) => (
            <li key={report.id} className="p-6 bg-[#2a2930] rounded-lg shadow">
              <p><strong>Report ID:</strong> {report.id}</p>
              <p><strong>Machine ID:</strong> {report.machine_id}</p>
              <p><strong>Summary:</strong> {report.summary}</p>
              <p><strong>Details:</strong> {report.paid ? report.details : "🔒 Locked - Purchase to view"}</p>
              <p><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>

              {/* Show Purchase Button if NOT paid */}
              {!report.paid && (
                <div className="mt-4">
                  <PurchaseReport reportId={report.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyReports;