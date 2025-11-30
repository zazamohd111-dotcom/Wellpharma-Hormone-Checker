import React from 'react';

// Simple Markdown Parser with Highlight Logic
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  // Split by "##" to find main sections
  const sections = content.split(/## /);

  return (
    <div className="space-y-8">
      {sections.map((section, idx) => {
        const cleanSection = section.trim();
        if (!cleanSection) return null;

        const lines = cleanSection.split('\n');
        // Clean any remaining markdown symbols from title (like # or **)
        // Aggressively remove leading hash signs and asterisks
        const rawTitle = lines[0].replace(/^#+\s*/g, '').replace(/\*\*/g, '').trim();
        const body = lines.slice(1);
        const titleLower = rawTitle.toLowerCase();

        // Logic to determine Section Type
        const isIntro = idx === 0 && !content.startsWith('##');
        const isProduct = titleLower.includes('testing') || titleLower.includes('support') || titleLower.includes('supplement');
        const isNatural = titleLower.includes('lifestyle') || titleLower.includes('natural');

        // -- STYLE: Intro Section --
        if (isIntro) {
            return (
                <div key={idx} className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-6">
                     <div className="text-lg text-slate-700 leading-relaxed">
                        {cleanSection.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                     </div>
                </div>
            );
        }

        // -- STYLE: Product/Sales Section (The "Highlighted Box") --
        if (isProduct) {
            return (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border-2 border-primary-100 overflow-hidden transform transition-all hover:scale-[1.01]">
                    <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
                        <h3 className="text-xl font-serif font-bold text-primary-700 flex items-center gap-2">
                            {rawTitle}
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="text-slate-600 leading-relaxed space-y-3">
                            {body.map((line, i) => {
                                const trimmed = line.trim();
                                if (!trimmed) return null;
                                const boldParsed = trimmed.split('**').map((part, bIdx) => 
                                    bIdx % 2 === 1 ? <strong key={bIdx} className="font-bold text-slate-800">{part}</strong> : part
                                );
                                
                                if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                                    return (
                                        <div key={i} className="flex gap-3 ml-1 p-2">
                                            <span className="text-primary-500 font-bold mt-1">✓</span>
                                            <span>{boldParsed.slice(1)}</span> 
                                        </div>
                                    );
                                }
                                return <p key={i}>{boldParsed}</p>;
                            })}
                        </div>
                        <div className="mt-4 text-center">
                             <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Pharmacy Recommendation
                             </span>
                        </div>
                    </div>
                </div>
            );
        }

        // -- STYLE: Natural/Standard Section --
        return (
          <div key={idx} className={`${isNatural ? 'bg-secondary-50 border border-secondary-100' : 'bg-white'} rounded-2xl p-6`}>
             <h3 className={`text-xl font-serif font-bold mb-4 flex items-center gap-2 ${isNatural ? 'text-secondary-700' : 'text-slate-800'}`}>
                {rawTitle}
              </h3>
            <div className="text-slate-600 leading-relaxed space-y-3">
              {body.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                
                const boldParsed = trimmed.split('**').map((part, bIdx) => 
                  bIdx % 2 === 1 ? <strong key={bIdx} className="font-bold text-slate-800">{part}</strong> : part
                );

                if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                  return (
                    <div key={i} className="flex gap-3 ml-1">
                      <span className={`${isNatural ? 'text-secondary-500' : 'text-primary-400'} font-bold mt-0.5 text-lg`}>•</span>
                      <span>{boldParsed.slice(1)}</span> 
                    </div>
                  );
                }
                return <p key={i}>{boldParsed}</p>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ResultsStep: React.FC<{ result: string | null; onRestart: () => void }> = ({ result, onRestart }) => {
  if (!result) return <div>No results found.</div>;

  const handleShare = async () => {
    // 1. Clean the text for sharing (remove markdown symbols)
    const cleanText = result
      .replace(/#{1,6}\s?/g, '') // Remove headers
      .replace(/\*\*/g, '')      // Remove bold
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim();

    const shareData = {
      title: 'My WellPharma Hormone Plan',
      text: `Here is my personalized hormone health plan from WellPharma:\n\n${cleanText}\n\n`,
    };

    // 2. Try Native Share (Mobile), Fallback to Email (Desktop)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text)}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-xl mb-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h2 className="text-3xl font-serif font-bold mb-2 relative z-10">Your Holistic Plan</h2>
        <p className="opacity-90 text-primary-50 font-medium relative z-10">Designed personally for you by AI & Dr. Zahraa</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6 custom-scrollbar">
        <SimpleMarkdown content={result} />

        {/* Static CTA Card */}
        <div className="mt-10 bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center shadow-sm mb-8">
          <h4 className="font-serif font-bold text-slate-800 text-xl mb-3">Want a human expert to look at this?</h4>
          <p className="text-slate-600 mb-6">
            You don't have to figure this out alone. Book a quick chat with Dr. Zahraa.
          </p>
          
          <div className="flex flex-col gap-4 items-center justify-center">
            <a 
                href="https://cal.com/wellpharma-pharmacy-esydym/hormone-consult" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto py-4 px-8 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
            >
                Book 1:1 Consultation
            </a>

            <button 
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto py-3 px-8 border-2 border-primary-200 text-primary-700 hover:bg-primary-50 font-bold rounded-full transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Results
            </button>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <button 
                onClick={onRestart}
                className="text-sm text-slate-400 hover:text-primary-500 transition-colors underline"
            >
                Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};