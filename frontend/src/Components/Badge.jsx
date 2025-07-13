import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'md',
  className = '',
  withDot = false,
  dotColor = '',
  dotClassName = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
    light: 'bg-gray-50 text-gray-700',
    dark: 'bg-gray-800 text-white',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-3 py-1 text-base',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
    light: 'bg-gray-300',
    dark: 'bg-gray-700',
  };

  const badgeClasses = classNames(
    'inline-flex items-center font-medium leading-tight',
    variants[variant] || variants.default,
    sizes[size] || sizes.md,
    roundedClasses[rounded] || roundedClasses.md,
    className
  );

  const dotClasses = classNames(
    'mr-1.5 h-2 w-2 rounded-full',
    dotColor ? dotColor : dotColors[variant] || dotColors.default,
    dotClassName
  );

  return (
    <span className={badgeClasses} {...props}>
      {withDot && <span className={dotClasses} aria-hidden="true" />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  className: PropTypes.string,
  withDot: PropTypes.bool,
  dotColor: PropTypes.string,
  dotClassName: PropTypes.string,
};

export default Badge;
