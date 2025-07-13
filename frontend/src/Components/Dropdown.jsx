import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from './index';

const Dropdown = ({
  trigger,
  children,
  position = 'bottom-start',
  className = '',
  menuClassName = '',
  triggerClassName = '',
  closeOnClick = true,
  closeOnClickOutside = true,
  closeOnScroll = true,
  isOpen: isOpenProp,
  onOpenChange,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const positions = {
    'top-start': 'bottom-full right-0 mb-2',
    'top': 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    'top-end': 'bottom-full left-0 mb-2',
    'right-start': 'left-full top-0 ml-2',
    'right': 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    'right-end': 'left-full bottom-0 ml-2',
    'bottom-start': 'top-full right-0 mt-2',
    'bottom': 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    'bottom-end': 'top-full left-0 mt-2',
    'left-start': 'right-full top-0 mr-2',
    'left': 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    'left-end': 'right-full bottom-0 mr-2',
  };

  const handleToggle = (e) => {
    e?.stopPropagation();
    const newState = isOpenProp !== undefined ? onOpenChange?.(!isOpenProp) : setIsOpen(!isOpen);
    return newState;
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target) && 
      triggerRef.current && 
      !triggerRef.current.contains(event.target)
    ) {
      closeDropdown();
    }
  };

  const handleScroll = () => {
    if (closeOnScroll) {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    if (isOpenProp !== undefined) {
      onOpenChange?.(false);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen || isOpenProp) {
      document.addEventListener('mousedown', handleClickOutside);
      if (closeOnScroll) {
        window.addEventListener('scroll', handleScroll, true);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, isOpenProp]);

  const renderTrigger = () => {
    if (React.isValidElement(trigger)) {
      return React.cloneElement(trigger, {
        ref: triggerRef,
        onClick: (e) => {
          handleToggle(e);
          trigger.props.onClick?.(e);
        },
        className: classNames(trigger.props.className, triggerClassName),
        'aria-haspopup': 'true',
        'aria-expanded': isOpen || isOpenProp,
      });
    }

    return (
      <Button
        ref={triggerRef}
        onClick={handleToggle}
        className={triggerClassName}
        aria-haspopup="true"
        aria-expanded={isOpen || isOpenProp}
      >
        {trigger}
      </Button>
    );
  };

  const isControlled = isOpenProp !== undefined;
  const showMenu = isControlled ? isOpenProp : isOpen;

  const menuClasses = classNames(
    'absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
    'transform transition-all duration-100 ease-in-out',
    positions[position] || positions['bottom-start'],
    menuClassName,
    {
      'opacity-0 scale-95 invisible': !showMenu,
      'opacity-100 scale-100 visible': showMenu,
    }
  );

  const handleItemClick = (e, onClick) => {
    if (closeOnClick) {
      closeDropdown();
    }
    onClick?.(e);
  };

  const renderMenu = () => {
    if (!showMenu) return null;

    return (
      <div 
        ref={dropdownRef}
        className={menuClasses}
        role="menu"
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1" role="none">
          {React.Children.map(children, (child) => {
            if (!child) return null;
            
            if (child.type === Dropdown.Item) {
              return React.cloneElement(child, {
                onClick: (e) => handleItemClick(e, child.props.onClick),
              });
            }
            
            if (child.type === Dropdown.Divider) {
              return child;
            }
            
            return child;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={classNames('relative inline-block text-left', className)} {...props}>
      {renderTrigger()}
      {renderMenu()}
    </div>
  );
};

const DropdownItem = ({ children, className = '', icon, disabled = false, ...props }) => {
  const itemClasses = classNames(
    'group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    { 'opacity-50 cursor-not-allowed': disabled },
    className
  );

  return (
    <button
      type="button"
      className={itemClasses}
      role="menuitem"
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

const DropdownDivider = ({ className = '' }) => (
  <div className={classNames('border-t border-gray-100 my-1', className)} />
);

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

Dropdown.propTypes = {
  trigger: PropTypes.oneOfType([PropTypes.node, PropTypes.element]).isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf([
    'top-start', 'top', 'top-end',
    'right-start', 'right', 'right-end',
    'bottom-start', 'bottom', 'bottom-end',
    'left-start', 'left', 'left-end'
  ]),
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  triggerClassName: PropTypes.string,
  closeOnClick: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
  closeOnScroll: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
};

DropdownDivider.propTypes = {
  className: PropTypes.string,
};

export default Dropdown;
