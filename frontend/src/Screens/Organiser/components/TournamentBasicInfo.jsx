import React, { useState } from 'react';

const TOURNAMENT_TYPES = ['League', 'Knockout', 'Round-robin', 'Custom'];

const TournamentBasicInfo = ({ data, updateData, nextStep }) => {
  const [form, setForm] = useState({
    name: data.name || '',
    type: data.type || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    location: data.location || '',
    banner: data.banner || null,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'banner') {
      setForm((prev) => ({ ...prev, banner: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.name.trim() || !form.type || !form.startDate || !form.endDate || !form.location.trim()) {
      setError('Please fill in all required fields.');
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
      <h2 className="text-xl font-bold mb-6 text-gray-800">Basic Tournament Info</h2>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Tournament Name *</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Tournament Type *</label>
        <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
          <option value="">Select type</option>
          {TOURNAMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">End Date *</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Location / Venue *</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Tournament Banner (optional)</label>
        <input type="file" name="banner" accept="image/*" onChange={handleChange} className="w-full" />
      </div>
      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
        Save and Continue
      </button>
    </form>
  );
};

export default TournamentBasicInfo; 