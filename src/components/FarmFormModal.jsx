import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../services/api';
import toast from 'react-hot-toast'; // 1. Import toast
import FarmMapSelector from './FarmMapSelector';

function FarmFormModal({ onClose, onSave, existingFarm }) {
  const [formData, setFormData] = useState({
    name: existingFarm?.name || '',
    location_text: existingFarm?.location_text || '',
    size_acres: existingFarm?.size_acres || '',
    latitude: existingFarm?.latitude || -1.286389, // Default to Nairobi
    longitude: existingFarm?.longitude || 36.817223,
    current_crop: existingFarm?.current_crop || '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleMapSelect = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const loadingToast = toast.loading(existingFarm ? 'Updating farm...' : 'Creating farm...');

    try {
      const dataToSubmit = {
        name: formData.name,
        location_text: formData.location_text,
        size_acres: parseFloat(formData.size_acres),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        current_crop: formData.current_crop || null,
      };

      let response;
      if (existingFarm) {
        response = await apiClient.patch(`/farms/${existingFarm.id}`, dataToSubmit);
      } else {
        response = await apiClient.post('/farms/', dataToSubmit);
      }
      
      onSave(response.data);
      toast.success(existingFarm ? 'Farm updated successfully!' : 'Farm created successfully!', { id: loadingToast });
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {existingFarm ? 'Edit Farm' : 'Add New Farm'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        {error && !isSubmitting && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm border border-red-300">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
            <input
              type="text"
              id="name"
              name="name" // Add name attribute
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="current_crop" className="block text-sm font-medium text-gray-700 mb-1">Current Crop (Optional)</label>
            <input
              type="text"
              id="current_crop"
              name="current_crop" // Add name attribute
              value={formData.current_crop}
              onChange={handleChange}
              placeholder="e.g., Maize, Beans, Cabbage"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="location_text" className="block text-sm font-medium text-gray-700 mb-1">Location (e.g., Kiambu, Kenya)</label>
                  <input
                      type="text"
                      id="location_text"
                      name="location_text" // Add name attribute
                      value={formData.location_text}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                      required
                  />
              </div>
              <div>
                  <label htmlFor="size_acres" className="block text-sm font-medium text-gray-700 mb-1">Size (in acres)</label>
                  <input
                      type="number"
                      id="size_acres"
                      name="size_acres" // Add name attribute
                      value={formData.size_acres}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                      required
                  />
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Farm Location on Map</label>
            <div className="h-64 w-full rounded-md overflow-hidden border">
              <FarmMapSelector
                center={[formData.latitude, formData.longitude]}
                onSelect={handleMapSelect}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lat: {formData.latitude.toFixed(5)}, Long: {formData.longitude.toFixed(5)}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 rounded bg-primary text-white hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Saving...' : (existingFarm ? 'Save Changes' : 'Add Farm')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default FarmFormModal;