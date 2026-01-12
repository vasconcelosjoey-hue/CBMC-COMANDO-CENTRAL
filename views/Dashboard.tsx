
import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { SectionTitle } from '../components/UI.tsx';
import { Role, Member } from '../types.ts';
import { db } from '../firebase.ts';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import * as htmlToImage from 'html-to-image';

interface DispositivoSlot {
  id: string; 
  label: string;
  sublabel: string;
  color: 'red' | 'white';
  active: boolean;
}

interface DashboardProps {
  members: Member[];
  heroImage: string | null;
  onUpdateHero: (url: string | null) => void;
  onUpdateRoster: (newList: Member[]) => void;
  userRole: Role;
  onBack: () => void;
}

const DEFAULT_SLOTS_DATA: Record<string, DispositivoSlot> = {
  'T1': { id: 'T1', label: 'F4-03 PERVERSO', sublabel: 'PRESIDENTE', color: 'red', active: true },
  'B1': { id: 'B1', label: '24 JB', sublabel: 'SECRETÁRIO', color: 'red', active: true },
  'L1': { id: 'L1', label: 'F4-02 ZANGGADO', sublabel: 'VICE PRESIDENTE', color: 'red', active: true },
  'L2': { id: 'L2', label: '10 MESTRE', sublabel: 'TESOUREIRO', color: 'red', active: true },
  'L3': { id: 'L3', label: '16 MARCÃO', sublabel: 'PREFEITO', color: 'red', active: true },
  'L4': { id: 'L4', label: '20 PAUL', sublabel: 'MEMBRO', color: 'white', active: true },
  'L5': { id: 'L5', label: '25 KATATAU', sublabel: 'MEMBRO', color: 'white', active: true },
  'R1': { id: 'R1', label: 'F4-01 JOHNNY', sublabel: 'SGT ARMAS', color: 'red', active: true },
  'R2': { id: 'R2', label: '15 DRÁKULA', sublabel: 'MEMBRO', color: 'white', active: true },
  'R3': { id: 'R3', label: '17 BACON', sublabel: 'MEMBRO', color: 'white', active: true },
  'R4': { id: 'R4', label: '23 JONAS', sublabel: 'MEMBRO', color: 'white', active: true },
  'R5': { id: 'R5', label: 'VAGO', sublabel: 'MEMBRO', color: 'white', active: false },
};

const SlotBox: React.FC<{ 
  slot: DispositivoSlot; 
  onEdit: (id: string) => void;
  isAdmin: boolean;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
}> = ({ slot, onEdit, isAdmin, onDragStart, onDrop }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div 
      draggable={isAdmin}
      onDragStart={() => onDragStart(slot.id)}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); onDrop(slot.id); }}
      className={`relative border-2 transition-all duration-200 flex flex-col justify-center min-h-[55px] md:min-h-[85px] p-1 md:p-2 text-center shadow-brutal-small group cursor-move ${
        isDraggingOver ? 'bg-mc-yellow scale-105 z-50' : 
        !slot.active ? 'bg-zinc-200 border-dashed border-zinc-400 opacity-20' : 
        slot.color === 'red' ? 'bg-mc-red text-white border-white' : 'bg-white text-black border-black'
      }`}
    >
      {isAdmin && (
        <div className="absolute -top-3 -right-2 flex gap-1 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(slot.id); }}
            className="w-5 h-5 md:w-6 md:h-6 bg-mc-yellow border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_#000] text-[10px]"
          >
            ✎
          </button>
        </div>
      )}
      <span className="text-[12px] sm:text-[14px] md:text-[20px] font-black font-mono leading-none truncate uppercase tracking-tighter">
        {slot.active ? slot.label : 'VAGO'}
      </span>
      {slot.active && slot.sublabel && (
        <span className="text-[8px] sm:text-[10px] md:text-[13px] font-bold font-mono leading-none mt-1 opacity-70 truncate uppercase tracking-tighter">
          {slot.sublabel}
        </span>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ members, heroImage, onUpdateHero, onUpdateRoster, userRole, onBack }) => {
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<string, DispositivoSlot>>(DEFAULT_SLOTS_DATA);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [draggedSlotId, setDraggedSlotId] = useState<string | null>(null);
  const [draggedMemberIndex, setDraggedMemberIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispositivoRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  
  const isAdmin = [Role.PRESIDENTE, Role.VICE_PRESIDENTE, Role.SECRETARIO, Role.SARGENTO_ARMAS].includes(userRole);
  const monthsList = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const weekdays = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

  // LÓGICA DE ESCALA INTELIGENTE (RODÍZIO RESPONSIVO)
  const getMemberForDate = useCallback((day: number, month: number, year: number) => {
    if (!members.length) return "CARREGANDO...";
    const epoch = new Date(2026, 0, 1);
    const target = new Date(year, month, day);
    const diffTime = target.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = ((diffDays % members.length) + members.length) % members.length;
    const m = members[index];
    if (m.role === Role.PROSPERO) return `PRÓSPERO ${m.name}`;
    return `${m.cumbraId} ${m.name}`;
  }, [members]);

  const currentScaleData = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateObj = new Date(viewYear, viewMonth, day);
      return {
        date: `${day.toString().padStart(2, '0')}/${(viewMonth + 1).toString().padStart(2, '0')}/${viewYear}`,
        weekday: weekdays[dateObj.getDay()],
        member: getMemberForDate(day, viewMonth, viewYear)
      };
    });
  }, [viewMonth, viewYear, members, getMemberForDate]);

  const todayDuty = useMemo(() => {
    const now = new Date();
    return getMemberForDate(now.getDate(), now.getMonth(), now.getFullYear());
  }, [getMemberForDate]);

  useEffect(() => {
    const unsubSlots = onSnapshot(doc(db, "dashboard", "slots"), (docSnap) => {
      if (docSnap.exists()) setSlots(docSnap.data() as Record<string, DispositivoSlot>);
      else setDoc(doc(db, "dashboard", "slots"), DEFAULT_SLOTS_DATA);
      setLoading(false);
    });
    return () => unsubSlots();
  }, []);

  // DRAG & DROP DO RODÍZIO (MUDAR A INTELIGÊNCIA DA ESCALA)
  const handleMemberDragStart = (index: number) => setDraggedMemberIndex(index);
  const handleMemberDrop = (targetIndex: number) => {
    if (draggedMemberIndex === null || draggedMemberIndex === targetIndex) return;
    const newList = [...members];
    const [moved] = newList.splice(draggedMemberIndex, 1);
    newList.splice(targetIndex, 0, moved);
    onUpdateRoster(newList);
    setDraggedMemberIndex(null);
  };

  const handleUpdateSlot = async (id: string, field: keyof DispositivoSlot, value: any) => {
    const newSlots = { ...slots, [id]: { ...slots[id], [field]: value } };
    setSlots(newSlots);
    try {
      await setDoc(doc(db, "dashboard", "slots"), newSlots);
    } catch (e) { console.error(e); }
  };

  const handleSlotDragStart = (id: string) => setDraggedSlotId(id);
  const handleSlotDrop = async (targetId: string) => {
    if (!draggedSlotId || draggedSlotId === targetId) return;
    const newSlots = { ...slots };
    const temp = { ...newSlots[draggedSlotId] };
    newSlots[draggedSlotId] = { ...newSlots[targetId], id: draggedSlotId };
    newSlots[targetId] = { ...temp, id: targetId };
    setSlots(newSlots);
    setDraggedSlotId(null);
    try {
      await setDoc(doc(db, "dashboard", "slots"), newSlots);
    } catch (e) { console.error(e); }
  };

  const navigateMonth = (direction: number) => {
    let nextMonth = viewMonth + direction;
    let nextYear = viewYear;
    if (nextMonth < 0) { nextMonth = 11; nextYear--; }
    if (nextMonth > 11) { nextMonth = 0; nextYear++; }
    setViewMonth(nextMonth);
    setViewYear(nextYear);
  };

  const exportAsImage = (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current) return;
    htmlToImage.toJpeg(ref.current, { quality: 0.95, backgroundColor: '#f4f4f4' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `CBMC-${name}-${new Date().getTime()}.jpg`;
        link.href = dataUrl;
        link.click();
      });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-12 h-12 border-4 border-mc-red border-t-transparent animate-spin mb-4"></div>
      <span className="font-mono text-xs font-black uppercase tracking-widest">Sincronizando...</span>
    </div>
  );

  return (
    <div className="space-y-10 md:space-y-20 pb-20">
      {/* HERO SECTION */}
      <div className="relative bg-mc-red border-4 border-white shadow-brutal-white min-h-[300px] md:min-h-[450px] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
           <span className="font-display text-[30vw] text-white leading-none">CBMC</span>
        </div>
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 py-10">
          <div className="text-center md:text-left flex-1 order-2 md:order-1">
            <h1 className="text-3xl sm:text-5xl md:text-[6vw] font-display text-white leading-[0.9] uppercase tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              CUMPADRES<br/><span className="text-white">DO BRASIL</span>
            </h1>
            <div className="mt-6 bg-black inline-block px-4 py-1 border-2 border-white shadow-brutal-red">
               <span className="text-white font-mono text-[8px] md:text-xs font-black uppercase tracking-[0.4em]">COMANDO CENTRAL</span>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center order-1 md:order-2">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 const reader = new FileReader();
                 reader.onloadend = () => onUpdateHero(reader.result as string);
                 reader.readAsDataURL(file);
               }
            }} />
            <div 
              onClick={() => isAdmin && fileInputRef.current?.click()}
              className={`w-40 h-40 md:w-72 md:h-72 bg-black border-4 border-white shadow-brutal-red overflow-hidden relative group ${isAdmin ? 'cursor-pointer' : ''}`}
            >
              {heroImage ? (
                <img src={heroImage} className="w-full h-full object-contain" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-16 h-16 border-2 border-mc-red mb-2 flex items-center justify-center opacity-20">
                    <span className="text-mc-red text-4xl">⚓</span>
                  </div>
                  <span className="text-white font-mono text-[10px] uppercase opacity-20 tracking-widest">Brasão Oficial</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MISSÃO DO DIA */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-mc-yellow border-4 border-black p-4 md:p-6 shadow-brutal-red flex flex-col md:flex-row items-center gap-6 animate-pulse-soft">
          <div className="bg-black text-white p-3 font-mono text-xs font-black uppercase tracking-widest leading-none text-center md:text-left">
            MISSÃO<br/>DO DIA
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-black font-display text-4xl md:text-6xl leading-none uppercase tracking-tighter block truncate">
              {todayDuty}
            </span>
            <span className="text-black font-mono text-[10px] font-black uppercase opacity-60 tracking-widest">RESPONSÁVEL PELA MANUTENÇÃO</span>
          </div>
        </div>
      </div>

      {/* RODÍZIO TÁTICO (DRAGGABLE ROSTER) */}
      <div className="space-y-6">
        <SectionTitle title="ORDEM DE RODÍZIO" subtitle="Arraste para mudar a Fila Tática" />
        <div className="max-w-5xl mx-auto bg-mc-gray border-4 border-white p-4 overflow-x-auto shadow-brutal-red">
           <div className="flex gap-2 min-w-max pb-2">
              {members.map((m, idx) => (
                 <div 
                   key={m.id}
                   draggable={isAdmin}
                   onDragStart={() => handleMemberDragStart(idx)}
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={() => handleMemberDrop(idx)}
                   className={`px-4 py-2 border-2 font-mono font-black text-xs uppercase cursor-move transition-all flex items-center gap-2 whitespace-nowrap ${
                     m.role === Role.PROSPERO ? 'bg-mc-yellow text-black border-black' : 'bg-white text-black border-mc-red'
                   } hover:scale-105 active:scale-95`}
                 >
                    <span className="opacity-40">⠿</span>
                    {m.role === Role.PROSPERO ? `PRÓSPERO ${m.name}` : `${m.cumbraId} ${m.name}`}
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* DISPOSITIVO DE REUNIÃO */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <SectionTitle title="DISPOSITIVO DE REUNIÃO" subtitle="Organização de Assentos Administrativos" />
          <button onClick={() => exportAsImage(dispositivoRef, 'dispositivo')} className="bg-black text-white font-mono text-[10px] font-black p-3 border-2 border-mc-red shadow-brutal-small">📸 EXPORTAR DISPOSITIVO</button>
        </div>
        <div ref={dispositivoRef} className="max-w-5xl mx-auto bg-black border-4 border-white p-4 md:p-10 shadow-brutal-red relative">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="invisible"></div>
              {slots['T1'] && <SlotBox slot={slots['T1']} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={handleSlotDragStart} onDrop={handleSlotDrop} />}
              <div className="invisible"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-stretch">
              <div className="flex flex-col gap-2">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map(id => slots[id] && <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={handleSlotDragStart} onDrop={handleSlotDrop} />)}
              </div>
              <div className="bg-mc-gray border-4 border-mc-red flex flex-col items-center justify-center min-h-[150px] md:min-h-[350px] relative overflow-hidden">
                <div className="z-20 p-2 transform -rotate-90 flex flex-col items-center justify-center">
                  <span className="text-mc-red font-display text-4xl md:text-[5vw] block leading-none font-black tracking-tighter drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]">CBMC</span>
                  <div className="h-1 bg-mc-red w-32 md:w-56 my-2"></div>
                  <span className="text-white font-mono text-[8px] md:text-[10px] uppercase font-black tracking-[0.4em] opacity-80 whitespace-nowrap">MESA DE COMANDO</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {['R1', 'R2', 'R3', 'R4', 'R5'].map(id => slots[id] && <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={handleSlotDragStart} onDrop={handleSlotDrop} />)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="invisible"></div>
              {slots['B1'] && <SlotBox slot={slots['B1']} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={handleSlotDragStart} onDrop={handleSlotDrop} />}
              <div className="invisible"></div>
            </div>
        </div>
      </div>

      {/* ESCALA COMPLETA */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
             <div className="bg-mc-red border-4 border-black px-8 py-3 mb-2 shadow-brutal-red">
                <h2 className="text-4xl font-display text-black uppercase tracking-widest leading-none">ESCALA COMPLETA</h2>
             </div>
             <div className="bg-white border-2 border-black px-4 py-1 flex items-center gap-4">
                <button onClick={() => navigateMonth(-1)} className="text-mc-red hover:scale-125 transition-transform font-black text-xl">◀</button>
                <span className="text-black font-mono font-black text-xs uppercase tracking-[0.3em] min-w-[150px] text-center">
                    {monthsList[viewMonth]} / {viewYear}
                </span>
                <button onClick={() => navigateMonth(1)} className="text-mc-red hover:scale-125 transition-transform font-black text-xl">▶</button>
             </div>
          </div>
          <button onClick={() => exportAsImage(checklistRef, 'escala-mensal')} className="bg-black text-white font-mono text-[10px] font-black p-4 border-2 border-mc-red shadow-brutal-small">📸 EXPORTAR ESCALA</button>
        </div>

        <div ref={checklistRef} className="max-w-5xl mx-auto border-4 border-black bg-white shadow-document overflow-hidden">
             <div className="bg-mc-red text-white p-4 flex justify-between items-center border-b-4 border-black">
                <span className="font-display text-2xl tracking-widest uppercase">ESCALA MENSAL OFICIAL</span>
                <span className="font-mono text-xs font-black uppercase">{monthsList[viewMonth]} / {viewYear}</span>
             </div>
             <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-black text-white font-mono text-[10px] uppercase">
                         <th className="p-3 border-r border-white/10 w-24 text-center">DATA</th>
                         <th className="p-3 border-r border-white/10 w-32">DIA</th>
                         <th className="p-3">CUMPADRE RESPONSÁVEL</th>
                      </tr>
                   </thead>
                   <tbody>
                      {currentScaleData.map((row: any, idx: number) => (
                         <tr key={idx} className={`border-b border-black/5 ${row.date.split('/')[0] === new Date().getDate().toString().padStart(2, '0') && viewMonth === new Date().getMonth() ? 'bg-mc-yellow/40' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="p-3 text-center font-mono text-[12px] md:text-sm text-black border-r border-black/5 font-bold">{row.date}</td>
                            <td className="p-3 font-mono text-[10px] text-black border-r border-black/5 font-black uppercase opacity-60">{row.weekday}</td>
                            <td className="p-3 font-mono font-black text-[14px] md:text-lg uppercase">{row.member}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      </div>

      {editingSlotId && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-mc-gray border-4 border-mc-red p-5 max-w-sm w-full shadow-brutal-white">
            <h3 className="font-display text-2xl text-white uppercase mb-6 border-b border-mc-red pb-2">EDITAR CADEIRA</h3>
            <div className="space-y-4">
              <input className="w-full bg-black border-2 border-mc-red p-3 text-white font-mono uppercase" value={slots[editingSlotId].label} onChange={(e) => handleUpdateSlot(editingSlotId, 'label', e.target.value)} placeholder="NOME" />
              <input className="w-full bg-black border-2 border-mc-red p-3 text-white font-mono uppercase" value={slots[editingSlotId].sublabel} onChange={(e) => handleUpdateSlot(editingSlotId, 'sublabel', e.target.value)} placeholder="CARGO" />
              <div className="flex gap-2">
                <button 
                  onClick={() => handleUpdateSlot(editingSlotId, 'active', !slots[editingSlotId].active)}
                  className={`flex-1 py-3 font-mono font-black text-xs uppercase border-2 border-black ${slots[editingSlotId].active ? 'bg-mc-red text-white' : 'bg-mc-green text-black'}`}
                >
                  {slots[editingSlotId].active ? 'DESATIVAR' : 'ATIVAR'}
                </button>
                <button onClick={() => setEditingSlotId(null)} className="flex-1 bg-white text-black font-display text-2xl py-2 border-2 border-black">FECHAR</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
