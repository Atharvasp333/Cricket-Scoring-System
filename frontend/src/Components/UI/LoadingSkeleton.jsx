import React from 'react';
import PropTypes from 'prop-types';

const LoadingSkeleton = ({
  type = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  count = 1,
  circle = false,
  style = {},
  ...props
}) => {
  const elements = [];
  
  // Generate multiple skeleton elements based on count
  for (let i = 0; i < count; i++) {
    const skeletonStyle = {
      width,
      height: circle ? width : height,
      borderRadius: circle ? '50%' : '0.25rem',
      ...style,
    };

    elements.push(
      <div
        key={i}
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
        style={skeletonStyle}
        {...props}
      />
    );

    // Add margin between multiple elements except for the last one
    if (i < count - 1) {
      elements.push(<div key={`spacer-${i}`} className="mb-2" />);
    }
  }

  return <>{elements}</>;
};

LoadingSkeleton.propTypes = {
  type: PropTypes.oneOf(['text', 'circle', 'rect']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  count: PropTypes.number,
  circle: PropTypes.bool,
  style: PropTypes.object,
};

export default LoadingSkeleton;
