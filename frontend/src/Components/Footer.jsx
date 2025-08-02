import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode from document class
  useEffect(() => {
    const checkDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <footer className={`py-10 transition-colors duration-200 ${
      darkMode 
        ? 'bg-[#1E1E1E] text-white border-t border-[#B3AC9B]/20' 
        : 'bg-[#16638A] text-white'
    }`}>
      <div className="container mx-auto px-4">
        {/* Zemo Logo */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="https://zemo.co.in/images/ZemoLogoNeon.svg" 
            alt="Zemo Logo" 
            className="h-12 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              // Fallback to text logo if image fails
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span className={`text-2xl font-bold hidden ${
            darkMode ? 'text-[#A8FD24]' : 'text-white'
          }`}>
            Zemo
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Useful Links */}
          <div>
            <h3 className={`font-bold text-xl mb-4 transition-colors ${
              darkMode ? 'text-[#A8FD24]' : 'text-[#74D341]'
            }`}>
              Useful Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/refund" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Tournaments */}
          <div>
            <h3 className={`font-bold text-xl mb-4 transition-colors ${
              darkMode ? 'text-[#A8FD24]' : 'text-[#74D341]'
            }`}>
              TOURNAMENTS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/tournaments/upcoming" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Upcoming
                </Link>
              </li>
              <li>
                <Link 
                  to="/tournaments/ongoing" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Ongoing
                </Link>
              </li>
              <li>
                <Link 
                  to="/tournaments/concluded" 
                  className={`transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  Concluded
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className={`font-bold text-xl mb-4 transition-colors ${
              darkMode ? 'text-[#A8FD24]' : 'text-[#74D341]'
            }`}>
              CONTACT
            </h3>
            <address className="not-italic">
              <p className={`mb-2 transition-colors ${
                darkMode ? 'text-[#B3B3B3]' : 'text-white'
              }`}>
                CIBA Vashi, 6th Floor, Agnel Technical Complex, Sector 9A Vashi, Navi Mumbai, Maharashtra 400703
              </p>
              <p className={`mb-2 transition-colors ${
                darkMode ? 'text-[#B3B3B3]' : 'text-white'
              }`}>
                Email: 
                <a 
                  href="mailto:support@zemo.co.in" 
                  className={`ml-1 transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  support@zemo.co.in
                </a>
              </p>
              <p className={`transition-colors ${
                darkMode ? 'text-[#B3B3B3]' : 'text-white'
              }`}>
                Phone: 
                <a 
                  href="tel:+919082705182" 
                  className={`ml-1 transition-colors ${
                    darkMode 
                      ? 'text-white hover:text-[#A8FD24]' 
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  +919082705182
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className={`mt-8 pt-6 text-center transition-colors ${
          darkMode 
            ? 'border-t border-[#B3AC9B]/20 text-[#B3B3B3]' 
            : 'border-t border-white text-white'
        }`}>
          <p>© 2025 Futurasport Catalyst Private Limited</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;