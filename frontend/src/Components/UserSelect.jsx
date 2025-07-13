import React from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';

const UserSelect = ({
  users,
  selectedUsers,
  onSelect,
  placeholder = 'Select users...',
  className = '',
}) => {
  const availableUsers = users.filter(
    (user) => !selectedUsers.some((selected) => selected.id === user.id)
  );

  const handleSelect = (e) => {
    const userId = e.target.value;
    if (!userId) return;
    
    const userToAdd = users.find((u) => u.id === userId);
    if (userToAdd) {
      onSelect([...selectedUsers, userToAdd]);
    }
  };

  const handleRemove = (userId) => {
    onSelect(selectedUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className={className}>
      <select
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value=""
        onChange={handleSelect}
        disabled={availableUsers.length === 0}
      >
        <option value="">
          {availableUsers.length > 0 ? placeholder : 'No more users to add'}
        </option>
        {availableUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      
      {selectedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center rounded-full bg-indigo-100 py-1 pl-3 pr-2 text-sm font-medium text-indigo-700"
            >
              {user.name}
              <button
                type="button"
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                onClick={() => handleRemove(user.id)}
              >
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

UserSelect.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

UserSelect.defaultProps = {
  placeholder: 'Select users...',
  className: '',
};

export default UserSelect;
