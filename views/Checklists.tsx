
import React, { useState, useEffect } from 'react';
import { BackButton } from '../components/UI.tsx';
import { db } from '../firebase.ts';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface ChecklistsProps {
  onBack: () => void;
}

const Checklists: React.FC<ChecklistsProps> = ({ onBack }) => {
  const month = "JANEIRO";
  const year = "2026";
  const docId = `january_2026`;
  
  const roster = [
    "ZANGGADO", "JOHNNY", "JAKÃO", "MOCO", "KATATAU", 
    "JB", "JONAS", "PAUL", "BACON", "DRÁKULA", 
    "MESTRE", "PERVERSO"
  ];

  const weekdays = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

  const [dailyData, setDailyData] = useState<any[]>([]);
  const [fixedData, setFixedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "maintenance", docId), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDailyData(data.daily || []);
          setFixedData(data.fixed || []);
        } else {
          const initialDaily = Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const dateObj = new Date(2026, 0, day);
            return {
              date: `${day.toString().padStart(2, '0')}/01/2026`,
              weekday: weekdays[dateObj.getDay()],
              member: roster[i % roster.length]
            };
          });
          const initialFixed = [
            { days: "DIAS 1 A 7", fixed: "JB", pps: "MOCO+JAKÃO" },
            { days: "DIAS 8 A 14", fixed: "JONAS", pps: "MOCO+JAKÃO" },
            { days: "DIAS 15 A 21", fixed: "PAUL", pps: "MOCO+JAKÃO" },
            { days: "DIAS 22 A 31", fixed: "BACON", pps: "MOCO+JAKÃO" },
          ];
          setDailyData(initialDaily);
          setFixedData(initialFixed);
          setDoc(doc(db, "maintenance", docId), { daily: initialDaily, fixed: initialFixed }).catch(() => {});
        }
        setLoading(false);
      },
      (error) => {
        console.error("Maintenance DB Error:", error);
        setLoading(false); // Libera tela
      }
    );
    return () => unsub();
  }, []);

  const saveToFirebase = async (newDaily: any[], newFixed: any[]) => {
    try {
      await setDoc(doc(db, "maintenance", docId), { daily: newDaily, fixed: newFixed });
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  const updateDaily = (index: number, field: string, value: string) => {
    const newData = [...dailyData];
    newData[index] = { ...newData[index], [field]: value };
    setDailyData(newData);
    saveToFirebase(newData, fixedData);
  };

  const updateFixed = (index: number, field: string, value: string) => {
    const newData = [...fixedData];
    newData[index] = { ...newData[index], [field]: value };
    setFixedData(newData);
    saveToFirebase(dailyData, newData);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="w-16 h-16 border-4 border-black border-t-mc-red rounded-full animate-spin mb-4"></div>
      <span className="font-mono text-black font-black tracking-widest uppercase text-xs">Sincronizando Escalas...</span>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 bg-transparent min-h-screen">
      <div className="flex justify-between items-center">
        <BackButton onClick={onBack} />
        <div className="bg-mc-black text-mc-yellow border-2 border-mc-yellow px-2 py-1 font-mono text-[9px] font-black uppercase tracking-widest">
          SISTEMA NUVEM
        </div>
      </div>
      
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

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
            <thead>
              <tr className="bg-black text-white font-mono text-xs uppercase">
                <th className="p-4 border-r border-white/20 w-32 text-center tracking-widest font-light">DIA</th>
                <th className="p-4 border-r border-white/20 w-40 tracking-widest font-light">DA SEMANA</th>
                <th className="p-4 tracking-widest font-light">MEMBRO ESCALADO</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((row: any, idx: number) => (
                <tr key={idx} className={`border-b border-black/5 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-3 text-center font-mono text-sm text-black border-r border-black/5 font-medium">{row.date}</td>
                  <td className="p-3 font-mono text-sm text-black border-r border-black/5 font-bold uppercase">{row.weekday}</td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={row.member} 
                      onChange={(e) => updateDaily(idx, 'member', e.target.value.toUpperCase())}
                      className="w-full bg-transparent border-none text-black font-mono font-black text-sm outline-none uppercase"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Checklists;
