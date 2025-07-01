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
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Dark theme CSS variables
  const darkThemeStyles = {
    '--primary-dark': '#A8FD24',
    '--secondary-dark': '#D6F917',
    '--secondary-alt-dark': '#FFFFFF',
    '--neutral-dark': '#1E1E1E',
    '--text-primary-dark': '#FFFFFF',
    '--text-muted-dark': '#B3B3B3',
    '--error-dark': '#ED1515',
    '--success-dark': '#00C26B',
    '--warning-dark': '#ED1515',
    '--border-dark': '#B3AC9B',
  };

  // Apply dark theme styles
  useEffect(() => {
    if (darkMode) {
      Object.entries(darkThemeStyles).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      // Reset to default light theme colors (original blue theme)
      document.documentElement.style.setProperty('--primary-dark', '');
      document.documentElement.style.setProperty('--secondary-dark', '');
      // ... reset other dark theme variables if needed
    }
  }, [darkMode]);

  const isActive = (path) => {
    return location.pathname === path 
      ? darkMode 
        ? 'text-primary-dark font-medium' 
        : 'text-white font-medium' 
      : darkMode 
        ? 'text-text-primary-dark hover:text-primary-dark' 
        : 'text-white hover:text-gray-200';
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
      
      <div className={`md:hidden w-full p-3 shadow-md flex justify-between items-center ${darkMode ? 'bg-neutral-dark' : 'bg-[#16638A]'}`}>
        {/* Menu Button */}
        <button 
          onClick={toggleSidebar}
          className={`p-1 rounded-md focus:outline-none ${darkMode ? 'text-text-primary-dark' : 'text-white'}`}
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
            className={`p-1 rounded-md focus:outline-none ${darkMode ? 'text-text-primary-dark' : 'text-white'}`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition ${darkMode ? 'bg-primary-dark text-neutral-dark' : 'bg-white text-[#16638A]'}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {currentUser && currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <FiUser />
              )}
            </div>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${darkMode ? 'bg-neutral-dark border border-border-dark' : 'bg-white border border-gray-200'}`}>
                {currentUser ? (
                  <>
                    <div className={`px-4 py-2 text-sm border-b ${darkMode ? 'border-border-dark' : 'border-gray-200'}`}>
                      <p className={`font-medium ${darkMode ? 'text-text-primary-dark' : 'text-gray-800'}`}>
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-text-muted-dark' : 'text-gray-500'}`}>
                        {currentUser.email}
                      </p>
                      <p className={`text-xs capitalize mt-1 ${darkMode ? 'text-text-muted-dark' : 'text-gray-500'}`}>
                        Role: {userRole || 'Viewer'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm flex items-center ${darkMode ? 'text-text-primary-dark hover:bg-neutral-dark/50' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FiLogOut className="mr-2" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-text-primary-dark hover:bg-neutral-dark/50' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setShowDropdown(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-text-primary-dark hover:bg-neutral-dark/50' : 'text-gray-700 hover:bg-gray-100'}`}
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
    <nav className={`hidden md:block w-full p-4 shadow-md ${darkMode ? 'bg-neutral-dark' : 'bg-[#16638A]'}`}>
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
                className={`flex items-center ${
                  isActive('/CompletedMatches') || 
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
                className={`flex items-center ${
                  isActive('/CompletedTournaments') || 
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
              className={`p-1 rounded-md focus:outline-none ${darkMode ? 'text-text-primary-dark' : 'text-white'}`}
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition ${darkMode ? 'bg-primary-dark text-neutral-dark' : 'bg-white text-[#16638A]'}`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {currentUser && currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <FiUser />
                )}
              </div>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${darkMode ? 'bg-neutral-dark border border-border-dark' : 'bg-white border border-gray-200'}`}>
                  {currentUser ? (
                    <>
                      <div className={`px-4 py-2 text-sm border-b ${darkMode ? 'border-border-dark' : 'border-gray-200'}`}>
                        <p className={`font-medium ${darkMode ? 'text-text-primary-dark' : 'text-gray-800'}`}>
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-text-muted-dark' : 'text-gray-500'}`}>
                          {currentUser.email}
                        </p>
                        <p className={`text-xs capitalize mt-1 ${darkMode ? 'text-text-muted-dark' : 'text-gray-500'}`}>
                          Role: {userRole || 'Viewer'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm flex items-center ${darkMode ? 'text-text-primary-dark hover:bg-neutral-dark/50' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiLogOut className="mr-2" /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-text-primary-dark hover:bg-neutral-dark/50' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-text-primary-dark hover:bg-neutral-dark/50' : 'text-gray-700 hover:bg-gray-100'}`}
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
    <div className={`md:hidden fixed bottom-0 left-0 right-0 shadow-lg z-40 ${darkMode ? 'bg-neutral-dark' : 'bg-[#16638A]'}`}>
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