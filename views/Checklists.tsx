
import React, { useState, useEffect, useMemo } from 'react';
import { BackButton, SectionTitle } from '../components/UI.tsx';
import { db } from '../firebase.ts';
import { doc, onSnapshot, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { MOCK_MEMBERS } from '../constants.ts';

interface ChecklistsProps {
  onBack: () => void;
}

const Checklists: React.FC<ChecklistsProps> = ({ onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2026);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const weekdays = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
  const roster = MOCK_MEMBERS.map(m => m.name);

  const docId = useMemo(() => `maintenance_${selectedMonth}_${selectedYear}`, [selectedMonth, selectedYear]);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "maintenance", docId), 
      (docSnap) => {
        if (docSnap.exists()) {
          setDailyData(docSnap.data().daily || []);
          setIsCreating(false);
        } else {
          setDailyData([]);
          setIsCreating(true);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar escala:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [docId]);

  const generateNewMonth = async () => {
    setLoading(true);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    const newDaily = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateObj = new Date(selectedYear, selectedMonth, day);
      return {
        date: `${day.toString().padStart(2, '0')}/${(selectedMonth + 1).toString().padStart(2, '0')}/${selectedYear}`,
        weekday: weekdays[dateObj.getDay()],
        member: roster[i % roster.length]
      };
    });

    try {
      await setDoc(doc(db, "maintenance", docId), { 
        daily: newDaily,
        createdAt: new Date().toISOString(),
        month: months[selectedMonth],
        year: selectedYear
      });
      setIsCreating(false);
    } catch (e) {
      console.error("Erro ao gerar escala:", e);
    }
    setLoading(false);
  };

  const updateDaily = async (index: number, value: string) => {
    const newData = [...dailyData];
    newData[index].member = value.toUpperCase();
    setDailyData(newData);
    try {
      await setDoc(doc(db, "maintenance", docId), { daily: newData }, { merge: true });
    } catch (e) {
      console.error("Erro ao salvar edição:", e);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <BackButton onClick={onBack} />
        <div className="bg-mc-black text-mc-yellow border-2 border-mc-yellow px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest shadow-brutal-small">
          CONTROLE DE MANUTENÇÃO
        </div>
      </div>

      <SectionTitle title="ESCALA DE MANUTENÇÃO" subtitle="Escalonamento de Efetivo por Período" />

      {/* CONTROLES DE NAVEGAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-4 border-black p-4 shadow-brutal-red">
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="bg-black text-white font-mono font-black p-3 border-2 border-mc-red outline-none uppercase text-sm"
        >
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-black text-white font-mono font-black p-3 border-2 border-mc-red outline-none uppercase text-sm"
        >
          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {isCreating ? (
          <button 
            onClick={generateNewMonth}
            className="bg-mc-green text-black font-mono font-black p-3 border-2 border-black hover:bg-black hover:text-mc-green transition-all uppercase text-sm"
          >
            + GERAR ESCALA {months[selectedMonth]}
          </button>
        ) : (
          <div className="flex items-center justify-center bg-zinc-100 border-2 border-black border-dashed font-mono text-[10px] font-black text-zinc-400 uppercase">
            ESCALA ATIVA NA NUVEM
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-16 h-16 border-4 border-mc-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-mono text-mc-red font-black tracking-widest uppercase text-xs">Sincronizando Escala...</span>
        </div>
      ) : isCreating ? (
        <div className="py-20 border-4 border-dashed border-black/10 flex flex-col items-center justify-center text-center bg-white/50">
          <span className="text-4xl mb-4">🗓️</span>
          <h3 className="font-display text-3xl text-black/40 uppercase">Sem registro para este período</h3>
          <p className="font-mono text-xs text-black/30 uppercase mt-2">Clique no botão acima para gerar a escala inteligente.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto border-4 border-black bg-white shadow-document overflow-hidden">
          <div className="bg-mc-red text-white p-4 flex justify-between items-center border-b-4 border-black">
            <span className="font-display text-2xl tracking-widest uppercase">LISTAGEM OFICIAL</span>
            <span className="font-mono text-xs font-black uppercase">{months[selectedMonth]} / {selectedYear}</span>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-black text-white font-mono text-[10px] uppercase">
                  <th className="p-3 border-r border-white/10 w-24 text-center">DATA</th>
                  <th className="p-3 border-r border-white/10 w-32">DIA</th>
                  <th className="p-3">CUMPADRE RESPONSÁVEL</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((row: any, idx: number) => (
                  <tr key={idx} className={`border-b border-black/5 hover:bg-mc-yellow/10 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-3 text-center font-mono text-xs text-black border-r border-black/5 font-bold">{row.date}</td>
                    <td className="p-3 font-mono text-[10px] text-black border-r border-black/5 font-black uppercase opacity-60">{row.weekday}</td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={row.member} 
                        onChange={(e) => updateDaily(idx, e.target.value)}
                        className="w-full bg-transparent border-none text-black font-mono font-black text-sm outline-none uppercase focus:bg-mc-yellow px-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;
