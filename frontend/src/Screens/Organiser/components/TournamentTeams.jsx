import React, { useState } from 'react';

const TeamCard = ({ team, index, handleChange, handleRemove }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-end gap-4 border">
    <div className="flex-1">
      <label className="block text-gray-700 font-semibold mb-1">Team Name *</label>
      <input type="text" name="name" value={team.name} onChange={e => handleChange(index, 'name', e.target.value)} className="w-full border rounded px-3 py-2 mb-2" required />
      <label className="block text-gray-700 font-semibold mb-1">Coach/Manager Name *</label>
      <input type="text" name="coach" value={team.coach} onChange={e => handleChange(index, 'coach', e.target.value)} className="w-full border rounded px-3 py-2" required />
    </div>
    <div>
      <label className="block text-gray-700 font-semibold mb-1">Team Logo (optional)</label>
      <input type="file" accept="image/*" onChange={e => handleChange(index, 'logo', e.target.files[0])} className="mb-2" />
      {team.logo && typeof team.logo === 'object' && (
        <img src={URL.createObjectURL(team.logo)} alt="Team Logo" className="w-16 h-16 object-cover rounded border" />
      )}
    </div>
    <button type="button" onClick={() => handleRemove(index)} className="text-red-600 font-bold mt-2 md:mt-0 md:ml-4">Remove</button>
  </div>
);

const TournamentTeams = ({ data, updateData, nextStep, prevStep }) => {
  const [teams, setTeams] = useState(data.teams || [
    { name: '', coach: '', logo: null },
    { name: '', coach: '', logo: null }
  ]);
  const [error, setError] = useState('');

  const handleChange = (idx, field, value) => {
    setTeams(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setTeams(prev => [...prev, { name: '', coach: '', logo: null }]);
  };

  const handleRemove = (idx) => {
    setTeams(prev => prev.length > 2 ? prev.filter((_, i) => i !== idx) : prev);
  };

  const validate = () => {
    if (teams.length < 2) {
      setError('At least two teams are required.');
      return false;
    }
    for (let t of teams) {
      if (!t.name.trim() || !t.coach.trim()) {
        setError('Please fill in all required fields for each team.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) {
      updateData({ teams });
      nextStep();
    }
  };

  return (
    <form className="bg-white shadow rounded-lg p-6" onSubmit={handleContinue}>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Team Registration</h2>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      {teams.map((team, idx) => (
        <TeamCard key={idx} team={team} index={idx} handleChange={handleChange} handleRemove={handleRemove} />
      ))}
      <button type="button" onClick={handleAdd} className="mb-6 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition-all duration-300">
        + Add Team
      </button>
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

export default TournamentTeams; 