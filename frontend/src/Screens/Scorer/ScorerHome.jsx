import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import api from '../../utils/api';

const ScorerHome = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedMatches = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          setError('You must be logged in to view assigned matches');
          setLoading(false);
          return;
        }
        
        const response = await api.get(`/api/matches/scorer/${user.email}`);
        const matches = response.data;
        
        // Separate matches into live and upcoming
        const live = matches.filter(match => match.status === 'Live');
        const upcoming = matches.filter(match => match.status === 'Upcoming');
        
        setLiveMatches(live);
        setUpcomingMatches(upcoming);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assigned matches:', err);
        setError('Failed to load your assigned matches. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAssignedMatches();
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E3F5FF' }}>
      <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16638A]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            {/* Live Matches Section */}
            <section className="mb-10 w-full">
              <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Live Matches</h2>
              {liveMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {liveMatches.map((match) => (
                    <div 
                      key={match._id} 
                      className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="bg-[#007595] text-white px-4 py-2 flex justify-between items-center">
                        <span className="font-bold">LIVE</span>
                        <span className="text-sm">{match.date} | {match.time}</span>
                      </div>
                      <div className="p-4 flex-grow">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-lg text-gray-800">{match.team1.name}</h3>
                          {/* Score would be added when match is live */}
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg text-gray-800">{match.team2.name}</h3>
                          {/* Score would be added when match is live */}
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{match.venue}</p>
                      </div>
                      <div className="p-4 text-center border-t border-gray-200">
                        <Link
                          to={`/match-setup/${match._id}`}
                          className="inline-block w-3/4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                          Score Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full bg-white rounded-lg p-6 shadow-md text-center border border-gray-200">
                  <p className="text-gray-600">No live matches assigned to you.</p>
                </div>
              )}
            </section>

            {/* Your Assigned Matches Section */}
            <section className="mb-10 w-full">
              <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Your Assigned Matches</h2>
              {upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {upcomingMatches.map((match) => (
                    <div 
                      key={match._id} 
                      className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-4 flex-grow">
                        <div className="flex justify-between items-center mb-4">
                          <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">UPCOMING</span>
                          <span className="text-gray-600 text-sm">{match.date} | {match.time}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">{match.team1.name}</h3>
                        <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">vs</h3>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">{match.team2.name}</h3>
                        <p className="text-gray-600 mb-4">{match.venue}</p>
                        <p className="text-gray-600 mb-4">Match Name: {match.match_name}</p>
                        <p className="text-gray-600 mb-4">Type: {match.match_type}</p>
                      </div>
                      <div className="p-4 text-center border-t border-gray-200">
                        <span className="text-sm text-gray-500 block mb-2">You are assigned as scorer</span>
                        <Link
                          to={`/match-setup/${match._id}`}
                          className="inline-block w-3/4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                          Start Scoring
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full bg-white rounded-lg p-6 shadow-md text-center border border-gray-200">
                  <p className="text-gray-600">No upcoming matches assigned to you.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ScorerHome;