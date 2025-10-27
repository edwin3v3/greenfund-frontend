import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ActivityLog({ farm }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activityType, setActivityType] = useState('Planting');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(10);
  const [unit, setUnit] = useState('litres');

  useEffect(() => {
    if (!farm.id) return;
    
    const fetchActivities = async () => {
      setIsLoading(true);
      setError(''); // Clear previous errors
      try {
        const response = await apiClient.get(`/activities/farm/${farm.id}`);
        setActivities(response.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Could not load activities. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [farm.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please add a description.");
      return;
    }
    const loadingToast = toast.loading('Calculating emissions and saving...');

    try {
      const newActivityData = {
        farm_id: farm.id,
        activity_type: activityType,
        description: description,
        value: parseFloat(value),
        unit: unit,
      };
      
      const response = await apiClient.post('/activities/', newActivityData);
      
      setActivities([response.data, ...activities]);
      toast.success('Activity logged successfully!', { id: loadingToast });
      
      setDescription('');
      setValue(10);
      
    } catch (err) {
      console.error("Failed to add activity:", err);
      const errorMessage = err.response?.data?.detail || "Failed to save activity.";
      toast.error(errorMessage, { id: loadingToast });
    }
  };
  
  const handleDelete = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this log entry?")) return;
    
    try {
      await apiClient.delete(`/activities/${activityId}`);
      setActivities(activities.filter(act => act.id !== activityId));
      toast.success('Entry deleted.');
    } catch (err) {
      console.error("Failed to delete activity:", err);
      toast.error('Could not delete the entry.');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Farm Activity Log</h2>
      
      <form onSubmit={handleSubmit} className="bg-background p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Log a New Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Tractor plowing for maize" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Activity Type</label>
            <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className="w-full p-2 border rounded">
              <option>Planting</option>
              <option>Harvesting</option>
              <option>Fertilizing</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Amount</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-2 border rounded">
                <option>litres</option>
                <option>kg</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-green-700">
          Save Activity
        </button>
      </form>

      {/* List of Activities */}
      <div className="space-y-4">
        {/* --- THIS IS THE FIX --- */}
        {isLoading ? (
          <p>Loading activities...</p>
        ) : error ? (
          <p className="text-red-500 text-center bg-red-50 p-4 rounded-lg">{error}</p>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="bg-background p-4 rounded-lg flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-text-primary">{activity.activity_type}</p>
                  <span className="text-xs font-medium bg-secondary text-white px-2 py-0.5 rounded-full">
                    {activity.carbon_footprint_kg?.toFixed(2)} kg CO₂e
                  </span>
                </div>
                <p className="text-text-secondary mt-1">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
              <button onClick={() => handleDelete(activity.id)} className="text-red-500 hover:text-red-700 p-1">
                <FiTrash2 />
              </button>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-center py-5">No activities logged for this farm yet.</p>
        )}
        {/* --- END FIX --- */}
      </div>
    </div>
  );
}

export default ActivityLog;