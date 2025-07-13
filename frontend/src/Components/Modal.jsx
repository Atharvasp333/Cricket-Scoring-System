import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  closeButton = true,
  className = '',
  contentClassName = '',
  overlayClassName = '',
  titleClassName = '',
  footer,
}) => {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  const modalClasses = classNames(
    'fixed z-50 inset-0 overflow-y-auto',
    className
  );

  const overlayClasses = classNames(
    'fixed inset-0 bg-black bg-opacity-50 transition-opacity',
    overlayClassName
  );

  const contentClasses = classNames(
    'inline-block w-full p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl',
    sizeClasses[size] || sizeClasses.md,
    contentClassName
  );

  const titleClasses = classNames(
    'text-lg font-medium leading-6 text-gray-900',
    titleClassName
  );

  const handleOverlayClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={modalClasses}>
      <div 
        className={overlayClasses} 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        <div className={`inline-block align-bottom ${contentClasses} sm:my-8 sm:align-middle`}>
          <div className="relative">
            {(title || closeButton) && (
              <div className="flex items-center justify-between mb-4">
                {title && <h3 className={titleClasses}>{title}</h3>}
                {closeButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute top-0 right-0 p-1 -mt-2 -mr-2 text-gray-400 hover:text-gray-500"
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}
            
            <div className="mt-2">
              {children}
            </div>
            
            {footer && (
              <div className="mt-6 flex justify-end space-x-3">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']),
  closeOnClickOutside: PropTypes.bool,
  closeButton: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  footer: PropTypes.node,
};

export default Modal;
