import React, { useState, useEffect } from 'react';
import { Components } from '../../../exports';


const {
    FormField
} = Components;

const ScorerAccess = ({ data, setData, nextStep, prevStep, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    // Check if at least one scorer is added
    useEffect(() => {
        setIsValid(data.scorers && data.scorers.length > 0);
    }, [data.scorers]);

    const handleInvite = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        
        // Check if this email already exists in the scorers list
        const emailExists = data.scorers.some(scorer => {
            if (typeof scorer === 'string') return scorer === email;
            return scorer.email === email;
        });
        
        if (emailExists) {
            setError('This email has already been added.');
            return;
        }
        
        setData(prev => ({
            ...prev,
            scorers: [...prev.scorers, { name: name || 'Scorer', email }]
        }));
        setName('');
        setEmail('');
        setError('');
    };
    
    const removeScorer = (index) => {
        setData(prev => ({
            ...prev,
            scorers: prev.scorers.filter((_, i) => i !== index)
        }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Scorer Access Management</h2>
            
            <div className="max-w-lg mx-auto">
                <form onSubmit={handleInvite} className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Invite Scorer</h3>
                        
                    </div>
                    
                    <div>
                        <label htmlFor="scorerName" className="block text-sm font-medium text-gray-700">Name (Optional)</label>
                        <input type="text" id="scorerName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="mt-1 block text-gray-700 w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="scorerEmail" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                        <input type="email" id="scorerEmail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john.doe@example.com" className="mt-1 block text-gray-700 w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        Add Scorer
                    </button>
                </form>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900">Invited Scorers</h3>
                    <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {(data.scorers || []).map((scorer, index) => (
                                <li key={index} className="px-4 py-3 flex items-center justify-between text-sm hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-800">
                                            {typeof scorer === 'object' ? scorer.name || 'No Name' : 'Scorer'}
                                        </span>
                                        <span className="ml-2 text-gray-500">
                                            ({typeof scorer === 'object' ? scorer.email : scorer})
                                        </span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeScorer(index)} 
                                        className="font-semibold text-red-600 hover:text-red-800 transition-colors duration-200"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                            {(data.scorers || []).length === 0 && <li className="px-4 py-4 text-sm text-gray-500 text-center">No scorers invited yet.</li>}
                        </ul>
                    </div>
                    
                    {!isValid && (
                        <p className="text-red-500 text-sm mt-2">
                            You must add at least one scorer to continue.
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={onCancel} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600">
                    Cancel
                </button>
                <div className="flex space-x-3">
                    <button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                        Back
                    </button>
                    <button 
                        onClick={nextStep} 
                        disabled={!isValid}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScorerAccess; 