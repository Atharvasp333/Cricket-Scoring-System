import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-6 mt-12">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
      <div className="mb-2 md:mb-0 text-center md:text-left">
        <span className="font-bold">Cricket Scoring System</span> &copy; {new Date().getFullYear()}<br />
        <span className="text-sm text-gray-400">Empowering cricket organisers and fans with real-time match insights.</span>
      </div>
      <div className="flex space-x-6">
        <a href="/" className="hover:text-gray-300">Home</a>
        <a href="#about" className="hover:text-gray-300">About</a>
        <a href="#contact" className="hover:text-gray-300">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer; 