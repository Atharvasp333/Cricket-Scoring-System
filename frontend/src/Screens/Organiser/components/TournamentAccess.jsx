import React, { useState } from 'react';

const ROLES = ['Scorer', 'Umpire'];

const AccessCard = ({ entry, index, handleChange, handleRemove }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-end gap-4 border">
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Name</label>
        <input type="text" value={entry.name} onChange={e => handleChange(index, 'name', e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Role</label>
        <select value={entry.role} onChange={e => handleChange(index, 'role', e.target.value)} className="w-full border rounded px-3 py-2 mb-2">
          <option value="">Select</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
        <input type="email" value={entry.email} onChange={e => handleChange(index, 'email', e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
      </div>
    </div>
    <button type="button" onClick={() => handleRemove(index)} className="text-red-600 font-bold mt-2 md:mt-0 md:ml-4">Remove</button>
  </div>
);

const TournamentAccess = ({ data, updateData, nextStep, prevStep }) => {
  const [access, setAccess] = useState(data.access || []);
  const [newEntry, setNewEntry] = useState({ name: '', role: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (idx, field, value) => {
    setAccess(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleRemove = (idx) => {
    setAccess(prev => prev.filter((_, i) => i !== idx));
  };

  const handleNewChange = (field, value) => {
    setNewEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newEntry.name.trim() || !newEntry.role || !newEntry.email.trim()) {
      setError('Please fill in all fields to send invite.');
      return;
    }
    setAccess(prev => [...prev, newEntry]);
    setNewEntry({ name: '', role: '', email: '' });
    setError('');
  };

  const handleContinue = (e) => {
    e.preventDefault();
    updateData({ access });
    nextStep();
  };

  return (
    <form className="bg-white shadow rounded-lg p-6" onSubmit={handleContinue}>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Scorer and Umpire Access</h2>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      {access.map((entry, idx) => (
        <AccessCard key={idx} entry={entry} index={idx} handleChange={handleChange} handleRemove={handleRemove} />
      ))}
      <div className="bg-gray-100 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-end gap-4 border">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input type="text" placeholder="Name" value={newEntry.name} onChange={e => handleNewChange('name', e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
          </div>
          <div>
            <select value={newEntry.role} onChange={e => handleNewChange('role', e.target.value)} className="w-full border rounded px-3 py-2 mb-2">
              <option value="">Role</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <input type="email" placeholder="Email Address" value={newEntry.email} onChange={e => handleNewChange('email', e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
          </div>
        </div>
        <button type="button" onClick={handleInvite} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 md:ml-4 mt-2 md:mt-0">
          Send Invite
        </button>
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

export default TournamentAccess; 