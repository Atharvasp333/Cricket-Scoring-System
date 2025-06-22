import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiAward, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-white font-medium' : 'text-white hover:text-gray-200';
  };
  
  return (
    <nav className=" bg-[#16638A] text-white p-4 shadow-md">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Left side - Logo only */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#16638A] font-bold mr-2">
            CS
          </div>
          <span className="text-xl font-bold hidden sm:block">CricketScorer</span>
        </div>
        
        {/* Right side - Navigation Links and Profile Icon */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <ul className="flex space-x-4 md:space-x-6">
            <li>
              <Link to="/scorer-home" className={`flex items-center ${isActive('/scorer-home')}`}>
                <FiHome className="mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/Completedmatches" className={`flex items-center ${isActive('/CompletedMatches')}`}>
                <FiCalendar className="mr-1" />
                <span className="hidden sm:inline">Matches</span>
              </Link>
            </li>
            <li>
              <Link to="/tournaments" className={`flex items-center ${isActive('/tournaments')}`}>
                <FiAward className="mr-1" />
                <span className="hidden sm:inline">Tournaments</span>
              </Link>
            </li>
          </ul>
          
          {/* Profile Icon */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#16638A] cursor-pointer hover:bg-gray-100 transition">
            <FiUser />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;