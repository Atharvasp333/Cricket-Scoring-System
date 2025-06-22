import React, { useState } from 'react';

const ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

const PlayerCard = ({ player, index, handleChange, handleRemove, teamOptions }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-end gap-4 border">
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Player Name</label>
        <input type="text" value={player.name} onChange={e => handleChange(index, 'name', e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Role</label>
        <select value={player.role} onChange={e => handleChange(index, 'role', e.target.value)} className="w-full border rounded px-3 py-2 mb-2">
          <option value="">Select</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Team Association</label>
        <select value={player.team} onChange={e => handleChange(index, 'team', e.target.value)} className="w-full border rounded px-3 py-2 mb-2">
          <option value="">Select</option>
          {teamOptions.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={player.isCaptain} onChange={e => handleChange(index, 'isCaptain', e.target.checked)} className="mr-2" />
          Captain
        </label>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={player.isWicketKeeper} onChange={e => handleChange(index, 'isWicketKeeper', e.target.checked)} className="mr-2" />
          Wicket-Keeper
        </label>
      </div>
    </div>
    <button type="button" onClick={() => handleRemove(index)} className="text-red-600 font-bold mt-2 md:mt-0 md:ml-4">Remove</button>
  </div>
);

const TournamentPlayerPool = ({ data, updateData, nextStep, prevStep }) => {
  const [players, setPlayers] = useState(data.players || []);
  const teamOptions = data.teams || [];

  const handleChange = (idx, field, value) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setPlayers(prev => [...prev, { name: '', role: '', team: '', isCaptain: false, isWicketKeeper: false }]);
  };

  const handleRemove = (idx) => {
    setPlayers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    updateData({ players });
    nextStep();
  };

  const handleSkip = (e) => {
    e.preventDefault();
    updateData({ players: [] });
    nextStep();
  };

  return (
    <form className="bg-white shadow rounded-lg p-6" onSubmit={handleContinue}>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Player Pool (Optional)</h2>
      {players.map((player, idx) => (
        <PlayerCard key={idx} player={player} index={idx} handleChange={handleChange} handleRemove={handleRemove} teamOptions={teamOptions} />
      ))}
      <button type="button" onClick={handleAdd} className="mb-6 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition-all duration-300">
        + Add Player
      </button>
      <div className="mt-8 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Back
        </button>
        <div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 mr-2">
            Add Player & Continue
          </button>
          <button type="button" onClick={handleSkip} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
            Skip and Continue
          </button>
        </div>
      </div>
    </form>
  );
};

export default TournamentPlayerPool; 