import React from 'react';

const MachineReport = ({ report }) => {
  if (!report) return <p className="text-center text-gray-400">No report data found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white font-poppins">
      {/* 1. Summary */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Machine Summary</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          {report.image && (
            <img
              src={report.image}
              alt="Machine"
              className="w-full sm:w-64 rounded-md shadow-lg"
            />
          )}
          <div className="flex-1 space-y-2">
            <p><strong>Make & Model:</strong> {report.make_model}</p>
            <p><strong>Year:</strong> {report.year}</p>
            <p><strong>Serial #:</strong> {report.serial_number}</p>
            <p><strong>Current Location:</strong> {report.location}</p>
            <p><strong>Original MSRP:</strong> {report.msrp}</p>
            <p><strong>Asking Price:</strong> {report.asking_price}</p>
          </div>
        </div>
      </section>

      {/* 2. Usage & Performance */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Usage & Performance History</h2>
        <div className="space-y-2">
          <p><strong>Total Spindle Hours:</strong> {report.spindle_hours}</p>
          <p><strong>Power-On Hours:</strong> {report.power_on_hours}</p>
          <p><strong>Avg Cycle Time:</strong> {report.cycle_time}</p>
          <p><strong>Max RPM Usage:</strong> {report.max_rpm}</p>
          <p><strong>Axis Load History:</strong> {report.axis_load}</p>
        </div>
      </section>

      {/* 3. Maintenance & Service */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Maintenance & Service Records</h2>
        <p><strong>Last Preventive Maintenance:</strong> {report.last_maintenance}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          {report.service_events?.length > 0 ? (
            report.service_events.map((event, idx) => (
              <li key={idx}>{event}</li>
            ))
          ) : (
            <li>No service events recorded.</li>
          )}
        </ul>
        <p className="mt-4">
          <strong>Certified Technician Reports:</strong> {report.tech_certified ? 'YES' : 'NO'}{' '}
          {report.tech_pdf && (
            <a href={report.tech_pdf} className="text-blue-400 hover:underline ml-2" target="_blank" rel="noreferrer">
              (view PDF)
            </a>
          )}
        </p>
        <p><strong>OEM Maintenance Verified:</strong> {report.oem_verified ? 'YES' : 'NO'}</p>
      </section>

      {/* 4. Inspection Report */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Inspection & Condition Report</h2>
        <div className="space-y-2">
          <p><strong>Last Inspection Date:</strong> {report.inspection_date}</p>
          <p><strong>Mechanical Condition:</strong> {report.mechanical_condition}</p>
          <p><strong>Electrical Systems:</strong> {report.electrical_condition}</p>
          {report.inspection_pdf && (
            <p>
              <strong>Inspection PDF Report:</strong>{' '}
              <a
                href={report.inspection_pdf}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                Download
              </a>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MachineReport;