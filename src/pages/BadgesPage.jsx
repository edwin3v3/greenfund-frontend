import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiLoader } from 'react-icons/fi';
import apiClient from '../services/api'; // Check path

function BadgeCard({ userBadge }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-surface p-5 rounded-lg shadow-md flex items-center gap-4 border-l-4 border-yellow-400"
        >
            <div className="flex-shrink-0">
                <span className="text-4xl text-yellow-500 p-3 bg-yellow-50 rounded-full inline-block">
                    {/* We can use the icon_name from the backend later if we map them */}
                    <FiAward />
                </span>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-text-primary">{userBadge.badge.name}</h3>
                <p className="text-sm text-text-secondary">{userBadge.badge.description}</p>
                <p className="text-xs text-text-secondary mt-1">
                    Earned on: {new Date(userBadge.earned_at).toLocaleDateString()}
                </p>
            </div>
        </motion.div>
    );
};


function BadgesPage() {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBadges = async () => {
            setLoading(true);
            try {
                // Fetch the list of *earned* badges
                const response = await apiClient.get('/badges/me');
                setBadges(response.data);
            } catch (err) {
                console.error("Failed to fetch badges:", err);
                setError('Could not load your badges at this time.');
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-text-primary mb-6">My Badges</h1>

            {loading && (
                <div className="flex justify-center items-center h-48">
                    <FiLoader className="animate-spin text-primary" size={40} />
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {badges.length === 0 ? (
                        <div className="bg-surface p-6 rounded-lg shadow text-center">
                            <h2 className="text-xl font-semibold text-text-primary">No Badges Yet!</h2>
                            <p className="text-text-secondary mt-2">
                                Start adding farms, analyzing soil, and participating in the community to earn badges.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {badges.map(userBadge => (
                                <BadgeCard key={userBadge.badge.id} userBadge={userBadge} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
}

export default BadgesPage;