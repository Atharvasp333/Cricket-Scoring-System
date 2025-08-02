import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const defaultMatchData = {
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
};

const CreateMatchPage = ({ initialData, isEdit = false, onSubmit: externalOnSubmit }) => {
    const [step, setStep] = useState(1);
    const [matchData, setMatchData] = useState(initialData || defaultMatchData);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (initialData) setMatchData(initialData);
    }, [initialData]);

    // Fetch match data if in edit mode
    useEffect(() => {
        const fetchMatchData = async () => {
            if (isEdit && id) {
                setLoading(true);
                try {
                    const response = await api.get(`/api/matches/${id}`);
                    if (response.data) {
                        const match = response.data;
                        
                        // Check if match is live and prevent editing
                        if (match.status === 'Live') {
                            alert('Cannot edit match details while the match is live. Please wait until the match is completed.');
                            navigate('/organiser-homepage');
                            return;
                        }
                        
                        // Check if match is completed and prevent editing
                        if (match.status === 'completed') {
                            alert('Cannot edit completed matches.');
                            navigate('/organiser-homepage');
                            return;
                        }
                        
                        // Transform the data to match the form structure
                        setMatchData({
                            match_name: match.match_name || '',
                            match_type: match.match_type || '',
                            team1_name: match.team1_name || '',
                            team2_name: match.team2_name || '',
                            venue: match.venue || '',
                            dateTime: match.date && match.time ? `${match.date}T${match.time}` : '',
                            team1_players: match.team1_players || [],
                            team2_players: match.team2_players || [],
                            team1_captains: match.team1_captains || [],
                            team2_captains: match.team2_captains || [],
                            overs: match.total_overs || 20,
                            powerplayOvers: match.powerplay_overs || 6,
                            drsEnabled: match.drs_enabled || false,
                            drsReviews: 2,
                            scorers: match.scorers ? match.scorers.map(email => ({ email, name: '' })) : [],
                            status: match.status || 'Upcoming',
                        });
                    }
                } catch (error) {
                    console.error('Error fetching match data:', error);
                    alert('Failed to load match data for editing');
                    navigate('/organiser-homepage');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMatchData();
    }, [isEdit, id, navigate]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    
    const handleCancelEdit = () => {
        const message = isEdit 
            ? 'Are you sure you want to cancel editing? All unsaved changes will be lost.'
            : 'Are you sure you want to cancel creating this match? All entered data will be lost.';
            
        if (window.confirm(message)) {
            if (isEdit) {
                // If in edit mode, go back to match details page
                navigate(`/organiser/matches/${id}`);
            } else {
                // If in create mode, go back to organizer homepage
                navigate('/organiser-homepage');
            }
        }
    };

    const submitMatch = async () => {
        console.log('Submitting match:', matchData);
        console.log('Team 1 Captains structure:', JSON.stringify(matchData.team1_captains));
        console.log('Team 1 Players structure:', JSON.stringify(matchData.team1_players));
        console.log('Team 2 Captains structure:', JSON.stringify(matchData.team2_captains));
        console.log('Team 2 Players structure:', JSON.stringify(matchData.team2_players));
        
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
            let response;
            if (isEdit && id) {
                // Edit mode: PUT
                response = await api.put(`/api/matches/${id}`, payload);
            } else {
                // Create mode: POST
                response = await api.post('/api/matches', payload);
            }
            if (!response || !response.data) {
                throw new Error('No response from backend');
            }
            alert(isEdit ? 'Match updated successfully!' : 'Match created successfully!');
            if (externalOnSubmit) {
                externalOnSubmit(response.data);
            } else {
                navigate('/organiser-homepage', { state: { refresh: true } });
            }
        } catch (err) {
            console.error('Failed to create match:', err);
            // Add more detailed error logging
            if (err.response) {
                console.error('Error response data:', JSON.stringify(err.response.data));
                console.error('Error response status:', err.response.status);
                console.error('Error response headers:', err.response.headers);
            }
            
            // Handle specific error cases
            if (err.response?.status === 403) {
                const errorMessage = err.response?.data?.error || 'Access denied';
                alert(errorMessage);
                if (err.response?.data?.details) {
                    console.log('Error details:', err.response.data.details);
                }
            } else {
                const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Please try again.';
                alert('Failed to ' + (isEdit ? 'update' : 'create') + ' match: ' + errorMessage);
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicMatchInfo data={matchData} setData={setMatchData} nextStep={nextStep} onCancel={handleCancelEdit} />;
            case 2:
                return <TeamPlayerSelection data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} onCancel={handleCancelEdit} />;
            case 3:
                return <MatchRules data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} onCancel={handleCancelEdit} />;
            case 4:
                return <ScorerAccess data={matchData} setData={setMatchData} nextStep={nextStep} prevStep={prevStep} onCancel={handleCancelEdit} />;
            case 5:
                return <Confirmation data={matchData} prevStep={prevStep} submit={submitMatch} isEdit={isEdit} onCancel={handleCancelEdit} />;
            default:
                return <div>Step not found</div>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading match data...</div>
                    </div>
                </div>
            </div>
        );
    }

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