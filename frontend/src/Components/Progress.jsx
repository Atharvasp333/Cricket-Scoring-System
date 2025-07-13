import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  labelPosition = 'inside',
  labelFormat = (value, max) => `${Math.round((value / max) * 100)}%`,
  className = '',
  barClassName = '',
  labelClassName = '',
  rounded = 'full',
  striped = false,
  animated = false,
  indeterminate = false,
  ...props
}) => {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percentage = (safeValue / max) * 100;
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };
  
  const colors = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
    light: 'bg-gray-200',
    dark: 'bg-gray-800',
  };
  
  const textColors = {
    primary: 'text-blue-700',
    secondary: 'text-purple-700',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-cyan-700',
    light: 'text-gray-700',
    dark: 'text-gray-100',
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  const containerClasses = classNames(
    'w-full overflow-hidden',
    sizes[size] || sizes.md,
    roundedClasses[rounded] || roundedClasses.full,
    'bg-gray-200',
    className
  );
  
  const barClasses = classNames(
    'h-full transition-all duration-300 ease-in-out flex items-center justify-end',
    colors[color] || colors.primary,
    {
      'bg-stripes': striped,
      'animate-stripes': striped && animated,
      'indeterminate': indeterminate,
    },
    barClassName
  );
  
  const labelClasses = classNames(
    'text-xs font-medium px-2',
    textColors[color] || textColors.primary,
    labelClassName
  );
  
  const renderLabel = () => {
    if (!showLabel) return null;
    
    const label = labelFormat(safeValue, max);
    
    if (labelPosition === 'inside' && percentage > 20) {
      return (
        <span className={labelClasses}>
          {label}
        </span>
      );
    }
    
    if (labelPosition === 'outside') {
      return (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{label}</span>
          {max !== 100 && <span>{safeValue}/{max}</span>}
        </div>
      );
    }
    
    return null;
  };
  
  const renderOutsideLabel = () => {
    if (labelPosition !== 'outside' || !showLabel) return null;
    
    const label = labelFormat(safeValue, max);
    
    return (
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        {max !== 100 && <span>{safeValue}/{max}</span>}
      </div>
    );
  };
  
  return (
    <div className={classNames('w-full', { 'mb-4': labelPosition === 'outside' })}>
      {renderOutsideLabel()}
      <div className={containerClasses} {...props}>
        <div 
          className={barClasses}
          style={{
            width: indeterminate ? '100%' : `${percentage}%`,
            minWidth: !indeterminate && showLabel && labelPosition === 'inside' ? '2rem' : '0',
          }}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : safeValue}
          aria-valuemin={0}
          aria-valuemax={indeterminate ? undefined : max}
        >
          {labelPosition === 'inside' && showLabel && percentage > 20 && (
            <span className={labelClasses}>
              {labelFormat(safeValue, max)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

Progress.Circle = ({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 4,
  color = 'primary',
  trackColor = 'gray-200',
  showLabel = true,
  labelFormat = (value, max) => `${Math.round((value / max) * 100)}%`,
  className = '',
  labelClassName = '',
  ...props
}) => {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percentage = (safeValue / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colors = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-500',
    info: 'text-cyan-500',
    light: 'text-gray-200',
    dark: 'text-gray-800',
  };
  
  const textColors = {
    primary: 'text-blue-700',
    secondary: 'text-purple-700',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-cyan-700',
    light: 'text-gray-700',
    dark: 'text-gray-100',
  };
  
  const label = labelFormat(safeValue, max);
  
  return (
    <div 
      className={classNames('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className={classNames('text-opacity-20', colors[color] || colors.primary)}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={classNames('transition-all duration-300 ease-in-out', colors[color] || colors.primary)}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      
      {showLabel && (
        <div className={classNames(
          'absolute inset-0 flex items-center justify-center',
          'text-sm font-medium',
          textColors[color] || textColors.primary,
          labelClassName
        )}>
          {label}
        </div>
      )}
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  showLabel: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['inside', 'outside']),
  labelFormat: PropTypes.func,
  className: PropTypes.string,
  barClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  striped: PropTypes.bool,
  animated: PropTypes.bool,
  indeterminate: PropTypes.bool,
};

Progress.Circle.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  trackColor: PropTypes.string,
  showLabel: PropTypes.bool,
  labelFormat: PropTypes.func,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default Progress;
