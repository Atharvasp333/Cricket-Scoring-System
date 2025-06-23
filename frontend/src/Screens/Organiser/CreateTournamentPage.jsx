import React, { useState } from 'react';
import Stepper from './components/Stepper';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
// Step components (to be implemented)
import TournamentBasicInfo from './components/TournamentBasicInfo';
import TournamentTeams from './components/TournamentTeams';
import TournamentPlayerPool from './components/TournamentPlayerPool';
import TournamentRules from './components/TournamentRules';
import TournamentSchedule from './components/TournamentSchedule';
import TournamentAccess from './components/TournamentAccess';
import TournamentReview from './components/TournamentReview';

const steps = [
  'Basic Info',
  'Teams',
  'Player Pool',
  'Rules',
  'Schedule',
  'Access',
  'Review'
];

const CreateTournamentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TournamentBasicInfo data={formData} updateData={updateFormData} nextStep={nextStep} />;
      case 2:
        return <TournamentTeams data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <TournamentPlayerPool data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <TournamentRules data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <TournamentSchedule data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <TournamentAccess data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 7:
        return <TournamentReview data={formData} prevStep={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Stepper currentStep={currentStep} steps={steps} />
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default CreateTournamentPage; 