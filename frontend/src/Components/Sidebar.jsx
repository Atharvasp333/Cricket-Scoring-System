import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiX, 
  FiHome, 
  FiCalendar, 
  FiAward, 
  FiBarChart2, 
  FiUser, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import Button from './Button';
import Avatar from './Avatar';

const Sidebar = ({ isOpen, toggleSidebar, navItems, userMenuItems, userInitials, currentUser }) => {
  const location = useLocation();

  const isActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path))
      ? 'bg-blue-700/20 text-white'
      : 'text-gray-200 hover:bg-blue-700/10';
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:hidden transition-transform duration-300 ease-in-out`}
    >
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      
      <div className="relative flex h-full w-72 flex-col bg-blue-800 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <img
              src="/logo-white.svg"
              alt="Cricket Scoring System"
              className="h-8 w-auto"
            />
            <span className="text-white font-semibold">Cricket Scoring</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-1 text-white hover:bg-blue-700/50 rounded-full"
            aria-label="Close menu"
            iconOnly
          >
            <FiX className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${isActive(item.activePaths)}`}
                onClick={toggleSidebar}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {currentUser && (
            <div className="mt-8 pt-4 border-t border-blue-700">
              <div className="px-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || currentUser.email}
                    size="md"
                    className="ring-2 ring-white"
                  >
                    {!currentUser.photoURL && userInitials}
                  </Avatar>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white">
                      {currentUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-blue-200 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 px-2">
                {userMenuItems.map((item) => (
                  item.type === 'divider' ? (
                    <div key={`divider-${Math.random()}`} className="border-t border-blue-700 my-2" />
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        toggleSidebar();
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        item.className || 'text-gray-200 hover:bg-blue-700/10 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;