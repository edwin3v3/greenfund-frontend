import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import ReportCard from './ReportCard'; // 1. Import the new ReportCard component

// --- Form for Manual Entry ---
function ManualEntryForm({ farm, onReportAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ph: 7.0, nitrogen: 20, phosphorus: 30, potassium: 150, moisture: 40,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/soil/manual', { farm_id: farm.id, ...formData });
      onReportAdded(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl shadow-md space-y-4 border">
      <h3 className="font-bold text-lg text-text-primary">Enter Lab Results</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-text-secondary">Soil pH (0-14)</label>
        <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="w-full p-2 border rounded-md mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Nitrogen (N) (ppm)</label>
        <input type="number" step="1" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="w-full p-2 border rounded-md mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Phosphorus (P) (ppm)</label>
        <input type="number" step="1" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="w-full p-2 border rounded-md mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Potassium (K) (ppm)</label>
        <input type="number" step="1" name="potassium" value={formData.potassium} onChange={handleChange} className="w-full p-2 border rounded-md mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Moisture (%)</label>
        <input type="number" step="1" name="moisture" value={formData.moisture} onChange={handleChange} className="w-full p-2 border rounded-md mt-1" disabled={isSubmitting} />
      </div>
      <button type="submit" className="w-full bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold" disabled={isSubmitting}>
        {isSubmitting ? 'Analyzing...' : 'Analyze Soil'}
      </button>
    </form>
  );
}

// --- Form for Image Upload ---
function ImageUploadForm({ farm, onReportAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select an image file."); return; }
    setError('');
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await apiClient.post(`/soil/upload_soil_image/${farm.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onReportAdded(response.data);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to analyze image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl shadow-md space-y-4 border">
      <h3 className="font-bold text-lg text-text-primary">Upload a Photo</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-text-secondary">Select Soil Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-md mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-primary hover:file:bg-green-100" disabled={isSubmitting} />
      </div>
      {preview && (
        <div className="text-center p-2 border-dashed border-2 rounded-lg">
          <img src={preview} alt="Soil preview" className="max-h-48 rounded-lg mx-auto" />
        </div>
      )}
      <button type="submit" className="w-full bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold" disabled={isSubmitting || !file}>
        {isSubmitting ? 'Analyzing Image...' : 'Analyze Soil Image'}
      </button>
    </form>
  );
}

// --- Main SoilReport Component ---
function SoilReport({ farm }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('manual');

  useEffect(() => {
    if (!farm.id) return;
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/soil/farm/${farm.id}`);
        setReports(response.data);
      } catch (err) {
        setError("Could not load past reports.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [farm.id]);

  const handleReportAdded = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT SIDE: Input Forms */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Submit New Test</h2>
        <div className="flex mb-4 border-b">
          <button className={`py-2 px-4 font-semibold ${activeTab === 'manual' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`} onClick={() => setActiveTab('manual')}>Enter Manually</button>
          <button className={`py-2 px-4 font-semibold ${activeTab === 'image' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`} onClick={() => setActiveTab('image')}>Upload Image</button>
        </div>
        <div>
          {activeTab === 'manual' && <ManualEntryForm farm={farm} onReportAdded={handleReportAdded} />}
          {activeTab === 'image' && <ImageUploadForm farm={farm} onReportAdded={handleReportAdded} />}
        </div>
      </div>
      {/* RIGHT SIDE: Past Reports */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Past Reports</h2>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {isLoading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length > 0 ? (
            // 2. Use the new ReportCard component here
            reports.map((report) => <ReportCard key={report.id} report={report} />)
          ) : (
            <p className="text-text-secondary text-center py-10">No soil reports submitted for this farm yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SoilReport;