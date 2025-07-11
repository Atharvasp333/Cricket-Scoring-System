import React from 'react';
import { X } from 'lucide-react';

const PlayerRegistrationForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onInputChange,
  teamName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Join {teamName}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Your Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-Rounder">All-Rounder</option>
                  <option value="Wicket-Keeper">Wicket-Keeper</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isWicketKeeper"
                  name="isWicketKeeper"
                  checked={formData.isWicketKeeper}
                  onChange={onInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={formData.role === 'Wicket-Keeper' || isSubmitting}
                />
                <label htmlFor="isWicketKeeper" className="ml-2 block text-sm text-gray-700">
                  I can keep wickets
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerRegistrationForm;
