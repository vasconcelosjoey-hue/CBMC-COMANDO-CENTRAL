
import React from 'react';
import { Card, SectionTitle, BackButton } from '../components/UI';

interface ArchiveProps {
  onBack: () => void;
}

const Archive: React.FC<ArchiveProps> = ({ onBack }) => {
  const years = [2024, 2023, 2022, 2021];

  return (
    <div className="space-y-8">
      <BackButton onClick={onBack} />
      <SectionTitle title="ACERVO MEMORIA" subtitle="Arquivos Institucionais" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {years.map(year => (
          <div key={year} className="bg-mc-gray border-4 border-white p-4 aspect-square flex flex-col items-center justify-center relative overflow-hidden group hover:bg-mc-red transition-all cursor-pointer shadow-brutal-red">
             <div className="absolute top-2 right-2 text-white font-mono font-black text-[10px] opacity-30">ANO {year}</div>
             <span className="text-6xl font-display font-black text-white group-hover:scale-110 transition-transform leading-none">{year}</span>
             <div className="mt-4 bg-white text-black font-black text-[10px] px-2 py-0.5 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity">
               ABRIR PASTA
             </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-4">
        <h3 className="text-xs font-black text-mc-red uppercase tracking-[0.4em] px-1">&gt; FEED DE ARQUIVOS</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="aspect-square bg-white border-2 border-black overflow-hidden group relative">
              <img 
                src={`https://picsum.photos/seed/moto_arch_${i}/200/200`} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
              />
              <div className="absolute inset-0 bg-mc-red/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black text-[10px] uppercase cursor-pointer">
                [ VER ]
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archive;
