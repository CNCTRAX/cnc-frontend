import React, { useEffect, useState } from "react";
import PurchaseReport from "./PurchaseReport";
import sampleReport from "../data/sampleReport.json"; // Pulls from your JSON file

const API = process.env.REACT_APP_API_URL;

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // === Uncomment this section for LIVE API connection ===
    // const fetchReports = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await fetch(`${API}/my-reports`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     const data = await response.json();
    //     setReports(data.reports);
    //   } catch (error) {
    //     console.error("Failed to fetch reports:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchReports();

    // === DEV MODE: Using sample JSON ===
    setReports(sampleReport);
    setLoading(false);
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
        <ul className="space-y-12">
          {reports.map((report) => (
            <li key={report.id} className="bg-[#2a2930] rounded-lg shadow p-6">
              {report.paid ? (
                <>
                  <h3 className="text-2xl font-bold mb-4">{report.machine_brand} - {report.machine_model}</h3>
                  <img src={report.main_photo_url} alt={report.machine_model} className="rounded shadow-lg mb-6 w-full" />
                  <p><strong>Serial Number:</strong> {report.serial_number}</p>
                  <p><strong>Year of Manufacture:</strong> {report.year}</p>

                  {/* Location & Usage */}
                  <div className="border-t border-gray-600 mt-6 pt-4">
                    <h4 className="text-xl font-semibold mb-2">Location & Usage</h4>
                    <p><strong>Location:</strong> {report.location}</p>
                    <p><strong>Runtime Hours:</strong> {report.runtime_hours} Hours</p>
                    <p><strong>Previous Owners:</strong> {report.previous_owners}</p>
                  </div>

                  {/* Specifications */}
                  <div className="bg-blue-600 text-white p-4 rounded-lg mt-6">
                    <h4 className="text-xl font-semibold mb-2">Machine Specifications</h4>
                    <p>{report.spec_summary}</p>
                    <ul className="list-disc list-inside mt-4">
                      {report.key_specs?.map((spec, idx) => (
                        <li key={idx}><span className="font-bold">{spec.label}:</span> {spec.value}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Upgrades */}
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-2">Upgrades & Add-Ons</h4>
                    <ul className="list-disc list-inside">
                      {report.upgrades?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>

                  {/* Maintenance */}
                  <div className="bg-blue-600 text-white p-4 rounded-lg mt-6">
                    <h4 className="text-xl font-semibold mb-2">Maintenance & Parts Replaced</h4>
                    <ul className="list-disc list-inside">
                      {report.maintenance?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>

                  {/* Inspection */}
                  <div className="bg-blue-600 text-white p-4 rounded-lg mt-6">
                    <h4 className="text-xl font-semibold mb-2">Inspection Notes</h4>
                    <p>{report.inspection_notes}</p>
                    <h5 className="mt-4 font-semibold">Potential Issues:</h5>
                    <ul className="list-disc list-inside">
                      {report.potential_issues?.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>

                  {/* Compliance */}
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-2">Compliance</h4>
                    <p><strong>Standards Met:</strong> {report.compliance}</p>
                    <p><strong>Last Calibration:</strong> {report.calibration_date}</p>
                    <p><strong>Inspection Verified:</strong> {report.inspection_verified ? "Yes" : "No"}</p>
                  </div>

                  {/* Photos */}
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-4">Machine Photos & Videos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {report.gallery?.map((photo, idx) => (
                        <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="rounded shadow" />
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-2">Additional Notes</h4>
                    <ul className="list-disc list-inside">
                      {report.additional_notes?.map((note, idx) => <li key={idx}>{note}</li>)}
                    </ul>
                  </div>

                  {/* Footer */}
                  <p className="mt-8 text-sm text-gray-400">*Generated by CNCTRAX Report System</p>
                </>
              ) : (
                <>
                  {/* Show Preview and Purchase CTA */}
                  <p><strong>Machine ID:</strong> {report.machine_id}</p>
                  <p><strong>Summary:</strong> {report.summary}</p>
                  <p><strong>Details:</strong> 🔒 Locked - Purchase to view</p>
                  <p><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
                  <div className="mt-4">
                    <PurchaseReport reportId={report.id} />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyReports;
