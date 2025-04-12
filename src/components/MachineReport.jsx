import React from 'react';

const MachineReport = ({ report }) => {
  if (!report) return <p>No report data found.</p>;

  return (
    <div className="p-6 bg-[#1c1b22] rounded-xl shadow-md max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Machine Report</h2>
      <p><strong>Make & Model:</strong> {report.make_model}</p>
      <p><strong>Year:</strong> {report.year}</p>
      <p><strong>Serial Number:</strong> {report.serial_number}</p>
      <p><strong>Location:</strong> {report.location}</p>
      <p><strong>Spindle Hours:</strong> {report.spindle_hours}</p>
      <p><strong>Last Maintenance:</strong> {report.last_maintenance}</p>
    </div>
  );
};

export default MachineReport;