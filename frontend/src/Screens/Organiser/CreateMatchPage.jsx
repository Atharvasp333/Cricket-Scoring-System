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
        matchType: 'T20',
        team1: '',
        team2: '',
        venue: '',
        dateTime: '',
        team1Players: [],
        team2Players: [],
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
        if (!matchData.matchName || !matchData.team1 || !matchData.team2 || !matchData.dateTime) {
            alert('Please fill in all required fields: Match Name, Team 1, Team 2, and Date/Time.');
            return;
        }
        const payload = {
            name: matchData.matchName || `${matchData.team1} vs ${matchData.team2}`,
            date: matchData.dateTime,
            teams: [matchData.team1, matchData.team2],
            tournament: matchData.matchType,
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
            navigate('/organiser/home');
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
            <Navbar />
            <div className="container mx-auto p-4 sm:p-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <Stepper currentStep={step} />
                    <div className="mt-10">
                        {renderStep()}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateMatchPage; 