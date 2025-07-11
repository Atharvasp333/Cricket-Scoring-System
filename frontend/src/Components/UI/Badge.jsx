import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../../utils/helpers';

const variantStyles = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  className: PropTypes.string,
};

export default Badge;
