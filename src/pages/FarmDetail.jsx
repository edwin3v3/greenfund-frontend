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
// Added more icons relevant to the overview section
import { FiCloudDrizzle, FiTrendingUp, FiHeart, FiMapPin, FiMaximize, FiEdit, FiTrash, FiSun, FiAlertTriangle, FiDroplet, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast'; // Import toast for better feedback

// Reusable Stat Card for this page
const FarmStatCard = ({ icon, title, value, unit }) => (
    <div className="bg-background p-4 rounded-lg flex items-center gap-4 shadow"> {/* Added shadow */}
        <div className="text-2xl text-primary p-3 bg-green-100 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-xl font-bold text-text-primary">
                {value} <span className="text-sm font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

// --- NEW Recommendation Display Component ---
const RecommendationCard = ({ title, icon, children, isLoading }) => (
    <div className="bg-white rounded-lg shadow p-4 min-h-[100px]"> {/* Changed background */}
        <h4 className="text-md font-semibold text-text-primary mb-2 flex items-center gap-2">
            {icon} {title}
        </h4>
        {isLoading ? (
            <div className="flex justify-center items-center h-16">
                <FiLoader className="animate-spin text-primary" />
            </div>
        ) : (
            <div className="text-sm text-text-secondary space-y-1">
                {children || <p>No specific recommendations available.</p>} {/* Added fallback */}
            </div>
        )}
    </div>
);


function FarmDetail() {
    // Renamed id to farmId for clarity
    const { id: farmId } = useParams();
    const navigate = useNavigate();
    const [farm, setFarm] = useState(null);
    // Removed old recommendations state
    const [carbonSummary, setCarbonSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- NEW State for Recommendations Overview ---
    const [overviewData, setOverviewData] = useState({
        soil: null,       // Latest soil report with suggestions
        alerts: [],       // Pest/Disease alerts
        water: null,      // Water management advice
        weatherRecs: [],  // Recommendations from weather forecast
        loading: true     // Loading state for this section
    });
    // ------------------------------------

    // Fetch all farm-specific data in parallel
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true); // Overall page loading
            setOverviewData(prev => ({ ...prev, loading: true })); // Overview section loading

            try {
                // Fetch farm, carbon, soil, alerts, water, and weather/recs
                const [farmRes, carbonRes, soilRes, alertsRes, waterRes, weatherRecsRes] = await Promise.allSettled([
                    apiClient.get(`/farms/${farmId}`),
                    apiClient.get(`/activities/farm/${farmId}/carbon_summary`),
                    apiClient.get(`/soil/farm/${farmId}?limit=1`), // Latest soil report
                    apiClient.get(`/climate-actions/alerts/${farmId}`), // Alerts
                    apiClient.get(`/climate-actions/water-management/${farmId}`), // Water advice
                    apiClient.get(`/climate/${farmId}/forecast`) // Weather AND Recommendations
                ]);

                // Process Farm Details
                if (farmRes.status === 'fulfilled') {
                    setFarm(farmRes.value.data);
                } else {
                    console.error("Failed to fetch farm details:", farmRes.reason);
                    toast.error("Could not load farm details.");
                    setIsLoading(false); // Stop loading if critical data fails
                    setOverviewData(prev => ({...prev, loading: false}));
                    return; // Stop execution if farm fails
                }

                // Process Carbon Summary
                if (carbonRes.status === 'fulfilled') {
                    setCarbonSummary(carbonRes.value.data);
                } else {
                    console.warn("Failed to fetch carbon summary:", carbonRes.reason);
                }

                // --- Process Recommendations Overview Data ---
                let latestSoilReport = null;
                if (soilRes.status === 'fulfilled' && soilRes.value.data.length > 0) {
                     latestSoilReport = soilRes.value.data.find(r => r.suggested_crops?.length > 0) || soilRes.value.data[0];
                } else if (soilRes.status === 'rejected') { console.warn("Failed soil fetch:", soilRes.reason); }

                let pestAlerts = [];
                if (alertsRes.status === 'fulfilled') {
                    pestAlerts = alertsRes.value.data.alerts || [];
                } else { console.warn("Failed alerts fetch:", alertsRes.reason); }

                let waterAdvice = null;
                if (waterRes.status === 'fulfilled') {
                    waterAdvice = waterRes.value.data.advice || null;
                } else { console.warn("Failed water advice fetch:", waterRes.reason); }

                let weatherRecommendations = [];
                if (weatherRecsRes.status === 'fulfilled') {
                    // Extract recommendations directly from this response
                    weatherRecommendations = weatherRecsRes.value.data.recommendations || [];
                } else { console.warn("Failed weather/recs fetch:", weatherRecsRes.reason); }

                setOverviewData({
                    soil: latestSoilReport,
                    alerts: pestAlerts,
                    water: waterAdvice,
                    weatherRecs: weatherRecommendations, // Set weather recs here
                    loading: false // Finish overview loading
                });
                // ------------------------------------

            } catch (error) {
                console.error("Unexpected error fetching farm data:", error);
                toast.error("An unexpected error occurred.");
                setOverviewData(prev => ({ ...prev, loading: false })); // Stop loading on error
            } finally {
                setIsLoading(false); // Finish overall loading
            }
        };
        fetchAllData();
    }, [farmId]);

    // This callback is no longer needed to set recommendations state
    // const handleForecastLoaded = useCallback((recs) => {
    //   // setRecommendations(recs); // We get recs from the main useEffect now
    // }, []);

    const handleUpdate = (updatedFarm) => {
        setFarm(updatedFarm);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
            try {
                await apiClient.delete(`/farms/${farmId}`);
                toast.success("Farm deleted successfully."); // Use toast
                navigate('/app/my-farms');
            } catch (error) {
                console.error("Delete failed:", error);
                toast.error('Could not delete the farm.'); // Use toast
            }
        }
    };

    // --- Render Helpers for Overview Section ---
    const renderCropSuggestions = () => {
        if (!overviewData.soil || !overviewData.soil.suggested_crops || overviewData.soil.suggested_crops.length === 0) {
            return <p>No recent crop suggestions.</p>;
        }
        return <ul className="list-disc list-inside">{overviewData.soil.suggested_crops.slice(0, 3).map((crop, i) => <li key={i}>{crop}</li>)}</ul>;
    };
    const renderAlerts = () => {
        const highRisk = overviewData.alerts.filter(a => a.risk_level === 'High');
        if (highRisk.length === 0 && overviewData.alerts.length > 0) return <p>No high-risk alerts. Check details for low/medium risks.</p>;
        if (overviewData.alerts.length === 0) return <p>No significant risks detected.</p>;
        return <ul className="space-y-1">{highRisk.slice(0, 2).map((a, i) => <li key={i} className="text-red-600"><strong>{a.name}:</strong> {a.advice}</li>)}</ul>;
    };
     const renderWaterAdvice = () => {
        if (!overviewData.water) return <p>Advice not available.</p>;
        return (
            <>
                {overviewData.water.next_7_days_outlook && <p><strong>Outlook:</strong> {overviewData.water.next_7_days_outlook}</p>}
                {overviewData.water.irrigation_advice && <p><strong>Irrigation:</strong> {overviewData.water.irrigation_advice}</p>}
            </>
        );
    };
     const renderWeatherRecs = () => {
        if (!overviewData.weatherRecs || overviewData.weatherRecs.length === 0) return <p>No weather-based advice currently.</p>;
        return <ul className="list-disc list-inside">{overviewData.weatherRecs.slice(0, 3).map((rec, i) => <li key={i}>{rec}</li>)}</ul>;
    };
    // ------------------------------------


    if (isLoading && !farm) return <div className="flex justify-center items-center h-64"><FiLoader className="animate-spin text-primary text-4xl" /></div>; // Show loader only if farm is not yet loaded
    if (!farm) return <p className="text-center mt-8 text-red-500">Farm not found or failed to load.</p>; // Show error if farm failed

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/app/my-farms" className="text-primary hover:underline mb-6 block">&larr; Back to My Farms</Link>

            {/* --- HEADER --- */}
            <div className="bg-surface p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{farm.name}</h1>
                        <p className="text-md text-text-secondary mt-1 flex items-center gap-1"><FiMapPin size={14}/> {farm.location_text}</p>
                        {farm.size_acres && <p className="text-sm text-text-secondary mt-1 flex items-center gap-1"><FiMaximize size={14}/> {farm.size_acres} acres</p>}
                    </div>
                    <div className="flex gap-2 self-start md:self-center">
                        <button onClick={() => setIsEditModalOpen(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1"><FiEdit/> Edit</button>
                        <button onClick={handleDelete} className="btn-danger text-sm py-2 px-4 flex items-center gap-1"><FiTrash/> Delete</button>
                    </div>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            {/* Show loading indicator or value for carbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <FarmStatCard
                    icon={<FiTrendingUp/>}
                    title="Total Carbon Footprint"
                    value={isLoading ? '...' : (carbonSummary?.total_carbon_kg.toFixed(1) ?? 'N/A')} // Handle loading and null
                    unit="kg CO₂e"
                 />
                 {/* Static values - replace with dynamic data if available */}
                <FarmStatCard icon={<FiCloudDrizzle/>} title="Predicted Rainfall" value="..." unit="mm (Next 7 days)" />
                <FarmStatCard icon={<FiHeart/>} title="Soil Health Index" value="..." unit="/ 100" />
            </div>

            {/* --- AI Recommendations Overview (NEW SECTION) --- */}
            <div className="mb-8">
                 <h2 className="text-xl font-semibold text-text-primary mb-4">AI Recommendations Overview</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Changed to 4 columns */}
                     <RecommendationCard title="Crop Suggestions" icon={<FiSun className="text-yellow-500"/>} isLoading={overviewData.loading}>
                         {renderCropSuggestions()}
                     </RecommendationCard>
                     <RecommendationCard title="Pest & Disease Alerts" icon={<FiAlertTriangle className="text-red-500"/>} isLoading={overviewData.loading}>
                         {renderAlerts()}
                     </RecommendationCard>
                     <RecommendationCard title="Water Management" icon={<FiDroplet className="text-blue-500"/>} isLoading={overviewData.loading}>
                         {renderWaterAdvice()}
                     </RecommendationCard>
                      <RecommendationCard title="Weather Advice" icon={<FiCloudDrizzle className="text-cyan-500"/>} isLoading={overviewData.loading}>
                         {renderWeatherRecs()} {/* Display weather recs here */}
                     </RecommendationCard>
                 </div>
            </div>
            {/* ------------------------------------------- */}


            {/* --- TABBED INTERFACE --- */}
            <div className="bg-surface p-6 rounded-lg shadow-md">
                <Tabs>
                    <TabPanel label="Weather"> {/* Changed label */}
                        {/* Pass farm data, no need for onForecastLoaded */}
                        <WeatherForecast farm={farm} />
                        {/* Removed AI Recommendations list from here */}
                        <div className="mt-6"> {/* Added margin */}
                             <FarmMap farm={farm} />
                        </div>
                    </TabPanel>

                    <TabPanel label="Activity Log">
                        <ActivityLog farm={farm} />
                    </TabPanel>

                    <TabPanel label="Carbon (CO₂e)">
                        {/* Pass carbonSummary if CarbonDashboard needs it */}
                        <CarbonDashboard farm={farm} carbonSummary={carbonSummary} />
                    </TabPanel>

                    <TabPanel label="Climate Actions"> {/* Renamed tab */}
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

            {/* Added standard button classes */}
             {/* Ensure these are defined in index.css */}
             {/*
            .btn-secondary { @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed; }
            .btn-danger { @apply bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed; }
            */}
        </motion.div>
    );
}

export default FarmDetail;