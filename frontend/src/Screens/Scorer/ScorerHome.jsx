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
    <div className="min-h-screen w-full" style={{ backgroundColor: '#F7F7F7' }}>
      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#0B405B] border-b-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-[#FFEFED] border border-[#FF5340] text-[#FF5340] px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        ) : (
          <>
            {/* Live Matches */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0B405B]">Live Matches</h2>
              {liveMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.map((match) => (
                    <div
                      key={match._id}
                      className="bg-white border border-[#B3AC9B] rounded-xl shadow-md transition-all duration-200 hover:shadow-lg flex flex-col"
                    >
                      <div className="bg-[#0B405B] text-white px-4 py-2 flex justify-between items-center">
                        <span className="text-sm font-semibold">LIVE</span>
                        <span className="text-xs">{match.date} | {match.time}</span>
                      </div>
                      <div className="p-4 flex-grow">
                        <div className="text-lg font-semibold text-gray-900 mb-1">{match.team1_name}</div>
                        <div className="text-lg font-semibold text-gray-900 mb-1">{match.team2_name}</div>
                        <p className="text-sm text-[#676767] mb-2">{match.venue}</p>
                        <p className="text-sm text-[#676767] mb-1">Match: {match.match_name}</p>
                        {match.match_type && (
                          <p className="text-sm text-[#676767]">{match.match_type}</p>
                        )}
                      </div>
                      <div className="p-4 text-center border-t border-[#B3AC9B]">
                        <Link
                          to={`/scoring/${match._id}`}
                          className="inline-block w-full bg-[#0B405B] hover:bg-[#0e5075] text-white text-sm font-bold py-2 rounded transition duration-200"
                        >
                          Score Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#B3AC9B] rounded-xl p-6 text-center text-[#676767]">
                  No live matches assigned to you.
                </div>
              )}
            </section>

            {/* Upcoming Matches */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0B405B]">Your Assigned Matches</h2>
              {upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match._id}
                      className="bg-white border border-[#B3AC9B] rounded-xl shadow-md transition-all duration-200 hover:shadow-lg flex flex-col"
                    >
                      <div className="p-4 flex-grow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="bg-[#676767] text-white px-3 py-1 rounded-full text-xs font-semibold">UPCOMING</span>
                          <span className="text-sm text-[#676767]">{match.date} | {match.time}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{match.team1_name}</h3>
                        <h3 className="text-center text-sm text-gray-700 mb-2">vs</h3>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{match.team2_name}</h3>
                        <p className="text-sm text-[#676767] mb-1">{match.venue}</p>
                        <p className="text-sm text-[#676767] mb-1">Match: {match.match_name}</p>
                        {match.match_type && <p className="text-sm text-[#676767] mb-1">Type: {match.match_type}</p>}
                        <div className="text-xs text-[#676767] mt-2">
                          <p>Overs: {match.total_overs}</p>
                          <p>Powerplay: {match.powerplay_overs}</p>
                          {match.drs_enabled && <p>DRS Enabled</p>}
                        </div>
                      </div>
                      <div className="p-4 text-center border-t border-[#B3AC9B]">
                        <span className="text-xs text-[#676767] block mb-2">You are assigned as scorer</span>
                        <Link
                          to={`/match-setup/${match._id}`}
                          className="inline-block w-full bg-[#0B405B] hover:bg-[#0e5075] text-white text-sm font-bold py-2 rounded transition duration-200"
                        >
                          Start Scoring
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#B3AC9B] rounded-xl p-6 text-center text-[#676767]">
                  No upcoming matches assigned to you.
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
