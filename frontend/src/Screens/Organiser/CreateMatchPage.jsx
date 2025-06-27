import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Stepper from './components/Stepper';
import BasicMatchInfo from './components/BasicMatchInfo';
import TeamPlayerSelection from './components/TeamPlayerSelection';
import MatchRules from './components/MatchRules';
import ScorerAccess from './components/ScorerAccess';
import Confirmation from './components/Confirmation';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

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
        overs: 20,
        powerplayOvers: 6,
        drsEnabled: false,
        drsReviews: 2,
        scorers: [],
    });

    const navigate = useNavigate();

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const submitMatch = async () => {
        // Validate required fields
        if (!matchData.match_name || !matchData.team1_name || !matchData.team2_name || !matchData.dateTime || !matchData.venue) {
            alert('Please fill in all required fields: Match Name, Team 1, Team 2, Venue, and Date/Time.');
            return;
        }
        
        const payload = {
            match_name: matchData.match_name,
            match_type: matchData.match_type,
            date: matchData.dateTime.split('T')[0],
            time: matchData.dateTime.split('T')[1] || '',
            teams: [matchData.team1_name, matchData.team2_name], // Array of team names
            team1_name: matchData.team1_name, // Direct team name
            team2_name: matchData.team2_name, // Direct team name
            venue: matchData.venue,
            team1_players: matchData.team1_players,
            team2_players: matchData.team2_players,
            total_overs: matchData.overs,
            powerplay_overs: matchData.powerplayOvers,
            drs_enabled: matchData.drsEnabled,
            scorers: matchData.scorers.map(s => s.email),
            status: 'Upcoming',
        };

        try {
            const response = await fetch('/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                let errorMsg = 'Failed to create match';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (jsonErr) {
                    try {
                        const text = await response.text();
                        if (text) errorMsg = text;
                    } catch {}
                }
                console.error('Backend error:', errorMsg);
                throw new Error(errorMsg);
            }
            
            alert('Match created successfully!');
            navigate('/organiser-homepage');
        } catch (err) {
            alert('Failed to create match. ' + (err.message || 'Please try again.'));
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