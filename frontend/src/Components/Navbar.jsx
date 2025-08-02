import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiAward, FiUser, FiLogOut, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    return localStorage.getItem('darkMode') === 'true' || false;
  });
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Apply dark theme styles and persist preference
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      // Apply dark theme
      root.style.setProperty('--primary-dark', '#A8FD24');
      root.style.setProperty('--secondary-dark', '#D6F917');
      root.style.setProperty('--secondary-alt-dark', '#FFFFFF');
      root.style.setProperty('--neutral-dark', '#1E1E1E');
      root.style.setProperty('--text-primary-dark', '#FFFFFF');
      root.style.setProperty('--text-muted-dark', '#B3B3B3');
      root.style.setProperty('--error-dark', '#ED1515');
      root.style.setProperty('--success-dark', '#00C26B');
      root.style.setProperty('--warning-dark', '#ED1515');
      root.style.setProperty('--border-dark', '#B3AC9B');
      
      root.classList.add('dark');
      document.body.style.backgroundColor = '#1E1E1E';
      document.body.style.color = '#FFFFFF';
    } else {
      // Reset to light theme
      root.style.removeProperty('--primary-dark');
      root.style.removeProperty('--secondary-dark');
      root.style.removeProperty('--secondary-alt-dark');
      root.style.removeProperty('--neutral-dark');
      root.style.removeProperty('--text-primary-dark');
      root.style.removeProperty('--text-muted-dark');
      root.style.removeProperty('--error-dark');
      root.style.removeProperty('--success-dark');
      root.style.removeProperty('--warning-dark');
      root.style.removeProperty('--border-dark');
      
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
    
    // Persist preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const isActive = (path) => {
    const isCurrentPath = location.pathname === path;
    return isCurrentPath
      ? darkMode
        ? 'text-[#A8FD24] font-medium'
        : 'text-white font-medium'
      : darkMode
        ? 'text-white hover:text-[#A8FD24] transition-colors'
        : 'text-white hover:text-gray-200 transition-colors';
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/viewer-home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleProfileClick = () => {
    navigate('/player-profile');
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Top Bar
  const MobileTopBar = () => (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} />

      <div className={`md:hidden w-full p-3 shadow-md flex justify-between items-center transition-colors ${
        darkMode ? 'bg-[#1E1E1E] border-b border-[#B3AC9B]/20' : 'bg-[#16638A]'
      }`}>
        {/* Menu Button */}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded-md focus:outline-none transition-colors ${
            darkMode ? 'text-white hover:text-[#A8FD24]' : 'text-white hover:text-gray-200'
          }`}
        >
          <FiMenu className="h-6 w-6" />
        </button>

        {/* Logo in center for mobile */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://zemo.co.in/images/ZemoLogoNeon.svg"
            alt="Zemo Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Theme Toggle and Profile Icon */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`p-1 rounded-md focus:outline-none transition-colors ${
              darkMode ? 'text-white hover:text-[#A8FD24]' : 'text-white hover:text-gray-200'
            }`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                darkMode 
                  ? 'bg-[#A8FD24] text-[#1E1E1E] hover:bg-[#D6F917]' 
                  : 'bg-white text-[#16638A] hover:bg-gray-100'
              }`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {currentUser && currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <FiUser />
              )}
            </div>

            {/* Mobile Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                darkMode 
                  ? 'bg-[#1E1E1E] border border-[#B3AC9B]/20' 
                  : 'bg-white border border-gray-200'
              }`}>
                {currentUser ? (
                  <>
                    {/* User Info Section */}
                    <div 
                      className={`px-4 py-2 text-sm border-b ${
                        darkMode ? 'border-[#B3AC9B]/20' : 'border-gray-200'
                      } ${userRole === 'player' ? 'cursor-pointer hover:bg-opacity-10 hover:bg-gray-500' : ''}`}
                      onClick={userRole === 'player' ? handleProfileClick : undefined}
                    >
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
                        {currentUser.email}
                      </p>
                      <p className={`text-xs capitalize mt-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
                        Role: {userRole || 'Viewer'}
                      </p>
                      {userRole === 'player' && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-[#A8FD24]' : 'text-blue-600'}`}>
                          Click to view profile
                        </p>
                      )}
                    </div>
                    
                    {/* View Profile Button */}
                    <button
                      onClick={handleProfileClick}
                      className={`block w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                        darkMode 
                          ? 'text-white hover:bg-[#B3AC9B]/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FiUser className="mr-2" /> View Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                        darkMode 
                          ? 'text-white hover:bg-[#B3AC9B]/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FiLogOut className="mr-2" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        darkMode 
                          ? 'text-white hover:bg-[#B3AC9B]/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setShowDropdown(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        darkMode 
                          ? 'text-white hover:bg-[#B3AC9B]/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setShowDropdown(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Desktop Navigation
  const DesktopNav = () => (
    <nav className={`hidden md:block w-full p-4 shadow-md transition-colors ${
      darkMode ? 'bg-[#1E1E1E] border-b border-[#B3AC9B]/20' : 'bg-[#16638A]'
    }`}>
      <div className="mx-auto flex gap-10 justify-between items-center">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <img
            src="https://zemo.co.in/images/ZemoLogoNeon.svg"
            alt="Zemo Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Right side - Navigation Links and Profile Icon */}
        <div className="flex items-center space-x-4 md:space-x-10">
          <ul className="flex space-x-6 md:space-x-7">
            <li>
              <Link
                to={userRole === 'organiser' ? '/organiser-homepage' :
                  userRole === 'scorer' ? '/scorer-home' :
                    userRole === 'player' ? '/player-home' :
                      '/viewer-home'}
                className={`flex items-center ${isActive('/viewer-home') ||
                  isActive('/scorer-home') ||
                  isActive('/organiser-homepage') ||
                  isActive('/player-home')
                  }`}
              >
                <FiHome className="mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>

            <li>
              <Link
                to={userRole === 'organiser' ? '/organiser/completed-matches' :
                  userRole === 'scorer' ? '/completed-matches' :
                    '/CompletedMatches'}
                className={`flex items-center ${isActive('/CompletedMatches') ||
                  isActive('/completed-matches') ||
                  isActive('/organiser/completed-matches')
                  }`}
              >
                <FiCalendar className="mr-1" />
                <span className="hidden sm:inline">Matches</span>
              </Link>
            </li>

            <li>
              <Link
                to={userRole === 'organiser' ? '/organiser/completed-tournaments' :
                  userRole === 'scorer' ? '/completed-tournaments' :
                    '/CompletedTournaments'}
                className={`flex items-center ${isActive('/CompletedTournaments') ||
                  isActive('/completed-tournaments') ||
                  isActive('/organiser/completed-tournaments')
                  }`}
              >
                <FiAward className="mr-1" />
                <span className="hidden sm:inline">Tournaments</span>
              </Link>
            </li>

            <li>
              <Link
                to="/player-stats"
                className={`flex items-center ${isActive('/player-stats')}`}
              >
                <FiAward className="mr-1" />
                <span className="hidden sm:inline">Player Stats</span>
              </Link>
            </li>
          </ul>

          {/* Theme Toggle and Profile Icon */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-1 rounded-md focus:outline-none transition-colors ${
                darkMode ? 'text-white hover:text-[#A8FD24]' : 'text-white hover:text-gray-200'
              }`}
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  darkMode 
                    ? 'bg-[#A8FD24] text-[#1E1E1E] hover:bg-[#D6F917]' 
                    : 'bg-white text-[#16638A] hover:bg-gray-100'
                }`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {currentUser && currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <FiUser />
                )}
              </div>

              {/* Desktop Dropdown Menu */}
              {showDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                  darkMode 
                    ? 'bg-[#1E1E1E] border border-[#B3AC9B]/20' 
                    : 'bg-white border border-gray-200'
                }`}>
                  {currentUser ? (
                    <>
                      {/* User Info Section */}
                      <div 
                        className={`px-4 py-2 text-sm border-b ${
                          darkMode ? 'border-[#B3AC9B]/20' : 'border-gray-200'
                        } ${userRole === 'player' ? 'cursor-pointer hover:bg-opacity-10 hover:bg-gray-500' : ''}`}
                        onClick={userRole === 'player' ? handleProfileClick : undefined}
                      >
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
                          {currentUser.email}
                        </p>
                        <p className={`text-xs capitalize mt-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
                          Role: {userRole || 'Viewer'}
                        </p>
                        {userRole === 'player' && (
                          <p className={`text-xs mt-1 ${darkMode ? 'text-[#A8FD24]' : 'text-blue-600'}`}>
                            Click to view profile
                          </p>
                        )}
                      </div>
                      
                      {/* View Profile Button */}
                      <button
                        onClick={handleProfileClick}
                        className={`block w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                          darkMode 
                            ? 'text-white hover:bg-[#B3AC9B]/10' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FiUser className="mr-2" /> View Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                          darkMode 
                            ? 'text-white hover:bg-[#B3AC9B]/10' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FiLogOut className="mr-2" /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          darkMode 
                            ? 'text-white hover:bg-[#B3AC9B]/10' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          darkMode 
                            ? 'text-white hover:bg-[#B3AC9B]/10' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 shadow-lg z-40 transition-colors ${
      darkMode ? 'bg-[#1E1E1E] border-t border-[#B3AC9B]/20' : 'bg-[#16638A]'
    }`}>
      <ul className="flex justify-around items-center p-2">
        <li className="flex-1 text-center">
          <Link
            to={userRole === 'organiser' ? '/organiser-homepage' :
              userRole === 'scorer' ? '/scorer-home' :
                userRole === 'player' ? '/player-home' :
                  '/viewer-home'}
            className={`flex flex-col items-center p-2 ${isActive('/viewer-home') ||
              isActive('/scorer-home') ||
              isActive('/organiser-homepage') ||
              isActive('/player-home')}`}
          >
            <FiHome className="text-xl" />
            <span className="text-xs mt-1">Home</span>
          </Link>
        </li>

        <li className="flex-1 text-center">
          <Link
            to={userRole === 'organiser' ? '/organiser/completed-matches' :
              userRole === 'scorer' ? '/completed-matches' :
                '/CompletedMatches'}
            className={`flex flex-col items-center p-2 ${isActive('/CompletedMatches') ||
              isActive('/completed-matches') ||
              isActive('/organiser/completed-matches')}`}
          >
            <FiCalendar className="text-xl" />
            <span className="text-xs mt-1">Matches</span>
          </Link>
        </li>

        <li className="flex-1 text-center">
          <Link
            to={userRole === 'organiser' ? '/organiser/completed-tournaments' :
              userRole === 'scorer' ? '/completed-tournaments' :
                '/CompletedTournaments'}
            className={`flex flex-col items-center p-2 ${isActive('/CompletedTournaments') ||
              isActive('/completed-tournaments') ||
              isActive('/organiser/completed-tournaments')}`}
          >
            <FiAward className="text-xl" />
            <span className="text-xs mt-1">Tournaments</span>
          </Link>
        </li>

        <li className="flex-1 text-center">
          <Link
            to="/player-stats"
            className={`flex flex-col items-center p-2 ${isActive('/player-stats')}`}
          >
            <FiAward className="text-xl" />
            <span className="text-xs mt-1">Stats</span>
          </Link>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileTopBar />
          <MobileBottomNav />
        </>
      ) : (
        <DesktopNav />
      )}
    </>
  );
};

export default Navbar;