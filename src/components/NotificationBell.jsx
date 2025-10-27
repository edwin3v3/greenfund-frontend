import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiLoader, FiX } from 'react-icons/fi';
import apiClient from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Single Notification Item Component ---
const NotificationItem = ({ notification, onMarkRead }) => {
    return (
        <div className={`px-4 py-3 border-b border-gray-100 ${!notification.is_read ? 'bg-green-50' : 'bg-white'} hover:bg-gray-50 transition duration-150`}>
            <p className="text-sm text-gray-700">{notification.message}</p>
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                </span>
                {!notification.is_read && (
                    <button
                        onClick={() => onMarkRead(notification.id)}
                        className="text-xs text-blue-500 hover:underline focus:outline-none"
                        title="Mark as read"
                    >
                        Mark Read
                    </button>
                )}
            </div>
            {/* Optional: Add Link to post if post_id exists */}
            {notification.post_id && (
                 <Link
                    to={`/app/forum/threads/${notification.post?.thread_id || ''}`} // Needs thread_id - ideally backend includes it
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                 >
                    View Post (Needs improvement)
                 </Link>
             )}
        </div>
    );
};


// --- Main Notification Bell & Dropdown Component ---
function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null); // Ref for detecting clicks outside

    const fetchNotifications = async (includeRead = false) => {
        setLoading(true);
        try {
            const [countRes, listRes] = await Promise.all([
                apiClient.get('/notifications/unread-count'),
                apiClient.get(`/notifications/?limit=10&include_read=${includeRead}`) // Fetch latest 10
            ]);
            setUnreadCount(countRes.data.unread_count);
            setNotifications(listRes.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Could not load notifications.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch on initial load
    useEffect(() => {
        fetchNotifications();
        
        // --- Optional: Poll for new notifications periodically ---
        // const intervalId = setInterval(() => {
        //     fetchNotifications(); // Re-fetch periodically
        // }, 60000); // e.g., every 60 seconds
        // return () => clearInterval(intervalId); // Cleanup on unmount
        // ----------------------------------------------------

    }, []);

    // Handle marking a single notification as read
    const handleMarkRead = async (id) => {
        try {
            await apiClient.post(`/notifications/${id}/mark-read`);
            // Update UI immediately
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1)); // Decrement count
            toast.success("Notification marked as read.");
        } catch (error) {
            toast.error("Failed to mark notification as read.");
        }
    };

    // Handle marking all as read
    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        try {
            await apiClient.post('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read.");
        } catch (error) {
            toast.error("Failed to mark all notifications as read.");
        }
    };

    // --- Click Outside Handler ---
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    // ----------------------------


    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    // Optionally fetch fresh data when opening
                    if (!isOpen) fetchNotifications(true); // Fetch read ones too when opened
                }}
                className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full"
                aria-label="Notifications"
            >
                <FiBell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex h-5 w-5 rounded-full bg-red-500 text-white text-xs items-center justify-center ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20 border"
                    >
                        {/* Dropdown Header */}
                        <div className="flex justify-between items-center px-4 py-3 border-b">
                            <h3 className="text-md font-semibold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-blue-500 hover:underline focus:outline-none"
                                >
                                    Mark all as read
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                               <FiX />
                            </button>
                        </div>

                        {/* Notification List */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading && (
                                <div className="flex justify-center items-center py-10">
                                    <FiLoader className="animate-spin text-primary" size={24} />
                                </div>
                            )}
                            {!loading && notifications.length === 0 && (
                                <p className="text-center text-gray-500 py-10 text-sm">No notifications yet.</p>
                            )}
                            {!loading && notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onMarkRead={handleMarkRead}
                                />
                            ))}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default NotificationBell;