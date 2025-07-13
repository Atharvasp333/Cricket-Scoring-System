import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  leftIcon, 
  endIcon,
  rightIcon,
  iconOnly = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'text-white bg-[#16638A] hover:bg-[#0f4c6a] focus:ring-[#16638A]',
    secondary: 'text-[#16638A] bg-white border border-gray-300 hover:bg-gray-50 focus:ring-[#16638A]',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
    warning: 'text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    text: 'text-[#16638A] hover:text-[#0f4c6a] focus:ring-transparent',
    outline: 'text-[#16638A] border border-[#16638A] hover:bg-gray-50 focus:ring-[#16638A]',
    ghost: 'text-[#16638A] hover:bg-gray-100 focus:ring-[#16638A]',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded',
    sm: 'px-3 py-2 text-sm leading-4 rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-4 py-2 text-base rounded-md',
    xl: 'px-6 py-3 text-base rounded-md',
  };

  const buttonClasses = classNames(
    baseStyles,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    {
      'opacity-50 cursor-not-allowed': disabled || loading,
      'w-full': fullWidth,
      'p-2': iconOnly,
      'aspect-square': iconOnly,
    },
    className
  );

  const { 
    iconOnly: _, 
    rightIcon: __, 
    leftIcon: ___, 
    startIcon: ____, 
    endIcon: _____, 
    ...filteredProps 
  } = props;

  const leftIconToRender = leftIcon || startIcon;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={iconOnly && typeof children === 'string' ? children : undefined}
      {...filteredProps}
    >
      {loading && (
        <LoadingSpinner 
          size={size === 'xs' ? 'xs' : 'sm'} 
          color={variant === 'secondary' || variant === 'outline' || variant === 'ghost' || variant === 'text' ? 'primary' : 'white'} 
          className={!iconOnly ? 'mr-2' : ''} 
        />
      )}
      {leftIconToRender && !loading && <span className={!iconOnly ? 'mr-2' : ''}>{leftIconToRender}</span>}
      {!iconOnly && children}
      {endIcon && <span className={!iconOnly ? 'ml-2' : ''}>{endIcon}</span>}
      {rightIcon && <span className={!iconOnly ? 'ml-2' : ''}>{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'danger',
    'success',
    'warning',
    'info',
    'text',
    'outline',
    'ghost'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  iconOnly: PropTypes.bool,
  startIcon: PropTypes.node,
  leftIcon: PropTypes.node, 
  endIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
