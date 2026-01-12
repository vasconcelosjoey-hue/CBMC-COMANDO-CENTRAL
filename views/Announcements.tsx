
import React from 'react';
import { Card, SectionTitle, BackButton } from '../components/UI';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import { Role } from '../types';

interface AnnouncementsProps {
  userRole: Role;
  onBack: () => void;
}

const Announcements: React.FC<AnnouncementsProps> = ({ userRole, onBack }) => {
  const canPublish = [
    Role.PRESIDENTE, 
    Role.VICE_PRESIDENTE, 
    Role.SECRETARIO, 
    Role.TESOUREIRO, 
    Role.PREFEITO,
    Role.SARGENTO_ARMAS
  ].includes(userRole);

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex justify-between items-start">
        <SectionTitle title="INFORMES OFICIAIS" subtitle="Comunicação Institucional" />
        {canPublish && (
          <button className="bg-mc-red border-2 border-white text-white p-3 shadow-brutal-white hover:scale-110 active:scale-90 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-mc-red/30">
        {MOCK_ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className="relative pl-8">
            <div className="absolute left-0 top-1.5 w-6 h-6 bg-mc-black border-2 border-mc-red flex items-center justify-center">
              <div className="w-2 h-2 bg-mc-red animate-pulse"></div>
            </div>
            
            <Card>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 border-b border-white/10 pb-2 gap-2">
                <div className="flex flex-col">
                  <h4 className="text-white font-display text-4xl leading-none">{ann.title}</h4>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-mc-red text-[9px] font-black tracking-widest uppercase font-mono">{ann.author}</span>
                    <span className="text-gray-700 text-[10px]">•</span>
                    <span className="text-mc-red text-[9px] font-black tracking-widest uppercase font-mono">{ann.authorRole}</span>
                  </div>
                </div>
                <span className="text-gray-600 text-[10px] font-mono font-bold whitespace-nowrap uppercase">DATA {ann.date}</span>
              </div>
              <p className="text-gray-300 font-mono text-[11px] md:text-xs leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
            </Card>
          </div>
        ))}
      </div>
      
      <p className="text-center text-gray-800 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-8">FIM DA TRANSMISSÃO</p>
    </div>
  );
};

export default Announcements;
