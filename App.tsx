import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { 
  WelcomeStep, 
  SymptomSelectionStep, 
  SymptomDetailsStep, 
  ContextStep, 
  EmailStep 
} from './components/Steps';
import { ResultsStep } from './components/Results';
import { AssessmentState, Step, UserContext, UserInfo } from './types';
import { generateAssessment } from './services/geminiService';
import { DURATION_OPTIONS } from './constants';

// --- Google Analytics Helper ---
const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

const INITIAL_STATE: AssessmentState = {
  step: Step.WELCOME,
  selectedSymptoms: [],
  symptomDetails: {},
  context: {
    age: '',
    periodStatus: '',
    hormoneTestHistory: '',
    currentTherapy: ''
  },
  userInfo: {
    name: '',
    email: ''
  },
  result: null,
  isLoading: false,
  error: null
};

export default function App() {
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.step]);

  const updateState = (updates: Partial<AssessmentState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleStart = () => {
    trackEvent('start_assessment', 'funnel');
    updateState({ step: Step.SYMPTOM_SELECTION });
  };

  const toggleSymptom = (id: string) => {
    setState(prev => {
      const exists = prev.selectedSymptoms.includes(id);
      let newSelected;
      let newDetails = { ...prev.symptomDetails };

      if (exists) {
        newSelected = prev.selectedSymptoms.filter(s => s !== id);
        delete newDetails[id];
      } else {
        newSelected = [...prev.selectedSymptoms, id];
        // Initialize default detail
        newDetails[id] = { severity: 5, duration: DURATION_OPTIONS[0] };
      }
      return { ...prev, selectedSymptoms: newSelected, symptomDetails: newDetails };
    });
  };

  const updateSymptomDetail = (id: string, field: 'severity' | 'duration', value: any) => {
    setState(prev => ({
      ...prev,
      symptomDetails: {
        ...prev.symptomDetails,
        [id]: { ...prev.symptomDetails[id], [field]: value }
      }
    }));
  };

  const updateContext = (field: keyof UserContext, value: string) => {
    setState(prev => ({
      ...prev,
      context: { ...prev.context, [field]: value }
    }));
  };

  const updateInfo = (field: keyof UserInfo, value: any) => {
    setState(prev => ({
      ...prev,
      userInfo: { ...prev.userInfo, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    trackEvent('submit_assessment', 'funnel');
    updateState({ isLoading: true, error: null });
    
    try {
      const result = await generateAssessment(state);
      updateState({ result, step: Step.RESULTS, isLoading: false });
      trackEvent('assessment_success', 'api');
    } catch (err: any) {
      updateState({ 
        isLoading: false, 
        error: "We encountered an issue analyzing your data. Please try again." 
      });
      console.error(err);
    }
  };

  const handleRestart = () => {
    trackEvent('restart', 'funnel');
    setState(INITIAL_STATE);
  };

  // Render Step Logic
  const renderStep = () => {
    switch (state.step) {
      case Step.WELCOME:
        return <WelcomeStep onStart={handleStart} />;
      case Step.SYMPTOM_SELECTION:
        return (
          <SymptomSelectionStep 
            selected={state.selectedSymptoms} 
            toggleSymptom={toggleSymptom}
            onNext={() => updateState({ step: Step.SYMPTOM_DETAILS })}
          />
        );
      case Step.SYMPTOM_DETAILS:
        return (
          <SymptomDetailsStep 
            selectedSymptoms={state.selectedSymptoms}
            details={state.symptomDetails}
            updateDetail={updateSymptomDetail}
            onNext={() => updateState({ step: Step.CONTEXT })}
            onBack={() => updateState({ step: Step.SYMPTOM_SELECTION })}
          />
        );
      case Step.CONTEXT:
        return (
          <ContextStep 
            context={state.context}
            updateContext={updateContext}
            onNext={() => updateState({ step: Step.EMAIL })}
            onBack={() => updateState({ step: Step.SYMPTOM_DETAILS })}
          />
        );
      case Step.EMAIL:
        return (
          <EmailStep 
            info={state.userInfo}
            updateInfo={updateInfo}
            onSubmit={handleSubmit}
            onBack={() => updateState({ step: Step.CONTEXT })}
            isLoading={state.isLoading}
          />
        );
      case Step.RESULTS:
        return <ResultsStep result={state.result} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      {state.step !== Step.WELCOME && state.step !== Step.RESULTS && (
        <Header currentStep={state.step} totalSteps={5} />
      )}
      
      <div className="flex-1 flex flex-col relative" ref={containerRef}>
        {state.error && (
            <div className="bg-red-50 text-red-600 p-4 m-4 rounded-xl text-sm border border-red-100">
                {state.error}
            </div>
        )}
        {renderStep()}
      </div>
    </Layout>
  );
}