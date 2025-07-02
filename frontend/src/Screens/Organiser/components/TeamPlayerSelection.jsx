import React from 'react';
import { UserPlus, Users, Crown } from 'lucide-react';
import UserSelect from '../../../Components/UserSelect';

const TeamPlayerSelection = ({ data, setData, nextStep, prevStep }) => {
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
        if (team === 1) {
            setData(prev => ({ ...prev, team1_captains: value ? [value] : [] }));
        } else {
            setData(prev => ({ ...prev, team2_captains: value ? [value] : [] }));
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Player Registration</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-blue-800 mb-2">Self-Registration System</h3>
                        <p className="text-blue-700 mb-4">
                            Players can now register themselves for matches! Once your match is created, players will be able to:
                        </p>
                        <ul className="list-disc pl-5 text-blue-700 mb-4 space-y-2">
                            <li>View your match on their dashboard</li>
                            <li>Submit registration requests with their player details</li>
                            <li>Specify their role, team preference, and special positions</li>
                        </ul>
                        <p className="text-blue-700 mb-2">
                            You'll be able to review and approve player registrations from the match management page after creation.
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
                        Players will be able to register for this team after match creation.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 mb-4">
                        Players will specify their role and position when registering.
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                        <div className="flex items-center mb-2">
                            <Crown className="h-4 w-4 text-amber-500 mr-2" />
                            <h4 className="font-semibold text-gray-700">Team Captain</h4>
                        </div>
                        <UserSelect 
                            role="player" 
                            value={data.team1_captains?.[0] || ''} 
                            onChange={(value) => handleCaptainChange(1, value)} 
                            placeholder="Select a player as captain" 
                            className="mb-2" 
                        />
                        <p className="text-xs text-gray-500">The captain will be able to approve player registrations for this team.</p>
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
                        Players will be able to register for this team after match creation.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 mb-4">
                        Players will specify their role and position when registering.
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                        <div className="flex items-center mb-2">
                            <Crown className="h-4 w-4 text-amber-500 mr-2" />
                            <h4 className="font-semibold text-gray-700">Team Captain</h4>
                        </div>
                        <UserSelect 
                            role="player" 
                            value={data.team2_captains?.[0] || ''} 
                            onChange={(value) => handleCaptainChange(2, value)} 
                            placeholder="Select a player as captain" 
                            className="mb-2" 
                        />
                        <p className="text-xs text-gray-500">The captain will be able to approve player registrations for this team.</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4 mb-8">
                <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                    <li>Create your match</li>
                    <li>Players submit registration requests for their preferred team</li>
                    <li>You review and approve/reject requests</li>
                    <li>Approved players are automatically added to the match</li>
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