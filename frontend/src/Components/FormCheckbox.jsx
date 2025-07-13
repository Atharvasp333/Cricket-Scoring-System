import React from 'react';
import PropTypes from 'prop-types';

const FormCheckbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  error = '',
  helpText = '',
  className = '',
  labelClassName = '',
  ...props
}) => {
  const inputId = id || name;
  
  return (
    <div className={`relative flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`h-4 w-4 rounded ${error ? 'border-red-300 text-red-600 focus:ring-red-500' : 'border-gray-300 text-[#16638A] focus:ring-[#16638A]'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          {...props}
        />
      </div>
      
      <div className="ml-3 text-sm">
        {label && (
          <label 
            htmlFor={inputId}
            className={`font-medium ${error ? 'text-red-700' : 'text-gray-700'} ${disabled ? 'opacity-50' : 'cursor-pointer'} ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {helpText && !error && (
          <p className="text-gray-500">{helpText}</p>
        )}
        
        {error && (
          <p className="text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

FormCheckbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string
};

export default FormCheckbox;
