import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const UserSelect = ({ 
  role, 
  value, 
  onChange, 
  label, 
  placeholder, 
  className, 
  required,
  options, // Allow passing options directly
  showEmail = true // Option to show/hide email
}) => {
  const [users, setUsers] = useState(options || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch users if options aren't provided and role is specified
    if (!options && role) {
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
    }
  }, [role, options]);

  // If options are provided, use them instead of fetched users
  useEffect(() => {
    if (options) {
      setUsers(options);
    }
  }, [options]);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedUser = users.find(user => user.value === selectedValue);
    
    // Pass both the ID and the full user object if available
    onChange(selectedValue, selectedUser);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-700 font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        disabled={loading || (options && options.length === 0)}
        required={required}
      >
        <option value="">{placeholder || 'Select a user'}</option>
        {users.map((user) => (
          <option key={user.value || user._id} value={user.value || user._id}>
            {user.label || user.displayName}
            {showEmail && user.email && ` (${user.email})`}
          </option>
        ))}
      </select>
      {loading && <p className="text-gray-500 text-sm mt-1">Loading users...</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default UserSelect;