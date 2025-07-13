import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tabs = ({
  children,
  defaultActiveTab = 0,
  onChange,
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
  variant = 'default', // 'default', 'pills', 'underline', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  centered = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabClick = (index, disabled, onClick) => {
    if (disabled) return;
    setActiveTab(index);
    if (onClick) onClick();
    if (onChange) onChange(index);
  };

  const variants = {
    default: 'border-b border-gray-200',
    pills: 'space-x-2',
    underline: 'border-b border-gray-200',
    outline: 'space-x-2',
  };

  const tabSizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const tabClasses = (index, disabled) =>
    classNames(
      tabSizes[size] || tabSizes.md,
      'font-medium text-sm leading-5 focus:outline-none',
      'transition-colors duration-200',
      {
        'border-b-2 font-medium': variant === 'default' || variant === 'underline',
        'rounded-md': variant === 'pills' || variant === 'outline',
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
          (variant === 'default' || variant === 'underline') && activeTab !== index && !disabled,
        'border-[#16638A] text-[#16638A]':
          (variant === 'default' || variant === 'underline') && activeTab === index && !disabled,
        'text-gray-400 cursor-not-allowed': disabled,
        'bg-white text-gray-700 hover:bg-gray-100':
          variant === 'pills' && activeTab !== index && !disabled,
        'bg-[#16638A] text-white': variant === 'pills' && activeTab === index && !disabled,
        'border border-gray-300 text-gray-700 hover:bg-gray-50':
          variant === 'outline' && activeTab !== index && !disabled,
        'border-[#16638A] text-[#16638A] bg-blue-50':
          variant === 'outline' && activeTab === index && !disabled,
        'flex-1 justify-center': fullWidth,
      }
    );

  const tabListClasses = classNames(
    'flex',
    variants[variant] || variants.default,
    {
      'justify-center': centered && !fullWidth,
    },
    tabListClassName
  );

  const tabPanelClasses = classNames('mt-4', tabPanelClassName);

  const tabs = Children.map(children, (child, index) => {
    if (!child) return null;

    const { label, disabled, icon, count, className: childClassName } = child.props;

    return (
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === index}
        aria-disabled={disabled}
        disabled={disabled}
        className={classNames(tabClasses(index, disabled), childClassName, 'flex items-center')}
        onClick={() => handleTabClick(index, disabled, child.props.onClick)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {typeof count !== 'undefined' && (
          <span 
            className={classNames(
              'ml-2 px-2 py-0.5 text-xs rounded-full',
              activeTab === index 
                ? 'bg-white bg-opacity-20' 
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {count}
          </span>
        )}
      </button>
    );
  });

  const tabPanels = Children.map(children, (child, index) => {
    if (!child) return null;
    
    return (
      <div
        role="tabpanel"
        className={tabPanelClasses}
        style={{ display: activeTab === index ? 'block' : 'none' }}
      >
        {child.props.children}
      </div>
    );
  });

  return (
    <div className={className}>
      <div className={tabListClasses} role="tablist">
        {tabs}
      </div>
      <div className="mt-4">
        {tabPanels}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return children;
};

Tab.propTypes = {
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  count: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Tabs.Tab = Tab;

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultActiveTab: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string,
  tabListClassName: PropTypes.string,
  tabPanelClassName: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'pills', 'underline', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  centered: PropTypes.bool,
};

export default Tabs;
