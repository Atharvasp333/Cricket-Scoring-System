import React from 'react';
import UserSelect from '../../../Components/UserSelect';

const TeamCard = ({ team, index, handleChange, handleRemove }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col gap-4 border">
    <div className="flex flex-col md:flex-row gap-4">
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
    </div>
    
    <div className="border-t pt-4">
      <h3 className="text-md font-semibold mb-2 text-gray-800">Team Captain</h3>
      {/* Dummy users array for selection (replace with real data/fetch) */}
      <UserSelect 
        users={[
          { id: '662e00000000000000000001', name: 'Player 1' },
          { id: '662e00000000000000000002', name: 'Player 2' },
          { id: '662e00000000000000000003', name: 'Player 3' },
          { id: '662e00000000000000000004', name: 'Player 4' }
        ]}
        selectedUsers={team.captains || []}
        onSelect={(value) => handleChange(index, 'captains', value)}
        placeholder="Select a player as captain"
        className="mb-2"
      />
      <p className="text-sm text-gray-500">The captain will be able to approve player registrations for this team.</p>
    </div>
    
    <div className="flex justify-end">
      <button type="button" onClick={() => handleRemove(index)} className="text-red-600 font-bold">Remove Team</button>
    </div>
  </div>
);

const TournamentTeams = ({ data, updateData, nextStep, prevStep }) => {
  // Only use default teams if data.teams is undefined (not just empty)
  const teams = (Array.isArray(data.teams) && data.teams.length > 0)
    ? data.teams
    : (data.teams === undefined
        ? [
            { name: '', coach: '', logo: null, captains: [] },
            { name: '', coach: '', logo: null, captains: [] }
          ]
        : []);
  const [error, setError] = React.useState('');

  const handleChange = (idx, field, value) => {
    const updated = [...teams];
    updated[idx] = { ...updated[idx], [field]: value };
    updateData({ teams: updated });
  };

  const handleAdd = () => {
    const updated = [...teams, { name: '', coach: '', logo: null, captains: [] }];
    updateData({ teams: updated });
  };

  const handleRemove = (idx) => {
    if (teams.length > 2) {
      const updated = teams.filter((_, i) => i !== idx);
      updateData({ teams: updated });
    }
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