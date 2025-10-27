import React, { useState, useEffect } from 'react';
import { FiUser, FiBell, FiLock, FiSave, FiLoader, FiMail, FiMapPin } from 'react-icons/fi'; // Added more icons
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api'; // Renamed to apiClient
import toast from 'react-hot-toast';

function SettingsPage() {
  const { user, fetchUser } = useAuth(); 
  
  // State for the profile form
  const [profileLoading, setProfileLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    location: '',
  });

  // State for the password form
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwords, setPasswords] = useState({
      old_password: '',
      new_password: '',
      confirm_password: ''
  });

  // When the component loads, fill the profile form
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        location: user.location || '',
      });
    }
  }, [user]); 

  // Handle changes to profile form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes to password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    
    const changes = {};
    if (formData.full_name !== user.full_name) changes.full_name = formData.full_name;
    if (formData.email !== user.email) changes.email = formData.email;
    if (formData.location !== (user.location || '')) changes.location = formData.location;

    if (Object.keys(changes).length === 0) {
      toast.error("No changes to save.");
      setProfileLoading(false);
      return;
    }

    try {
      const response = await apiClient.put('/users/me', changes);
      if (fetchUser) {
        fetchUser(); 
      }
      toast.success("Profile updated successfully!");
      setFormData({
        full_name: response.data.full_name || '',
        email: response.data.email || '',
        location: response.data.location || '',
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };
  
  // --- vvvv IMPLEMENTED PASSWORD SUBMIT vvvv ---
  const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      
      const { old_password, new_password, confirm_password } = passwords;

      // 1. Client-side validation
      if (!old_password || !new_password || !confirm_password) {
          toast.error("Please fill in all password fields.");
          return;
      }
      if (new_password !== confirm_password) {
          toast.error("New passwords do not match.");
          return;
      }
      if (new_password.length < 8) {
          toast.error("New password must be at least 8 characters long.");
          return;
      }

      setPasswordLoading(true);
      try {
          // 2. Send to backend
          await apiClient.post('/users/me/change-password', {
              old_password: old_password,
              new_password: new_password
          });
          
          toast.success("Password updated successfully!");
          // 3. Reset fields
          setPasswords({
              old_password: '',
              new_password: '',
              confirm_password: ''
          });
          
      } catch (error) {
          const detail = error.response?.data?.detail || "An error occurred.";
          toast.error(detail);
      } finally {
          setPasswordLoading(false);
      }
  };
  // --- ^^^^ END IMPLEMENTATION ^^^^ ---

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>

      {/* --- Profile Information Form --- */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Account Settings</h2>
        
        {/* Full Name */}
        <div className="flex items-center space-x-4 p-3">
          <FiUser className="text-primary" size={20} />
          <div className="flex-1">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-500">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
        
        {/* Email */}
        <div className="flex items-center space-x-4 p-3">
          <FiMail className="text-primary" size={20} /> {/* Changed icon */}
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-4 p-3">
          <FiMapPin className="text-primary" size={20} /> {/* Changed icon */}
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-500">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''} 
              onChange={handleChange}
              placeholder="e.g., Nairobi, Kenya"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={profileLoading}
            className={`bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center justify-center min-w-[120px] ${profileLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {profileLoading ? <FiLoader className="animate-spin" /> : <><FiSave className="mr-2" /> Save Changes</>}
          </button>
        </div>
      </form>
      
      {/* --- Password Change Form (Now functional) --- */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Change Password</h2>
        <div className="flex items-center space-x-4 p-3">
          <FiLock className="text-primary" size={20} />
           <div className="flex-1">
            <label htmlFor="old_password" className="block text-sm font-medium text-gray-500">Current Password</label>
            <input 
                type="password" 
                id="old_password" 
                name="old_password" // <-- Added name
                value={passwords.old_password} // <-- Added value
                onChange={handlePasswordChange} // <-- Added onChange
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                placeholder="************" 
            />
          </div>
        </div>
         <div className="flex items-center space-x-4 p-3">
          <FiLock className="text-primary" size={20} />
           <div className="flex-1">
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-500">New Password</label>
            <input 
                type="password" 
                id="new_password" 
                name="new_password" // <-- Added name
                value={passwords.new_password} // <-- Added value
                onChange={handlePasswordChange} // <-- Added onChange
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                placeholder="************" 
            />
          </div>
        </div>
        {/* --- vvvv ADDED CONFIRM PASSWORD vvvv --- */}
        <div className="flex items-center space-x-4 p-3">
          <FiLock className="text-primary" size={20} />
           <div className="flex-1">
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-500">Confirm New Password</label>
            <input 
                type="password" 
                id="confirm_password" 
                name="confirm_password" // <-- Added name
                value={passwords.confirm_password} // <-- Added value
                onChange={handlePasswordChange} // <-- Added onChange
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                placeholder="************" 
            />
          </div>
        </div>
        {/* --- ^^^^ END CONFIRM PASSWORD ^^^^ --- */}
         <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={passwordLoading} // <-- Use passwordLoading
            className={`bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center justify-center min-w-[170px] ${passwordLoading ? 'opacity-50 cursor-not-allowed' : ''}`} // <-- Use primary color
          >
            {passwordLoading ? <FiLoader className="animate-spin" /> : <><FiSave className="mr-2" /> Change Password</>}
          </button>
        </div>
      </form>
      
    </div>
  );
}

export default SettingsPage;