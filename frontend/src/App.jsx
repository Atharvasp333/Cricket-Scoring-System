import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrganiserHomepage from './Screens/Organiser/OrganiserHomepage';
import CreateMatchPage from './Screens/Organiser/CreateMatchPage';
import CreateTournamentPage from './Screens/Organiser/CreateTournamentPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen font-sans">
        <Routes>
          <Route path="/" element={<Navigate to="/organiser/home" replace />} />
          <Route path="/organiser/home" element={<OrganiserHomepage />} />
          <Route path="/organiser/create-match" element={<CreateMatchPage />} />
          <Route path="/organiser/create-tournament" element={<CreateTournamentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
