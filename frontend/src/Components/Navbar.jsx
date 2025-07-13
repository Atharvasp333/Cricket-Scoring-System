import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Components, Icons } from '../exports';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import { useTheme } from '../contexts/ThemeContext';

const { Button, Avatar, Dropdown, Tooltip } = Components;
const { 
  FiHome, 
  FiCalendar, 
  FiAward, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiMoon, 
  FiSun, 
  FiChevronDown,
  FiBarChart2,
  FiSettings
} = Icons;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navbarRef = useRef(null);

  // Navigation items for authenticated users
  const navItems = [
    {
      name: 'Home',
      icon: <FiHome className="h-5 w-5" />,
      path: userRole === 'organiser' ? '/organiser-homepage' :
            userRole === 'scorer' ? '/scorer-home' :
            userRole === 'player' ? '/player-home' : '/viewer-home',
      activePaths: ['/viewer-home', '/scorer-home', '/organiser-homepage', '/player-home']
    },
    {
      name: 'Matches',
      icon: <FiCalendar className="h-5 w-5" />,
      path: userRole === 'organiser' ? '/organiser/completed-matches' :
            userRole === 'scorer' ? '/completed-matches' : '/matches',
      activePaths: ['/matches', '/completed-matches', '/organiser/completed-matches']
    },
    {
      name: 'Tournaments',
      icon: <FiAward className="h-5 w-5" />,
      path: userRole === 'organiser' ? '/organiser/completed-tournaments' : '/tournaments',
      activePaths: ['/tournaments', '/completed-tournaments', '/organiser/completed-tournaments']
    },
    {
      name: 'Stats',
      icon: <FiBarChart2 className="h-5 w-5" />,
      path: '/player-stats',
      activePaths: ['/player-stats']
    }
  ];

  // User dropdown menu items
  const userMenuItems = [
    {
      label: 'Your Profile',
      icon: <FiUser className="h-4 w-4" />,
      onClick: () => navigate('/profile')
    },
    {
      label: 'Settings',
      icon: <FiSettings className="h-4 w-4" />,
      onClick: () => navigate('/settings')
    },
    { type: 'divider' },
    {
      label: 'Sign out',
      icon: <FiLogOut className="h-4 w-4" />,
      onClick: async () => {
        try {
          await signOut(auth);
          navigate('/login');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },
      className: 'text-red-600 hover:!bg-red-50 dark:text-red-400 dark:hover:!bg-red-900/30'
    }
  ];

  // Check if current path matches any of the given paths
  const isActive = useCallback((...paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  }, [location.pathname]);

  // Get user's initials for avatar fallback
  const getUserInitials = useCallback(() => {
    if (!currentUser?.displayName) return 'U';
    return currentUser.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [currentUser]);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Navigation
  const MobileTopBar = () => (
    <div className="md:hidden w-full p-3 bg-blue-800 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-white hover:bg-blue-700/50 rounded-full"
          aria-label="Toggle menu"
          iconOnly
        >
          <FiMenu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center">
          <span className="text-white font-semibold text-lg">Cricket Scoring</span>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <Tooltip content={darkMode ? 'Light mode' : 'Dark mode'} position="bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 text-white hover:bg-blue-700/50 rounded-full"
            aria-label="Toggle theme"
            iconOnly
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </Button>
        </Tooltip>

        {currentUser ? (
          <Dropdown
            trigger={
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || currentUser.email}
                  size="sm"
                  className="ring-2 ring-white"
                >
                  {!currentUser.photoURL && getUserInitials()}
                </Avatar>
              </div>
            }
            position="bottom-end"
            className="w-56"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentUser.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
            
            {userMenuItems.map((item, index) => (
              item.type === 'divider' ? (
                <Dropdown.Divider key={`divider-${index}`} />
              ) : (
                <Dropdown.Item 
                  key={item.label}
                  icon={item.icon}
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.label}
                </Dropdown.Item>
              )
            ))}
          </Dropdown>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-white border-white/30 hover:bg-white/10"
            >
              Log in
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-800 hover:bg-gray-100"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Desktop Navigation
  const DesktopNav = () => (
    <nav className="hidden md:block w-full bg-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-white font-semibold text-lg">
                Cricket Scoring
              </span>
            </Link>

            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium mx-1 ${
                    isActive(...item.activePaths)
                      ? 'text-white font-medium bg-blue-700/20 rounded-md'
                      : 'text-gray-200 hover:text-white hover:bg-blue-700/10 rounded-md transition-colors'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Tooltip content={darkMode ? 'Light mode' : 'Dark mode'} position="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 text-white hover:bg-blue-700/50 rounded-full"
                aria-label="Toggle theme"
                iconOnly
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </Button>
            </Tooltip>

            {currentUser ? (
              <Dropdown
                trigger={
                  <div className="flex items-center space-x-2 cursor-pointer group">
                    <div className="flex-shrink-0">
                      <Avatar 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || currentUser.email}
                        size="sm"
                        className="ring-2 ring-white/80 group-hover:ring-white transition-all"
                      >
                        {!currentUser.photoURL && getUserInitials()}
                      </Avatar>
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium text-white">
                        {currentUser.displayName || 'User'}
                      </span>
                      <span className="text-xs text-blue-200">
                        {userRole?.charAt(0).toUpperCase() + (userRole?.slice(1) || '')}
                      </span>
                    </div>
                    <FiChevronDown className="h-4 w-4 text-blue-200 group-hover:text-white transition-colors" />
                  </div>
                }
                position="bottom-end"
                className="w-64"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
                
                {userMenuItems.map((item, index) => (
                  item.type === 'divider' ? (
                    <Dropdown.Divider key={`divider-${index}`} />
                  ) : (
                    <Dropdown.Item 
                      key={item.label}
                      icon={item.icon}
                      onClick={item.onClick}
                      className={item.className}
                    >
                      {item.label}
                    </Dropdown.Item>
                  )
                ))}
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-blue-800 hover:bg-gray-100"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <ul className="flex justify-around py-2">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1">
            <Link
              to={item.path}
              className={`flex flex-col items-center px-2 py-2 text-xs font-medium ${
                isActive(...item.activePaths)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <header ref={navbarRef} className="sticky top-0 z-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navItems={navItems}
        userMenuItems={userMenuItems}
        userInitials={getUserInitials()}
        currentUser={currentUser}
      />
      
      {isMobile ? (
        <>
          <MobileTopBar />
          <MobileBottomNav />
        </>
      ) : (
        <DesktopNav />
      )}
    </header>
  );
};

export default Navbar;
