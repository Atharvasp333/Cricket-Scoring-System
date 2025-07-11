import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Player Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser?.displayName || 'Player'}!</h2>
        <p className="text-gray-600">This is your player dashboard. Here you can view your matches, statistics, and more.</p>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              View Upcoming Matches
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              View Statistics
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
