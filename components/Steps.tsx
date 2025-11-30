import React from 'react';
import { 
  SYMPTOMS_LIST, 
  DURATION_OPTIONS, 
  AGE_RANGES, 
  PERIOD_STATUS_OPTIONS, 
  TEST_HISTORY_OPTIONS, 
  THERAPY_OPTIONS 
} from '../constants';
import { UserContext, UserInfo } from '../types';

// --- Components ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  className, 
  variant = 'primary', 
  ...props 
}) => {
  const base = "w-full py-4 px-6 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide";
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white shadow-md",
    outline: "border-2 border-primary-200 hover:border-primary-500 text-primary-600 hover:bg-primary-50"
  };
  return <button className={`${base} ${variants[variant]} ${className || ''}`} {...props} />;
};

// --- Logo Component ---
const WellPharmaLogo: React.FC = () => (
  <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor:'#0F4C66', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#0F4C66', stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Text Curve Path */}
    <path id="curve" d="M 30 60 Q 100 10 170 60" fill="transparent" />
    
    {/* Text: WellPharma */}
    <text width="200" className="fill-[#0F4C66] font-bold font-sans text-xl tracking-widest" textAnchor="middle">
      <textPath xlinkHref="#curve" startOffset="50%">
        WELLPHARMA
      </textPath>
    </text>
    
    {/* Shield Icon */}
    <g transform="translate(75, 45)">
      {/* Shield Outline */}
      <path d="M 5 5 Q 25 0 45 5 V 25 Q 25 55 5 25 Z" fill="none" stroke="#0F4C66" strokeWidth="3" />
      {/* Pill Body */}
      <rect x="18" y="10" width="14" height="26" rx="7" fill="#E57A60" />
      <path d="M 18 10 H 32 V 23 H 18 Z" fill="#0F4C66" style={{opacity: 0.9}} />
      
      {/* Leaf Detail */}
      <path d="M 32 30 Q 40 20 40 35 Q 35 40 28 36" fill="#14b8a6" stroke="white" strokeWidth="1"/>
    </g>

    {/* Text: Pharmacy (Bottom Curve) */}
     <path id="curveBottom" d="M 40 85 Q 100 115 160 85" fill="transparent" />
     <text width="200" className="fill-[#0F4C66] font-bold font-sans text-sm tracking-widest" textAnchor="middle">
      <textPath xlinkHref="#curveBottom" startOffset="50%">
        PHARMACY
      </textPath>
    </text>
  </svg>
);


// --- Step 1: Welcome ---
export const WelcomeStep: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="flex flex-col h-full justify-center items-center text-center p-8 space-y-8 animate-fade-in">
    <div className="mb-4">
        <WellPharmaLogo />
    </div>
    <div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-3">Let's get you feeling like yourself again.</h2>
        <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
        Symptoms like fatigue, mood swings, or weight gain aren't just "part of aging." They are messages from your body. 
        </p>
    </div>
    
    <div className="bg-white border border-primary-100 p-5 rounded-2xl shadow-sm text-sm text-slate-600 text-left w-full max-w-md mx-auto">
        <p className="font-semibold text-primary-600 mb-1">Our Promise:</p>
        This free assessment uses clinical logic to help you understand your hormones. We focus on <span className="font-semibold">natural remedies first</span>.
    </div>

    <div className="w-full max-w-xs pt-2">
      <Button onClick={onStart}>Start My Assessment</Button>
    </div>
  </div>
);

// --- Step 2: Symptom Selection ---
export const SymptomSelectionStep: React.FC<{ 
  selected: string[]; 
  toggleSymptom: (id: string) => void; 
  onNext: () => void; 
}> = ({ selected, toggleSymptom, onNext }) => (
  <div className="flex flex-col h-full p-6 md:p-8">
    <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-2">What's been bothering you?</h2>
        <p className="text-slate-500">Select all that apply. There are no wrong answers here.</p>
    </div>
    
    <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-8 custom-scrollbar">
      {SYMPTOMS_LIST.map((symptom) => {
        const isSelected = selected.includes(symptom.id);
        return (
          <div 
            key={symptom.id}
            onClick={() => toggleSymptom(symptom.id)}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${
              isSelected 
                ? 'border-primary-400 bg-primary-50 text-primary-900 shadow-sm' 
                : 'border-slate-100 hover:border-primary-200 bg-white hover:shadow-sm'
            }`}
          >
            <span className="font-medium">{symptom.label}</span>
            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-200 group-hover:border-primary-300'}`}>
                {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
          </div>
        );
      })}
    </div>
    
    <Button onClick={onNext} disabled={selected.length === 0}>
      Continue
    </Button>
  </div>
);

// --- Step 3: Symptom Details ---
export const SymptomDetailsStep: React.FC<{
  selectedSymptoms: string[];
  details: Record<string, { severity: number; duration: string }>;
  updateDetail: (id: string, field: 'severity' | 'duration', value: any) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ selectedSymptoms, details, updateDetail, onNext, onBack }) => (
  <div className="flex flex-col h-full p-6 md:p-8">
    <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-2">Let's go a little deeper.</h2>
        <p className="text-slate-500">Understanding the intensity helps us tailor the natural remedies.</p>
    </div>
    
    <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-8 custom-scrollbar">
      {selectedSymptoms.map(id => {
        const symptom = SYMPTOMS_LIST.find(s => s.id === id);
        const detail = details[id] || { severity: 5, duration: DURATION_OPTIONS[0] };
        
        return (
          <div key={id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-primary-700 mb-4 border-b border-slate-50 pb-2">{symptom?.label}</h3>
            
            {/* Severity Slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-3 text-sm font-medium text-slate-600">
                <span>Intensity</span>
                <span className="text-primary-600 font-bold">{detail.severity}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={detail.severity}
                onChange={(e) => updateDetail(id, 'severity', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Duration Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">How long has this been happening?</label>
              <div className="relative">
                <select 
                    value={detail.duration}
                    onChange={(e) => updateDetail(id, 'duration', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 appearance-none text-slate-700"
                >
                    {DURATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    
    <div className="flex gap-4 pt-4">
      <Button variant="outline" onClick={onBack} className="w-1/3">Back</Button>
      <Button onClick={onNext} className="w-2/3">Next</Button>
    </div>
  </div>
);

// --- Step 4: Context ---
export const ContextStep: React.FC<{
  context: UserContext;
  updateContext: (field: keyof UserContext, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ context, updateContext, onNext, onBack }) => {
  const isComplete = context.age && context.periodStatus && context.hormoneTestHistory && context.currentTherapy;

  return (
    <div className="flex flex-col h-full p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-2">A bit of context.</h2>
        <p className="text-slate-500">This helps us check if it's menopause, thyroid, or stress related.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 mb-8 custom-scrollbar">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
            <label className="block font-medium mb-2 text-slate-700">What is your age range?</label>
            <select 
                value={context.age}
                onChange={(e) => updateContext('age', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-200"
            >
                <option value="">Select Age</option>
                {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            </div>

            <div>
            <label className="block font-medium mb-2 text-slate-700">Period Status</label>
            <select 
                value={context.periodStatus}
                onChange={(e) => updateContext('periodStatus', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-200"
            >
                <option value="">Select Status</option>
                {PERIOD_STATUS_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
            <label className="block font-medium mb-3 text-slate-700">Have you tested hormones before?</label>
            <div className="space-y-2">
                {TEST_HISTORY_OPTIONS.map(opt => (
                <div 
                    key={opt}
                    onClick={() => updateContext('hormoneTestHistory', opt)}
                    className={`p-3 border rounded-xl cursor-pointer transition-colors ${context.hormoneTestHistory === opt ? 'bg-primary-50 border-primary-400 text-primary-800' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                    {opt}
                </div>
                ))}
            </div>
            </div>

            <div>
            <label className="block font-medium mb-3 text-slate-700">Current Hormone Therapy?</label>
            <div className="space-y-2">
                {THERAPY_OPTIONS.map(opt => (
                <div 
                    key={opt}
                    onClick={() => updateContext('currentTherapy', opt)}
                    className={`p-3 border rounded-xl cursor-pointer transition-colors ${context.currentTherapy === opt ? 'bg-primary-50 border-primary-400 text-primary-800' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                    {opt}
                </div>
                ))}
            </div>
            </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="w-1/3">Back</Button>
        <Button onClick={onNext} disabled={!isComplete} className="w-2/3">Next</Button>
      </div>
    </div>
  );
};

// --- Step 5: Email ---
export const EmailStep: React.FC<{
  info: UserInfo;
  updateInfo: (field: keyof UserInfo, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}> = ({ info, updateInfo, onSubmit, onBack, isLoading }) => {
  const isValid = info.name.length > 0 && info.email.includes('@');

  return (
    <div className="flex flex-col h-full p-6 md:p-8 justify-center">
      <div className="text-center mb-8">
        <div className="bg-secondary-50 inline-block p-4 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">You're all set!</h2>
        <p className="text-slate-600">We've compiled your holistic wellness plan.</p>
      </div>
      
      <div className="w-full max-w-md mx-auto space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <label className="block font-medium mb-2 text-slate-700">First Name</label>
          <input 
            type="text" 
            value={info.name}
            onChange={(e) => updateInfo('name', e.target.value)}
            placeholder="Jane"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">Email Address</label>
          <input 
            type="email" 
            value={info.email}
            onChange={(e) => updateInfo('email', e.target.value)}
            placeholder="jane@example.com"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mt-8 w-full max-w-md mx-auto">
        <Button variant="outline" onClick={onBack} className="w-1/3">Back</Button>
        <Button onClick={onSubmit} disabled={!isValid || isLoading} className="w-2/3 shadow-primary-200">
          {isLoading ? 'Generating Plan...' : 'See My Results'}
        </Button>
      </div>
    </div>
  );
};