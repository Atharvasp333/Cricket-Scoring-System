import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import TournamentBasicInfo from './components/TournamentBasicInfo';
import TournamentTeams from './components/TournamentTeams';
import TournamentRules from './components/TournamentRules';
import ScorerAccess from './components/ScorerAccess';
import Confirmation from './components/Confirmation';

const TournamentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [step, setStep] = useState(1);
    const [tournamentData, setTournamentData] = useState({
        name: '',
        type: 'T20',
        startDate: '',
        endDate: '',
        location: '',
        teams: [],
        maxTeams: 8,
        maxPlayersPerTeam: 15,
        overs: 20,
        powerplayOvers: 6,
        drsEnabled: false,
        drsReviews: 2,
        scorers: [],
    });

    useEffect(() => {
        const fetchTournament = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/tournaments/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tournament details');
                }
                const data = await response.json();
                setTournament(data);
                
                setTournamentData({
                    name: data.name || '',
                    type: data.type || 'T20',
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                    location: data.location || '',
                    teams: data.teams || [],
                    maxTeams: data.maxTeams || 8,
                    maxPlayersPerTeam: data.maxPlayersPerTeam || 15,
                    overs: data.overs || 20,
                    powerplayOvers: data.powerplayOvers || 6,
                    drsEnabled: data.drsEnabled || false,
                    drsReviews: data.drsReviews || 2,
                    scorers: data.scorers || [],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTournament();
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

    const submitTournament = async () => {
        try {
            const payload = {
                name: tournamentData.name,
                type: tournamentData.type,
                startDate: tournamentData.startDate,
                endDate: tournamentData.endDate,
                location: tournamentData.location,
                teams: tournamentData.teams,
                maxTeams: tournamentData.maxTeams,
                maxPlayersPerTeam: tournamentData.maxPlayersPerTeam,
                overs: tournamentData.overs,
                powerplayOvers: tournamentData.powerplayOvers,
                drsEnabled: tournamentData.drsEnabled,
                drsReviews: tournamentData.drsReviews,
                scorers: tournamentData.scorers,
            };

            const response = await fetch(`/api/tournaments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update tournament');
            }

            const updatedTournament = await response.json();
            setTournament(updatedTournament);
            setIsEditing(false);
            setStep(1);
            alert('Tournament updated successfully!');
        } catch (err) {
            alert('Error updating tournament: ' + err.message);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <TournamentBasicInfo data={tournamentData} setData={setTournamentData} nextStep={nextStep} />;
            case 2:
                return <TournamentTeams data={tournamentData} setData={setTournamentData} nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <TournamentRules data={tournamentData} setData={setTournamentData} nextStep={nextStep} prevStep={prevStep} />;
            case 4:
                return <ScorerAccess data={tournamentData} setData={setTournamentData} nextStep={nextStep} prevStep={prevStep} />;
            case 5:
                return <Confirmation data={tournamentData} prevStep={prevStep} submit={submitTournament} />;
            default:
                return <div>Step not found</div>;
        }
    };

    const renderTournamentDetails = () => {
        if (!tournament) return null;

        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                {/* Header with Edit Button */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">{tournament.name}</h2>
                        <button 
                            onClick={handleEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Edit Tournament
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {tournament.type} • {tournament.location || 'Location not specified'}
                    </p>
                </div>

                {/* Basic Info Section */}
                <div className="px-4 py-4 border-b border-gray-200">
                    <div className="bg-white rounded border border-gray-200 p-3">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                            Tournament Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Start Date</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : 'Not set'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">End Date</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : 'Not set'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Teams</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {tournament.teams?.length || 0} / {tournament.maxTeams}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                <p className="text-xs font-medium text-gray-600">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                    tournament.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                    tournament.status === 'Live' ? 'bg-red-100 text-red-800 border border-red-200' : 
                                    'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                    {tournament.status || 'Upcoming'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teams Section */}
                {tournament.teams && tournament.teams.length > 0 && (
                    <div className="px-4 py-4 border-b border-gray-200">
                        <div className="bg-white rounded border border-gray-200 p-3">
                            <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                                Participating Teams
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {tournament.teams.map((team, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow transition-shadow duration-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{team.name}</h4>
                                                {/* Display Team Captain */}
                                                {team.captains && team.captains.length > 0 ? (
                                                    <div className="mt-2 flex items-center">
                                                        <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full mr-1">
                                                            Captain
                                                        </div>
                                                        <p className="text-sm text-gray-700">
                                                            {typeof team.captains[0] === 'object' ? 
                                                                (team.captains[0].displayName || team.captains[0].name || 'Captain') : 
                                                                'Captain'}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500 mt-1 italic">No captain assigned</p>
                                                )}
                                                {/* Display Players Count */}
                                                {team.players && (
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        <span className="font-medium">Players:</span> {team.players.length} (max {tournament.maxPlayersPerTeam})
                                                    </p>
                                                )}
                                            </div>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                Team {idx + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rules Section */}
                <div className="px-4 py-4 border-b border-gray-200">
                    <div className="bg-white rounded border border-gray-200 p-3">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                            Tournament Rules
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-3 border border-blue-200 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="bg-blue-600 rounded-full p-1 mr-2">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-medium text-blue-700">Match Format</p>
                                </div>
                                <p className="text-lg font-bold text-blue-900">{tournament.type}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-3 border border-green-200 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="bg-green-600 rounded-full p-1 mr-2">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-medium text-green-700">Overs per Innings</p>
                                </div>
                                <p className="text-lg font-bold text-green-900">{tournament.overs}</p>
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
                                    {tournament.drsEnabled ? tournament.drsReviews : 'OFF'}
                                </p>
                                <p className="text-xs text-purple-600 mt-0.5">
                                    {tournament.drsEnabled ? 'reviews per team' : 'disabled'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scorers Section */}
                {tournament.scorers && tournament.scorers.length > 0 && (
                    <div className="px-4 py-4">
                        <div className="bg-white rounded border border-gray-200 p-3">
                            <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                                Tournament Scorers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {tournament.scorers.map((scorer, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded p-2 border border-gray-200 hover:shadow transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                                <span className="text-white font-semibold text-xs">
                                                    {typeof scorer === 'string' ? scorer.charAt(0).toUpperCase() : (scorer.name ? scorer.name.charAt(0).toUpperCase() : 'S')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{typeof scorer === 'string' ? 'Scorer' : (scorer.name || 'Scorer')}</p>
                                                <p className="text-xs text-gray-600">{typeof scorer === 'string' ? scorer : (scorer.email || 'No email provided')}</p>
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
                <p className="ml-2 text-sm text-gray-700">Loading tournament details...</p>
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
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate('/organiser-homepage')} 
                        className="mr-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center px-2 py-1 rounded hover:bg-blue-50 transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Tournament Details
                    </h1>
                </div>

                {isEditing ? (
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Edit Tournament</h2>
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
                    renderTournamentDetails()
                )}
            </div>
        </div>
    );
};

export default TournamentDetailPage;