// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    FiGrid, 
    FiMap, // Using FiMap for My Farms
    FiDroplet, 
    FiMessageSquare, 
    FiLogOut, 
    FiSettings,
    FiCpu, // AI/Bot icon
    FiAward // <-- 1. Import the new icon
} from 'react-icons/fi';

function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-4 rounded-lg transition duration-200 text-base ${
          isActive 
            ? 'bg-green-100 text-primary font-semibold' 
            : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
        }`;

    return (
        <aside className="w-64 bg-surface text-text-primary p-4 shadow-lg flex flex-col h-screen sticky top-0">
            <div className="mb-8 text-2xl font-bold text-primary flex items-center gap-2 px-2 py-4 border-b">
                🌿 GreenFund
            </div>

            <nav className="flex-grow space-y-1">
                <NavLink to="/app/dashboard" className={linkClasses} end>
                    <FiGrid /> Dashboard
                </NavLink>
                <NavLink to="/app/my-farms" className={linkClasses}>
                    <FiMap /> My Farms
                </NavLink>
                <NavLink to="/app/soil-analysis" className={linkClasses}>
                    <FiDroplet /> Soil Scans
                </NavLink>
                <NavLink to="/app/forum" className={linkClasses}>
                    <FiMessageSquare /> Community
                </NavLink>
                <NavLink to="/app/chatbot" className={linkClasses}>
                    <FiCpu /> AI Chatbot
                </NavLink>
                {/* --- 2. ADD THE NEW LINK --- */}
                <NavLink to="/app/badges" className={linkClasses}>
                    <FiAward /> My Badges
                </NavLink>
                {/* --- END NEW LINK --- */}
            </nav>

            <div className="mt-auto pt-4 border-t space-y-2">
                <NavLink to="/app/settings" className={linkClasses}>
                    <FiSettings /> Settings
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full py-2.5 px-4 rounded-lg transition duration-200 text-text-secondary hover:bg-red-100 hover:text-red-600"
                >
                    <FiLogOut /> Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;