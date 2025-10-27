import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import WeatherChart from './WeatherChart'; // Import the new chart component

function WeatherForecast({ farm, onForecastLoaded }) {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!farm || !farm.id) return;

    const fetchForecast = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/climate/${farm.id}/forecast`);
        const forecastData = response.data.forecast.daily;
        const recommendations = response.data.recommendations;

        const processedForecast = forecastData.time.map((date, index) => ({
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          weatherCode: forecastData.weathercode[index],
          maxTemp: Math.round(forecastData.temperature_2m_max[index]),
          minTemp: Math.round(forecastData.temperature_2m_min[index]),
          precipitation: forecastData.precipitation_sum[index],
        }));
        
        setForecast(processedForecast);
        
        if (onForecastLoaded) {
          onForecastLoaded(recommendations);
        }
      } catch (err) {
        setError('Could not load weather forecast.');
        console.error('Failed to fetch forecast:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, [farm, onForecastLoaded]);

  if (isLoading) return <p className="text-text-secondary mt-8">Loading weather data...</p>;
  if (error) return <p className="text-red-500 mt-8">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-text-primary mb-2">7-Day Forecast</h2>
      {/* Render the chart instead of the old grid */}
      <WeatherChart forecast={forecast} />
    </div>
  );
}

export default WeatherForecast;