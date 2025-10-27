// src/components/ClimateActionSection.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

function ClimateActionSection({ farmId }) {
  const [alerts, setAlerts] = useState(null);
  const [carbonGuidance, setCarbonGuidance] = useState(null);
  const [waterAdvice, setWaterAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Prevent fetching if farmId is not available yet
    if (!farmId) {
        setIsLoading(false);
        return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch all data in parallel
        // Use correct API endpoints, /api is added by apiClient
        const [alertsRes, carbonRes, waterRes] = await Promise.all([
          apiClient.get(`/climate-actions/alerts/${farmId}`),
          apiClient.get(`/climate-actions/carbon-guidance/${farmId}`),
          apiClient.get(`/climate-actions/water-management/${farmId}`)
        ]);
        setAlerts(alertsRes.data);
        setCarbonGuidance(carbonRes.data);
        setWaterAdvice(waterRes.data);
      } catch (err) {
        console.error("Failed to fetch climate action data:", err);
        setError('Could not load AI climate action insights. The feature might be under development or there was a server error.');
        // Clear data on error
        setAlerts(null);
        setCarbonGuidance(null);
        setWaterAdvice(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [farmId]); // Dependency array includes farmId

  if (isLoading) return <p className="p-4 text-text-secondary animate-pulse">Loading AI insights...</p>; // Added pulse animation
  if (error) return <p className="p-4 text-red-500 bg-red-100 rounded border border-red-300">{error}</p>; // Improved error styling

  // Helper function to determine border color based on risk
  const getRiskColor = (riskLevel) => {
      switch(riskLevel?.toLowerCase()){
          case 'high': return 'border-red-500';
          case 'medium': return 'border-orange-500';
          case 'low': return 'border-green-500';
          default: return 'border-gray-300';
      }
  }

  return (
    <div className="space-y-6 mt-6"> {/* Added spacing */}

      {/* Pest & Disease Alerts */}
      {alerts && (
        <div className="bg-background p-4 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
             <span role="img" aria-label="pest">🦟</span>📉 Pest & Disease Alerts
          </h3>
          {alerts.alerts?.length > 0 ? ( // Added optional chaining
            <ul className="space-y-3">
              {alerts.alerts.map((alert, index) => (
                <li key={index} className={`border-l-4 p-3 pl-4 bg-surface rounded shadow-sm ${getRiskColor(alert.risk_level)}`}>
                  <strong className="text-primary block text-md">{alert.name} ({alert.type}) - Risk: {alert.risk_level}</strong>
                  <p className="text-sm text-text-secondary mt-1">{alert.advice}</p>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-text-secondary text-sm">No significant pest or disease risks detected based on current forecast.</p>
          )}
        </div>
      )}

      {/* Carbon Sequestration Guidance */}
      {carbonGuidance && carbonGuidance.guidance && ( // Check guidance exists
        <div className="bg-background p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
                <span role="img" aria-label="tree">🌳</span> Carbon Sequestration Guidance
            </h3>
            <p className="text-sm text-text-secondary mb-3">
                <span className="font-medium">Estimated Rate:</span> {carbonGuidance.guidance.estimated_current_seq_rate || 'N/A'}
            </p>
            <h4 className="font-medium text-text-primary mb-2 text-md">Recommendations:</h4>
            {carbonGuidance.guidance.recommendations?.length > 0 ? ( // Optional chaining
                <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary pl-4">
                {carbonGuidance.guidance.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                </ul>
            ) : (
                 <p className="text-text-secondary text-sm pl-4">No specific recommendations at this time. Ensure you log activities like cover cropping or reduced tillage.</p>
            )}
        </div>
      )}

      {/* Water Management Advice */}
      {waterAdvice && waterAdvice.advice && ( // Check advice exists
        <div className="bg-background p-4 rounded-lg shadow border border-gray-200">
           <h3 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
               <span role="img" aria-label="droplet">💧</span> Water Management Advice
           </h3>
           <p className="text-sm text-text-secondary mb-2">
               <span className="font-medium">Weather Outlook (Next 7 days):</span> {waterAdvice.advice.next_7_days_outlook || 'N/A'}
            </p>
           <p className="text-sm text-text-secondary mb-3">
               <span className="font-medium">Irrigation Advice:</span> {waterAdvice.advice.irrigation_advice || 'N/A'}
            </p>
            <h4 className="font-medium text-text-primary mb-2 text-md">Tips:</h4>
            {waterAdvice.advice.tips?.length > 0 ? ( // Optional chaining
                <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary pl-4">
                {waterAdvice.advice.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
             ) : (
                  <p className="text-text-secondary text-sm pl-4">General water conservation practices are always recommended.</p>
             )}
        </div>
      )}

      {/* Placeholder message if no data could be loaded */}
       {!isLoading && !error && !alerts && !carbonGuidance && !waterAdvice && (
            <p className="text-center text-text-secondary p-4">Could not load any AI climate action insights.</p>
       )}

    </div>
  );
}

export default ClimateActionSection;