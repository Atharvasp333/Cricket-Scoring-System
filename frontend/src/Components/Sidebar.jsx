import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCalendar, FiAward, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const { currentUser, userRole } = useAuth();

  const isActive = (path) => {
    const isPathActive = window.location.pathname === path;
    return isPathActive 
      ? darkMode 
        ? 'text-primary-dark bg-neutral-dark' 
        : 'text-white bg-blue-700' 
      : darkMode 
        ? 'text-text-primary-dark hover:bg-neutral-dark/50' 
        : 'text-white hover:bg-blue-600';
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      w-64 shadow-lg z-50 transition-transform duration-300 ease-in-out
      ${darkMode ? 'bg-neutral-dark' : 'bg-[#16638A]'}`}>
      
      <div className={`flex items-center justify-between p-4 ${darkMode ? 'border-b border-border-dark' : 'border-b border-blue-500'}`}>
        <div className="flex items-center">
          <img
            src="https://zemo.co.in/images/ZemoLogoNeon.svg"
            alt="Zemo Logo"
            className="h-8 w-auto"
          />
        </div>
        <button onClick={toggleSidebar} className={darkMode ? "text-text-primary-dark" : "text-white"}>
          <FiX className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-4">
        {currentUser && (
          <div className={`flex items-center mb-6 p-2 rounded-lg ${darkMode ? 'bg-neutral-dark/50' : 'bg-blue-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
              ${darkMode ? 'bg-primary-dark text-neutral-dark' : 'bg-white text-[#16638A]'}`}>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <FiUser />
              )}
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-text-primary-dark' : 'text-white'}`}>
                {currentUser.displayName || 'User'}
              </p>
              <p className={`text-xs ${darkMode ? 'text-text-muted-dark' : 'text-blue-100'}`}>
                Role: {userRole || 'Viewer'}
              </p>
            </div>
          </div>
        )}
        
        <nav className="space-y-1">
          <Link
            to={userRole === 'organiser' ? '/organiser-homepage' : 
                userRole === 'scorer' ? '/scorer-home' : 
                userRole === 'player' ? '/player-home' :
                '/viewer-home'}
            className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/viewer-home') || 
              isActive('/scorer-home') || 
              isActive('/organiser-homepage') ||
              isActive('/player-home')}`}
            onClick={toggleSidebar}
          >
            <FiHome className="mr-3" />
            <span>Home</span>
          </Link>
          
          <Link
            to={userRole === 'organiser' ? '/organiser/completed-matches' : 
                userRole === 'scorer' ? '/completed-matches' : 
                '/CompletedMatches'}
            className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/CompletedMatches') || 
              isActive('/completed-matches') || 
              isActive('/organiser/completed-matches')}`}
            onClick={toggleSidebar}
          >
            <FiCalendar className="mr-3" />
            <span>Matches</span>
          </Link>
          
          <Link
            to={userRole === 'organiser' ? '/organiser/completed-tournaments' : 
                userRole === 'scorer' ? '/completed-tournaments' : 
                '/CompletedTournaments'}
            className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/CompletedTournaments') || 
              isActive('/completed-tournaments') || 
              isActive('/organiser/completed-tournaments')}`}
            onClick={toggleSidebar}
          >
            <FiAward className="mr-3" />
            <span>Tournaments</span>
          </Link>
          
          <Link
            to="/player-stats"
            className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/player-stats')}`}
            onClick={toggleSidebar}
          >
            <FiAward className="mr-3" />
            <span>Player Stats</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;