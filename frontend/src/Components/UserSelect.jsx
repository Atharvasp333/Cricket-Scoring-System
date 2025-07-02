import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const UserSelect = ({ role, value, onChange, label, placeholder, className, required }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/users/role/${role}`);
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-700 font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
        disabled={loading}
        required={required}
      >
        <option value="">{placeholder || 'Select a user'}</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.displayName} ({user.email})
          </option>
        ))}
      </select>
      {loading && <p className="text-gray-500 text-sm mt-1">Loading users...</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default UserSelect;