import React from 'react';

const CompletedMatches = () => {
  // Mock data for completed matches
  const completedMatches = [
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
      scoredBy: 'You',
      completedAt: '2023-10-12 22:45'
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
      scoredBy: 'You',
      completedAt: '2023-10-10 18:20'
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
      scoredBy: 'You',
      completedAt: '2023-10-08 17:30'
    },
    {
      id: 4,
      team1: 'Rajasthan Royals',
      team2: 'Sunrisers Hyderabad',
      venue: 'Rajiv Gandhi Stadium',
      date: '2023-10-05',
      time: '19:30',
      status: 'completed',
      finalScore: 'RR 164/8 (20) vs SRH 167/3 (18.4)',
      result: 'Sunrisers Hyderabad won by 7 wickets',
      matchType: 'T20',
      scoredBy: 'You',
      completedAt: '2023-10-05 22:15'
    },
    {
      id: 5,
      team1: 'Gujarat Titans',
      team2: 'Lucknow Super Giants',
      venue: 'Narendra Modi Stadium',
      date: '2023-10-03',
      time: '15:30',
      status: 'completed',
      finalScore: 'GT 188/6 (20) vs LSG 191/4 (19.2)',
      result: 'Lucknow Super Giants won by 6 wickets',
      matchType: 'T20',
      scoredBy: 'You',
      completedAt: '2023-10-03 18:45'
    },
    {
      id: 6,
      team1: 'Chennai Super Kings',
      team2: 'Royal Challengers Bangalore',
      venue: 'M. A. Chidambaram Stadium',
      date: '2023-10-01',
      time: '19:30',
      status: 'completed',
      finalScore: 'CSK 215/4 (20) vs RCB 218/5 (19.4)',
      result: 'Royal Challengers Bangalore won by 5 wickets',
      matchType: 'T20',
      scoredBy: 'You',
      completedAt: '2023-10-01 22:30'
    }
  ];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E3F5FF' }}>
      <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
        {/* Header Section */}
        <section className="mb-8 w-full">
          <h1 className="text-3xl font-bold mb-2 text-[#16638A]">Completed Matches</h1>
          <p className="text-gray-600">Matches you have successfully scored and completed</p>
        </section>

        {/* Statistics Section */}
        <section className="mb-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">{completedMatches.length}</h3>
              <p className="text-gray-600">Total Matches Scored</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">6</h3>
              <p className="text-gray-600">This Month</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-[#16638A]">100%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </section>

        {/* Completed Matches Section */}
        <section className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Match History</h2>
          {completedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {completedMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full"
                >
                  <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center">
                    <span className="font-bold">COMPLETED</span>
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
                      <p className="text-sm font-semibold text-green-700 text-center">{match.result}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Venue:</span> {match.venue}</p>
                      <p><span className="font-medium">Match Time:</span> {match.time}</p>
                      <p><span className="font-medium">Completed:</span> {new Date(match.completedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 text-center border-t border-gray-200">
                    <span className="text-sm text-gray-500 block mb-2">Scored by you</span>
                    <button
                      className="inline-block w-3/4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200"
                      onClick={() => alert(`Viewing details for match ${match.id}`)}
                    >
                      View Details
                    </button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Matches</h3>
              <p className="text-gray-600">You haven't completed scoring any matches yet.</p>
              <button
                className="inline-block mt-4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-6 rounded transition duration-200"
                onClick={() => alert('Navigate to available matches')}
              >
                View Available Matches
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompletedMatches;