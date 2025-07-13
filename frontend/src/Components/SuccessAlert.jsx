import React from 'react';
import PropTypes from 'prop-types';

const SuccessAlert = ({ message, onDismiss, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`bg-green-50 border-l-4 border-green-400 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-green-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            {message}
            {onDismiss && (
              <button 
                type="button" 
                onClick={onDismiss}
                className="ml-2 text-green-500 hover:text-green-700 focus:outline-none"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

SuccessAlert.propTypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func,
  className: PropTypes.string
};

export default SuccessAlert;
