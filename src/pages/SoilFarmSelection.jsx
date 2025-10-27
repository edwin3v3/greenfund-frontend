import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

function SoilFarmSelection() {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await apiClient.get('/farms/');
        setFarms(response.data);
      } catch (error) {
        console.error("Failed to fetch farms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">
        Select a Farm for Soil Analysis 🔬
      </h1>

      {isLoading ? (
        <p>Loading farms...</p>
      ) : farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            // --- THIS IS THE LINK YOU CLICK SECOND ---
            <Link
              to={`/app/farms/${farm.id}/soil`} // Ensure this path is correct
              key={farm.id}
              className="block bg-surface p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="font-bold text-lg text-primary">{farm.name}</h3>
              <p className="text-text-secondary">{farm.location_text}</p>
            </Link>
            // --- END LINK ---
          ))}
        </div>
      ) : (
        <p className="text-text-secondary">You haven't added any farms yet.</p>
      )}
    </div>
  );
}

export default SoilFarmSelection;