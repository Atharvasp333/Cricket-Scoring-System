import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import BasicMatchInfo from './components/BasicMatchInfo';
import TeamPlayerSelection from './components/TeamPlayerSelection';
import MatchRules from './components/MatchRules';
import ScorerAccess from './components/ScorerAccess';
import Confirmation from './components/Confirmation';

const MatchDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [step, setStep] = useState(1);
    const [matchData, setMatchData] = useState({
        match_name: '',
        match_type: '',
        venue: '',
        dateTime: '',
        team1_name: '',
        team2_name: '',
        team1_players: [],
        team2_players: [],
        total_overs: 20,
        powerplay_overs: 6,
        drs_enabled: false,
        scorers: [],
    });

    useEffect(() => {
        const fetchMatch = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/matches/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch match details');
                }
                const data = await response.json();
                setMatch(data);
                
                // Format the data for the form
                setMatchData({
                    match_name: data.match_name,
                    match_type: data.match_type,
                    venue: data.venue,
                    dateTime: data.date && data.time ? 
                        `${data.date}T${data.time.padEnd(5, ':00').substring(0, 5)}` : '',
                    team1_name: data.team1_name || data.team1?.name || data.teams?.[0] || '',
                    team2_name: data.team2_name || data.team2?.name || data.teams?.[1] || '',
                    team1_players: data.team1_players || data.team1?.players || [],
                    team2_players: data.team2_players || data.team2?.players || [],
                    total_overs: data.total_overs || 20,
                    powerplay_overs: data.powerplay_overs || 6,
                    drs_enabled: data.drs_enabled || false,
                    scorers: data.scorers || [],
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching match:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setStep(1);
    };

    const submitMatch = async () => {
        try {
            // Format the data for submission
            const payload = {
                match_name: matchData.match_name,
                match_type: matchData.match_type,
                venue: matchData.venue,
                team1_name: matchData.team1_name,
                team2_name: matchData.team2_name,
                team1_players: matchData.team1_players,
                team2_players: matchData.team2_players,
                total_overs: matchData.total_overs,
                powerplay_overs: matchData.powerplay_overs,
                drs_enabled: matchData.drs_enabled,
                scorers: matchData.scorers,
                status: match?.status || 'Upcoming',
            };
            
            // Handle date and time
            if (matchData.dateTime) {
                const dateTimeObj = new Date(matchData.dateTime);
                payload.date = dateTimeObj.toISOString().split('T')[0];
                payload.time = dateTimeObj.toTimeString().split(' ')[0].substring(0, 5);
            }
            
            // Set teams array for backward compatibility
            payload.teams = [payload.team1_name, payload.team2_name];

            const response = await fetch(`/api/matches/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update match');
            }

            const updatedMatch = await response.json();
            setMatch(updatedMatch);
            setIsEditing(false);
            setStep(1);
            alert('Match updated successfully!');
        } catch (err) {
            alert('Error updating match: ' + err.message);
            console.error('Update error:', err);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicMatchInfo data={matchData} setData={setMatchData} nextStep={nextStep} />;
            case 2:
                return <TeamPlayerSelection data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <MatchRules data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} />;
            case 4:
                return <ScorerAccess data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} />;
            case 5:
                return <Confirmation data={matchData} prevStep={prevStep} submit={submitMatch} />;
            default:
                return <div>Step not found</div>;
        }
    };

    const renderMatchDetails = () => {
        if (!match) return null;

        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                {/* Header with Edit Button */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => navigate('/organiser-homepage')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center px-2 py-1 rounded hover:bg-blue-50 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <button 
                            onClick={handleEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Edit Match
                        </button>
                    </div>
                </div>

                {/* Teams Section - Compact */}
                <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                            <div className="bg-white rounded border border-gray-200 p-3 min-w-[120px]">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                    {match.team1_name || match.team1?.name || match.teams?.[0] || 'Team 1'}
                                </h3>
                                {matchData.team1_players?.length > 0 && (
                                    <p className="text-xs text-gray-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                                        {matchData.team1_players.length} players
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow">
                                <span className="text-sm font-bold">VS</span>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-white rounded border border-gray-200 p-3 min-w-[120px]">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                    {match.team2_name || match.team2?.name || match.teams?.[1] || 'Team 2'}
                                </h3>
                                {matchData.team2_players?.length > 0 && (
                                    <p className="text-xs text-gray-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                                        {matchData.team2_players.length} players
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Details Section - Compact */}
                <div className="px-4 py-4 border-b border-gray-200">
                    <div className="bg-white rounded border border-gray-200 p-3">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                            Match Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Match Type</p>
                                <p className="text-sm font-semibold text-gray-800">{match.match_type}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Date</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {match.date ? new Date(match.date).toLocaleDateString() : 'Not set'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Time</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {match.time ? match.time : 
                                     match.date ? new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                                     'Not set'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Venue</p>
                                <p className="text-sm font-semibold text-gray-800">{match.venue || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="bg-gray-50 rounded p-2 border border-gray-100 inline-block">
                                <p className="text-xs font-medium text-gray-600">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                    match.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                    match.status === 'Live' ? 'bg-red-100 text-red-800 border border-red-200' : 
                                    'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                    {match.status || 'Upcoming'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Rules Section - Compact */}
                <div className="px-4 py-4 border-b border-gray-200">
                    <div className="bg-white rounded border border-gray-200 p-3">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                            Match Rules
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-3 border border-blue-200 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="bg-blue-600 rounded-full p-1 mr-2">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-medium text-blue-700">Total Overs</p>
                                </div>
                                <p className="text-lg font-bold text-blue-900">{match.total_overs || 'Not set'}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-3 border border-green-200 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="bg-green-600 rounded-full p-1 mr-2">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-medium text-green-700">Powerplay Overs</p>
                                </div>
                                <p className="text-lg font-bold text-green-900">{match.powerplay_overs || 'Not set'}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded p-3 border border-purple-200 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="bg-purple-600 rounded-full p-1 mr-2">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-medium text-purple-700">DRS System</p>
                                </div>
                                <p className="text-lg font-bold text-purple-900">
                                    {match.drs_enabled ? 'Enabled' : 'Disabled'}
                                </p>
                                {match.drs_enabled && (
                                    <p className="text-xs text-purple-600 mt-0.5">
                                        {match.drs_reviews || '2'} reviews per team
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scorers Section - Compact */}
                {match.scorers && match.scorers.length > 0 && (
                    <div className="px-4 py-4">
                        <div className="bg-white rounded border border-gray-200 p-3">
                            <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                                Match Scorers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {match.scorers.map((scorer, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded p-2 border border-gray-200 hover:shadow transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                                <span className="text-white font-semibold text-xs">
                                                    {typeof scorer === 'string' ? scorer.charAt(0).toUpperCase() : 
                                                     scorer.name ? scorer.name.charAt(0).toUpperCase() : 'S'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {typeof scorer === 'string' ? scorer : scorer.name || 'Scorer'}
                                                </p>
                                                {typeof scorer === 'object' && (
                                                    <p className="text-xs text-gray-600">{scorer.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="ml-2 text-sm text-gray-700">Loading match details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded p-4 max-w-md">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                    <button 
                        onClick={() => navigate('/organiser-homepage')} 
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition-all duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto p-4">
                {isEditing ? (
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Edit Match</h2>
                            <button 
                                onClick={handleCancel}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                        <Stepper currentStep={step} />
                        <div className="mt-6">
                            {renderStep()}
                        </div>
                    </div>
                ) : (
                    renderMatchDetails()
                )}
            </div>
        </div>
    );
};

export default MatchDetailPage;