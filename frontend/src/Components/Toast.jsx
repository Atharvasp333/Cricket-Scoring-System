import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

const Toast = ({
  isOpen = false,
  onClose,
  message,
  title,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  className = '',
  showIcon = true,
  showCloseButton = true,
  autoClose = true,
  pauseOnHover = true,
  ...props
}) => {
  const [show, setShow] = useState(isOpen);
  const timerRef = React.useRef(null);

  const typeIcons = {
    success: (
      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H11v-2a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  const typeColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    warning: 'bg-yellow-50 border-yellow-100',
    info: 'bg-blue-50 border-blue-100',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  const closeToast = useCallback(() => {
    setShow(false);
    if (onClose) {
      setTimeout(() => onClose(), 300); // Wait for the exit animation
    }
  }, [onClose]);

  const startTimer = useCallback(() => {
    if (autoClose && duration) {
      timerRef.current = setTimeout(() => {
        closeToast();
      }, duration);
    }
  }, [autoClose, duration, closeToast]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (show && autoClose) {
      startTimer();
      return () => clearTimer();
    }
  }, [show, autoClose, startTimer, clearTimer]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      clearTimer();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      startTimer();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H11v-2a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H11v-2a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (!isOpen && !show) return null;

  return (
    <Transition
      show={show}
      as={React.Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2"
      enterTo="opacity-100 translate-y-0 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={classNames(
          'fixed z-50 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden',
          typeColors[type] || typeColors.info,
          'border',
          positions[position] || positions['top-right'],
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="alert"
        {...props}
      >
        <div className="p-4">
          <div className="flex items-start">
            {showIcon && (
              <div className="flex-shrink-0 pt-0.5">
                {getIcon()}
              </div>
            )}
            <div className="ml-3 w-0 flex-1">
              {title && (
                <h3 className={classNames('text-sm font-medium', textColors[type] || textColors.info)}>
                  {title}
                </h3>
              )}
              {message && (
                <p className={classNames('mt-1 text-sm', textColors[type] || textColors.info)}>
                  {message}
                </p>
              )}
            </div>
            {showCloseButton && (
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={classNames(
                    'inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md',
                    textColors[type] ? 'opacity-70 hover:opacity-100' : ''
                  )}
                  onClick={closeToast}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
};

// Toast Container Component
const ToastContainer = ({
  toasts = [],
  position = 'top-right',
  className = '',
  ...props
}) => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={classNames(
        'fixed z-50 space-y-4',
        positions[position] || positions['top-right'],
        className
      )}
      style={{
        maxWidth: 'calc(100% - 2rem)',
        width: '24rem',
      }}
      {...props}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} position={position} {...toast} />
      ))}
    </div>
  );
};

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toastId = React.useRef(0);

  const showToast = (options) => {
    const id = toastId.current++;
    const toast = { ...options, id, isOpen: true };
    
    setToasts((prevToasts) => [...prevToasts, toast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => 
      prevToasts.map(toast => 
        toast.id === id ? { ...toast, isOpen: false } : toast
      )
    );
    
    // Remove from state after animation
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    }, 300);
  };

  const toast = {
    success: (message, options = {}) => 
      showToast({ ...options, message, type: 'success' }),
    error: (message, options = {}) => 
      showToast({ ...options, message, type: 'error' }),
    warning: (message, options = {}) => 
      showToast({ ...options, message, type: 'warning' }),
    info: (message, options = {}) => 
      showToast({ ...options, message, type: 'info' }),
    remove: removeToast,
  };

  return { toasts, toast, removeToast };
};

Toast.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.node,
  title: PropTypes.node,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ]),
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  autoClose: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.node,
    duration: PropTypes.number,
    onClose: PropTypes.func,
    className: PropTypes.string,
  })),
  position: PropTypes.oneOf([
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ]),
  className: PropTypes.string,
};

export { Toast, ToastContainer, useToast };
export default Toast;
