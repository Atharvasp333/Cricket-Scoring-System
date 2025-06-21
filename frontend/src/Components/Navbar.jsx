import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  
  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-300' : 'hover:text-gray-300'
  }
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Cricket Scoring System</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/scorer-home" className={isActive('/scorer-home')}>Scorer Home</Link>
          </li>
          <li>
            <Link to="/matches" className={isActive('/matches')}>Matches</Link>
          </li>
          <li>
            <Link to="/teams" className={isActive('/teams')}>Teams</Link>
          </li>
          <li>
            <Link to="/stats" className={isActive('/stats')}>Statistics</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar