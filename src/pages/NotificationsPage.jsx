import React from 'react';
import Layout from '../components/AppLayout'; // Correct path relative to src/pages/
import { FiInfo } from 'react-icons/fi';

function NotificationsPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-primary mb-6">Notifications</h1>

      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center text-center h-48">
        <div className="space-y-3">
           <FiInfo className="mx-auto text-gray-400" size={30} />
           <p className="text-text-secondary text-lg">
             No new notifications. <br/> This feature will be available in a future update.
           </p>
        </div>
      </div>
    </Layout>
  );
}

export default NotificationsPage;