import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-blue-500`}></div>
      {message && (
        <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
