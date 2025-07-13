import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../exports';

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  showButton = true,
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icons.FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${inputClassName}`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={autoFocus}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icons.FiX className="h-4 w-4 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>
      {showButton && (
        <button
          type="submit"
          className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${buttonClassName}`}
        >
          Search
        </button>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  showButton: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default SearchBar;