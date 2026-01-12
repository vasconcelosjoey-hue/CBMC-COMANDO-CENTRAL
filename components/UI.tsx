
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; shadowColor?: 'red' | 'white' }> = ({ 
  children, 
  className = "", 
  shadowColor = 'red' 
}) => {
  const shadowClass = shadowColor === 'red' ? 'shadow-brutal-red' : 'shadow-brutal-white';
  return (
    <div className={`bg-mc-gray border-2 border-white rounded-none ${shadowClass} p-3 md:p-6 ${className}`}>
      {children}
    </div>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-10 relative flex flex-col items-center text-center px-2">
    <div className="bg-mc-red inline-block px-4 md:px-8 py-2 md:py-3 mb-2 border-4 border-white shadow-brutal-white">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-display text-black leading-none uppercase tracking-[0.15em]">{title}</h1>
    </div>
    {subtitle && (
      <div className="bg-white px-3 py-1 border-2 border-black">
        <p className="text-black text-[8px] md:text-[12px] font-mono font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{subtitle}</p>
      </div>
    )}
  </div>
);

export const Badge: React.FC<{ color: 'red' | 'green' | 'blue' | 'yellow' | 'gray'; children: React.ReactNode }> = ({ color, children }) => {
  const styles = {
    red: 'bg-mc-red text-white border-white',
    green: 'bg-mc-green text-black border-black font-black',
    blue: 'bg-blue-600 text-white border-white',
    yellow: 'bg-mc-yellow text-black border-black font-black',
    gray: 'bg-gray-800 text-gray-400 border-gray-600'
  };

  return (
    <span className={`px-2 py-0.5 rounded-none text-[8px] md:text-[11px] font-mono uppercase tracking-tighter border-2 ${styles[color]}`}>
      {children}
    </span>
  );
};

export const BackButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = "VOLTAR AO QG" }) => (
  <button 
    onClick={onClick}
    className="inline-flex items-center gap-2 bg-mc-black text-mc-red border-2 border-mc-red px-3 py-1.5 md:px-5 md:py-2.5 font-mono font-black text-[9px] md:text-[11px] uppercase shadow-brutal-small hover:bg-mc-red hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none mb-4 md:mb-8"
  >
    <span className="text-base md:text-xl leading-none">←</span> {label}
  </button>
);
