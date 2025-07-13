import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({
  label,
  labelFor,
  required = false,
  helpText,
  error,
  children,
  className = '',
  labelClassName = '',
  contentClassName = '',
  inline = false
}) => {
  return (
    <div className={`${inline ? 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start' : 'mb-4'} ${className}`}>
      {label && (
        <label 
          htmlFor={labelFor}
          className={`block text-sm font-medium text-gray-700 ${inline ? 'sm:mt-2' : 'mb-1'} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`${inline ? 'mt-1 sm:mt-0 sm:col-span-2' : ''} ${contentClassName}`}>
        {children}
        
        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helpText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string,
  labelFor: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  inline: PropTypes.bool
};

export default FormGroup;
