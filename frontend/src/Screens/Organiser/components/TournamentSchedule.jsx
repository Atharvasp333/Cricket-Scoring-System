import React, { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TournamentSchedule = ({ data, updateData, nextStep, prevStep }) => {
  const [form, setForm] = useState({
    autoGenerate: data.autoGenerate || false,
    days: data.days || [],
    maxMatchesPerDay: data.maxMatchesPerDay || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayChange = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    updateData(form);
    nextStep();
  };

  const handleSkip = (e) => {
    e.preventDefault();
    updateData({ autoGenerate: false, days: [], maxMatchesPerDay: '' });
    nextStep();
  };

  return (
    <form className="bg-white shadow rounded-lg p-6" onSubmit={handleContinue}>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Schedule Preferences (Optional)</h2>
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 font-semibold mr-4">Auto-generate Fixtures</label>
        <input type="checkbox" name="autoGenerate" checked={form.autoGenerate} onChange={handleChange} className="h-5 w-5" />
      </div>
      {form.autoGenerate && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Days of the Week Matches Can Be Played</label>
            <div className="flex flex-wrap gap-4">
              {DAYS.map(day => (
                <label key={day} className="inline-flex items-center">
                  <input type="checkbox" checked={form.days.includes(day)} onChange={() => handleDayChange(day)} className="mr-2" />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Max Matches per Day</label>
            <input type="number" name="maxMatchesPerDay" value={form.maxMatchesPerDay} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" />
          </div>
        </>
      )}
      <div className="mt-8 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
          Back
        </button>
        <div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 mr-2">
            Save and Continue
          </button>
          <button type="button" onClick={handleSkip} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
            Skip and Continue
          </button>
        </div>
      </div>
    </form>
  );
};

export default TournamentSchedule; 