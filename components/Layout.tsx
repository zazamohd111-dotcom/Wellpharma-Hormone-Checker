import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 p-4 md:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col">
        {children}
      </div>
      <footer className="mt-8 text-slate-400 text-sm text-center">
        © {new Date().getFullYear()} WellPharma Pharmacy. Dr. Zahraa Babiker.
      </footer>
    </div>
  );
};
