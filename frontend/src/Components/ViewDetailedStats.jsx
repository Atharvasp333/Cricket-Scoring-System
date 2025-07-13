import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

const ViewDetailedStats = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 ${className}`}
    >
      <FiBarChart2 className="mr-1 h-4 w-4" />
      View Detailed Stats
    </button>
  );
};

export default ViewDetailedStats;
