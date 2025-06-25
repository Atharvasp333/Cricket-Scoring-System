import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MatchDetails = () => {
    const { matchId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentAnimation, setCurrentAnimation] = useState(null);
    const [activeInning, setActiveInning] = useState(1);

    // Mock data for the match
    useEffect(() => {
        // In a real app, you would fetch this data from an API
        const mockMatchData = {
            id: matchId,
            team1: {
                name: 'Mumbai Indians',
                logo: '🏏',
                score: '189/4',
                overs: '18.2',
                players: [
                    {
                        name: 'Rohit Sharma',
                        role: 'Batsman',
                        isCaptain: true,
                        specialization: 'Right-handed opening batter'
                    },
                    {
                        name: 'Ishan Kishan',
                        role: 'Wicketkeeper',
                        specialization: 'Left-handed batter'
                    },
                    {
                        name: 'Suryakumar Yadav',
                        role: 'Batsman',
                        specialization: 'Right-handed middle-order batter'
                    },
                    {
                        name: 'Tilak Varma',
                        role: 'Batsman',
                        specialization: 'Left-handed top-order batter'
                    },
                    {
                        name: 'Hardik Pandya',
                        role: 'Allrounder',
                        specialization: 'Right-handed batter • Right-arm fast-medium'
                    },
                    {
                        name: 'Kieron Pollard',
                        role: 'Allrounder',
                        specialization: 'Right-handed batter • Right-arm medium'
                    },
                    {
                        name: 'Krunal Pandya',
                        role: 'Allrounder',
                        specialization: 'Left-handed batter • Left-arm orthodox'
                    },
                    {
                        name: 'Jasprit Bumrah',
                        role: 'Bowler',
                        specialization: 'Right-arm fast'
                    },
                    {
                        name: 'Trent Boult',
                        role: 'Bowler',
                        specialization: 'Left-arm fast-medium'
                    },
                    {
                        name: 'Rahul Chahar',
                        role: 'Bowler',
                        specialization: 'Right-arm legbreak'
                    },
                    {
                        name: 'Piyush Chawla',
                        role: 'Bowler',
                        specialization: 'Right-arm legbreak'
                    },
                ],
                bench: [
                    {
                        name: 'Quinton de Kock',
                        role: 'Wicketkeeper',
                        specialization: 'Left-handed batter'
                    },
                    {
                        name: 'Anmolpreet Singh',
                        role: 'Batsman',
                        specialization: 'Right-handed batter'
                    },
                    {
                        name: 'Saurabh Tiwary',
                        role: 'Batsman',
                        specialization: 'Left-handed batter'
                    },
                    {
                        name: 'Jayant Yadav',
                        role: 'Allrounder',
                        specialization: 'Right-handed batter • Right-arm offbreak'
                    },
                ],
                battingStats: [
                    { name: 'Rohit Sharma', runs: 78, balls: 45, fours: 8, sixes: 4, strikeRate: 173.33, status: 'not out' },
                    { name: 'Ishan Kishan', runs: 32, balls: 25, fours: 3, sixes: 1, strikeRate: 128.00, status: 'c Jadeja b Thakur' },
                    { name: 'Suryakumar Yadav', runs: 45, balls: 28, fours: 5, sixes: 2, strikeRate: 160.71, status: 'b Chahar' },
                    { name: 'Tilak Varma', runs: 12, balls: 10, fours: 1, sixes: 0, strikeRate: 120.00, status: 'c Dhoni b Jadeja' },
                    { name: 'Hardik Pandya', runs: 42, balls: 21, fours: 3, sixes: 3, strikeRate: 200.00, status: 'not out' },
                    { name: 'Kieron Pollard', runs: 15, balls: 8, fours: 1, sixes: 1, strikeRate: 187.50, status: 'c Raina b Bravo' }
                ],
                bowlingStats: [
                    { name: 'Jasprit Bumrah', overs: 4, maidens: 0, runs: 28, wickets: 3, economy: 7.00 },
                    { name: 'Trent Boult', overs: 4, maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
                    { name: 'Rahul Chahar', overs: 4, maidens: 0, runs: 40, wickets: 1, economy: 10.00 },
                    { name: 'Piyush Chawla', overs: 4, maidens: 0, runs: 38, wickets: 0, economy: 9.50 },
                    { name: 'Krunal Pandya', overs: 2, maidens: 0, runs: 30, wickets: 0, economy: 15.00 }
                ],
                extras: {
                    wides: 5,
                    noBalls: 1,
                    byes: 2,
                    legByes: 3,
                    penalties: 0
                },
                fallOfWickets: [
                    { score: '65/1', batsman: 'Ishan Kishan', over: 7.5 },
                    { score: '143/2', batsman: 'Suryakumar Yadav', over: 14.2 },
                    { score: '165/3', batsman: 'Tilak Varma', over: 16.1 },
                    { score: '189/4', batsman: 'Kieron Pollard', over: 18.2 }
                ]
            },
            team2: {
                name: 'Chennai Super Kings',
                logo: '🏏',
                score: '185/7',
                overs: '20.0',
                players: [
                    {
                        name: 'Ruturaj Gaikwad',
                        role: 'Batsman',
                        specialization: 'Right-handed opening batter'
                    },
                    {
                        name: 'Faf du Plessis',
                        role: 'Batsman',
                        specialization: 'Right-handed top-order batter'
                    },
                    {
                        name: 'Moeen Ali',
                        role: 'Allrounder',
                        specialization: 'Left-handed batter • Right-arm offbreak'
                    },
                    {
                        name: 'Suresh Raina',
                        role: 'Batsman',
                        specialization: 'Left-handed middle-order batter'
                    },
                    {
                        name: 'Ambati Rayudu',
                        role: 'Batsman',
                        specialization: 'Right-handed middle-order batter'
                    },
                    {
                        name: 'MS Dhoni',
                        role: 'Wicketkeeper',
                        isCaptain: true,
                        specialization: 'Right-handed batter'
                    },
                    {
                        name: 'Ravindra Jadeja',
                        role: 'Allrounder',
                        specialization: 'Left-handed batter • Left-arm orthodox'
                    },
                    {
                        name: 'Dwayne Bravo',
                        role: 'Allrounder',
                        specialization: 'Right-handed batter • Right-arm medium-fast'
                    },
                    {
                        name: 'Shardul Thakur',
                        role: 'Bowler',
                        specialization: 'Right-arm medium-fast'
                    },
                    {
                        name: 'Deepak Chahar',
                        role: 'Bowler',
                        specialization: 'Right-arm medium'
                    },
                    {
                        name: 'Lungi Ngidi',
                        role: 'Bowler',
                        specialization: 'Right-arm fast'
                    },
                ],
                bench: [
                    {
                        name: 'Robin Uthappa',
                        role: 'Batsman',
                        specialization: 'Right-handed batter'
                    },
                    {
                        name: 'Cheteshwar Pujara',
                        role: 'Batsman',
                        specialization: 'Right-handed batter'
                    },
                    {
                        name: 'Imran Tahir',
                        role: 'Bowler',
                        specialization: 'Right-arm legbreak'
                    },
                    {
                        name: 'Mitchell Santner',
                        role: 'Allrounder',
                        specialization: 'Left-handed batter • Left-arm orthodox'
                    }
                ],
                battingStats: [
                    { name: 'Ruturaj Gaikwad', runs: 42, balls: 30, fours: 5, sixes: 1, strikeRate: 140.00, status: 'c Kishan b Bumrah' },
                    { name: 'Faf du Plessis', runs: 35, balls: 25, fours: 4, sixes: 1, strikeRate: 140.00, status: 'b Boult' },
                    { name: 'Moeen Ali', runs: 28, balls: 20, fours: 3, sixes: 1, strikeRate: 140.00, status: 'c Hardik b Chahar' },
                    { name: 'Suresh Raina', runs: 15, balls: 12, fours: 1, sixes: 1, strikeRate: 125.00, status: 'run out (Hardik)' },
                    { name: 'Ambati Rayudu', runs: 25, balls: 15, fours: 2, sixes: 1, strikeRate: 166.67, status: 'c Boult b Bumrah' },
                    { name: 'MS Dhoni', runs: 18, balls: 10, fours: 1, sixes: 1, strikeRate: 180.00, status: 'not out' },
                    { name: 'Ravindra Jadeja', runs: 22, balls: 8, fours: 1, sixes: 2, strikeRate: 275.00, status: 'c Rohit b Bumrah' }
                ],
                bowlingStats: [
                    { name: 'Deepak Chahar', overs: 4, maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
                    { name: 'Lungi Ngidi', overs: 4, maidens: 0, runs: 42, wickets: 0, economy: 10.50 },
                    { name: 'Shardul Thakur', overs: 4, maidens: 0, runs: 38, wickets: 1, economy: 9.50 },
                    { name: 'Ravindra Jadeja', overs: 4, maidens: 0, runs: 32, wickets: 1, economy: 8.00 },
                    { name: 'Dwayne Bravo', overs: 2.2, maidens: 0, runs: 42, wickets: 0, economy: 18.00 }
                ],
                extras: {
                    wides: 7,
                    noBalls: 2,
                    byes: 1,
                    legByes: 2,
                    penalties: 0
                },
                fallOfWickets: [
                    { score: '42/1', batsman: 'Ruturaj Gaikwad', over: 5.3 },
                    { score: '85/2', batsman: 'Faf du Plessis', over: 10.1 },
                    { score: '110/3', batsman: 'Moeen Ali', over: 12.5 },
                    { score: '125/4', batsman: 'Suresh Raina', over: 14.3 },
                    { score: '150/5', batsman: 'Ambati Rayudu', over: 17.1 },
                    { score: '172/6', batsman: 'Ravindra Jadeja', over: 18.5 },
                    { score: '185/7', batsman: 'Dwayne Bravo', over: 19.6 }
                ]
            },
            venue: 'Wankhede Stadium, Mumbai',
            date: '2023-10-15',
            toss: {
                winner: 'Chennai Super Kings',
                decision: 'bat'
            },
            status: 'MI needs 24 runs in 10 balls',
            currentBatsmen: [
                { name: 'Rohit Sharma', runs: 78, balls: 45, fours: 8, sixes: 4, strikeRate: 173.33, isStriker: true },
                { name: 'Hardik Pandya', runs: 42, balls: 21, fours: 3, sixes: 3, strikeRate: 200.00, isStriker: false }
            ],
            currentBowlers: [
                { name: 'Dwayne Bravo', overs: 2.2, maidens: 0, runs: 42, wickets: 0, economy: 18.00, isBowling: true },
                { name: 'Shardul Thakur', overs: 4, maidens: 0, runs: 38, wickets: 1, economy: 9.50, isBowling: false }
            ],
            currentOver: [
                { ball: 1, runs: 1, extra: null, wicket: null, description: 'Single to long-on' },
                { ball: 2, runs: 4, extra: null, wicket: null, description: 'Four through covers' },
                { ball: 3, runs: 6, extra: null, wicket: null, description: 'Six over long-off' },
                { ball: 4, runs: 2, extra: null, wicket: null, description: 'Two runs to deep mid-wicket' },
                { ball: 5, runs: 0, extra: 'wide', wicket: null, description: 'Wide outside off stump' },
                { ball: 6, runs: 1, extra: null, wicket: null, description: 'Single to square leg' }
            ],
            previousOvers: [
                {
                    bowler: 'Deepak Chahar',
                    over: 18,
                    runs: 12,
                    wickets: 0,
                    balls: [
                        { ball: 1, runs: 1, extra: null, wicket: null },
                        { ball: 2, runs: 4, extra: null, wicket: null },
                        { ball: 3, runs: 0, extra: null, wicket: null },
                        { ball: 4, runs: 1, extra: null, wicket: null },
                        { ball: 5, runs: 0, extra: null, wicket: null },
                        { ball: 6, runs: 6, extra: null, wicket: null }
                    ]
                },
                {
                    bowler: 'Shardul Thakur',
                    over: 17,
                    runs: 8,
                    wickets: 0,
                    balls: [
                        { ball: 1, runs: 1, extra: null, wicket: null },
                        { ball: 2, runs: 1, extra: null, wicket: null },
                        { ball: 3, runs: 0, extra: null, wicket: null },
                        { ball: 4, runs: 4, extra: null, wicket: null },
                        { ball: 5, runs: 1, extra: null, wicket: null },
                        { ball: 6, runs: 1, extra: null, wicket: null }
                    ]
                }
            ],
            partnerships: [
                { batsmen: ['Rohit Sharma', 'Ishan Kishan'], runs: 65, balls: 45 },
                { batsmen: ['Rohit Sharma', 'Suryakumar Yadav'], runs: 78, balls: 52 },
                { batsmen: ['Rohit Sharma', 'Tilak Varma'], runs: 22, balls: 15 },
                { batsmen: ['Rohit Sharma', 'Hardik Pandya'], runs: 24, balls: 12 }
            ],
            commentary: [
                { over: 18.2, description: 'FOUR! Rohit Sharma plays a beautiful cover drive for a boundary.' },
                { over: 18.1, description: 'Bravo to Rohit, full toss and pushed to long-on for a single.' },
                { over: 18.0, description: 'End of over 18. Mumbai Indians 165/4.' },
                { over: 17.6, description: 'Chahar to Hardik, single to deep point.' },
                { over: 17.5, description: 'SIX! Hardik Pandya smashes it over long-on for a maximum!' },
                { over: 17.4, description: 'Dot ball. Hardik defends it back to the bowler.' },
                { over: 17.3, description: 'Single taken by Rohit, pushing it to mid-off.' },
                { over: 17.2, description: 'FOUR! Rohit pulls it to the boundary for four more runs.' },
                { over: 17.1, description: 'Chahar to Rohit, defended back to the bowler.' }
            ],
            currentRunRate: 10.32,
            requiredRunRate: 14.40
        };

        // Simulate API call
        setTimeout(() => {
            setMatchData(mockMatchData);
            setLoading(false);

            // Simulate ball-by-ball animations
            const animations = ['4', '6', 'W', '1', '2', '0'];
            const randomAnimation = () => {
                const randomIndex = Math.floor(Math.random() * animations.length);
                setCurrentAnimation(animations[randomIndex]);
                setTimeout(() => setCurrentAnimation(null), 2000);
            };

            // Show animation every 10 seconds
            const animationInterval = setInterval(randomAnimation, 10000);
            return () => clearInterval(animationInterval);
        }, 1000);
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
                        <div className=" flex flex-col text-black items-center text-center flex-1">
                            <div className="text-4xl mb-2">{matchData.team1.logo}</div>
                            <div className="text-sm font-medium text-black mb-1">{matchData.team1.name}</div>
                            <div className="text-lg font-bold text-gray-800">{matchData.team1.shortName}</div>
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
                            <div className="text-lg font-bold text-gray-800">{matchData.team2.shortName}</div>
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
                        <button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'overview'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'scorecard'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('scorecard')}
                        >
                            Scorecard
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'commentary'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('commentary')}
                        >
                            Commentary
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'squads'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('squads')}
                        >
                            Squads
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'stats'
                                ? 'text-white bg-[#16638A] border-b-2 border-[#16638A]'
                                : 'text-gray-700 hover:text-[#16638A] hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Stats
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        {/* Updated Overview Tab - Current Over and Previous Overs side by side */}
                        {activeTab === 'overview' && (
                            <div>
                                {/* Current Batsmen */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold mb-3 text-[#16638A]">Batsmen</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batsman</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">4s</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">6s</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {matchData.currentBatsmen.map((batsman, index) => (
                                                    <tr key={index} className='text-black'>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="font-medium">{batsman.name}</span>
                                                                {batsman.isStriker && <span className="ml-1 text-xs">*</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 text-center">{batsman.runs}</td>
                                                        <td className="px-4 py-2 text-center">{batsman.balls}</td>
                                                        <td className="px-4 py-2 text-center">{batsman.fours}</td>
                                                        <td className="px-4 py-2 text-center">{batsman.sixes}</td>
                                                        <td className="px-4 py-2 text-center">{batsman.strikeRate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Current Bowlers */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold mb-3 text-[#16638A]">Bowlers</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bowler</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">O</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Econ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {matchData.currentBowlers.map((bowler, index) => (
                                                    <tr key={index} className='text-black'>

                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="font-medium">{bowler.name}</span>
                                                                {bowler.isBowling && <span className="ml-1 text-xs">*</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 text-center">{bowler.overs}</td>
                                                        <td className="px-4 py-2 text-center">{bowler.maidens}</td>
                                                        <td className="px-4 py-2 text-center">{bowler.runs}</td>
                                                        <td className="px-4 py-2 text-center">{bowler.wickets}</td>
                                                        <td className="px-4 py-2 text-center">{bowler.economy}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Current Over and Previous Overs - Side by Side */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Current Over - Left Side */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-bold mb-3 text-[#16638A]">This Over</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {matchData.currentOver.map((ball, index) => (
                                                <div
                                                    key={index}
                                                    className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                                        ${ball.wicket ? 'bg-red-500' :
                                                            ball.extra ? 'bg-yellow-500' :
                                                                ball.runs === 4 ? 'bg-green-500' :
                                                                    ball.runs === 6 ? 'bg-purple-500' :
                                                                        ball.runs > 0 ? 'bg-blue-500' : 'bg-gray-500'}
                                                    `}
                                                >
                                                    {ball.wicket ? 'W' :
                                                        ball.extra ? ball.extra.charAt(0).toUpperCase() :
                                                            ball.runs}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">CRR:</span> {matchData.currentRunRate} |
                                            <span className="font-medium ml-2">RRR:</span> {matchData.requiredRunRate}
                                        </div>
                                    </div>

                                    {/* Previous Overs - Right Side */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-bold mb-3 text-[#16638A]">Previous Overs</h3>
                                        <div className="space-y-4 max-h-64 overflow-y-auto">
                                            {matchData.previousOvers.map((over, overIndex) => (
                                                <div key={overIndex} className="border-b border-gray-200 pb-3 last:border-0">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="font-medium text-sm">Over {over.over}: {over.bowler}</span>
                                                        <span className="text-xs text-gray-600">{over.runs} runs, {over.wickets} wickets</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {over.balls.map((ball, ballIndex) => (
                                                            <div
                                                                key={ballIndex}
                                                                className={`
                                                                    w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                                                                    ${ball.wicket ? 'bg-red-500' :
                                                                        ball.extra ? 'bg-yellow-500' :
                                                                            ball.runs === 4 ? 'bg-green-500' :
                                                                                ball.runs === 6 ? 'bg-purple-500' :
                                                                                    ball.runs > 0 ? 'bg-blue-500' : 'bg-gray-500'}
                                                                `}
                                                            >
                                                                {ball.wicket ? 'W' :
                                                                    ball.extra ? ball.extra.charAt(0).toUpperCase() :
                                                                        ball.runs}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'scorecard' && (
                            <div>
                                {/* Innings Tabs */}
                                <div className="flex justify-center border-b border-gray-200 mb-4">
                                    <button
                                        className={`px-4 py-2 font-medium text-sm ${activeInning === 1 ? 'text-[#16638A] border-b-2 border-[#16638A]' : 'text-gray-700'}`}
                                        onClick={() => setActiveInning(1)}
                                    >
                                        1st Innings - {matchData.team1.name}
                                    </button>
                                    <button
                                        className={`px-4 py-2 font-medium text-sm ${activeInning === 2 ? 'text-[#16638A] border-b-2 border-[#16638A]' : 'text-gray-700'}`}
                                        onClick={() => setActiveInning(2)}
                                    >
                                        2nd Innings - {matchData.team2.name}
                                    </button>
                                </div>

                                {/* First Innings Content */}
                                {activeInning === 1 && (
                                    <div className="space-y-6">
                                        {/* Team 1 Batting Card */}
                                        <div className="bg-white rounded-lg shadow-sm p-4">
                                            <h3 className="text-lg font-bold mb-3 text-[#16638A]">{matchData.team1.name} Batting</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batsman</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">4s</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">6s</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {matchData.team1.battingStats.map((batsman, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 whitespace-nowrap">
                                                                    <div className="font-medium text-black">{batsman.name}</div>
                                                                    <div className="text-xs text-gray-600 mt-1">{batsman.status}</div>
                                                                </td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.runs}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.balls}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.fours}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.sixes}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.strikeRate}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Extras and Total */}
                                            <div className="mt-2 border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-sm text-gray-700">
                                                    <span>Extras</span>
                                                    <span>
                                                        (b {matchData.team1.extras.byes}, lb {matchData.team1.extras.legByes},
                                                        w {matchData.team1.extras.wides}, nb {matchData.team1.extras.noBalls},
                                                        p {matchData.team1.extras.penalties}) {calculateTotalExtras(matchData.team1.extras)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm font-medium text-gray-900 mt-1">
                                                    <span>Total</span>
                                                    <span>{matchData.team1.score} ({matchData.team1.overs} overs)</span>
                                                </div>
                                            </div>

                                            {/* Yet to Bat */}
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Yet to Bat</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchData.team1.players
                                                        .filter(player => !matchData.team1.battingStats.some(batsman => batsman.name === player.name))
                                                        .map((player, index) => (
                                                            <div key={index} className="text-black text-xs bg-gray-100 px-2 py-1 rounded">
                                                                {player.name}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Fall of Wickets */}
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Fall of Wickets</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchData.team1.fallOfWickets.map((fow, index) => (
                                                        <div key={index} className="text-black text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {fow.score} ({fow.batsman}, {fow.over} ov)
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Team 2 Bowling Card */}
                                        <div className="bg-white rounded-lg shadow-sm p-4">
                                            <h3 className="text-lg font-bold mb-3 text-[#16638A]">{matchData.team2.name} Bowling</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bowler</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">O</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Econ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {matchData.team2.bowlingStats.map((bowler, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 whitespace-nowrap font-medium text-black">{bowler.name}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.overs}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.maidens}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.runs}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.wickets}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.economy}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Second Innings Content */}
                                {activeInning === 2 && (
                                    <div className="space-y-6">
                                        {/* Team 2 Batting Card */}
                                        <div className="bg-white rounded-lg shadow-sm p-4">
                                            <h3 className="text-lg font-bold mb-3 text-[#16638A]">{matchData.team2.name} Batting</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batsman</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">4s</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">6s</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {matchData.team2.battingStats.map((batsman, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 whitespace-nowrap">
                                                                    <div className="font-medium text-black">{batsman.name}</div>
                                                                    <div className="text-xs text-gray-600 mt-1">{batsman.status}</div>
                                                                </td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.runs}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.balls}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.fours}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.sixes}</td>
                                                                <td className="px-4 py-2 text-center text-black">{batsman.strikeRate}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Extras and Total */}
                                            <div className="mt-2 border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-sm text-gray-700">
                                                    <span>Extras</span>
                                                    <span>
                                                        (b {matchData.team2.extras.byes}, lb {matchData.team2.extras.legByes},
                                                        w {matchData.team2.extras.wides}, nb {matchData.team2.extras.noBalls},
                                                        p {matchData.team2.extras.penalties}) {calculateTotalExtras(matchData.team2.extras)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm font-medium text-gray-900 mt-1">
                                                    <span>Total</span>
                                                    <span>{matchData.team2.score} ({matchData.team2.overs} overs)</span>
                                                </div>
                                            </div>

                                            {/* Yet to Bat */}
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Yet to Bat</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchData.team2.players
                                                        .filter(player => !matchData.team2.battingStats.some(batsman => batsman.name === player.name))
                                                        .map((player, index) => (
                                                            <div key={index} className="text-black text-xs bg-gray-100 px-2 py-1 rounded">

                                                                {player.name}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Fall of Wickets */}
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Fall of Wickets</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchData.team2.fallOfWickets?.map((fow, index) => (
                                                        <div key={index} className="text-black text-xs bg-gray-100 px-2 py-1 rounded">

                                                            {fow.score} ({fow.batsman}, {fow.over} ov)
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Team 1 Bowling Card */}
                                        <div className="bg-white rounded-lg shadow-sm p-4">
                                            <h3 className="text-lg font-bold mb-3 text-[#16638A]">{matchData.team1.name} Bowling</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bowler</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">O</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Econ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {matchData.team1.bowlingStats.map((bowler, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 whitespace-nowrap font-medium text-black">{bowler.name}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.overs}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.maidens}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.runs}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.wickets}</td>
                                                                <td className="px-4 py-2 text-center text-black">{bowler.economy}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Commentary Tab */}
                        {/* Commentary Tab */}
                        {activeTab === 'commentary' && (
                            <div className="space-y-4">
                                {matchData.commentary.map((comment, index) => {
                                    // Check if this is the last ball of an over (ends with .6)
                                    const isOverComplete = comment.over.toString().endsWith('.6');
                                    const overNumber = Math.floor(comment.over);

                                    // Find the complete over data from previousOvers
                                    const completeOver = matchData.previousOvers.find(
                                        over => over.over === overNumber
                                    );

                                    return (
                                        <div key={index}>
                                            <div className="border-b border-gray-200 pb-4 last:border-0">
                                                <div className="flex items-start">
                                                    <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="text-black font-bold text-sm">{comment.over}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-800">{comment.description}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Show over summary when over is complete */}
                                            {isOverComplete && completeOver && (
                                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-medium text-[#16638A]">Over {completeOver.over} Summary</h4>
                                                        <span className="text-sm text-gray-600">
                                                            {completeOver.runs} runs, {completeOver.wickets} wicket(s)
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {completeOver.balls.map((ball, ballIndex) => (
                                                            <div
                                                                key={ballIndex}
                                                                className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                                            ${ball.wicket ? 'bg-red-500' :
                                                                        ball.extra ? 'bg-yellow-500' :
                                                                            ball.runs === 4 ? 'bg-green-500' :
                                                                                ball.runs === 6 ? 'bg-purple-500' :
                                                                                    ball.runs > 0 ? 'bg-blue-500' : 'bg-gray-500'}
                                        `}
                                                            >
                                                                {ball.wicket ? 'W' :
                                                                    ball.extra ? ball.extra.charAt(0).toUpperCase() :
                                                                        ball.runs}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Squads Tab */}
                        {activeTab === 'squads' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Team 1 Squad */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-bold mb-4 text-[#16638A] text-center">{matchData.team1.name}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-black mb-3 border-b pb-2">Playing XI</h4>
                                            <div className="space-y-3">
                                                {matchData.team1.players.map((player, index) => (
                                                    <div key={index} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                                        <div className="w-6 h-6 bg-[#16638A] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-1 flex-shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex-start">
                                                                <span className="text-black font-medium mr-2">{player.name}</span>
                                                                {player.isCaptain && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">(c)</span>}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {player.specialization}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-black mb-3 border-b pb-2">Bench</h4>
                                            <div className="space-y-3">
                                                {matchData.team1.bench.map((player, index) => (
                                                    <div key={index} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-3 mt-1 flex-shrink-0">
                                                            {index + 12}
                                                        </div>
                                                        <div className="flex-1 text-center">
                                                            <div className="text-black text-sm font-medium">{player.name}</div>
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {player.specialization}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team 2 Squad */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-bold mb-4 text-[#16638A] text-center">{matchData.team2.name}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-black mb-3 border-b pb-2">Playing XI</h4>
                                            <div className="space-y-3">
                                                {matchData.team2.players.map((player, index) => (
                                                    <div key={index} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                                        <div className="w-6 h-6 bg-[#16638A] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-1 flex-shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex-start">
                                                                <span className="text-black font-medium mr-2">{player.name}</span>
                                                                {player.isCaptain && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">(c)</span>}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {player.specialization}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-black mb-3 border-b pb-2">Bench</h4>
                                            <div className="space-y-3">
                                                {matchData.team2.bench.map((player, index) => (
                                                    <div key={index} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-3 mt-1 flex-shrink-0">
                                                            {index + 12}
                                                        </div>
                                                        <div className="flex-1 text-center">
                                                            <div className="text-black text-sm font-medium">{player.name}</div>
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {player.specialization}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Tab */}
                        {activeTab === 'stats' && (
                            <div>
                                {/* Match Info */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-[#16638A]">Match Information</h3>
                                    <div className="grid grid-cols-1 font-bold text-blue-900 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-xl font-bold mb-2">Match Details</h4>
                                            <div className="space-y-1">
                                                <p><span className="font-medium">Venue:</span> {matchData.venue}</p>
                                                <p><span className="font-medium">Date:</span> {new Date(matchData.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                                <p><span className="font-medium">Toss:</span> {matchData.toss.winner} won the toss and chose to {matchData.toss.decision}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-xl font-bold mb-2">Run Rates</h4>
                                            <div className="space-y-1 font-bold">
                                                <p><span className="font-medium">Current Run Rate:</span> {matchData.currentRunRate}</p>
                                                <p><span className="font-medium">Required Run Rate:</span> {matchData.requiredRunRate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Partnerships */}
                                <div className="mb-6 font-bold text-black">
                                    <h3 className="text-xl font-bold mb-3 text-[#16638A]">Partnerships</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partners</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Balls</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Run Rate</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {matchData.partnerships.map((partnership, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            {partnership.batsmen.join(' & ')}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">{partnership.runs}</td>
                                                        <td className="px-4 py-2 text-center">{partnership.balls}</td>
                                                        <td className="px-4 py-2 text-center">
                                                            {((partnership.runs / partnership.balls) * 6).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Key Stats */}
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-[#16638A]">Key Statistics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 text-black p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">Most Runs</h4>
                                            <div className="space-y-2">
                                                {[...matchData.team1.battingStats, ...matchData.team2.battingStats]
                                                    .sort((a, b) => b.runs - a.runs)
                                                    .slice(0, 3)
                                                    .map((batsman, index) => (
                                                        <div key={index} className="flex justify-between">
                                                            <span>{batsman.name}</span>
                                                            <span className="font-medium">{batsman.runs}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 text-black p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">Most Wickets</h4>
                                            <div className="space-y-2">
                                                {matchData.team2.bowlingStats
                                                    .sort((a, b) => b.wickets - a.wickets)
                                                    .slice(0, 3)
                                                    .map((bowler, index) => (
                                                        <div key={index} className="flex justify-between">
                                                            <span>{bowler.name}</span>
                                                            <span className="font-medium">{bowler.wickets}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 text-black rounded-lg">
                                            <h4 className="font-medium mb-2">Best Strike Rates</h4>
                                            <div className="space-y-2">
                                                {[...matchData.team1.battingStats, ...matchData.team2.battingStats]
                                                    .filter(b => b.balls > 10)
                                                    .sort((a, b) => b.strikeRate - a.strikeRate)
                                                    .slice(0, 3)
                                                    .map((batsman, index) => (
                                                        <div key={index} className="flex justify-between">
                                                            <span>{batsman.name}</span>
                                                            <span className="font-medium">{batsman.strikeRate}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MatchDetails;
