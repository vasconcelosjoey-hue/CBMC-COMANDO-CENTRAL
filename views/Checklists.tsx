
import React, { useState, useEffect } from 'react';
import { BackButton } from '../components/UI';

interface ChecklistsProps {
  onBack: () => void;
}

const STORAGE_KEYS = {
  DAILY: 'cbmc_checklist_daily_v1',
  FIXED: 'cbmc_checklist_fixed_v1'
};

const Checklists: React.FC<ChecklistsProps> = ({ onBack }) => {
  const month = "JANEIRO";
  const year = "2026";
  
  const roster = [
    "ZANGGADO", "JOHNNY", "JAKÃO", "MOCO", "KATATAU", 
    "JB", "JONAS", "PAUL", "BACON", "DRÁKULA", 
    "MESTRE", "PERVERSO"
  ];

  const weekdays = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

  const [dailyData, setDailyData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const dateObj = new Date(2026, 0, day);
      return {
        date: `${day.toString().padStart(2, '0')}/01/2026`,
        weekday: weekdays[dateObj.getDay()],
        member: roster[i % roster.length]
      };
    });
  });

  const [fixedData, setFixedData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FIXED);
    if (saved) return JSON.parse(saved);
    return [
      { days: "DIAS 1 A 7", fixed: "JB", pps: "MOCO+JAKÃO" },
      { days: "DIAS 8 A 14", fixed: "JONAS", pps: "MOCO+JAKÃO" },
      { days: "DIAS 15 A 21", fixed: "PAUL", pps: "MOCO+JAKÃO" },
      { days: "DIAS 22 A 31", fixed: "BACON", pps: "MOCO+JAKÃO" },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(dailyData));
  }, [dailyData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FIXED, JSON.stringify(fixedData));
  }, [fixedData]);

  const updateDaily = (index: number, field: string, value: string) => {
    const newData = [...dailyData];
    newData[index] = { ...newData[index], [field]: value };
    setDailyData(newData);
  };

  const updateFixed = (index: number, field: string, value: string) => {
    const newData = [...fixedData];
    newData[index] = { ...newData[index], [field]: value };
    setFixedData(newData);
  };

  return (
    <div className="space-y-6 pb-20 bg-transparent min-h-screen">
      <BackButton onClick={onBack} />
      
      <div className="max-w-5xl mx-auto border-4 border-black bg-white shadow-document">
        <div className="bg-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b-2 border-black/10">
          <h2 className="text-black font-display text-4xl md:text-6xl tracking-tighter font-normal leading-none text-center md:text-left">
            CUMPADRES DO BRASIL MOTO CLUBE
          </h2>
          <div className="bg-mc-red text-white px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#000]">
            <span className="font-display text-3xl md:text-4xl tracking-tighter whitespace-nowrap">
              {month}/{year}
            </span>
          </div>
        </div>

        <div className="bg-mc-red text-white py-6 px-4 text-center border-y-4 border-black flex justify-center items-center">
          <h3 className="font-display text-2xl md:text-4xl lg:text-5xl tracking-[0.4em] font-light uppercase leading-tight text-center w-full">
            ESCALA DE MANUTENÇÃO - CHECK LIST
          </h3>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
            <thead>
              <tr className="bg-black text-white font-mono text-xs font-light uppercase">
                <th className="p-4 border-r border-white/20 w-32 text-center tracking-widest font-light">DIA</th>
                <th className="p-4 border-r border-white/20 w-40 tracking-widest font-light">DA SEMANA</th>
                <th className="p-4 tracking-widest font-light">MEMBRO ESCALADO</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((row: any, idx: number) => (
                <tr key={idx} className={`border-b border-black/5 group hover:bg-mc-red/5 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-3 text-center font-mono text-[11px] md:text-sm text-black border-r border-black/5 font-medium">{row.date}</td>
                  <td className="p-3 font-mono text-[11px] md:text-sm text-black border-r border-black/5 font-bold uppercase tracking-tight">{row.weekday}</td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={row.member} 
                      onChange={(e) => updateDaily(idx, 'member', e.target.value.toUpperCase())}
                      className="w-full bg-transparent border-none text-black font-mono font-black text-xs md:text-sm outline-none uppercase tracking-tighter focus:text-mc-red"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 mt-12">
        <div className="bg-mc-red text-white py-5 px-4 text-center border-4 border-black shadow-[4px_4px_0px_#000]">
          <h3 className="font-display text-2xl md:text-4xl tracking-[0.3em] font-light uppercase">ESCALA DE MANUTENÇÃO - FIXA</h3>
        </div>

        <div className="bg-white border-4 border-black overflow-hidden shadow-document">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-black text-white font-mono text-xs font-light uppercase">
                <th className="p-4 border-r border-white/20 tracking-widest">DIAS</th>
                <th className="p-4 border-r border-white/20 tracking-widest">FIXO</th>
                <th className="p-4 tracking-widest">PPs</th>
              </tr>
            </thead>
            <tbody>
              {fixedData.map((row: any, idx: number) => {
                const rangeLabel = row.days.replace("DIAS ", "");
                return (
                  <tr key={idx} className="border-b-2 border-black/10 bg-white group hover:bg-mc-yellow/10 transition-all">
                    <td className="p-6 border-r-2 border-black/5 bg-gray-50/50">
                      <div className="flex flex-col items-center justify-center leading-none">
                        <span className="font-display text-lg md:text-2xl text-mc-red group-hover:text-black mb-1 opacity-40 uppercase font-normal">DIAS</span>
                        <span className="font-display text-4xl md:text-6xl text-black font-normal">{rangeLabel}</span>
                      </div>
                    </td>
                    <td className="p-6 border-r-2 border-black/5">
                      <input 
                        type="text" 
                        value={row.fixed} 
                        onChange={(e) => updateFixed(idx, 'fixed', e.target.value.toUpperCase())}
                        className="w-full bg-transparent border-none text-black font-display text-4xl md:text-7xl text-center outline-none uppercase tracking-[0.1em] font-normal"
                      />
                    </td>
                    <td className="p-6">
                      <input 
                        type="text" 
                        value={row.pps} 
                        onChange={(e) => updateFixed(idx, 'pps', e.target.value.toUpperCase())}
                        className="w-full bg-transparent border-none text-black font-display text-3xl md:text-5xl text-center outline-none uppercase tracking-tight opacity-70 font-normal"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Checklists;
