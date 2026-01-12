
import React from 'react';
import { SectionTitle, Card, Badge, BackButton } from '../components/UI';
import { Role } from '../types';

interface PresidencyProps {
  userRole: Role;
  onBack: () => void;
  onNavigateToAnnualChecklist: () => void;
}

const Presidency: React.FC<PresidencyProps> = ({ userRole, onBack, onNavigateToAnnualChecklist }) => {
  const isHighAdmin = [Role.PRESIDENTE, Role.VICE_PRESIDENTE].includes(userRole);

  const strategicDecisions = [
    { id: 1, title: 'EXPULSÃO DISCIPLINAR #04', status: 'EXECUTADO', date: '2026-01-05' },
    { id: 2, title: 'REFORMA ESTRUTURAL SEDE', status: 'EM ANÁLISE', date: '2026-01-10' },
    { id: 3, title: 'CONVOCAÇÃO EXTRAORDINÁRIA', status: 'AGENDADO', date: '2026-02-15' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      <BackButton onClick={onBack} />
      <SectionTitle title="GABINETE DA PRESIDÊNCIA" subtitle="Alta Governança e Decisões" />

      {!isHighAdmin && (
        <div className="bg-mc-red border-4 border-white p-5 md:p-8 shadow-brutal-white text-center">
          <p className="font-display text-3xl md:text-5xl text-white uppercase tracking-widest leading-none">ACESSO RESTRITO</p>
          <p className="font-mono text-[9px] md:text-xs text-black font-black mt-2 uppercase tracking-widest">APENAS ALTA DIRETORIA TEM PERMISSÃO DE COMANDO NESTA ÁREA</p>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ${!isHighAdmin ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
        <div className="space-y-6 md:space-y-8">
          <h3 className="text-mc-red font-display text-3xl md:text-4xl uppercase tracking-widest bg-white/5 p-2 border-l-8 border-mc-red">ORDENS EXECUTIVAS</h3>
          <div className="space-y-3 md:space-y-4">
            {strategicDecisions.map(dec => (
              <div key={dec.id} className="bg-mc-gray border-2 border-white p-4 flex justify-between items-center shadow-brutal-small hover:bg-white group transition-all">
                <div className="flex flex-col overflow-hidden mr-2">
                  <span className="text-mc-red font-mono text-[8px] md:text-[10px] font-black uppercase tracking-widest">{dec.date}</span>
                  <span className="text-white group-hover:text-black font-display text-xl md:text-2xl tracking-widest uppercase truncate">{dec.title}</span>
                </div>
                <Badge color={dec.status === 'EXECUTADO' ? 'green' : 'red'}>{dec.status}</Badge>
              </div>
            ))}
          </div>
          <button className="w-full py-4 border-4 border-mc-red bg-mc-black text-mc-red font-display text-3xl hover:bg-mc-red hover:text-white transition-all uppercase shadow-brutal-white active:shadow-none active:translate-x-1 active:translate-y-1">
            + NOVA DIRETRIZ
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          <h3 className="text-mc-red font-display text-3xl md:text-4xl uppercase tracking-widest bg-white/5 p-2 border-l-8 border-mc-red">SITUAÇÃO DO CLUBE</h3>
          <Card className="bg-white" shadowColor="red">
            <div className="space-y-5">
              <div className="border-b-2 border-black/10 pb-3">
                <span className="text-gray-400 font-mono text-[8px] md:text-[10px] font-black uppercase block tracking-widest">DISCIPLINA INTERNA</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-5 bg-mc-black border-2 border-black">
                    <div className="w-[95%] h-full bg-mc-yellow"></div>
                  </div>
                  <span className="font-display text-2xl md:text-3xl text-black leading-none">95%</span>
                </div>
              </div>
              <div className="border-b-2 border-black/10 pb-3">
                <span className="text-gray-400 font-mono text-[8px] md:text-[10px] font-black uppercase block tracking-widest">FREQUÊNCIA REUNIÕES</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-5 bg-mc-black border-2 border-black">
                    <div className="w-[82%] h-full bg-mc-red"></div>
                  </div>
                  <span className="font-display text-2xl md:text-3xl text-black leading-none">82%</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400 font-mono text-[8px] md:text-[10px] font-black uppercase block tracking-widest">SAÚDE FINANCEIRA</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-5 bg-mc-black border-2 border-black">
                    <div className="w-[88%] h-full bg-mc-yellow"></div>
                  </div>
                  <span className="font-display text-2xl md:text-3xl text-black leading-none">88%</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-black border-2 border-white p-4 md:p-6 shadow-brutal-small">
            <h4 className="text-mc-red font-display text-2xl md:text-3xl uppercase tracking-widest mb-3 border-b border-mc-red/30 pb-1">COMANDO</h4>
            <p className="text-white font-mono text-[10px] md:text-[11px] font-black italic uppercase leading-tight tracking-wide">
              "A HIERARQUIA NÃO É UM PRIVILÉGIO, É UMA RESPONSABILIDADE. A DISCIPLINA É O QUE NOS MANTÉM UNIDOS NA ESTRADA E NA VIDA."
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-20">
        <h3 className="text-mc-red font-display text-3xl md:text-4xl uppercase tracking-widest bg-white/5 p-2 border-l-8 border-mc-red mb-6">MÓDULOS OPERACIONAIS</h3>
        <button 
          onClick={onNavigateToAnnualChecklist}
          className="w-full md:w-auto px-10 py-6 border-4 border-mc-green bg-mc-black text-mc-green font-display text-3xl md:text-5xl hover:bg-mc-green hover:text-black transition-all uppercase shadow-brutal-green active:shadow-none active:translate-x-1 active:translate-y-1 leading-none"
        >
          ACESSAR FREQUÊNCIA ANUAL
        </button>
      </div>

      <div className="bg-mc-yellow p-4 md:p-5 border-4 border-black shadow-brutal-red mt-12">
        <p className="text-black font-mono text-[9px] md:text-xs font-black uppercase leading-tight text-center tracking-widest">
          TODA DECISÃO DESTA ÁREA É FINAL E INCONTESTÁVEL. O REGISTRO É PERMANENTE NO SISTEMA.
        </p>
      </div>
    </div>
  );
};

export default Presidency;
