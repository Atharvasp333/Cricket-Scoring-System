import React from 'react';
import { UserPlus } from 'lucide-react';

const TournamentPlayerPool = ({ data, updateData, nextStep, prevStep }) => {
  const handleContinue = (e) => {
    e.preventDefault();
    // We're not manually adding players anymore, just continue to the next step
    updateData({ players: [] });
    nextStep();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Player Registration</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-4">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-blue-800 mb-2">Self-Registration System</h3>
            <p className="text-blue-700 mb-4">
              Players can now register themselves for tournaments! Once your tournament is created, players will be able to:
            </p>
            <ul className="list-disc pl-5 text-blue-700 mb-4 space-y-2">
              <li>View your tournament on their dashboard</li>
              <li>Submit registration requests with their player details</li>
              <li>Specify their role, team preference, and special positions</li>
            </ul>
            <p className="text-blue-700 mb-2">
              You'll be able to review and approve player registrations from the tournament management page after creation.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
              <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                <li>Create your tournament</li>
                <li>Players submit registration requests</li>
                <li>You review and approve/reject requests</li>
                <li>Approved players are automatically added to your tournament</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Back
        </button>
        <button type="button" onClick={handleContinue} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};


export default TournamentPlayerPool;