import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  rounded = 'full',
  className = '',
  placeholder = null,
  status = null,
  statusPosition = 'bottom-right',
  ...props
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  const statusPositions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const avatarClasses = classNames(
    'relative flex items-center justify-center bg-gray-200 text-gray-600 font-medium overflow-hidden',
    sizeClasses[size] || sizeClasses.md,
    roundedClasses[rounded] || roundedClasses.full,
    className
  );

  const statusClasses = classNames(
    'absolute border-2 border-white rounded-full',
    statusSizes[size] || statusSizes.md,
    statusColors[status] || statusColors.offline,
    statusPositions[statusPosition] || statusPositions['bottom-right'],
    {
      'opacity-0': !status,
    }
  );

  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }
    
    if (alt) {
      // Get initials from alt text
      const initials = alt
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      return (
        <span className="font-medium text-gray-600">
          {initials}
        </span>
      );
    }
    
    return (
      <svg
        className="h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  return (
    <div className={avatarClasses} {...props}>
      {src ? (
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={alt}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div className="h-full w-full flex items-center justify-center">
        {renderPlaceholder()}
      </div>
      
      {status && <span className={statusClasses} aria-hidden="true" />}
    </div>
  );
};

Avatar.Group = ({ children, className = '', max = 5, size = 'md', ...props }) => {
  const childrenArray = React.Children.toArray(children);
  const totalChildren = childrenArray.length;
  const maxToShow = Math.min(max, totalChildren);
  const remaining = totalChildren - maxToShow;
  
  const sizeClasses = {
    xs: '-ml-1',
    sm: '-ml-1.5',
    md: '-ml-2',
    lg: '-ml-3',
    xl: '-ml-4',
    '2xl': '-ml-5',
  };
  
  const avatarSize = size === '2xl' ? 'xl' : 
                    size === 'xl' ? 'lg' : 
                    size === 'lg' ? 'md' : 
                    size === 'sm' ? 'sm' : 'md';
  
  return (
    <div className={classNames('flex items-center', className)} {...props}>
      {childrenArray.slice(0, maxToShow).map((child, index) => (
        <div 
          key={index} 
          className={classNames(
            'ring-2 ring-white', 
            index !== 0 ? sizeClasses[size] || sizeClasses.md : ''
          )}
          style={{ zIndex: maxToShow - index }}
        >
          {React.cloneElement(child, {
            size: avatarSize,
            className: classNames(child.props.className, 'ring-2 ring-white'),
          })}
        </div>
      ))}
      
      {remaining > 0 && (
        <div 
          className={classNames(
            'flex items-center justify-center bg-gray-200 text-gray-600 font-medium rounded-full ring-2 ring-white',
            sizeClasses[size] || sizeClasses.md,
            sizeClasses[size]?.replace('-ml-', 'h-') || 'h-10',
            sizeClasses[size]?.replace('-ml-', 'w-') || 'w-10',
            'text-xs',
            'z-10'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  className: PropTypes.string,
  placeholder: PropTypes.node,
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  statusPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
};

Avatar.Group.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
};

export default Avatar;
