import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import ProtectedRoute from './Components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

// Auth Screens
import Login from './Screens/Auth/Login'
import Signup from './Screens/Auth/Signup'

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
import OrganiserHomepage from './Screens/Organiser/OrganiserHomepage'
import CreateTournamentPage from './Screens/Organiser/CreateTournamentPage'
import CreateMatchPage from './Screens/Organiser/CreateMatchPage'
import NewsDetail from './Screens/Viewer/NewsDetail'
import OldNews from './Screens/Viewer/OldNews'
import MatchDetailPage from './Screens/Organiser/MatchDetailPage'
import TournamentDetailPage from './Screens/Organiser/TournamentDetailPage'
import OrganiserCompletedMatches from './Screens/Organiser/OrganiserCompletedMatches'
import OrganiserCompletedTournaments from './Screens/Organiser/OrganiserCompletedTournaments'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="content">
          <Routes>
            {/* Redirect root to viewer home for now */}
            <Route path="/" element={<Navigate to="/viewer-home" />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Scorer Routes - Protected */}
            <Route path="/scorer-home" element={
              <ProtectedRoute allowedRoles={['scorer', 'organiser']}>
                <ScorerHome />
              </ProtectedRoute>
            } />
            <Route path='/CompletedMatches' element={<CompletedMatches />} />
            <Route path='/CompletedTournaments' element={<CompletedTournaments />} />

            <Route path="/match-setup/:matchId" element={
              <ProtectedRoute allowedRoles={['scorer', 'organiser']}>
                <MatchSetup />
              </ProtectedRoute>
            } />
            <Route path="/scoring/:matchId" element={
              <ProtectedRoute allowedRoles={['scorer', 'organiser']}>
                <Scoring />
              </ProtectedRoute>
            } />
            <Route path="/innings-break/:matchId" element={
              <ProtectedRoute allowedRoles={['scorer', 'organiser']}>
                <InningsBreak />
              </ProtectedRoute>
            } />
            <Route path="/match-summary/:matchId" element={
              <ProtectedRoute allowedRoles={['scorer', 'organiser']}>
                <MatchSummary />
              </ProtectedRoute>
            } />
            
            {/* Viewer Routes */}
            <Route path="/match-details/:matchId" element={<MatchDetails />} />
            <Route path="/viewer-home" element={<ViewerHome />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/old-news" element={<OldNews />} />

            {/* Organiser Routes - Protected */}
            <Route path="/organiser-homepage" element={
              <ProtectedRoute allowedRoles={['organiser']}>
                <OrganiserHomepage />
              </ProtectedRoute>
            } />
            <Route path="/organiser/create-tournament" element={
              <ProtectedRoute allowedRoles={['organiser']}>
                <CreateTournamentPage />
              </ProtectedRoute>
            } />
            <Route path="/organiser/create-match" element={
              <ProtectedRoute allowedRoles={['organiser']}>
                <CreateMatchPage />
              </ProtectedRoute>
            } />
            <Route path="/organiser/match/:id" element={<MatchDetailPage />} />
            <Route path="/organiser/tournament/:id" element={<TournamentDetailPage />} />
            <Route path="/organiser/completed-matches" element={
              <ProtectedRoute allowedRoles={['organiser']}>
                <OrganiserCompletedMatches />
              </ProtectedRoute>
            } />
            <Route path="/organiser/completed-tournaments" element={
              <ProtectedRoute allowedRoles={['organiser']}>
                <OrganiserCompletedTournaments />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App