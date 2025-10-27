import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

function CarbonDashboard({ farm }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!farm.id) return;
    
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/activities/farm/${farm.id}/carbon_summary`);
        setSummary(response.data);
      } catch (err) {
        console.error("Failed to fetch carbon summary:", err);
        setError("Could not load carbon summary.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSummary();
  }, [farm.id]);

  if (isLoading) {
    return <p className="text-text-secondary mt-8">Loading carbon summary...</p>;
  }
  
  if (error) {
    return <p className="text-red-500 mt-8">{error}</p>;
  }
  
  if (!summary) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Carbon Emissions Summary</h2>
      
      {/* Total Emissions */}
      <div className="bg-background p-6 rounded-lg text-center">
        <p className="text-text-secondary">Total Farm Emissions (Estimated)</p>
        <p className="text-5xl font-bold text-secondary my-2">
          {summary.total_carbon_kg.toFixed(1)}
        </p>
        <p className="text-text-primary">kg CO₂e</p>
      </div>
      
      {/* Breakdown by Activity */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Breakdown by Activity</h3>
        <div className="space-y-2">
          {Object.entries(summary.breakdown_by_activity).map(([activity, carbon]) => (
            <div key={activity} className="flex justify-between items-center bg-background p-3 rounded">
              <span className="text-text-primary">{activity}</span>
              <span className="font-bold text-text-secondary">{carbon.toFixed(1)} kg CO₂e</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Later, we can add a chart here */}
    </div>
  );
}

export default CarbonDashboard;