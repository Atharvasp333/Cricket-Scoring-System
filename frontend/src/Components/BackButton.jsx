import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = ({ to, onClick, className = '', children }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 ${className}`}
    >
      <FiArrowLeft className="mr-1 h-4 w-4" />
      {children || 'Back'}
    </button>
  );
};

export default BackButton;
