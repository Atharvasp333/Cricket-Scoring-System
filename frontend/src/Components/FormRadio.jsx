import React from 'react';
import PropTypes from 'prop-types';

const FormRadio = ({
  id,
  name,
  label,
  value,
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
  const inputId = id || `${name}-${value}`;
  
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={inputId}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`h-4 w-4 ${error ? 'border-red-300 text-red-600 focus:ring-red-500' : 'border-gray-300 text-[#16638A] focus:ring-[#16638A]'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        {...props}
      />
      
      <label 
        htmlFor={inputId}
        className={`ml-2 block text-sm ${error ? 'text-red-700' : 'text-gray-700'} ${disabled ? 'opacity-50' : 'cursor-pointer'} ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {helpText && !error && (
          <span className="block text-gray-500 text-xs font-normal">{helpText}</span>
        )}
        {error && (
          <span className="block text-red-600 text-xs font-normal">{error}</span>
        )}
      </label>
    </div>
  );
};

FormRadio.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string
};

export default FormRadio;
