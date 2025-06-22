import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <a href="/">Cricket Scoring System</a>
        </div>
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="hover:text-gray-300">Home</a>
          </li>
          <li>
            <a href="/matches" className="hover:text-gray-300">Matches</a>
          </li>
          <li>
            <a href="/teams" className="hover:text-gray-300">Teams</a>
          </li>
          <li>
            <a href="/stats" className="hover:text-gray-300">Statistics</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar 