import React from 'react';
import PropTypes from 'prop-types';

const FormTextarea = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  required = false,
  disabled = false,
  error = '',
  helpText = '',
  className = '',
  textareaClassName = '',
  labelClassName = '',
  ...props
}) => {
  const inputId = id || name;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#16638A] focus:border-[#16638A] sm:text-sm ${textareaClassName}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

FormTextarea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string,
  textareaClassName: PropTypes.string,
  labelClassName: PropTypes.string
};

export default FormTextarea;
