import { useState } from 'react'
import Navbar from './Components/Navbar'
import Header from './Components/Header'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Header />
      <main className="container">
        <div className="content">
          <h2>Welcome to Cricket Scoring System</h2>
          <p>Start managing your cricket matches with our comprehensive scoring system</p>
        </div>
      </main>
    </>
  )
}

export default App
