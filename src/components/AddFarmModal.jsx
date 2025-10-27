import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../services/api';

function AddFarmModal({ onClose, onFarmAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    location_text: '',
    latitude: 0,
    longitude: 0,
    size_acres: 0,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/farms/', formData);
      
      // DEBUG: Log the successful response from the API
      console.log('API Success Response:', response);

      onFarmAdded(response.data);
      onClose();
    } catch (err) {
      // DEBUG: Log the full error object if the code fails
      console.error('API Error Caught:', err);

      setError(err.response?.data?.detail || 'Failed to add farm.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-surface p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Add a New Farm</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">Farm Name</label>
              <input type="text" name="name" onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Location (e.g., Nairobi, KE)</label>
              <input type="text" name="location_text" onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Latitude</label>
              <input type="number" step="any" name="latitude" onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Longitude</label>
              <input type="number" step="any" name="longitude" onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div className="col-span-2">
              <label className="block text-text-secondary mb-1">Size (in acres)</label>
              <input type="number" step="any" name="size_acres" onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 rounded bg-primary text-white hover:bg-green-700">
              Save Farm
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default AddFarmModal;