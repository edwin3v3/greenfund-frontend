import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiGrid, FiMap, FiPlus } from 'react-icons/fi';
import apiClient from '../services/api';
import FarmCard from '../components/FarmCard';
import FarmsMapView from '../components/FarmsMapView';
import FarmFormModal from '../components/FarmFormModal';

function MyFarmsPage() {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'map'
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/farms/');
        setFarms(response.data);
      } catch (err) {
        setError('Could not load your farms. Please try again.');
        console.error("Failed to fetch farms:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const handleFarmSaved = (savedFarm) => {
    setFarms(prevFarms => {
      const existingIndex = prevFarms.findIndex(farm => farm.id === savedFarm.id);
      if (existingIndex !== -1) {
        const updatedFarms = [...prevFarms];
        updatedFarms[existingIndex] = savedFarm;
        return updatedFarms;
      }
      return [savedFarm, ...prevFarms];
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">My Farms</h1>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="bg-gray-200 p-1 rounded-lg flex items-center">
            <button onClick={() => setViewMode('card')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'card' ? 'bg-white shadow' : ''}`}><FiGrid className="inline mr-1" /> Card View</button>
            <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'map' ? 'bg-white shadow' : ''}`}><FiMap className="inline mr-1" /> Map View</button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
          >
            <FiPlus /> Add New Farm
          </button>
        </div>
      </div>

      <div>
        {isLoading && <p className="text-center py-10">Loading farms...</p>}
        {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</p>}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'card' ? (
                farms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farms.map(farm => <FarmCard key={farm.id} farm={farm} />)}
                  </div>
                ) : (
                  <p className="text-center py-10 text-text-secondary">No farms added yet.</p>
                )
              ) : (
                <FarmsMapView farms={farms} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <FarmFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleFarmSaved}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MyFarmsPage;