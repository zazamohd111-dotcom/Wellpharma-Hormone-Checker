import React from 'react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, totalSteps }) => {
  const progress = Math.min(((currentStep) / (totalSteps - 1)) * 100, 100);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 border-b border-warm-100 sticky top-0 z-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
           {/* Warm Lotus Icon */}
           <div className="bg-primary-50 p-2 rounded-xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
             </svg>
           </div>
           <div>
             <h1 className="font-serif font-bold text-slate-800 text-xl leading-tight tracking-tight">WellPharma</h1>
             <p className="text-xs text-primary-600 font-medium tracking-wide uppercase">Hormone Health</p>
           </div>
        </div>
        {currentStep > 0 && currentStep < 5 && (
            <div className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Step {currentStep} / 4
            </div>
        )}
      </div>
      
      {currentStep > 0 && currentStep < 5 && (
        <div className="w-full bg-warm-100 h-1.5 rounded-full overflow-hidden">
            <div 
                className="bg-gradient-to-r from-primary-400 to-primary-500 h-full transition-all duration-700 ease-in-out rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      )}
    </div>
  );
};