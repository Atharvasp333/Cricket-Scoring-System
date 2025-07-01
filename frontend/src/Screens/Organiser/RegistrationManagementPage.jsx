import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronLeft, Filter, RefreshCw, UserCheck, UserX } from 'lucide-react';
import api from '../../utils/api';
import { useSocket } from '../../contexts/SocketContext';

const RegistrationManagementPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  
  // State
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [activeTab, setActiveTab] = useState('tournaments'); // tournaments, matches
  
  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);
  
  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    
    socket.on('registrationAdded', (newRegistration) => {
      setRegistrations(prev => [...prev, newRegistration]);
    });
    
    socket.on('registrationUpdated', (updatedRegistration) => {
      setRegistrations(prev => {
        const filtered = prev.filter(r => r._id !== updatedRegistration._id);
        return [...filtered, updatedRegistration];
      });
    });
    
    socket.on('registrationRemoved', (id) => {
      setRegistrations(prev => prev.filter(r => r._id !== id));
    });
    
    return () => {
      socket.off('registrationAdded');
      socket.off('registrationUpdated');
      socket.off('registrationRemoved');
    };
  }, [socket]);
  
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/registrations');
      setRegistrations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load registrations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/registrations/${id}/status`, { status });
      // The socket will handle updating the UI
    } catch (err) {
      console.error('Error updating registration status:', err);
      setError('Failed to update registration status. Please try again.');
    }
  };
  
  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    if (filter !== 'all' && reg.status !== filter) return false;
    if (activeTab === 'tournaments' && reg.registrationType !== 'tournament') return false;
    if (activeTab === 'matches' && reg.registrationType !== 'match') return false;
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 md:mb-0"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Player Registration Management</h1>
            <p className="text-gray-600 mt-2">Review and manage player registration requests</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button 
              onClick={fetchRegistrations} 
              className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                {filter === 'all' ? 'All Status' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  <button 
                    onClick={() => setFilter('all')} 
                    className={`block px-4 py-2 text-sm w-full text-left ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    All Status
                  </button>
                  <button 
                    onClick={() => setFilter('pending')} 
                    className={`block px-4 py-2 text-sm w-full text-left ${filter === 'pending' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => setFilter('approved')} 
                    className={`block px-4 py-2 text-sm w-full text-left ${filter === 'approved' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    Approved
                  </button>
                  <button 
                    onClick={() => setFilter('rejected')} 
                    className={`block px-4 py-2 text-sm w-full text-left ${filter === 'rejected' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'tournaments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tournament Registrations
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'matches' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Match Registrations
          </button>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              {filter === 'pending' ? (
                <UserCheck className="h-16 w-16 text-gray-400" />
              ) : filter === 'rejected' ? (
                <UserX className="h-16 w-16 text-gray-400" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">?</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No {filter !== 'all' ? filter : ''} registrations found
            </h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? 'There are no pending registration requests to review.' 
                : filter === 'approved' 
                ? 'You haven\'t approved any registration requests yet.' 
                : filter === 'rejected' 
                ? 'You haven\'t rejected any registration requests yet.' 
                : 'There are no registration requests to display.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'tournaments' ? 'Tournament' : 'Match'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {registration.playerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{registration.playerName}</div>
                          <div className="text-sm text-gray-500">{registration.team || 'No team specified'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activeTab === 'tournaments' 
                          ? registration.tournamentName || 'Tournament' 
                          : registration.matchName || 'Match'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.role}</div>
                      <div className="text-xs text-gray-500">
                        {registration.isCaptain && 'Captain'}
                        {registration.isCaptain && registration.isWicketKeeper && ' & '}
                        {registration.isWicketKeeper && 'Wicket-Keeper'}
                        {!registration.isCaptain && !registration.isWicketKeeper && 'Regular Player'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${registration.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          registration.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {registration.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(registration._id, 'approved')}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1.5 rounded-full transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {registration.status === 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                      {registration.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(registration._id, 'approved')}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1.5 rounded-full transition-colors"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationManagementPage;