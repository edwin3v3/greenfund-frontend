import React from 'react';
import { FiClipboard, FiDroplet, FiZap, FiThermometer } from 'react-icons/fi';

function ReportCard({ report }) {
  // Helper to display a value or a placeholder
  const displayValue = (value, unit = '') => {
    return (value !== null && value !== undefined) ? `${value}${unit}` : 'N/A';
  };

  return (
    <div className="bg-surface p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <p className="font-bold text-text-primary mb-3">
        Report from: {new Date(report.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {/* AI Analysis Section */}
      <div className="mb-4">
        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><FiClipboard /> AI Analysis:</h4>
        <p className="text-text-secondary text-sm bg-background p-3 rounded-lg">
          {report.ai_analysis_text || "Analysis not available."}
        </p>
      </div>

      {/* Suggested Crops Section */}
      <div className="mb-4">
        <h4 className="font-semibold text-primary mb-2">Suggested Crops:</h4>
        <div className="flex flex-wrap gap-2">
          {report.suggested_crops && report.suggested_crops.length > 0 ? (
            report.suggested_crops.map((crop, index) => (
              <span key={index} className="text-xs bg-secondary text-white px-2 py-1 rounded-full font-medium">
                {crop}
              </span>
            ))
          ) : (
            <p className="text-xs text-text-secondary italic">No specific crops suggested.</p>
          )}
        </div>
      </div>

      {/* Raw Data Section */}
      <div>
        <h4 className="font-semibold text-primary mb-2">Soil Data Snapshot:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2"><FiDroplet className="text-blue-500" /> pH: <strong>{displayValue(report.ph)}</strong></div>
          <div className="flex items-center gap-2"><FiZap className="text-yellow-500" /> N: <strong>{displayValue(report.nitrogen, ' ppm')}</strong></div>
          <div className="flex items-center gap-2"><FiZap className="text-orange-500" /> P: <strong>{displayValue(report.phosphorus, ' ppm')}</strong></div>
          <div className="flex items-center gap-2"><FiZap className="text-red-500" /> K: <strong>{displayValue(report.potassium, ' ppm')}</strong></div>
          <div className="flex items-center gap-2"><FiThermometer className="text-cyan-500" /> Moisture: <strong>{displayValue(report.moisture, '%')}</strong></div>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;