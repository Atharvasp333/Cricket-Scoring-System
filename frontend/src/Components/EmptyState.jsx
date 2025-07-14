import React from 'react';

const EmptyState = ({ children, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-8 text-gray-400 ${className}`}>
    {children || <p>No data available.</p>}
  </div>
);

export default EmptyState; 