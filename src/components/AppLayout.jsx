import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
// Remove FiBell import if not used elsewhere
// import { FiBell } from 'react-icons/fi'; 
import NotificationBell from './NotificationBell'; // <-- 1. Import NotificationBell

// Header component with NotificationBell integrated
function Header() {
    const { user } = useAuth();
    return (
        <header className="bg-surface w-full py-4 px-8 flex justify-end items-center border-b">
            <div className="flex items-center gap-4">
                {/* --- vvvv REPLACE THE BUTTON vvvv --- */}
                <NotificationBell /> 
                {/* --- ^^^^ END REPLACEMENT ^^^^ --- */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                        {/* Use initials or placeholder */}
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : '?'} 
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{user?.full_name || 'User'}</span>
                </div>
            </div>
        </header>
    );
}

// AppLayout remains the same structurally
function AppLayout() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-grow p-6 md:p-8 overflow-y-auto"> {/* Added overflow-y-auto */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default AppLayout;