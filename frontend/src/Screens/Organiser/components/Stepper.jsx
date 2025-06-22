import React from 'react';

const Stepper = ({ currentStep }) => {
    const steps = [
        'Basic Info',
        'Player Selection',
        'Match Rules',
        'Scorer Access',
        'Confirmation'
    ];

    return (
        <div className="w-full py-4">
            <div className="flex">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center w-full">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-colors duration-300 ${
                                index + 1 <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {index + 1}
                            </div>
                            <p className={`mt-2 text-center text-sm font-medium ${
                                index + 1 <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                            }`}>
                                {step}
                            </p>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-4 transition-colors duration-500 ease-in-out ${
                                index + 1 < currentStep ? 'border-indigo-600' : 'border-gray-200'
                            }`}>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stepper;
