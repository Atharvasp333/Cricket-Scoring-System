import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TournamentReview = ({ data, prevStep }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create tournament');
      // Show toast (replace with your toast system)
      alert('Tournament created successfully!');
      navigate('/organiser-homepage');
    } catch (err) {
      setError('Failed to create tournament. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Final Review and Submission</h2>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
        <div className="mb-2">Name: <span className="font-medium">{data.name}</span></div>
        <div className="mb-2">Type: <span className="font-medium">{data.type}</span></div>
        <div className="mb-2">Dates: <span className="font-medium">{data.startDate} to {data.endDate}</span></div>
        <div className="mb-2">Location: <span className="font-medium">{data.location}</span></div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Teams</h3>
        <ul className="list-disc ml-6">
          {data.teams && data.teams.map((t, i) => (
            <li key={i} className="mb-2">
              <div className="font-medium">{t.name} (Coach: {t.coach})</div>
              {t.captains && t.captains.length > 0 ? (
                <div className="text-sm ml-2 mt-1">
                  Captain: <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    {typeof t.captains[0] === 'object' ? t.captains[0].displayName : t.captains[0]}
                  </span>
                </div>
              ) : (
                <div className="text-sm ml-2 mt-1 text-gray-500">No captain assigned</div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {data.players && data.players.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Player Pool</h3>
          <ul className="list-disc ml-6">
            {data.players.map((p, i) => (
              <li key={i}>{p.name} - {p.role} ({p.team}) {p.isCaptain && 'C'} {p.isWicketKeeper && 'WK'}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Match Rules</h3>
        <div>Max Players: {data.maxPlayers}</div>
        <div>Overs: {data.overs}</div>
        <div>Powerplay: {data.powerplay}</div>
        <div>DRS: {data.drsEnabled ? `Enabled (${data.drsReviews} reviews)` : 'No'}</div>
        <div>Tie Breaker: {data.tieBreaker}</div>
        <div>Custom Scoring: {data.customScoring ? 'Yes' : 'No'}</div>
      </div>
      {(data.autoGenerate || (data.days && data.days.length > 0)) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Schedule Preferences</h3>
          <div>Auto-generate: {data.autoGenerate ? 'Yes' : 'No'}</div>
          {data.autoGenerate && <div>Days: {data.days && data.days.join(', ')}</div>}
          {data.autoGenerate && <div>Max Matches/Day: {data.maxMatchesPerDay}</div>}
        </div>
      )}
      {data.access && data.access.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Scorer/Umpire Access</h3>
          <ul className="list-disc ml-6">
            {data.access.map((a, i) => (
              <li key={i}>{a.name} ({a.role}) - {a.email}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Back
        </button>
        <button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
          {submitting ? 'Creating...' : 'Create Tournament'}
        </button>
      </div>
    </div>
  );
};

export default TournamentReview;