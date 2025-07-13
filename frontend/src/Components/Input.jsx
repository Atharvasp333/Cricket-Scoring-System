import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  className = '',
  required = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  leftIcon, // Alias for startIcon
  endIcon,
  rightIcon, // Alias for endIcon
  ...props
}) => {
  // Use leftIcon if provided, otherwise fall back to startIcon
  const startIconToRender = leftIcon || startIcon;
  // Use rightIcon if provided, otherwise fall back to endIcon
  const endIconToRender = rightIcon || endIcon;

  const inputClasses = classNames(
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
    {
      'pl-10': startIconToRender,
      'pl-3': !startIconToRender,
      'pr-10': endIconToRender,
      'pr-3': !endIconToRender,
      'border-red-500': error,
      'bg-gray-100': disabled,
    },
    className
  );

  return (
    <div className={classNames('mb-4', { 'w-full': fullWidth }, className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {startIconToRender && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIconToRender}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          required={required}
          {...props}
        />
        {endIconToRender && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endIconToRender}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  leftIcon: PropTypes.node, // Alias for startIcon
  endIcon: PropTypes.node,
  rightIcon: PropTypes.node, // Alias for endIcon
};

export default Input;
