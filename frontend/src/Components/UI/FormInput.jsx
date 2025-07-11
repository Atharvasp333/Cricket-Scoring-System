import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  ...props
}) => {
  const inputId = `input-${name}`;
  const isCheckboxOrRadio = type === 'checkbox' || type === 'radio';
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${isCheckboxOrRadio ? 'inline-block' : ''} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={isCheckboxOrRadio ? 'flex items-center' : ''}>
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${isCheckboxOrRadio ? 'h-4 w-4 mr-2' : ''} ${inputClassName}`}
          required={required}
          {...props}
        />
        {isCheckboxOrRadio && label && (
          <span className="text-sm text-gray-700">{label}</span>
        )}
      </div>
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  errorClassName: PropTypes.string,
};

export default FormInput;
