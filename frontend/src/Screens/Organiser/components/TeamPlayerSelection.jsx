import React, { useState, useEffect } from 'react';

const PlayerInputRow = ({ player, index, updatePlayer, removePlayer, teamName }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        updatePlayer(teamName, index, { ...player, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-center p-2 rounded-lg hover:bg-gray-50">
            <div className="md:col-span-4">
                <input type="text" name="name" value={player.name} onChange={handleChange} placeholder="Player Name" className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="md:col-span-3">
                <select name="role" value={player.role} onChange={handleChange} className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Batsman</option>
                    <option>Bowler</option>
                    <option>All-Rounder</option>
                </select>
            </div>
            <div className="md:col-span-2 flex items-center">
                <input type="checkbox" name="isCaptain" checked={!!player.isCaptain} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label className="ml-2 text-sm text-gray-700">Captain</label>
            </div>
            <div className="md:col-span-2 flex items-center">
                <input type="checkbox" name="isWicketKeeper" checked={!!player.isWicketKeeper} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label className="ml-2 text-sm text-gray-700">WK</label>
            </div>
            <div className="md:col-span-1 text-right">
                <button onClick={() => removePlayer(teamName, index)} className="text-red-600 hover:text-red-800 font-semibold transition-colors duration-200">Remove</button>
            </div>
        </div>
    );
};

const TeamPlayerSelection = ({ data, setData, nextStep, prevStep }) => {
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const { team1Players, team2Players } = data;
        const team1HasCaptain = team1Players.some(p => p.isCaptain);
        const team2HasCaptain = team2Players.some(p => p.isCaptain);
        setIsFormValid(team1Players.length >= 1 && team2Players.length >= 1 && team1HasCaptain && team2HasCaptain);
    }, [data]);

    const addPlayer = (teamName) => {
        const teamPlayers = data[teamName] || [];
        if (teamPlayers.length < 15) {
            setData(prev => ({ ...prev, [teamName]: [...teamPlayers, { name: '', role: 'Batsman', isCaptain: false, isWicketKeeper: false }] }));
        }
    };

    const updatePlayer = (teamName, index, player) => {
        let teamPlayers = [...(data[teamName] || [])];
        if (player.isCaptain) {
            teamPlayers = teamPlayers.map(p => ({ ...p, isCaptain: false }));
        }
        if (player.isWicketKeeper) {
            teamPlayers = teamPlayers.map(p => ({...p, isWicketKeeper: false}));
        }
        teamPlayers[index] = player;
        setData(prev => ({ ...prev, [teamName]: teamPlayers }));
    };

    const removePlayer = (teamName, index) => {
        setData(prev => ({
            ...prev,
            [teamName]: prev[teamName].filter((_, i) => i !== index)
        }));
    };

    const renderTeamInputs = (teamName, teamLabel) => (
        <div className="p-6 border border-gray-200 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{teamLabel}</h3>
            <div className="space-y-2">
                {(data[teamName] || []).map((player, index) => (
                    <PlayerInputRow
                        key={index}
                        player={player}
                        index={index}
                        updatePlayer={updatePlayer}
                        removePlayer={removePlayer}
                        teamName={teamName}
                    />
                ))}
            </div>
            {(data[teamName] || []).length < 15 &&
                <button onClick={() => addPlayer(teamName)} className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
                    + Add Player
                </button>
            }
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Team Player Selection</h2>
            <div className="space-y-8">
                {renderTeamInputs('team1Players', `Team 1: ${data.team1 || 'Team A'}`)}
                {renderTeamInputs('team2Players', `Team 2: ${data.team2 || 'Team B'}`)}
            </div>
            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!isFormValid}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
};

export default TeamPlayerSelection;
