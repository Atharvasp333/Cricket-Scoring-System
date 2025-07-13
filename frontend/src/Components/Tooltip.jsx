import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tooltip = ({
  content,
  children,
  position = 'top',
  className = '',
  contentClassName = '',
  arrow = true,
  delay = 100,
  interactive = false,
  disabled = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({});
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  let timeout;

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2',
    topStart: 'bottom-full left-0 -translate-y-2',
    topEnd: 'bottom-full right-0 -translate-y-2',
    right: 'left-full top-1/2 transform translate-x-2 -translate-y-1/2',
    rightStart: 'left-full top-0 translate-x-2',
    rightEnd: 'left-full bottom-0 translate-x-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2',
    bottomStart: 'top-full left-0 translate-y-2',
    bottomEnd: 'top-full right-0 translate-y-2',
    left: 'right-full top-1/2 transform -translate-x-2 -translate-y-1/2',
    leftStart: 'right-full top-0 -translate-x-2',
    leftEnd: 'right-full bottom-0 -translate-x-2',
  };

  const arrowPositions = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45',
    topStart: 'bottom-0 left-3 translate-y-1/2 rotate-45',
    topEnd: 'bottom-0 right-3 translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
    rightStart: 'left-0 top-3 -translate-x-1/2 rotate-45',
    rightEnd: 'left-0 bottom-3 -translate-x-1/2 rotate-45',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
    bottomStart: 'top-0 left-3 -translate-y-1/2 rotate-45',
    bottomEnd: 'top-0 right-3 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45',
    leftStart: 'right-0 top-3 translate-x-1/2 rotate-45',
    leftEnd: 'right-0 bottom-3 translate-x-1/2 rotate-45',
  };

  const showTooltip = () => {
    if (disabled) return;
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          width: rect.width,
          height: rect.height,
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  const handleClickOutside = (event) => {
    if (
      tooltipRef.current && 
      !tooltipRef.current.contains(event.target) &&
      triggerRef.current && 
      !triggerRef.current.contains(event.target)
    ) {
      hideTooltip();
    }
  };

  useEffect(() => {
    if (interactive && isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timeout);
    };
  }, [isVisible, interactive]);

  const tooltipClasses = classNames(
    'absolute z-50 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap',
    positions[position] || positions.top,
    contentClassName,
    {
      'opacity-0 invisible': !isVisible,
      'opacity-100 visible': isVisible,
    }
  );

  const arrowClasses = classNames(
    'absolute w-2 h-2 bg-gray-900',
    arrowPositions[position] || arrowPositions.top,
    {
      'hidden': !arrow,
    }
  );

  const triggerProps = {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onMouseLeave: !interactive ? hideTooltip : undefined,
    onClick: interactive ? showTooltip : undefined,
    'aria-describedby': isVisible ? 'tooltip' : undefined,
    ...props,
  };

  return (
    <div className={classNames('inline-block relative', className)}>
      {React.cloneElement(React.Children.only(children), triggerProps)}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          id="tooltip"
          className={tooltipClasses}
          style={{
            transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
            ...(interactive && { pointerEvents: 'auto' }),
          }}
          onMouseEnter={interactive ? showTooltip : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          {content}
          <span className={arrowClasses} />
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.element.isRequired,
  position: PropTypes.oneOf([
    'top', 'topStart', 'topEnd',
    'right', 'rightStart', 'rightEnd',
    'bottom', 'bottomStart', 'bottomEnd',
    'left', 'leftStart', 'leftEnd'
  ]),
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  arrow: PropTypes.bool,
  delay: PropTypes.number,
  interactive: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Tooltip;
