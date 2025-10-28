import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiUpload, FiMapPin, FiBarChart, FiCpu, FiAward, FiCheckCircle, FiGitPullRequest } from 'react-icons/fi'; // Added icons
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import apiClient from '../services/api';
import { formatDistanceToNow } from 'date-fns';

// --- vvvv THIS COMPONENT IS UPDATED vvvv ---
const StatCard = ({ title, value, trend, icon, chartData = [], listData = [], colorClass }) => {
    const formattedChartData = chartData.map((val, index) => ({
        name: `Day ${index + 1}`,
        value: val
    }));

    // Check if we should render a list instead of a chart
    const shouldRenderList = chartData.length === 0 && listData.length > 0;
    // Check if we should render the chart
    const shouldRenderChart = chartData.length > 0;

    return (
        <div className="bg-surface p-6 rounded-xl shadow-md flex flex-col">
            {/* Top section (no change) */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-text-secondary font-medium">{title}</p>
                    <p className="text-3xl font-bold text-text-primary">{value}</p>
                    <p className={`text-xs font-semibold ${trend.startsWith('+') || trend.startsWith('Tracking') || trend.startsWith('Great') || trend === 'Stable' || trend.includes('suggestion') ? 'text-green-500' : (trend === 'N/A' || trend === 'Coming Soon' || trend === 'No suggestions' ? 'text-gray-500' : 'text-red-500')}`}>{trend}</p>
                </div>
                <div className={`text-2xl p-3 rounded-full ${colorClass}`}>{icon}</div>
            </div>

            {/* Bottom section (Updated) */}
            <div className="h-16 w-full mt-auto">
                {shouldRenderChart && (
                    <ResponsiveContainer>
                        <LineChart data={formattedChartData} margin={{ top: 5, right: 10, left: -40, bottom: 5 }}>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffffcc', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value, name, props) => {
                                    if (title.includes("Emission")) return [`${value.toFixed(1)} kg CO2e`, null];
                                    return [`${value}`, null];
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={colorClass.includes('green') ? '#22c55e' : (colorClass.includes('red') ? '#ef4444' : (colorClass.includes('yellow') ? '#eab308' : '#3b82f6'))}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
                
                {shouldRenderList && (
                    <div className="space-y-1 overflow-y-auto h-full">
                        {listData.slice(0, 3).map((item, index) => ( // Show top 3
                            <div key={index} className="flex items-center gap-2 text-xs text-text-secondary">
                                {title.includes("Farms") && <FiGitPullRequest className="text-green-500" />}
                                {title.includes("Suggestions") && <FiCheckCircle className="text-blue-500" />}
                                {title.includes("Badges") && <FiAward className="text-yellow-500" />}
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* If no chart AND no list, this renders nothing */}
                {!shouldRenderChart && !shouldRenderList && null}
            </div>
        </div>
    );
};
// --- ^^^^ END OF UPDATE ^^^^ ---

const ActivityItem = ({ icon, text, time, color }) => (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-primary">{text}</p>
            <p className="text-xs text-text-secondary">{time}</p>
        </div>
    </div>
);

function Dashboard() {
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState({
      totalFarms: 0,
      badgeCount: 0,
      weeklyEmissions: { total_emissions_kg: 0, daily_emissions: [] },
      cropSuggestions: { unique_suggestion_count: 0, recent_suggestions: [] }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  
  // --- vvvv NEW STATE FOR LISTS vvvv ---
  const [recentFarms, setRecentFarms] = useState([]);
  const [recentBadges, setRecentBadges] = useState([]);
  // --- ^^^^ END NEW STATE ^^^^ ---

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; 
      
      setIsLoading(true);
      
      let farmCount = 0; 
      let farmList = []; // <-- To store farm names
      let badgeCount = 0;
      let badgeList = []; // <-- To store badge names
      let activities = [];
      let emissionsData = { total_emissions_kg: 0, daily_emissions: [] };
      let suggestionsData = { unique_suggestion_count: 0, recent_suggestions: [] };

      try {
        const [farmsRes, badgesCountRes, emissionsRes, suggestionsRes, activityRes, recentBadgesRes] = await Promise.allSettled([
            apiClient.get('/farms/'),
            apiClient.get('/badges/me/count'),
            apiClient.get('/activities/emissions/weekly'),
            apiClient.get('/soil/suggestions/summary'),
            apiClient.get('/activities/me/recent'),
            apiClient.get('/badges/me') // <-- Fetch the list of earned badges
        ]);

        // Process farms
        if (farmsRes.status === 'fulfilled') {
            farmCount = farmsRes.value.data.length;
            // Get names of last 3 farms
            farmList = farmsRes.value.data.map(farm => farm.name).slice(0, 3);
        } else { console.error("Failed farms fetch:", farmsRes.reason); }

        // Process badge count
        if (badgesCountRes.status === 'fulfilled') {
            badgeCount = badgesCountRes.value.data.count;
        } else { console.error("Failed badges fetch:", badgesCountRes.reason); }

        // Process recent badges list
        if (recentBadgesRes.status === 'fulfilled') {
            // Get names of last 3 badges
            badgeList = recentBadgesRes.value.data.map(userBadge => userBadge.badge.name).slice(0, 3);
        } else { console.error("Failed recent badges fetch:", recentBadgesRes.reason); }

        // Process emissions
        if (emissionsRes.status === 'fulfilled') {
            if (emissionsRes.value.data && emissionsRes.value.data.daily_emissions) {
                emissionsData = emissionsRes.value.data;
            } else { console.warn("Received unexpected emissions data:", emissionsRes.value.data); }
        } else { console.error("Failed emissions fetch:", emissionsRes.reason); }

        // Process suggestions
        if (suggestionsRes.status === 'fulfilled') {
             if (suggestionsRes.value.data && suggestionsRes.value.data.unique_suggestion_count !== undefined) {
                suggestionsData = suggestionsRes.value.data;
             } else { console.warn("Received unexpected suggestions data:", suggestionsRes.value.data); }
        } else { console.error("Failed suggestions fetch:", suggestionsRes.reason); }
        
        // Process activities
        if (activityRes.status === 'fulfilled') {
            activities = activityRes.value.data;
        } else { console.error("Failed activities fetch:", activityRes.reason); }

      } catch (error) {
        console.error("Unexpected error fetching dashboard data:", error);
      } finally {
        setDashboardData({
            totalFarms: farmCount,
            badgeCount: badgeCount,
            weeklyEmissions: emissionsData,
            cropSuggestions: suggestionsData
        });
        setRecentActivities(activities);
        // --- vvvv SET NEW LIST STATE vvvv ---
        setRecentFarms(farmList);
        setRecentBadges(badgeList);
        // --- ^^^^ END SET NEW LIST STATE ^^^^ ---
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]); 

   const activitiesToShow = isLoading ? [] : recentActivities.length > 0 ? recentActivities.map(act => ({
      id: act.id,
      icon: '🚜',
      text: act.description || act.activity_type,
      time: `${formatDistanceToNow(new Date(act.date), { addSuffix: true })}`,
      color: 'bg-orange-100 text-orange-600'
   })) : [
     { id: 1, icon: '🤷', text: 'No recent activity.', time: 'Just now', color: 'bg-gray-100 text-gray-600' }
   ];

   const getEmissionsTrend = () => {
       if (isLoading) return "...";
       const daily = dashboardData.weeklyEmissions.daily_emissions || [];
       if (daily.length < 7) return "N/A";
       const firstHalfSum = daily.slice(0, 3).reduce((s, v) => s + v, 0);
       const secondHalfSum = daily.slice(3, 7).reduce((s, v) => s + v, 0);
       if (secondHalfSum > firstHalfSum * 1.1) return "Increasing";
       if (secondHalfSum < firstHalfSum * 0.9) return "Decreasing";
       return "Stable";
   };

   const getSuggestionsTrend = () => {
       if (isLoading) return "...";
       const count = dashboardData.cropSuggestions.unique_suggestion_count;
       if (count === 0) return "No suggestions yet";
       if (count === 1) return "1 unique suggestion";
       return `${count} unique suggestions`;
   };


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user?.full_name || 'Farmer'}!</h1>
                <p className="text-text-secondary mt-1">Summary of your farms' activity.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
                <Link to="/app/my-farms" className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"><FiPlus /> Add/View Farms</Link>
                <Link to="/app/soil-analysis" className="bg-secondary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"><FiUpload /> Upload Soil Data</Link>
            </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Farms"
                value={isLoading ? '...' : dashboardData.totalFarms}
                trend={isLoading ? '...' : `Tracking ${dashboardData.totalFarms} properties`}
                icon={<FiMapPin />}
                colorClass="bg-green-100 text-green-600"
                listData={recentFarms} // <-- Pass farm list
            />
            <StatCard
                title="Weekly Emission"
                value={isLoading ? '...' : `${dashboardData.weeklyEmissions.total_emissions_kg.toFixed(1)} kg`}
                trend={getEmissionsTrend()}
                icon={<FiBarChart />}
                chartData={dashboardData.weeklyEmissions.daily_emissions} // Has chart data
                colorClass="bg-red-100 text-red-600"
            />
            <StatCard
                title="AI Crop Suggestions"
                value={isLoading ? '...' : dashboardData.cropSuggestions.unique_suggestion_count}
                trend={getSuggestionsTrend()}
                icon={<FiCpu />}
                listData={dashboardData.cropSuggestions.recent_suggestions} // <-- Pass suggestion list
                colorClass="bg-blue-100 text-blue-600"
            />
            <StatCard
                title="Badges Earned"
                value={isLoading ? '...' : dashboardData.badgeCount}
                trend={isLoading ? '...' : (dashboardData.badgeCount > 0 ? "Great job!" : "Start exploring")}
                icon={<FiAward />}
                listData={recentBadges} // <-- Pass badge list
                colorClass="bg-yellow-100 text-yellow-600"
            />
        </div>

        {/* Recent Activity */}
        <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Recent Activity</h2>
            <div className="bg-surface rounded-xl shadow-md p-6">
                <div className="space-y-2">
                    {isLoading ? (<p className="text-gray-500">Loading activity...</p>) : (
                        activitiesToShow.map((activity, index) => (<ActivityItem key={activity.id || index} {...activity} />))
                    )}
                </div>
            </div>
        </div>
    </motion.div>
  );
}

export default Dashboard;
