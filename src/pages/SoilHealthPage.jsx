import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../services/api';
import SoilReport from '../components/SoilReport';

function SoilHealthPage() {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarm = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/farms/${id}`);
        setFarm(response.data);
      } catch (error) {
        console.error("Failed to fetch farm details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarm();
  }, [id]);

  if (isLoading) {
    return <p className="text-center mt-10">Loading farm data...</p>;
  }

  if (!farm) {
    return (
        <div className="text-center mt-10">
            <p className="text-red-500">Farm not found.</p>
            <Link to="/app/my-farms" className="text-primary hover:underline mt-4 block">
                &larr; Go back to My Farms
            </Link>
        </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <Link to={`/app/farms/${farm.id}`} className="text-primary hover:underline mb-2 block text-sm">
          &larr; Back to {farm.name}
        </Link>
        <h1 className="text-3xl font-bold text-text-primary">
          Soil Health Analysis
        </h1>
        <p className="text-text-secondary">Submit new tests and review past reports for {farm.name}.</p>
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        <SoilReport farm={farm} />
      </div>
    </motion.div>
  );
}

export default SoilHealthPage;