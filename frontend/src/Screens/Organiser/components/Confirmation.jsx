import React from 'react';

const Confirmation = ({ data, prevStep, submit }) => {

    const DetailItem = ({ label, value }) => (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
        </div>
    );

    const PlayerList = ({ players }) => (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
            {players.map((player, index) => (
                <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                        <span className="ml-2 w-0 flex-1 truncate font-medium">{player.name}</span>
                        <span className="flex-shrink-0 text-gray-500">{player.role}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        {player.isCaptain && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">C</span>}
                        {player.isWicketKeeper && <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">WK</span>}
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Confirmation</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Match Summary</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Please review all details before creating the match.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="sm:px-6">
                            <DetailItem label="Match Name" value={data.match_name} />
                            <DetailItem label="Match Type" value={data.match_type} />
                            <DetailItem label="Teams" value={`${data.team1_name} vs ${data.team2_name}`} />
                            <DetailItem label="Venue" value={data.venue} />
                            <DetailItem label="Date" value={data.dateTime ? data.dateTime.split('T')[0] : data.date} />
                            <DetailItem label="Time" value={data.dateTime ? data.dateTime.split('T')[1] : data.time} />
                            <DetailItem label="Status" value={data.status || 'Upcoming'} />
                        </div>
                        
                        {/* Team 1 Captain */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">{data.team1_name} Captain</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {data.team1_captains && data.team1_captains.length > 0 ? (
                                    <div className="flex items-center">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 mr-2">C</span>
                                        {typeof data.team1_captains[0] === 'object' ? data.team1_captains[0].displayName : data.team1_captains[0]}
                                    </div>
                                ) : (
                                    <span className="text-gray-500">No captain assigned</span>
                                )}
                            </dd>
                        </div>
                        
                        {/* Team 2 Captain */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">{data.team2_name} Captain</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {data.team2_captains && data.team2_captains.length > 0 ? (
                                    <div className="flex items-center">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 mr-2">C</span>
                                        {typeof data.team2_captains[0] === 'object' ? data.team2_captains[0].displayName : data.team2_captains[0]}
                                    </div>
                                ) : (
                                    <span className="text-gray-500">No captain assigned</span>
                                )}
                            </dd>
                        </div>
                        
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">{data.team1_name} Players</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <PlayerList players={data.team1_players} />
                            </dd>
                        </div>
                         <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">{data.team2_name} Players</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <PlayerList players={data.team2_players} />
                            </dd>
                        </div>
                        <div className="sm:px-6">
                            <DetailItem label="Total Overs" value={data.total_overs} />
                            <DetailItem label="Powerplay Overs" value={data.powerplay_overs} />
                            <DetailItem label="DRS Enabled" value={data.drs_enabled ? 'Yes' : 'No'} />
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Invited Scorers</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {data.scorers && data.scorers.length > 0 ? data.scorers.join(', ') : 'None'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                    Back
                </button>
                <button onClick={submit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Create Match
                </button>
            </div>
        </div>
    );
};

export default Confirmation;