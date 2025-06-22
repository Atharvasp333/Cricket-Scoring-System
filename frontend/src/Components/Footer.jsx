import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#16638A] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Useful Links */}
          <div>
            <h3 className="text-[#74D341] font-bold text-xl mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-gray-300">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-gray-300">Refund Policy</Link></li>
              <li><Link to="/contact" className="hover:text-gray-300">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Tournaments */}
          <div>
            <h3 className="text-[#74D341] font-bold text-xl mb-4">TOURNAMENTS</h3>
            <ul className="space-y-2">
              <li><Link to="/tournaments/upcoming" className="hover:text-gray-300">Upcoming</Link></li>
              <li><Link to="/tournaments/ongoing" className="hover:text-gray-300">Ongoing</Link></li>
              <li><Link to="/tournaments/concluded" className="hover:text-gray-300">Concluded</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="text-[#74D341] font-bold text-xl mb-4">CONTACT</h3>
            <address className="not-italic">
              <p className="mb-2">CIBA Vashi, 6th Floor, Agnel Technical Complex, Sector 9A Vashi, Navi Mumbai, Maharashtra 400703</p>
              <p className="mb-2">Email: <a href="mailto:support@zemo.co.in" className="hover:text-gray-300">support@zemo.co.in</a></p>
              <p>Phone: <a href="tel:+919082705182" className="hover:text-gray-300">+919082705182</a></p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p>© 2025 Futurasport Catalyst Private Limited</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;