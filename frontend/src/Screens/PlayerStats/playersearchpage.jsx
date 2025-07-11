// import { useState } from 'react';
// import ViewDetailedStats from '../../Components/ViewDetailedStats';
// import { Link , useParams } from 'react-router-dom';
 
// const PlayerSearchPage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
 
//   // Static player data
//   const players = [
//     {
//       id: 1,
//       name: 'Rohit Sharma',
//       role: 'Batsman',
//       matches: 243,
//       runs: 9844,
//       average: 48.97,
//       highest: 264,
//       image: 'https://example.com/rohit.jpg',
//       team: 'India'
//     },
//     {
//       id: 2,
//       name: 'Virat Kohli',
//       role: 'Batsman',
//       matches: 275,
//       runs: 12898,
//       average: 57.32,
//       highest: 183,
//       image: 'https://example.com/kohli.jpg',
//       team: 'India'
//     },
//     {
//       id: 3,
//       name: 'Jasprit Bumrah',
//       role: 'Bowler',
//       matches: 121,
//       wickets: 149,
//       economy: 4.63,
//       best: '5/27',
//       image: 'https://example.com/bumrah.jpg',
//       team: 'India'
//     },
//     {
//       id: 4,
//       name: 'Hardik Pandya',
//       role: 'All-rounder',
//       matches: 87,
//       runs: 1758,
//       wickets: 76,
//       average: 32.55,
//       image: 'https://example.com/hardik.jpg',
//       team: 'India'
//     },
//     {
//       id: 5,
//       name: 'Suryakumar Yadav',
//       role: 'Batsman',
//       matches: 60,
//       runs: 2141,
//       average: 44.60,
//       highest: 117,
//       image: 'https://example.com/surya.jpg',
//       team: 'India'
//     },
//     {
//       id: 6,
//       name: 'Shubman Gill',
//       role: 'Batsman',
//       matches: 44,
//       runs: 2271,
//       average: 61.37,
//       highest: 208,
//       image: 'https://example.com/gill.jpg',
//       team: 'India'
//     },
//     {
//       id: 7,
//       name: 'Tilak Varma',
//       role: 'Batsman',
//       matches: 16,
//       runs: 336,
//       average: 33.60,
//       highest: 51,
//       image: 'https://example.com/tilak.jpg',
//       team: 'India'
//     }
//   ];

//   // Filter players based on search term
//   const filteredPlayers = players.filter(player =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with animated gradient */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-3">
//             Player Stats
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover in-depth statistics and performance metrics of your favorite cricket stars
//           </p>
//         </div>

//         {/* Enhanced Search Bar */}
//         <div className="mb-16 max-w-3xl mx-auto">
//           <div className="relative shadow-lg rounded-xl overflow-hidden">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <svg
//                 className="h-6 w-6 text-blue-400"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-6 py-5 bg-white text-gray-800 placeholder-gray-400 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
//               placeholder="Search players by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm('')}
//                 className="absolute inset-y-0 right-0 pr-4 flex items-center"
//               >
//                 <svg
//                   className="h-5 w-5 text-gray-400 hover:text-gray-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Player Cards with enhanced design */}
//         {filteredPlayers.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {filteredPlayers.map((player) => (
//               <div
//                 key={player.id}
//                 className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 {/* Player Header with gradient */}
//                 <div className="bg-gradient-to-r from-blue-500 to-teal-300 p-5">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h2 className="text-xl font-bold text-white">{player.name}</h2>
//                       <div className="flex items-center py-2 mt-1">
//                         <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-800 bg-opacity-30 text-blue-100 rounded-full">
//                           {player.role}
//                         </span>
//                         <span className="ml-2 text-sm text-blue-100">{player.team}</span>
//                       </div>
//                     </div>
//                     <div className="bg-white bg-opacity-20 rounded-full w-17 h-17 flex items-center justify-center">
//                       <span className="text-xl font-bold text-white">
//                         {player.name.split(' ').map(n => n[0]).join('')}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Player Stats */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     {player.role === 'Bowler' ? (
//                       <>
//                         <StatItem label="Matches" value={player.matches} />
//                         <StatItem label="Wickets" value={player.wickets} />
//                         <StatItem label="Economy" value={player.economy} />
//                         <StatItem label="Best" value={player.best} />
//                       </>
//                     ) : player.role === 'All-rounder' ? (
//                       <>
//                         <StatItem label="Matches" value={player.matches} />
//                         <StatItem label="Runs" value={player.runs} />
//                         <StatItem label="Wickets" value={player.wickets} />
//                         <StatItem label="Average" value={player.average} />
//                       </>
//                     ) : (
//                       <>
//                         <StatItem label="Matches" value={player.matches} />
//                         <StatItem label="Runs" value={player.runs} />
//                         <StatItem label="Average" value={player.average} />
//                         <StatItem label="Highest" value={player.highest} />
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Button */}
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                   <ViewDetailedStats playerId={player.id} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <svg
//                 className="mx-auto h-16 w-16 text-gray-400"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="mt-4 text-lg font-medium text-gray-900">No players found</h3>
//               <p className="mt-2 text-gray-500">
//                 We couldn't find any players matching "{searchTerm}". Try a different name.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Reusable stat component
// const StatItem = ({ label, value }) => (
//   <div className="bg-gray-50 rounded-lg p-3">
//     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
//     <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
//   </div>
// );

// export default PlayerSearchPage;




import { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayerSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Static player data
  const players = [
    {
      id: 1,
      name: 'Rohit Sharma',
      role: 'Batsman',
      matches: 243,
      runs: 9844,
      average: 48.97,
      highest: 264,
      image: 'https://example.com/rohit.jpg',
      team: 'India'
    },
    {
      id: 2,
      name: 'Virat Kohli',
      role: 'Batsman',
      matches: 275,
      runs: 12898,
      average: 57.32,
      highest: 183,
      image: 'https://example.com/kohli.jpg',
      team: 'India'
    },
    {
      id: 3,
      name: 'Jasprit Bumrah',
      role: 'Bowler',
      matches: 121,
      wickets: 149,
      economy: 4.63,
      best: '5/27',
      image: 'https://example.com/bumrah.jpg',
      team: 'India'
    },
    {
      id: 4,
      name: 'Hardik Pandya',
      role: 'All-rounder',
      matches: 87,
      runs: 1758,
      wickets: 76,
      average: 32.55,
      image: 'https://example.com/hardik.jpg',
      team: 'India'
    },
    {
      id: 5,
      name: 'Suryakumar Yadav',
      role: 'Batsman',
      matches: 60,
      runs: 2141,
      average: 44.60,
      highest: 117,
      image: 'https://example.com/surya.jpg',
      team: 'India'
    },
    {
      id: 6,
      name: 'Shubman Gill',
      role: 'Batsman',
      matches: 44,
      runs: 2271,
      average: 61.37,
      highest: 208,
      image: 'https://example.com/gill.jpg',
      team: 'India'
    },
    {
      id: 7,
      name: 'Tilak Varma',
      role: 'Batsman',
      matches: 16,
      runs: 336,
      average: 33.60,
      highest: 51,
      image: 'https://example.com/tilak.jpg',
      team: 'India'
    }
  ];

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // View Detailed Stats button component
  const ViewDetailedStats = ({ playerId }) => {
    return (
      <Link
        to={`/players/${playerId}`}
        className="block w-full text-center text-blue-600 hover:text-blue-800 font-medium px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
      >
        View Detailed Stats →
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated gradient */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-3">
            Player Stats
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover in-depth statistics and performance metrics of your favorite cricket stars
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="relative shadow-lg rounded-xl overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-6 py-5 bg-white text-gray-800 placeholder-gray-400 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
              placeholder="Search players by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Player Cards with enhanced design */}
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Player Header with gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-teal-300 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white">{player.name}</h2>
                      <div className="flex items-center py-2 mt-1">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-800 bg-opacity-30 text-blue-100 rounded-full">
                          {player.role}
                        </span>
                        <span className="ml-2 text-sm text-blue-100">{player.team}</span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {player.role === 'Bowler' ? (
                      <>
                        <StatItem label="Matches" value={player.matches} />
                        <StatItem label="Wickets" value={player.wickets} />
                        <StatItem label="Economy" value={player.economy} />
                        <StatItem label="Best" value={player.best} />
                      </>
                    ) : player.role === 'All-rounder' ? (
                      <>
                        <StatItem label="Matches" value={player.matches} />
                        <StatItem label="Runs" value={player.runs} />
                        <StatItem label="Wickets" value={player.wickets} />
                        <StatItem label="Average" value={player.average} />
                      </>
                    ) : (
                      <>
                        <StatItem label="Matches" value={player.matches} />
                        <StatItem label="Runs" value={player.runs} />
                        <StatItem label="Average" value={player.average} />
                        <StatItem label="Highest" value={player.highest} />
                      </>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <ViewDetailedStats playerId={player.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No players found</h3>
              <p className="mt-2 text-gray-500">
                We couldn't find any players matching "{searchTerm}". Try a different name.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable stat component
const StatItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
  </div>
);

export default PlayerSearchPage;