import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Components } from '../../exports';
import Stepper from './components/Stepper';
import BasicMatchInfo from './components/BasicMatchInfo';
import TeamPlayerSelection from './components/TeamPlayerSelection';
import MatchRules from './components/MatchRules';
import ScorerAccess from './components/ScorerAccess';
import Confirmation from './components/Confirmation';
import api from '../../utils/api';

const { 
  Navbar,
  Footer
} = Components;

const CreateMatchPage = () => {
    const [step, setStep] = useState(1);
    const [matchData, setMatchData] = useState({
        match_name: '',
        match_type: '',
        team1_name: '',
        team2_name: '',
        venue: '',
        dateTime: '',
        team1_players: [],
        team2_players: [],
        team1_captains: [],
        team2_captains: [],
        overs: 20,
        powerplayOvers: 6,
        drsEnabled: false,
        drsReviews: 2,
        scorers: [],
    });

    const navigate = useNavigate();

    const nextStep = () => {
        console.log('Moving to next step:', step + 1);
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const submitMatch = async () => {
        console.log('Submitting match:', matchData);
        // Validate required fields
        if (!matchData.match_name || !matchData.team1_name || !matchData.team2_name || !matchData.dateTime || !matchData.venue) {
            alert('Please fill in all required fields: Match Name, Team 1, Team 2, Venue, and Date/Time.');
            return;
        }
        
        // Ensure we have at least one scorer
        if (!matchData.scorers || matchData.scorers.length === 0) {
            alert('Please add at least one scorer to the match.');
            return;
        }
        
        // Extract email addresses from scorer objects
        const scorerEmails = matchData.scorers.map(scorer => {
            if (typeof scorer === 'string') return scorer;
            return scorer.email || '';
        }).filter(email => email); // Filter out any empty emails
        
        if (scorerEmails.length === 0) {
            alert('Please add at least one valid scorer email to the match.');
            return;
        }
        
        const payload = {
            match_name: matchData.match_name,
            match_type: matchData.match_type,
            date: matchData.dateTime.split('T')[0],
            time: matchData.dateTime.split('T')[1] || '00:00',
            teams: [matchData.team1_name, matchData.team2_name], // Array of team names
            team1_name: matchData.team1_name, // Direct team name
            team2_name: matchData.team2_name, // Direct team name
            venue: matchData.venue,
            team1_players: matchData.team1_players || [],
            team2_players: matchData.team2_players || [],
            team1_captains: matchData.team1_captains || [],
            team2_captains: matchData.team2_captains || [],
            total_overs: parseInt(matchData.overs, 10) || 20,
            powerplay_overs: parseInt(matchData.powerplayOvers, 10) || 6,
            drs_enabled: Boolean(matchData.drsEnabled),
            scorers: scorerEmails,
            status: 'Upcoming',
        };

        console.log('Final payload to send:', payload);

        try {
            const response = await api.post('/api/matches', payload);
            if (!response || !response.data) {
                throw new Error('No response from backend');
            }
            alert('Match created successfully!');
            navigate('/organiser-homepage', { state: { refresh: true } });
        } catch (err) {
            console.error('Failed to create match:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Please try again.';
            alert('Failed to create match: ' + errorMessage);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicMatchInfo data={matchData} setData={setMatchData} nextStep={nextStep} />;
            case 2:
                return <TeamPlayerSelection data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <MatchRules data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} />;
            case 4:
                return <ScorerAccess data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} />;
            case 5:
                return <Confirmation data={matchData} prevStep={prevStep} submit={submitMatch} />;
            default:
                return <div>Step not found</div>;
        }
    };

    return (
        <>
            <div className="container mx-auto p-4 sm:p-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <Stepper currentStep={step} />
                    <div className="mt-10">
                        {renderStep()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateMatchPage;