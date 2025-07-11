import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../../utils/helpers';

const Tabs = ({ children, defaultActiveKey, className, tabClassName, contentClassName, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveKey || (Children.toArray(children)[0]?.props?.eventKey || ''));

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    if (onChange) {
      onChange(tabKey);
    }
  };

  const tabs = [];
  let tabContent = null;

  Children.forEach(children, (child) => {
    if (!child) return;
    
    const { eventKey, title, disabled, tabClassName: childTabClassName } = child.props;
    const isActive = activeTab === eventKey;

    tabs.push(
      <button
        key={eventKey}
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && handleTabClick(eventKey)}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          isActive
            ? 'text-primary-600 border-b-2 border-primary-500'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          disabled && 'opacity-50 cursor-not-allowed',
          tabClassName,
          childTabClassName
        )}
      >
        {title}
      </button>
    );

    if (isActive) {
      tabContent = child.props.children;
    }
  });

  return (
    <div className={cn('w-full', className)}>
      <div 
        className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-4"
        role="tablist"
      >
        {tabs}
      </div>
      <div className={contentClassName}>
        {tabContent}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return children;
};

Tabs.Tab = Tab;

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultActiveKey: PropTypes.string,
  className: PropTypes.string,
  tabClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  onChange: PropTypes.func,
};

Tab.propTypes = {
  eventKey: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  tabClassName: PropTypes.string,
};

export default Tabs;
