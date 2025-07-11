import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  hoverEffect = false,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hoverEffect ? 'hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverClass} ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      {footer && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerAction: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  hoverEffect: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
};

export default Card;
