import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Components, Icons } from '../../exports';
import api from '../../utils/api';

const { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  ProgressBar,
  LoadingSpinner
} = Components;

const { 
  FiBarChart2, 
  FiList, 
  FiUsers, 
  FiAward, 
  FiPlay, 
  FiPause,
  FiRefreshCw,
  FiArrowLeft
} = Icons;

const MatchDetails = () => {
    const { matchId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentAnimation, setCurrentAnimation] = useState(null);
    const [activeInning, setActiveInning] = useState(1);

    // Fetch match data from API
    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                setLoading(true);
                // Use the api utility to handle authentication and base URL
                const response = await api.get(`/api/matches/${matchId}`);
                const matchData = response.data;
                console.log('Fetched match data:', matchData);
                
                // Transform API data to match our component's expected format
                const transformedData = {
                    id: matchData._id,
                    team1: {
                        name: matchData.team1_name || 'Team 1',
                        logo: '🏏',
                        score: matchData.team1Score ? `${matchData.team1Score}/${matchData.team1Wickets || 0}` : '0/0',
                        overs: matchData.team1Overs || '0.0',
                        players: matchData.team1_players || [],
                        bench: [],
                        battingStats: [],
                        bowlingStats: [],
                        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 },
                        fallOfWickets: []
                    },
                    team2: {
                        name: matchData.team2_name || 'Team 2',
                        logo: '🏏',
                        score: matchData.team2Score ? `${matchData.team2Score}/${matchData.team2Wickets || 0}` : '0/0',
                        overs: matchData.team2Overs || '0.0',
                        players: matchData.team2_players || [],
                        bench: [],
                        battingStats: [],
                        bowlingStats: [],
                        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 },
                        fallOfWickets: []
                    },
                    venue: matchData.venue || 'Unknown',
                    date: matchData.date || new Date().toLocaleDateString(),
                    time: matchData.time || 'TBD',
                    toss: {
                        winner: matchData.toss_winner || 'Unknown',
                        decision: matchData.toss_decision || 'bat'
                    },
                    status: matchData.status || 'Upcoming',
                    currentBatsmen: [],
                    currentBowlers: [],
                    currentOver: [],
                    previousOvers: [],
                    partnerships: [],
                    commentary: [],
                    currentRunRate: 0,
                    requiredRunRate: 0
                };
                
                setMatchData(transformedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching match data:', error);
                // Fallback to mock data if API fails
                const mockMatchData = {
                    id: matchId,
                    team1: {
                        name: 'Team 1',
                        logo: '🏏',
                        score: '0/0',
                        overs: '0.0',
                        players: [],
                        bench: [],
                        battingStats: [],
                        bowlingStats: [],
                        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 },
                        fallOfWickets: []
                    },
                    team2: {
                        name: 'Team 2',
                        logo: '🏏',
                        score: '0/0',
                        overs: '0.0',
                        players: [],
                        bench: [],
                        battingStats: [],
                        bowlingStats: [],
                        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 },
                        fallOfWickets: []
                    },
                    venue: 'Unknown',
                    date: new Date().toISOString().split('T')[0],
                    toss: {
                        winner: 'Unknown',
                        decision: 'bat'
                    },
                    status: 'Upcoming',
                    currentBatsmen: [],
                    currentBowlers: [],
                    currentOver: [],
                    previousOvers: [],
                    partnerships: [],
                    commentary: [],
                    currentRunRate: 0,
                    requiredRunRate: 0
                };
                
                setMatchData(mockMatchData);
                setLoading(false);
            }
        };
        
        fetchMatchData();
        
        // Simulate ball-by-ball animations
        const animations = ['4', '6', 'W', '1', '2', '0'];
        const randomAnimation = () => {
            const randomIndex = Math.floor(Math.random() * animations.length);
            setCurrentAnimation(animations[randomIndex]);
            setTimeout(() => setCurrentAnimation(null), 2000);
        };

        // Show animation every 10 seconds
        const animationInterval = setInterval(randomAnimation, 10000);
        
        // Clean up on unmount
        return () => {
            clearInterval(animationInterval);
        };
    }, [matchId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16638A]"></div>
            </div>
        );
    }

    // Function to calculate total extras
    const calculateTotalExtras = (extras) => {
        return extras.wides + extras.noBalls + extras.byes + extras.legByes + extras.penalties;
    };

    return (
        <div className="min-h-screen bg-[#E3F5FF]">
            {/* Match Status Section */}
            <section className="bg-white py-6 px-4 border-b border-gray-200">
                <div className="container text-black mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Team 1 */}
                        <div className="flex flex-col text-black items-center text-center flex-1">
                            <div className="text-4xl mb-2">{matchData.team1.logo}</div>
                            <div className="text-sm font-medium text-black mb-1">{matchData.team1.name}</div>
                            <div className="text-2xl font-bold text-gray-900">{matchData.team1.score}</div>
                            <div className="text-sm text-gray-800">({matchData.team1.overs} overs)</div>
                        </div>

                        {/* Center Animation & Status */}
                        <div className="flex flex-col items-center mx-8 flex-1">
                            {/* Ball Animation */}
                            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                                {currentAnimation ? (
                                    <div className="animate-bounce text-3xl font-bold">
                                        {currentAnimation === '4' && <span className="text-green-500">4</span>}
                                        {currentAnimation === '6' && <span className="text-purple-500">6</span>}
                                        {currentAnimation === 'W' && <span className="text-red-500">W</span>}
                                        {currentAnimation === '1' && <span className="text-blue-500">1</span>}
                                        {currentAnimation === '2' && <span className="text-blue-500">2</span>}
                                        {currentAnimation === '0' && <span className="text-gray-500">0</span>}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm">Live</div>
                                )}
                            </div>

                            {/* Match Status */}
                            <div className="text-center">
                                <div className="text-lg font-bold text-red-600 mb-1">{matchData.status}</div>
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">CRR:</span> {matchData.currentRunRate} |
                                    <span className="font-medium ml-2">RRR:</span> {matchData.requiredRunRate}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">{matchData.venue}</div>
                            </div>
                        </div>

                        {/* Team 2 */}
                        <div className="flex flex-col items-center text-center flex-1">
                            <div className="text-4xl mb-2">{matchData.team2.logo}</div>
                            <div className="text-sm font-medium text-gray-600 mb-1">{matchData.team2.name}</div>
                            <div className="text-2xl font-bold text-gray-900">{matchData.team2.score}</div>
                            <div className="text-sm text-gray-600">({matchData.team2.overs} overs)</div>
                        </div>
                    </div>

                    {/* Toss Info */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            {matchData.toss.winner} won the toss and elected to {matchData.toss.decision} first
                        </p>
                    </div>
                </div>
            </section>

            {/* Updated Tabs Section with better text colors */}
            <section className="py-4 px-4">
                <div className="container mx-auto">
                    <div className="flex gap-2 overflow-x-auto border-b border-gray-200 mb-4 px-3 py-3 bg-white rounded-t-lg">
                        <Button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'overview'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </Button>
                        <Button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'scorecard'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('scorecard')}
                        >
                            Scorecard
                        </Button>
                        <Button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'commentary'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('commentary')}
                        >
                            Commentary
                        </Button>
                        <Button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'squads'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('squads')}
                        >
                            Squads
                        </Button>
                        <Button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'stats'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Stats
                        </Button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <div className="text-center py-8">
                                    <h2 className="text-xl font-bold mb-4">Match Details</h2>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Match:</span> {matchData.team1.name} vs {matchData.team2.name}</p>
                                        <p><span className="font-medium">Venue:</span> {matchData.venue}</p>
                                        <p><span className="font-medium">Date:</span> {matchData.date}</p>
                                        <p><span className="font-medium">Time:</span> {matchData.time}</p>
                                        <p><span className="font-medium">Status:</span> {matchData.status}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Scorecard Tab */}
                        {activeTab === 'scorecard' && (
                            <div>
                                <div className="text-center py-8">
                                    <h2 className="text-xl font-bold mb-4">Team Lineups</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-semibold mb-2">{matchData.team1.name}</h3>
                                            <ul className="list-disc list-inside">
                                                {matchData.team1.players && matchData.team1.players.map((player, index) => (
                                                    <li key={index}>{player.name} {player.isCaptain ? '(C)' : ''}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">{matchData.team2.name}</h3>
                                            <ul className="list-disc list-inside">
                                                {matchData.team2.players && matchData.team2.players.map((player, index) => (
                                                    <li key={index}>{player.name} {player.isCaptain ? '(C)' : ''}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Commentary Tab */}
                        {activeTab === 'commentary' && (
                            <div className="text-center py-8">
                                <h2 className="text-xl font-bold mb-4">Live Commentary</h2>
                                <p className="text-gray-500">Live commentary will be available during the match.</p>
                            </div>
                        )}
                        
                        {/* Squads Tab */}
                        {activeTab === 'squads' && (
                            <div className="text-center py-8">
                                <h2 className="text-xl font-bold mb-4">Team Squads</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold mb-2">{matchData.team1.name}</h3>
                                        <ul className="list-disc list-inside">
                                            {matchData.team1.players && matchData.team1.players.map((player, index) => (
                                                <li key={index}>{player.name} - {player.role}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">{matchData.team2.name}</h3>
                                        <ul className="list-disc list-inside">
                                            {matchData.team2.players && matchData.team2.players.map((player, index) => (
                                                <li key={index}>{player.name} - {player.role}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Stats Tab */}
                        {activeTab === 'stats' && (
                            <div className="text-center py-8">
                                <h2 className="text-xl font-bold mb-4">Match Statistics</h2>
                                <p className="text-gray-500">Match statistics will be available after the match starts.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MatchDetails;