import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Crown } from 'lucide-react';
import UserSelect from '../../../Components/UserSelect';
import api from '../../../utils/api';
import { Components } from '../../../exports';

const { LoadingSpinner } = Components;

const TeamPlayerSelection = ({ data, setData, nextStep, prevStep }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [players, setPlayers] = useState([]);

    // Fetch players with 'player' role from the database
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/users/role/player');
                if (response.data && response.data.success) {
                    // Transform the data to match the expected format for UserSelect
                    const formattedPlayers = response.data.data.map(player => ({
                        id: player._id,
                        name: player.displayName,
                        email: player.email,
                        firebaseUID: player.firebaseUID
                    }));
                    setPlayers(formattedPlayers);
                } else {
                    setPlayers([]);
                    console.warn('Unexpected API response format:', response.data);
                }
            } catch (err) {
                console.error('Error fetching players:', err);
                setError('Failed to load players. Using sample data instead.');
                // Fallback to sample data
                setPlayers([
                    { id: '662e00000000000000000001', name: 'Player 1' },
                    { id: '662e00000000000000000002', name: 'Player 2' },
                    { id: '662e00000000000000000003', name: 'Player 3' },
                    { id: '662e00000000000000000004', name: 'Player 4' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    // Initialize empty player arrays and captain arrays if they don't exist
    const handleContinue = () => {
        if (!data.team1_players) {
            setData(prev => ({ ...prev, team1_players: [] }));
        }
        if (!data.team2_players) {
            setData(prev => ({ ...prev, team2_players: [] }));
        }
        if (!data.team1_captains) {
            setData(prev => ({ ...prev, team1_captains: [] }));
        }
        if (!data.team2_captains) {
            setData(prev => ({ ...prev, team2_captains: [] }));
        }
        nextStep();
    };

    const handleCaptainChange = (team, value) => {
        // Extract the captain object from the array if it's an array
        const captainObject = Array.isArray(value) ? value[0] : value;
        
        if (team === 1) {
            setData(prev => {
                // Add captain to team1_players if not already there
                const captainAlreadyInPlayers = prev.team1_players?.some(p => 
                    (p.userId === captainObject?.id));
                
                let updatedPlayers = [...(prev.team1_players || [])];
                if (captainObject && !captainAlreadyInPlayers) {
                    updatedPlayers.push({
                        userId: captainObject.id,
                        name: captainObject.name,
                        role: 'Batsman',
                        isCaptain: true,
                        isWicketKeeper: false,
                        status: 'approved',
                        approvedBy: 'organiser'
                    });
                }
                
                return { 
                    ...prev, 
                    team1_captains: captainObject ? [captainObject] : [], // Store as a simple array
                    team1_players: updatedPlayers
                };
            });
        } else {
            setData(prev => {
                // Add captain to team2_players if not already there
                const captainAlreadyInPlayers = prev.team2_players?.some(p => 
                    (p.userId === captainObject?.id));
                
                let updatedPlayers = [...(prev.team2_players || [])];
                if (captainObject && !captainAlreadyInPlayers) {
                    updatedPlayers.push({
                        userId: captainObject.id,
                        name: captainObject.name,
                        role: 'Batsman',
                        isCaptain: true,
                        isWicketKeeper: false,
                        status: 'approved',
                        approvedBy: 'organiser'
                    });
                }
                
                return { 
                    ...prev, 
                    team2_captains: captainObject ? [captainObject] : [], // Store as a simple array
                    team2_players: updatedPlayers
                };
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Player Registration</h2>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Team Captains Selection</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-blue-800 mb-2">Captain Selection System</h3>
                        <p className="text-blue-700 mb-4">
                            Select captains for each team from registered players in the system. Captains will:
                        </p>
                        <ul className="list-disc pl-5 text-blue-700 mb-4 space-y-2">
                            <li>Be notified about their selection on their dashboard</li>
                            <li>Have the ability to approve or reject player registration requests</li>
                            <li>Manage their team during matches</li>
                        </ul>
                        <p className="text-blue-700 mb-2">
                            Players will be able to register for teams after match creation, and captains (or you) can approve their requests.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                            <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{data.team1_name || 'Team 1'}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Select a captain for {data.team1_name || 'Team 1'} from registered players.
                    </p>
                    
                    <div className="border-t pt-4 mt-4">
                        <div className="flex items-center mb-2">
                            <Crown className="h-4 w-4 text-amber-500 mr-2" />
                            <h4 className="font-semibold text-gray-700">Team Captain</h4>
                        </div>
                        <UserSelect 
                            users={players}
                            role="player" 
                            value={data.team1_captains?.[0] || ''} 
                            selectedUsers={data.team1_captains || []}
                            onSelect={(value) => handleCaptainChange(1, value)} 
                            placeholder="Select a player as captain" 
                            className="mb-2" 
                        />
                        <p className="text-xs text-gray-500">The captain will be notified and will be able to approve player registrations for this team.</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                            <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{data.team2_name || 'Team 2'}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Select a captain for {data.team2_name || 'Team 2'} from registered players.
                    </p>
                    
                    <div className="border-t pt-4 mt-4">
                        <div className="flex items-center mb-2">
                            <Crown className="h-4 w-4 text-amber-500 mr-2" />
                            <h4 className="font-semibold text-gray-700">Team Captain</h4>
                        </div>
                        <UserSelect 
                            users={players}
                            role="player" 
                            value={data.team2_captains?.[0] || ''} 
                            selectedUsers={data.team2_captains || []}
                            onSelect={(value) => handleCaptainChange(2, value)} 
                            placeholder="Select a player as captain" 
                            className="mb-2" 
                        />
                        <p className="text-xs text-gray-500">The captain will be notified and will be able to approve player registrations for this team.</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4 mb-8">
                <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                    <li>Select captains for both teams</li>
                    <li>Create your match</li>
                    <li>Captains are notified of their selection</li>
                    <li>Players can register for teams</li>
                    <li>Captains and organizers can approve/reject player requests</li>
                </ol>
            </div>
            
            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default TeamPlayerSelection;