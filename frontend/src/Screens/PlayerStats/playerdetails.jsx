import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {playersData} from '../../data/playersData'

const PlayerDetailsPage = () => {
  const { playerId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    team: 'all',
    opponent: 'all',
    format: 'all',
    year: 'all',
    minRuns: '',
    maxRuns: ''
  });
  const player = playersData[playerId-1]; // Directly access by key instead of using .find()
   // For now, let's assume you've moved the players data to a shared file:
  // const player = playersData.find(p => p.id === parseInt(playerId));
  if (!player) {
    return <div>Player not found</div>;
  }

  // Filter matches based on search and filters
  const filteredMatches = player.matches.filter(match => {
    const matchesSearch = match.opponent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filters.team === 'all' || match.team === filters.team;
    const matchesOpponent = filters.opponent === 'all' || match.opponent === filters.opponent;
    const matchesFormat = filters.format === 'all' || match.format === filters.format;
    const matchesYear = filters.year === 'all' || match.date.startsWith(filters.year);
    const matchesMinRuns = !filters.minRuns || match.runs >= parseInt(filters.minRuns);
    const matchesMaxRuns = !filters.maxRuns || match.runs <= parseInt(filters.maxRuns);
    
    return matchesSearch && matchesTeam && matchesOpponent && matchesFormat && 
           matchesYear && matchesMinRuns && matchesMaxRuns;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Stadium Background */}
      <div 
        className="relative h-96 bg-blue-900 overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
        
        <div className="relative container mx-auto px-6 h-full flex items-center">
          {/* Player Image */}
          <div className="w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                #{player.id}
              </div>
            </div>
          </div>
          
          {/* Player Info */}
          <div className="w-2/3 text-white pl-12">
            <h1 className="text-5xl font-bold mb-2">{player.name}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm mr-3">{player.role}</span>
              <span className="text-blue-200">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {player.city}, {player.country}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-8">
              <StatCard value={player.careerStats.totalMatches} label="Matches" />
              <StatCard value={player.careerStats.totalRuns} label="Total Runs" />
              <StatCard value={player.careerStats.highestScore} label="Highest" suffix="*" />
              <StatCard value={player.careerStats.average} label="Average" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 -mt-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Filters Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search matches by opponent..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-3">
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.team}
                  onChange={(e) => setFilters({...filters, team: e.target.value})}
                >
                  <option value="all">All Teams</option>
                  {player.teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.opponent}
                  onChange={(e) => setFilters({...filters, opponent: e.target.value})}
                >
                  <option value="all">All Opponents</option>
                  <option value="Australia">Australia</option>
                  <option value="England">England</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Pakistan">Pakistan</option>
                </select>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.format}
                  onChange={(e) => setFilters({...filters, format: e.target.value})}
                >
                  <option value="all">All Formats</option>
                  <option value="Test">Test</option>
                  <option value="ODI">ODI</option>
                  <option value="T20">T20</option>
                </select>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                >
                  <option value="all">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Runs</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.minRuns}
                  onChange={(e) => setFilters({...filters, minRuns: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Runs</label>
                <input
                  type="number"
                  placeholder="300"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.maxRuns}
                  onChange={(e) => setFilters({...filters, maxRuns: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          {/* Matches Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balls</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">4s/6s</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map(match => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(match.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{match.team} vs {match.opponent}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.format}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{match.runs}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.balls}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.strikeRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-blue-600">{match.fours}</span> / <span className="text-green-600">{match.sixes}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          match.result === 'Won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {match.result}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No matches found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Career Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-3">
              <h3 className="text-lg font-medium text-white">Batting Summary</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <StatBox value={player.careerStats.centuries} label="Centuries" icon="🏆" />
                <StatBox value={player.careerStats.halfCenturies} label="Half Centuries" icon="🟢" />
                <StatBox value={player.careerStats.strikeRate} label="Strike Rate" icon="⚡" />
                <StatBox value={player.matches.filter(m => m.runs >= 100).length} label="100+ Scores" icon="💯" />
                <StatBox value={player.matches.filter(m => m.runs >= 50 && m.runs < 100).length} label="50+ Scores" icon="5️⃣0️⃣" />
                <StatBox value={player.matches.filter(m => m.runs === 0).length} label="Ducks" icon="🦆" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-3">
              <h3 className="text-lg font-medium text-white">Performance Against Teams</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {['Australia', 'England', 'New Zealand', 'South Africa', 'Pakistan'].map(team => {
                  const vsMatches = player.matches.filter(m => m.opponent === team);
                  const totalRuns = vsMatches.reduce((sum, m) => sum + m.runs, 0);
                  const average = vsMatches.length > 0 ? (totalRuns / vsMatches.length).toFixed(2) : 0;
                  const centuries = vsMatches.filter(m => m.runs >= 100).length;
                  
                  return (
                    <div key={team} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{team}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {vsMatches.length} matches
                        </span>
                        <span className="text-sm text-gray-600">{average} avg</span>
                        <span className="text-sm text-gray-600">{totalRuns} runs</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {centuries} 💯
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable components
const StatCard = ({ value, label, suffix = '' }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-white mb-1">{value}{suffix}</div>
    <div className="text-sm text-blue-200 uppercase tracking-wider">{label}</div>
  </div>
);

const StatBox = ({ value, label, icon }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-lg font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default PlayerDetailsPage;