import React from 'react';

const TIE_BREAKERS = ['Super Over', 'Shared', 'NRR', 'Custom'];

const TournamentRules = ({ data, updateData, nextStep, prevStep }) => {
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateData({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    if (!data.maxPlayers || !data.overs || !data.tieBreaker) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (data.drsEnabled && !data.drsReviews) {
      setError('Please specify number of DRS reviews.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  return (
    <form className="bg-white shadow rounded-lg p-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Match Rules and Settings</h2>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Max Players per Team *</label>
          <input type="number" name="maxPlayers" value={data.maxPlayers || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Overs per Match *</label>
          <input type="number" name="overs" value={data.overs || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Powerplay Rules</label>
        <input type="text" name="powerplay" value={data.powerplay || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. First 6 overs" />
      </div>
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 font-semibold mr-4">DRS Enabled</label>
        <input type="checkbox" name="drsEnabled" checked={!!data.drsEnabled} onChange={handleChange} className="h-5 w-5" />
      </div>
      {data.drsEnabled && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Number of Reviews per Innings *</label>
          <input type="number" name="drsReviews" value={data.drsReviews || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Tie Breaker Rule *</label>
        <select name="tieBreaker" value={data.tieBreaker || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
          <option value="">Select</option>
          {TIE_BREAKERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mb-6 flex items-center">
        <label className="block text-gray-700 font-semibold mr-4">Allow Custom Scoring Rules</label>
        <input type="checkbox" name="customScoring" checked={!!data.customScoring} onChange={handleChange} className="h-5 w-5" />
      </div>
      <div className="mt-8 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Back
        </button>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Save and Continue
        </button>
      </div>
    </form>
  );
};

export default TournamentRules; 