import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import './App.css'

// Import Pages
import ScorerHome from './Screens/Scorer/ScorerHome'
import MatchSetup from './Screens/Scorer/MatchSetup'
import Scoring from './Screens/Scorer/Scoring'
import InningsBreak from './Screens/Scorer/InningsBreak'
import MatchSummary from './Screens/Scorer/MatchSummary'
import CompletedMatches from './Screens/Scorer/CompletedMatches'
import CompletedTournaments from './Screens/Scorer/CompletedTournaments'

import MatchDetails from './Screens/Viewer/MatchDetails'
import ViewerHome from './Screens/Viewer/ViewerHome'

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          {/* Redirect root to scorer home for now */}
          <Route path="/" element={<Navigate to="/scorer-home" />} />

          {/* Scorer Routes */}
          <Route path="/scorer-home" element={<ScorerHome />} />
          <Route path='/CompletedMatches' element={<CompletedMatches />} />
          <Route path='/CompletedTournaments' element={<CompletedTournaments />} />

          <Route path="/match-setup/:matchId" element={<MatchSetup />} />
          <Route path="/scoring/:matchId" element={<Scoring />} />
          <Route path="/innings-break/:matchId" element={<InningsBreak />} />
          <Route path="/match-summary/:matchId" element={<MatchSummary />} />
          <Route path="/match-details/:matchId" element={<MatchDetails />} />
          <Route path="/viewer-home" element={<ViewerHome />} />

        </Routes>
      </Router>
  )
}

export default App
