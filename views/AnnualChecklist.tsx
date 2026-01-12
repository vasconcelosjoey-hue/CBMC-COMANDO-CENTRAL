
import React, { useState, useMemo, useEffect } from 'react';
import { SectionTitle, Card, Badge, BackButton } from '../components/UI.tsx';
import { Member, Role } from '../types.ts';
import { db } from '../firebase.ts';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface AnnualChecklistProps {
  members: Member[];
  userRole: Role;
  onBack: () => void;
}

type AttendanceState = Record<string, Record<string, boolean>>;

const AnnualChecklist: React.FC<AnnualChecklistProps> = ({ members, userRole, onBack }) => {
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  const eventNames = [
    'REUNIÃO DE ATA',
    'VISITA AO CUMPADRE',
    'GIRO NOTURNO',
    'CAFÉ NA ESTRADA'
  ];

  const months = useMemo(() => [
    { name: 'JANEIRO', events: eventNames },
    { name: 'FEVEREIRO', events: eventNames },
    { name: 'MARÇO', events: eventNames },
    { name: 'ABRIL', events: eventNames },
    { name: 'MAIO', events: eventNames },
    { name: 'JUNHO', events: eventNames },
    { name: 'JULHO', events: eventNames },
    { name: 'AGOSTO', events: eventNames },
    { name: 'SETEMBRO', events: eventNames },
    { name: 'OUTUBRO', events: eventNames },
    { name: 'NOVEMBRO', events: eventNames },
    { name: 'DEZEMBRO', events: eventNames },
  ], []);

  const totalEventsPossible = 12 * 4;
  
  const isAdmin = [
    Role.PRESIDENTE, 
    Role.VICE_PRESIDENTE, 
    Role.SECRETARIO, 
    Role.SARGENTO_ARMAS, 
    Role.TESOUREIRO
  ].includes(userRole);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "attendance", "annual_2026"), 
      (docSnap) => {
        if (docSnap.exists()) {
          setAttendance(docSnap.data() as AttendanceState);
        }
        setLoading(false);
        setDbError(false);
      },
      (error) => {
        console.error("Firebase Attendance Error:", error);
        setDbError(true);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const toggleAttendance = async (memberId: string, monthIndex: number, eventIndex: number) => {
    if (!isAdmin) {
      alert("ACESSO NEGADO: Apenas membros do Comando podem alterar registros oficiais.");
      return;
    }
    
    const key = `${monthIndex}-${eventIndex}`;
    const newAttendance = { ...attendance };
    if (!newAttendance[memberId]) newAttendance[memberId] = {};
    
    newAttendance[memberId][key] = !newAttendance[memberId][key];

    try {
      await setDoc(doc(db, "attendance", "annual_2026"), newAttendance);
      setDbError(false);
    } catch (e) {
      console.error("Erro ao salvar no Firebase:", e);
      setDbError(true);
    }
  };

  const getStats = (memberId: string) => {
    const memberAttendance = attendance[memberId] || {};
    const presentCount = Object.values(memberAttendance).filter(val => val).length;
    const percentage = (presentCount / totalEventsPossible) * 100;
    return { presentCount, percentage };
  };

  const renderTable = (startMonth: number, endMonth: number) => (
    <div className="overflow-x-auto border-4 border-white shadow-brutal-red bg-white mb-8 md:mb-12 custom-scrollbar">
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr className="bg-mc-red text-white">
            <th className="border-2 border-black p-2 w-28 md:w-36 sticky left-0 bg-mc-red z-30 font-sans font-bold text-xs md:text-base uppercase tracking-widest whitespace-nowrap">
              EFETIVO
            </th>
            {months.slice(startMonth, endMonth).map((m, idx) => (
              <th key={idx} colSpan={4} className="border-2 border-black p-1.5 md:p-2 text-center font-sans font-semibold text-xs md:text-base tracking-widest">
                {m.name}
              </th>
            ))}
          </tr>
          <tr className="bg-mc-yellow text-black font-mono font-bold uppercase tracking-tighter">
            <th className="border-2 border-black p-1 sticky left-0 bg-mc-yellow z-30">---</th>
            {months.slice(startMonth, endMonth).map((m) => 
              m.events.map((e, eIdx) => (
                <th key={eIdx} className="border-2 border-black p-0 w-10 md:w-16 h-36 leading-tight overflow-hidden">
                  <div className="rotate-180 [writing-mode:vertical-lr] mx-auto text-[9px] md:text-[11px] font-black h-32 flex items-center justify-center text-center whitespace-nowrap">
                    {e}
                  </div>
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-mc-red/5 transition-colors border-b-2 border-black/10">
              <td className="border-2 border-black p-2 sticky left-0 bg-white font-mono font-black text-black uppercase z-30 whitespace-nowrap text-[9px] md:text-xs">
                {member.name}
              </td>
              {months.slice(startMonth, endMonth).map((_, mIdx) => {
                const absoluteMonthIdx = startMonth + mIdx;
                return Array.from({ length: 4 }).map((__, eIdx) => {
                  const isPresent = attendance[member.id]?.[`${absoluteMonthIdx}-${eIdx}`];
                  return (
                    <td 
                      key={`${absoluteMonthIdx}-${eIdx}`}
                      onClick={() => toggleAttendance(member.id, absoluteMonthIdx, eIdx)}
                      className={`border-2 border-black cursor-pointer text-center transition-all h-10 w-10 md:h-12 md:w-12 relative group ${
                        isPresent ? 'bg-mc-green' : 'bg-gray-50 hover:bg-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-center h-full w-full">
                        {isPresent ? (
                          <span className="font-mono font-black text-lg md:text-2xl text-black animate-in fade-in zoom-in duration-200">✓</span>
                        ) : (
                          <div className="w-4 h-4 border border-black/10 rounded-none bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        )}
                      </div>
                    </td>
                  );
                });
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const dashboardData = useMemo(() => {
    return members.map(m => ({
      ...m,
      stats: getStats(m.id)
    })).sort((a, b) => b.stats.percentage - a.stats.percentage);
  }, [attendance, members]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-16 h-16 border-4 border-mc-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="font-mono text-mc-red font-black tracking-widest uppercase text-xs">Sincronizando Banco Nuvem...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {dbError && (
        <div className="bg-mc-yellow border-4 border-black p-4 text-center animate-pulse shadow-brutal-red mb-4">
          <span className="font-mono text-[11px] font-black uppercase tracking-widest block mb-2">⚠️ ERRO DE PERMISSÃO FIREBASE</span>
          <span className="font-mono text-[9px] uppercase block leading-tight">Vá no Console do Firebase > Firestore > Rules e libere o acesso (allow read, write: if true).</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <BackButton onClick={onBack} />
        <div className={`border-2 px-3 py-1 flex items-center gap-2 ${dbError ? 'bg-mc-red border-white' : 'bg-mc-black border-mc-green'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${dbError ? 'bg-white' : 'bg-mc-green'}`}></div>
          <span className={`font-mono text-[9px] font-black uppercase tracking-widest ${dbError ? 'text-white' : 'text-mc-green'}`}>
            {dbError ? 'OFFLINE' : 'CONECTADO'}
          </span>
        </div>
      </div>
      
      <SectionTitle title="CHECKLIST VENTO ANUAL - 2026" subtitle="Controle de Frequência" />

      <div className="bg-mc-green/10 border-4 border-mc-green p-3 md:p-4 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 shadow-brutal-green">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-mc-green border-2 border-black flex items-center justify-center font-black text-black shrink-0 text-lg md:text-xl">!</div>
        <p className="font-mono text-[9px] md:text-xs text-mc-green font-black uppercase tracking-widest leading-tight">
          SISTEMA DE PRESENÇA OPERACIONAL EM NUVEM. ACESSÍVEL DE QUALQUER DISPOSITIVO.
        </p>
      </div>

      <div>
        <h3 className="text-mc-red font-display text-xl md:text-4xl uppercase mb-3 md:mb-5 tracking-tight bg-mc-red/10 p-2 border-l-8 border-mc-red font-normal">SEMESTRE 01: JAN - JUN</h3>
        {renderTable(0, 6)}
      </div>

      <div>
        <h3 className="text-mc-red font-display text-xl md:text-4xl uppercase mb-3 md:mb-5 tracking-tight bg-mc-red/10 p-2 border-l-8 border-mc-red font-normal">SEMESTRE 02: JUL - DEZ</h3>
        {renderTable(6, 12)}
      </div>

      <div className="space-y-10 mt-16 md:mt-24">
        <SectionTitle title="DASHBOARD DE COMPARECIMENTO" subtitle="Engajamento Consolidado" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Card className="bg-black" shadowColor="white">
            <h4 className="text-mc-yellow font-display text-2xl md:text-3xl uppercase tracking-widest mb-6 border-b-2 border-mc-yellow pb-2">RANKING DE PRESENÇA</h4>
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3 md:pr-4 custom-scrollbar">
              {dashboardData.map((member, idx) => (
                <div key={member.id} className="flex flex-col gap-1.5 border-b border-white/10 pb-3">
                  <div className="flex justify-between items-end">
                    <span className="text-white font-mono text-[10px] md:text-[11px] font-black uppercase truncate mr-2">
                      <span className={`mr-2 ${idx < 3 ? 'text-mc-yellow' : 'text-mc-red'}`}>#{idx + 1}</span>
                      {member.name}
                    </span>
                    <span className={`font-display text-2xl md:text-3xl leading-none ${member.stats.percentage >= 75 ? 'text-mc-green' : member.stats.percentage >= 40 ? 'text-mc-yellow' : 'text-mc-red'}`}>
                      {member.stats.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 md:h-4 bg-zinc-900 border border-zinc-700 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ease-out ${
                        member.stats.percentage >= 75 
                        ? 'bg-mc-green shadow-[0_0_15px_#00ff41]' 
                        : member.stats.percentage >= 40 
                        ? 'bg-mc-yellow shadow-[0_0_10px_#faff00]' 
                        : 'bg-mc-red'
                      }`}
                      style={{ width: `${member.stats.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between font-mono text-[8px] font-bold text-gray-500 uppercase">
                    <span>{member.stats.presentCount} MISSÕES</span>
                    <span>META: 75%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8 md:space-y-12">
            <Card className="bg-white border-black" shadowColor="red">
              <h4 className="text-black font-display text-3xl md:text-4xl uppercase tracking-widest mb-6 border-b-4 border-black pb-2">MÉTRICAS GERAIS</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
                <div className="bg-black p-4 md:p-6 border-4 border-mc-red shadow-brutal-red">
                  <span className="text-mc-red font-mono text-[8px] md:text-[10px] font-black uppercase block tracking-[0.2em]">EVENTOS TOTAIS / ANO</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-white font-display text-5xl md:text-7xl leading-none">{totalEventsPossible}</span>
                    <span className="text-mc-red font-display text-xl md:text-2xl uppercase">missões</span>
                  </div>
                </div>
                <div className="bg-mc-yellow p-4 md:p-6 border-4 border-black shadow-brutal-small">
                  <span className="text-black font-mono text-[8px] md:text-[10px] font-black uppercase block tracking-[0.2em]">MÉDIA DO EFETIVO</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-black font-display text-5xl md:text-7xl leading-none">
                      {(dashboardData.reduce((acc, curr) => acc + curr.stats.percentage, 0) / members.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-mc-red border-4 border-white p-4 md:p-6 shadow-brutal-white">
              <h4 className="text-white font-display text-3xl md:text-5xl uppercase tracking-widest leading-none">QUARENTENA DISCIPLINAR</h4>
              <p className="text-black font-mono text-[10px] md:text-xs font-black uppercase mt-4 leading-relaxed">
                IRMÃOS COM FREQUÊNCIA ABAIXO DE <span className="text-white bg-black px-1">40%</span> SERÃO AUTOMATICAMENTE COLOCADOS EM REGIME DE OBSERVAÇÃO PELA SECRETARIA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualChecklist;
