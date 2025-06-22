import React, { useState } from 'react';

const Tournaments = () => {
  // Mock data for completed tournaments
  const completedTournaments = [
    {
      id: 1,
      name: 'IPL 2023 League Stage',
      type: 'T20 League',
      totalMatches: 25,
      scoredMatches: 25,
      startDate: '2023-09-15',
      endDate: '2023-10-15',
      status: 'completed',
      venue: 'Multiple Venues',
      completedAt: '2023-10-15 23:30',
      description: 'Indian Premier League 2023 League Stage matches',
      teams: ['MI', 'CSK', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'],
      logoUrl: null
    },
    {
      id: 2,
      name: 'Mumbai T20 Championship',
      type: 'T20 Tournament',
      totalMatches: 12,
      scoredMatches: 12,
      startDate: '2023-08-01',
      endDate: '2023-08-20',
      status: 'completed',
      venue: 'Wankhede Stadium',
      completedAt: '2023-08-20 22:15',
      description: 'Local Mumbai T20 Championship Tournament',
      teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'],
      logoUrl: null
    },
    {
      id: 3,
      name: 'Corporate Cricket League 2023',
      type: 'Corporate League',
      totalMatches: 18,
      scoredMatches: 18,
      startDate: '2023-07-10',
      endDate: '2023-08-05',
      status: 'completed',
      venue: 'Various Corporate Grounds',
      completedAt: '2023-08-05 19:45',
      description: 'Inter-corporate cricket tournament featuring IT companies',
      teams: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Accenture'],
      logoUrl: null
    },
    {
      id: 4,
      name: 'State Under-19 Championship',
      type: 'Youth Tournament',
      totalMatches: 8,
      scoredMatches: 8,
      startDate: '2023-06-15',
      endDate: '2023-06-25',
      status: 'completed',
      venue: 'Youth Cricket Academy',
      completedAt: '2023-06-25 17:30',
      description: 'Maharashtra State Under-19 Cricket Championship',
      teams: ['Mumbai U19', 'Pune U19', 'Nagpur U19', 'Nashik U19'],
      logoUrl: null
    }
  ];

  const [selectedTournament, setSelectedTournament] = useState(null);

  // Mock data for matches within a tournament
  const getTournamentMatches = (tournamentId) => {
    const matchesData = {
      1: [ // IPL 2023 League Stage matches
        {
          id: 1,
          team1: 'Mumbai Indians',
          team2: 'Chennai Super Kings',
          venue: 'Wankhede Stadium',
          date: '2023-10-12',
          time: '19:30',
          status: 'completed',
          finalScore: 'MI 195/7 (20) vs CSK 192/8 (20)',
          result: 'Mumbai Indians won by 3 runs',
          matchType: 'T20',
          tournamentMatch: 'Match 25'
        },
        {
          id: 2,
          team1: 'Royal Challengers Bangalore',
          team2: 'Kolkata Knight Riders',
          venue: 'Eden Gardens',
          date: '2023-10-10',
          time: '15:30',
          status: 'completed',
          finalScore: 'RCB 178/9 (20) vs KKR 182/4 (19.3)',
          result: 'Kolkata Knight Riders won by 6 wickets',
          matchType: 'T20',
          tournamentMatch: 'Match 24'
        },
        {
          id: 3,
          team1: 'Delhi Capitals',
          team2: 'Punjab Kings',
          venue: 'Arun Jaitley Stadium',
          date: '2023-10-08',
          time: '14:00',
          status: 'completed',
          finalScore: 'DC 201/5 (20) vs PBKS 198/7 (20)',
          result: 'Delhi Capitals won by 3 runs',
          matchType: 'T20',
          tournamentMatch: 'Match 23'
        }
      ],
      2: [ // Mumbai T20 Championship matches
        {
          id: 4,
          team1: 'Team A',
          team2: 'Team B',
          venue: 'Wankhede Stadium',
          date: '2023-08-20',
          time: '19:30',
          status: 'completed',
          finalScore: 'Team A 165/8 (20) vs Team B 168/5 (19.2)',
          result: 'Team B won by 5 wickets',
          matchType: 'T20',
          tournamentMatch: 'Final'
        },
        {
          id: 5,
          team1: 'Team C',
          team2: 'Team D',
          venue: 'Wankhede Stadium',
          date: '2023-08-18',
          time: '15:30',
          status: 'completed',
          finalScore: 'Team C 142/9 (20) vs Team D 145/7 (18.4)',
          result: 'Team D won by 3 wickets',
          matchType: 'T20',
          tournamentMatch: 'Semi Final 1'
        }
      ]
    };
    return matchesData[tournamentId] || [];
  };

  // If a tournament is selected, show tournament details page
  if (selectedTournament) {
    const tournamentMatches = getTournamentMatches(selectedTournament.id);
    
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: '#E3F5FF' }}>
        <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedTournament(null)}
              className="flex items-center text-[#16638A] hover:text-[#1a7ca8] font-medium transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tournaments
            </button>
          </div>

          {/* Tournament Header */}
          <section className="mb-8 w-full">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h1 className="text-3xl font-bold mb-2 text-[#16638A]">{selectedTournament.name}</h1>
              <p className="text-gray-600 mb-4">{selectedTournament.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <p className="text-gray-600">{selectedTournament.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <p className="text-gray-600">{selectedTournament.startDate} to {selectedTournament.endDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Venue:</span>
                  <p className="text-gray-600">{selectedTournament.venue}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Matches Scored:</span>
                  <p className="text-gray-600">{selectedTournament.scoredMatches}/{selectedTournament.totalMatches}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tournament Statistics */}
          <section className="mb-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
                <h3 className="text-2xl font-bold text-[#16638A]">{selectedTournament.totalMatches}</h3>
                <p className="text-gray-600">Total Matches</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
                <h3 className="text-2xl font-bold text-[#16638A]">{selectedTournament.scoredMatches}</h3>
                <p className="text-gray-600">Matches Scored</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
                <h3 className="text-2xl font-bold text-[#16638A]">{selectedTournament.teams.length}</h3>
                <p className="text-gray-600">Teams</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
                <h3 className="text-2xl font-bold text-[#16638A]">100%</h3>
                <p className="text-gray-600">Completion Rate</p>
              </div>
            </div>
          </section>

          {/* Tournament Matches */}
          <section className="mb-10 w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Tournament Matches</h2>
            {tournamentMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {tournamentMatches.map((match) => (
                  <div 
                    key={match.id} 
                    className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full"
                  >
                    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                      <span className="font-bold">{match.tournamentMatch}</span>
                      <span className="text-sm">{match.date}</span>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg text-gray-800">{match.team1}</h3>
                        <div className="text-right">
                          <span className="font-bold text-gray-800">{match.finalScore.split(' vs ')[0]}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800">{match.team2}</h3>
                        <div className="text-right">
                          <span className="font-bold text-gray-800">{match.finalScore.split(' vs ')[1]}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm font-semibold text-blue-700 text-center">{match.result}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Venue:</span> {match.venue}</p>
                        <p><span className="font-medium">Match Time:</span> {match.time}</p>
                      </div>
                    </div>
                    <div className="p-4 text-center border-t border-gray-200">
                      <button
                        className="inline-block w-3/4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200"
                        onClick={() => alert(`Viewing details for ${match.tournamentMatch}`)}
                      >
                        View Match Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-white rounded-lg p-8 shadow-md text-center border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-gray-600">No matches found for this tournament.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // Main tournaments page
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E3F5FF' }}>
      <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
        {/* Header Section */}
        <section className="mb-8 w-full">
          <h1 className="text-3xl font-bold mb-2 text-[#16638A]">Completed Tournaments</h1>
          <p className="text-gray-600">Tournaments you have successfully completed scoring</p>
        </section>

        {/* Statistics Section */}
        <section className="mb-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">{completedTournaments.length}</h3>
              <p className="text-gray-600">Total Tournaments</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">
                {completedTournaments.reduce((total, tournament) => total + tournament.scoredMatches, 0)}
              </h3>
              <p className="text-gray-600">Total Matches Scored</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">2</h3>
              <p className="text-gray-600">This Quarter</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">100%</h3>
              <p className="text-gray-600">Completion Rate</p>
            </div>
          </div>
        </section>

        {/* Completed Tournaments Section */}
        <section className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Tournament History</h2>
          {completedTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {completedTournaments.map((tournament) => (
                <div 
                  key={tournament.id} 
                  className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center">
                    <span className="font-bold">COMPLETED</span>
                    <span className="text-sm">{tournament.endDate}</span>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{tournament.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tournament.description}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Matches Scored:</span>
                        <span className="text-sm font-bold text-purple-700">
                          {tournament.scoredMatches}/{tournament.totalMatches}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Type:</span> {tournament.type}</p>
                      <p><span className="font-medium">Venue:</span> {tournament.venue}</p>
                      <p><span className="font-medium">Duration:</span> {tournament.startDate} to {tournament.endDate}</p>
                      <p><span className="font-medium">Teams:</span> {tournament.teams.length} teams</p>
                    </div>
                  </div>
                  <div className="p-4 text-center border-t border-gray-200">
                    <span className="text-sm text-gray-500 block mb-2">
                      Completed on {new Date(tournament.completedAt).toLocaleDateString()}
                    </span>
                    <div className="w-3/4 mx-auto bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200">
                      View Tournament Details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full bg-white rounded-lg p-8 shadow-md text-center border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Tournaments</h3>
              <p className="text-gray-600">You haven't completed scoring any tournaments yet.</p>
              <button
                className="inline-block mt-4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-6 rounded transition duration-200"
                onClick={() => alert('Navigate to available tournaments')}
              >
                View Available Tournaments
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Tournaments;