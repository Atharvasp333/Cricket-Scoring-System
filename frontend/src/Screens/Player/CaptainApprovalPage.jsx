import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { Components, Icons } from '../../exports';

const { 
  Card, 
  Button, 
  Badge, 
  Tabs, 
  Tab, 
  LoadingSpinner,
  Modal
} = Components;

const { 
  FiCheck, 
  FiX, 
  FiChevronLeft, 
  FiFilter, 
  FiRefreshCw, 
  FiUserCheck, 
  FiUserX,
  FiClock
} = Icons;

const CaptainApprovalPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { currentUser } = useAuth();
  
  // State
  const [registrations, setRegistrations] = useState([]);
  const [captainTeams, setCaptainTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [activeTab, setActiveTab] = useState('matches'); // tournaments, matches
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Fetch teams where the current user is a captain
  useEffect(() => {
    const fetchCaptainTeams = async () => {
      try {
        setLoading(true);
        // Fetch tournaments where user is a captain
        const tournamentsResponse = await api.get('/api/tournaments');
        const tournaments = tournamentsResponse.data;
        
        // Fetch matches where user is a captain
        const matchesResponse = await api.get('/api/matches');
        const matches = matchesResponse.data;
        
        // Extract teams where user is a captain
        const tournamentTeams = [];
        tournaments.forEach(tournament => {
          tournament.teams.forEach(team => {
            if (team.captains && team.captains.some(captain => 
              (typeof captain === 'object' && captain.firebaseUID === currentUser.uid) || 
              captain === currentUser.uid
            )) {
              tournamentTeams.push({
                type: 'tournament',
                id: tournament._id,
                name: tournament.name,
                teamName: team.name
              });
            }
          });
        });
        
        const matchTeams = [];
        matches.forEach(match => {
          console.log('Checking match for captain:', match.match_name, match);
          
          // Check team1_captains with support for nested arrays
          let isTeam1Captain = false;
          if (Array.isArray(match.team1_captains)) {
            for (const captainEntry of match.team1_captains) {
              if (Array.isArray(captainEntry)) {
                // Handle nested array structure
                for (const captain of captainEntry) {
                  if (typeof captain === 'object') {
                    if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                      isTeam1Captain = true;
                      break;
                    }
                  } else if (currentUser && captain === currentUser.uid) {
                    isTeam1Captain = true;
                    break;
                  }
                }
              } else if (typeof captainEntry === 'object') {
                if (captainEntry && captainEntry.firebaseUID && currentUser && captainEntry.firebaseUID === currentUser.uid) {
                  isTeam1Captain = true;
                  break;
                }
              } else if (currentUser && captainEntry === currentUser.uid) {
                isTeam1Captain = true;
                break;
              }
              
              if (isTeam1Captain) break;
            }
          }
          
          if (isTeam1Captain) {
            console.log('User is a captain for team1:', match.team1_name);
            matchTeams.push({
              type: 'match',
              id: match._id,
              name: match.match_name,
              teamName: match.team1_name
            });
          }
          
          // Check team2_captains with support for nested arrays
          let isTeam2Captain = false;
          if (Array.isArray(match.team2_captains)) {
            for (const captainEntry of match.team2_captains) {
              if (Array.isArray(captainEntry)) {
                // Handle nested array structure
                for (const captain of captainEntry) {
                  if (typeof captain === 'object') {
                    if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                      isTeam2Captain = true;
                      break;
                    }
                  } else if (currentUser && captain === currentUser.uid) {
                    isTeam2Captain = true;
                    break;
                  }
                }
              } else if (typeof captainEntry === 'object') {
                if (captainEntry && captainEntry.firebaseUID && currentUser && captainEntry.firebaseUID === currentUser.uid) {
                  isTeam2Captain = true;
                  break;
                }
              } else if (currentUser && captainEntry === currentUser.uid) {
                isTeam2Captain = true;
                break;
              }
              
              if (isTeam2Captain) break;
            }
          }
          
          if (isTeam2Captain) {
            console.log('User is a captain for team2:', match.team2_name);
            matchTeams.push({
              type: 'match',
              id: match._id,
              name: match.match_name,
              teamName: match.team2_name
            });
          }
        });
        
        setCaptainTeams([...tournamentTeams, ...matchTeams]);
        
        // If user is a captain, fetch registrations
        if (tournamentTeams.length > 0 || matchTeams.length > 0) {
          fetchRegistrations();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching captain teams:', err);
        setError('Failed to load teams. Please try again.');
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchCaptainTeams();
    }
  }, [currentUser]);
  
  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    
    socket.on('registrationAdded', (newRegistration) => {
      // Check if registration is for one of the captain's teams
      const isForCaptainTeam = captainTeams.some(team => {
        if (team.type === 'tournament' && newRegistration.tournamentId === team.id) {
          return newRegistration.team === team.teamName;
        }
        if (team.type === 'match' && newRegistration.matchId === team.id) {
          return newRegistration.team === team.teamName;
        }
        return false;
      });
      
      if (isForCaptainTeam) {
        setRegistrations(prev => [...prev, newRegistration]);
      }
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
  }, [socket, captainTeams]);
  
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/registrations');
      
      // Filter registrations for teams where the user is a captain
      const captainRegistrations = response.data.filter(reg => {
        return captainTeams.some(team => {
          if (team.type === 'tournament' && reg.tournamentId === team.id) {
            return reg.team === team.teamName;
          }
          if (team.type === 'match' && reg.matchId === team.id) {
            return reg.team === team.teamName;
          }
          return false;
        });
      });
      
      setRegistrations(captainRegistrations);
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
      setActionLoading(true);
      await api.put(`/api/registrations/${id}/status`, { 
        status, 
        approverRole: 'captain' // Captain is making the approval
      });
      
      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg._id === id ? { ...reg, status, approvedBy: 'captain' } : reg
        )
      );
      
      // Close modal if open
      if (showDetailsModal) {
        setShowDetailsModal(false);
      }
      
      // Success message
      alert(`Registration ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      console.error('Error updating registration status:', err);
      alert(`Failed to ${status} registration. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    if (filter !== 'all' && reg.status !== filter) return false;
    if (activeTab === 'tournaments' && reg.registrationType !== 'tournament') return false;
    if (activeTab === 'matches' && reg.registrationType !== 'match') return false;
    return true;
  });
  
  // View registration details
  const viewRegistrationDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };
  
  // Get event name from registration
  const getEventName = (registration) => {
    const team = captainTeams.find(t => {
      if (registration.registrationType === 'tournament') {
        return t.type === 'tournament' && t.id === registration.tournamentId;
      } else {
        return t.type === 'match' && t.id === registration.matchId;
      }
    });
    
    return team ? team.name : 'Unknown Event';
  };
  
  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge color="yellow" icon={<FiClock />}>Pending</Badge>;
      case 'approved':
        return <Badge color="green" icon={<FiCheck />}>Approved</Badge>;
      case 'rejected':
        return <Badge color="red" icon={<FiX />}>Rejected</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <FiUserX size={48} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No registration requests</h3>
      <p className="text-gray-500 mb-6">
        {filter !== 'all' 
          ? `No ${filter} registration requests found.` 
          : 'There are no player registration requests for your teams yet.'}
      </p>
      <Button onClick={fetchRegistrations} variant="outline" className="mx-auto">
        <FiRefreshCw className="mr-2" />
        Refresh
      </Button>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading captain dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-lg w-full">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <FiRefreshCw className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }
  
  if (captainTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 max-w-lg w-full">
          <p className="font-bold">Not a Captain</p>
          <p>You are not currently assigned as a captain for any team.</p>
        </div>
        <Button onClick={() => navigate('/player-home')} variant="outline">
          <FiChevronLeft className="mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Captain Approval Dashboard</h1>
            <p className="text-gray-600">Manage player registration requests for your teams</p>
          </div>
          <Button onClick={() => navigate('/player-home')} variant="outline">
            <FiChevronLeft className="mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {captainTeams.map((team, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-600">Team: {team.teamName}</p>
                <Badge color={team.type === 'match' ? 'blue' : 'purple'} className="mt-2">
                  {team.type === 'match' ? 'Match' : 'Tournament'}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h2 className="text-lg font-semibold">Registration Requests</h2>
              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Button onClick={fetchRegistrations} variant="outline" size="sm">
                  <FiRefreshCw />
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs>
            <Tab 
              label="Matches" 
              active={activeTab === 'matches'} 
              onClick={() => setActiveTab('matches')}
              badge={registrations.filter(r => r.registrationType === 'match').length}
            />
            <Tab 
              label="Tournaments" 
              active={activeTab === 'tournaments'} 
              onClick={() => setActiveTab('tournaments')}
              badge={registrations.filter(r => r.registrationType === 'tournament').length}
            />
          </Tabs>
          
          {filteredRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{registration.playerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.team}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.role}</div>
                        {registration.isWicketKeeper && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            WK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getEventName(registration)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => viewRegistrationDetails(registration)} 
                            variant="outline" 
                            size="sm"
                          >
                            View
                          </Button>
                          {registration.status === 'pending' && (
                            <>
                              <Button 
                                onClick={() => handleStatusUpdate(registration._id, 'approved')} 
                                color="green" 
                                size="sm"
                              >
                                <FiCheck className="mr-1" />
                                Approve
                              </Button>
                              <Button 
                                onClick={() => handleStatusUpdate(registration._id, 'rejected')} 
                                color="red" 
                                size="sm"
                              >
                                <FiX className="mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
      
      {/* Registration Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Registration Details"
        >
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">{getEventName(selectedRegistration)}</h3>
              {renderStatusBadge(selectedRegistration.status)}
              {selectedRegistration.approvedBy && (
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRegistration.status === 'approved' ? 'Approved' : 'Rejected'} by: {selectedRegistration.approvedBy}
                </p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Player Information</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.playerName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Team</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.team}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.role}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Wicket Keeper</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.isWicketKeeper ? 'Yes' : 'No'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRegistration.registrationDate).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
            
            {selectedRegistration.status === 'pending' && (
              <div className="border-t pt-4 flex justify-end space-x-3">
                <Button
                  onClick={() => handleStatusUpdate(selectedRegistration._id, 'rejected')}
                  color="red"
                  disabled={actionLoading}
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : 'Reject'}
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedRegistration._id, 'approved')}
                  color="green"
                  disabled={actionLoading}
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : 'Approve'}
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CaptainApprovalPage;