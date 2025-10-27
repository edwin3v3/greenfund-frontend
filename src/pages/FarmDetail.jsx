import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import apiClient from '../services/api';
import FarmFormModal from '../components/FarmFormModal';
import WeatherForecast from '../components/WeatherForecast';
import FarmMap from '../components/FarmMap';
import ActivityLog from '../components/ActivityLog';
import CarbonDashboard from '../components/CarbonDashboard';
import ClimateActionSection from '../components/ClimateActionSection';
import { Tabs, TabPanel } from '../components/Tabs';
import { FiCloudDrizzle, FiTrendingUp, FiHeart } from 'react-icons/fi';

// Reusable Stat Card for this page
const FarmStatCard = ({ icon, title, value, unit }) => (
    <div className="bg-background p-4 rounded-lg flex items-center gap-4">
        <div className="text-2xl text-primary p-3 bg-green-100 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-xl font-bold text-text-primary">
                {value} <span className="text-sm font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

function FarmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [carbonSummary, setCarbonSummary] = useState(null); // State for carbon data
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch all farm-specific data in parallel
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [farmRes, carbonRes] = await Promise.all([
            apiClient.get(`/farms/${id}`),
            apiClient.get(`/activities/farm/${id}/carbon_summary`)
        ]);
        setFarm(farmRes.data);
        setCarbonSummary(carbonRes.data);
      } catch (error) {
        console.error("Failed to fetch farm details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [id]);
  
  const handleForecastLoaded = useCallback((recs) => {
    setRecommendations(recs);
  }, []);

  const handleUpdate = (updatedFarm) => {
    setFarm(updatedFarm);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/farms/${id}`);
        navigate('/app/my-farms');
      } catch (error) {
        alert('Could not delete the farm.');
      }
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading farm details...</p>;
  if (!farm) return <p className="text-center mt-8">Farm not found.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/app/my-farms" className="text-primary hover:underline mb-6 block">&larr; Back to My Farms</Link>
      
      {/* --- HEADER --- */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">{farm.name}</h1>
                <p className="text-md text-text-secondary mt-1">{farm.location_text}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsEditModalOpen(true)} className="py-2 px-4 rounded bg-secondary text-white hover:bg-blue-700 text-sm">Edit</button>
                <button onClick={handleDelete} className="py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600 text-sm">Delete</button>
            </div>
        </div>
      </div>
      
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FarmStatCard icon={<FiTrendingUp/>} title="Total Carbon Footprint" value={carbonSummary?.total_carbon_kg.toFixed(1) || '0'} unit="kg CO₂e" />
        <FarmStatCard icon={<FiCloudDrizzle/>} title="Predicted Rainfall" value="15" unit="mm (next 7 days)" />
        <FarmStatCard icon={<FiHeart/>} title="Soil Health Index" value="78" unit="/ 100" />
      </div>

      {/* --- TABBED INTERFACE --- */}
      <div className="bg-surface p-6 rounded-lg shadow-md">
        <Tabs>
          <TabPanel label="Overview">
            <WeatherForecast farm={farm} onForecastLoaded={handleForecastLoaded} />
            {recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-text-primary mb-3">💡 AI Recommendations</h2>
                <ul className="list-disc list-inside space-y-2 bg-background p-4 rounded-lg text-sm">
                  {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                </ul>
              </div>
            )}
             <FarmMap farm={farm} />
          </TabPanel>
          
          <TabPanel label="Activity Log">
            <ActivityLog farm={farm} />
          </TabPanel>

          <TabPanel label="Carbon (CO₂e)">
            <CarbonDashboard farm={farm} />
          </TabPanel>

          <TabPanel label="Climate Action AI">
             <ClimateActionSection farmId={farm.id} />
          </TabPanel>
        </Tabs>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <FarmFormModal
            existingFarm={farm}
            onSave={handleUpdate}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FarmDetail;