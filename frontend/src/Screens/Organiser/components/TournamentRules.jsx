import React, { useState } from 'react';

const TIE_BREAKERS = ['Super Over', 'Shared', 'NRR', 'Custom'];

const TournamentRules = ({ data, updateData, nextStep, prevStep }) => {
  const [form, setForm] = useState({
    maxPlayers: data.maxPlayers || '',
    overs: data.overs || '',
    powerplay: data.powerplay || '',
    drsEnabled: data.drsEnabled || false,
    drsReviews: data.drsReviews || '',
    tieBreaker: data.tieBreaker || '',
    customScoring: data.customScoring || false,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    if (!form.maxPlayers || !form.overs || !form.tieBreaker) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (form.drsEnabled && !form.drsReviews) {
      setError('Please specify number of DRS reviews.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateData(form);
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
          <input type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Overs per Match *</label>
          <input type="number" name="overs" value={form.overs} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Powerplay Rules</label>
        <input type="text" name="powerplay" value={form.powerplay} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. First 6 overs" />
      </div>
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 font-semibold mr-4">DRS Enabled</label>
        <input type="checkbox" name="drsEnabled" checked={form.drsEnabled} onChange={handleChange} className="h-5 w-5" />
      </div>
      {form.drsEnabled && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Number of Reviews per Innings *</label>
          <input type="number" name="drsReviews" value={form.drsReviews} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Tie Breaker Rule *</label>
        <select name="tieBreaker" value={form.tieBreaker} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
          <option value="">Select</option>
          {TIE_BREAKERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mb-6 flex items-center">
        <label className="block text-gray-700 font-semibold mr-4">Allow Custom Scoring Rules</label>
        <input type="checkbox" name="customScoring" checked={form.customScoring} onChange={handleChange} className="h-5 w-5" />
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