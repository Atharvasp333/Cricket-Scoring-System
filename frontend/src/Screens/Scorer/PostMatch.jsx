import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostMatch = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();

    // Mock match data - in a real app, this would come from an API or state
    const matchData = {
        id: matchId,
        team1: {
            name: 'Team A',
            score: 187,
            wickets: 8,
            overs: 20,
            extras: 12,
            players: [
                { name: 'Player A1', runs: 78, balls: 42, fours: 7, sixes: 3, strikeRate: 185.71, isOut: true },
                { name: 'Player A2', runs: 45, balls: 30, fours: 5, sixes: 1, strikeRate: 150.00, isOut: true },
                // ... other players
            ]
        },
        team2: {
            name: 'Team B',
            score: 175,
            wickets: 9,
            overs: 19.4,
            extras: 8,
            players: [
                { name: 'Player B1', runs: 65, balls: 38, fours: 6, sixes: 2, strikeRate: 171.05, isOut: true },
                { name: 'Player B2', runs: 52, balls: 28, fours: 4, sixes: 3, strikeRate: 185.71, isOut: true },
                // ... other players
            ]
        },
        venue: 'Stadium 1',
        date: '2023-10-15',
        overs: 20,
        result: `${matchId === '1' ? 'Team A' : 'Team B'} won by ${matchId === '1' ? '12' : '5'} runs`,
        momCandidates: ['Player A1', 'Player B1', 'Player A2', 'Player B2']
    };

    const [selectedMOM, setSelectedMOM] = React.useState(null);
    const [isFinalized, setIsFinalized] = React.useState(false);

    const handleMOMSelect = (player) => {
        setSelectedMOM(player);
    };

    const handleFinalize = () => {
        if (selectedMOM) {
            setIsFinalized(true);
        } else {
            alert('Please select Man of the Match before finalizing');
        }
    };

    const handleEndMatch = () => {
        // In a real app, you might want to save the match data here
        navigate('/scorer-home'); // Navigate to scorer-home page
    };

    return (
        <div className="w-full bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 mx-auto px-4 py-6">
            {/* Match Info Header */}
            <div className="bg-white/90 p-4 shadow-lg mb-6 text-black">
                <h1 className="font-bold text-5xl mb-2 text-blue-900">
                    {matchData.team1.name} vs {matchData.team2.name}
                </h1>
                <p className="text-black text-xl mb-2">
                    <span className="font-medium text-green-900">Venue:</span> {matchData.venue}
                    <span className="text-xl font-bold text-black"> | </span>
                    <span className="font-medium font-bold text-green-900"> Date: </span> {matchData.date}
                </p>
                <div className="text-2xl font-bold text-center py-4 bg-blue-100 rounded-lg">
                    {matchData.result}
                </div>
            </div>

            {/* Match Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Team 1 Innings */}
                <div className="bg-white/90 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">{matchData.team1.name} Innings</h2>
                    <div className="text-lg mb-4">
                        <span className="font-medium">{matchData.team1.score}/{matchData.team1.wickets}</span>
                        <span className="mx-2">in</span>
                        <span className="font-medium">{matchData.team1.overs} overs</span>
                        {matchData.team1.extras > 0 && (
                            <span className="ml-2">(Extras: {matchData.team1.extras})</span>
                        )}
                    </div>

                    <h3 className="text-lg font-medium mb-2 text-blue-900">Top Performers</h3>
                    <div className="space-y-2">
                        {matchData.team1.players
                            .sort((a, b) => b.runs - a.runs)
                            .slice(0, 3)
                            .map((player, index) => (
                                <div key={index} className="bg-blue-100 p-2 rounded">
                                    <div className="font-medium">{player.name}</div>
                                    <div className="text-sm">
                                        {player.runs} ({player.balls}) | {player.fours}x4, {player.sixes}x6 | SR: {player.strikeRate}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Team 2 Innings */}
                <div className="bg-white/90 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">{matchData.team2.name} Innings</h2>
                    <div className="text-lg mb-4">
                        <span className="font-medium">{matchData.team2.score}/{matchData.team2.wickets}</span>
                        <span className="mx-2">in</span>
                        <span className="font-medium">{matchData.team2.overs} overs</span>
                        {matchData.team2.extras > 0 && (
                            <span className="ml-2">(Extras: {matchData.team2.extras})</span>
                        )}
                    </div>

                    <h3 className="text-lg font-medium mb-2 text-blue-900">Top Performers</h3>
                    <div className="space-y-2">
                        {matchData.team2.players
                            .sort((a, b) => b.runs - a.runs)
                            .slice(0, 3)
                            .map((player, index) => (
                                <div key={index} className="bg-blue-100 p-2 rounded">
                                    <div className="font-medium">{player.name}</div>
                                    <div className="text-sm">
                                        {player.runs} ({player.balls}) | {player.fours}x4, {player.sixes}x6 | SR: {player.strikeRate}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Player of the Match Selection */}
            <div className="bg-white/90 p-4 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">Player of the Match</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {matchData.momCandidates.map((player, index) => {
                        const playerData = [...matchData.team1.players, ...matchData.team2.players].find(p => p.name === player);
                        return (
                            <div
                                key={index}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedMOM === player ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200'}`}
                                onClick={() => handleMOMSelect(player)}
                            >
                                <div className="font-bold">{player}</div>
                                {playerData && (
                                    <div className="text-sm">
                                        {playerData.runs && `${playerData.runs} runs`}
                                        {playerData.wickets && ` | ${playerData.wickets} wickets`}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Finalize Button */}
            <div className="flex justify-center mb-4">
                {!isFinalized ? (
                    <button
                        className="py-3 px-6 rounded-lg bg-green-600 text-white font-bold text-lg hover:bg-green-700 shadow-lg"
                        onClick={handleFinalize}
                    >
                        Finalize Match
                    </button>
                ) : (
                    <button
                        className="py-3 px-6 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700 shadow-lg"
                        onClick={handleEndMatch}
                    >
                        End Match
                    </button>
                )}
            </div>

            {/* Confirmation Message */}
            {isFinalized && (
                <div className="text-center mb-6">
                    <p className="text-xl font-semibold text-green-800">
                        "{selectedMOM}" has been selected as Man of the Match!
                    </p>
                    <p className="text-lg text-gray-700 mt-2">
                        Click "End Match" to return to the scorer homepage.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PostMatch;