import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiAward, FiUser, FiLogOut } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path ? 'text-white font-medium' : 'text-white hover:text-gray-200';
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/viewer-home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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

  return (
    <nav className=" w-full bg-[#16638A] text-white text-[1.35rem] p-4 shadow-md">
      <div className="mx-auto flex gap-10 justify-between items-center">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <img
            src="https://zemo.co.in/images/ZemoLogoNeon.svg"
            alt="Zemo Logo"
            className="h-8 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              // Fallback to text logo if image fails
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback logo if image fails to load */}
          <div className="w-8 h-8 bg-white rounded-full items-center justify-center text-[#16638A] font-bold hidden">
            CS
          </div>
        </div>

        {/* Right side - Navigation Links and Profile Icon */}
        <div className="flex items-center space-x-4 md:space-x-10">
          <ul className="flex space-x-6 md:space-x-7">
            {/* Home link based on user role */}
            <li>
              <Link 
                to={userRole === 'organiser' ? '/organiser-homepage' : 
                    userRole === 'scorer' ? '/scorer-home' : 
                    '/viewer-home'} 
                className={`flex items-center ${isActive('/viewer-home') || isActive('/scorer-home') || isActive('/organiser-homepage') ? 'text-white font-medium' : 'text-white hover:text-gray-200'}`}
              >
                <FiHome className="mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/CompletedMatches" className={`flex items-center ${isActive('/CompletedMatches')}`}>
                <FiCalendar className="mr-1" />
                <span className="hidden sm:inline">Matches</span>
              </Link>
            </li>
            <li>
              <Link to="/CompletedTournaments" className={`flex items-center ${isActive('/CompletedTournaments')}`}>
                <FiAward className="mr-1" />
                <span className="hidden sm:inline">Tournaments</span>
              </Link>
            </li>
            <li>
              <Link to="/player-stats" className={`flex items-center ${isActive('/player-stats')}`}>
                <FiAward className="mr-1" />
                <span className="hidden sm:inline">Player Stats</span>
              </Link>
            </li>
          </ul>

          {/* Profile Icon with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#16638A] cursor-pointer hover:bg-gray-100 transition"
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
              <div className="absolute right-0 mt-2 w-48 text-blue-800 bg-white rounded-md shadow-lg py-1 z-10">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{currentUser.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">Role: {userRole || 'Viewer'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100"
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
    </nav>
  );
};

export default Navbar;