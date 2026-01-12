
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { SectionTitle } from '../components/UI.tsx';
import { MOCK_EVENTS } from '../constants.ts';
import { Role, ClubEvent } from '../types.ts';
import { db } from '../firebase.ts';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface DispositivoSlot {
  id: string; 
  label: string;
  sublabel: string;
  color: 'red' | 'white';
  active: boolean;
}

interface DashboardProps {
  heroImage: string | null;
  onUpdateHero: (url: string | null) => void;
  userRole: Role;
}

const SlotBox: React.FC<{ 
  slot: DispositivoSlot; 
  onEdit: (id: string) => void;
  isAdmin: boolean;
}> = ({ slot, onEdit, isAdmin }) => (
  <div 
    className={`relative border-2 transition-all duration-200 flex flex-col justify-center min-h-[45px] md:min-h-[75px] p-1 md:p-2 text-center shadow-brutal-small group ${
      !slot.active ? 'bg-zinc-200 border-dashed border-zinc-400 opacity-20 hover:opacity-100' : 
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
    <span className="text-[7px] sm:text-[9px] md:text-[13px] font-black font-mono leading-none truncate uppercase tracking-tighter">
      {slot.active ? slot.label : 'VAGO'}
    </span>
    {slot.active && slot.sublabel && (
      <span className="text-[5px] sm:text-[7px] md:text-[9px] font-bold font-mono leading-none mt-0.5 md:mt-1 opacity-70 truncate uppercase tracking-tighter">
        {slot.sublabel}
      </span>
    )}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ heroImage, onUpdateHero, userRole }) => {
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth()); 
  const heroInputRef = useRef<HTMLInputElement>(null);
  const centerImageInputRef = useRef<HTMLInputElement>(null);
  
  const [centerTableImage, setCenterTableImage] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<string, DispositivoSlot>>({});
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  
  const isAdmin = [Role.PRESIDENTE, Role.VICE_PRESIDENTE, Role.SECRETARIO, Role.SARGENTO_ARMAS].includes(userRole);

  useEffect(() => {
    // Escutar Slots com tratamento de erro
    const unsubSlots = onSnapshot(doc(db, "dashboard", "slots"), 
      (docSnap) => {
        if (docSnap.exists()) {
          setSlots(docSnap.data() as Record<string, DispositivoSlot>);
        } else {
          const defaultSlots: Record<string, DispositivoSlot> = {
            'T1': { id: 'T1', label: '03 PERVERSO', sublabel: 'PRESIDENTE', color: 'red', active: true },
            'B1': { id: 'B1', label: '24 JB', sublabel: 'SECRETÁRIO', color: 'red', active: true },
            'L1': { id: 'L1', label: '02 ZANGGADO', sublabel: 'VICE PRESIDENTE', color: 'red', active: true },
            'L2': { id: 'L2', label: '10 MESTRE', sublabel: 'TESOUREIRO', color: 'red', active: true },
            'L3': { id: 'L3', label: '16 MARCÃO', sublabel: 'PREFEITO', color: 'red', active: true },
            'L4': { id: 'L4', label: '20 PAUL', sublabel: 'MEMBRO', color: 'white', active: true },
            'L5': { id: 'L5', label: '25 KATATAU', sublabel: 'MEMBRO', color: 'white', active: true },
            'R1': { id: 'R1', label: '01 JOHNNY', sublabel: 'SGT ARMAS', color: 'red', active: true },
            'R2': { id: 'R2', label: '15 DRÁKULA', sublabel: 'MEMBRO', color: 'white', active: true },
            'R3': { id: 'R3', label: '17 BACON', sublabel: 'MEMBRO', color: 'white', active: true },
            'R4': { id: 'R4', label: '23 JONAS', sublabel: 'MEMBRO', color: 'white', active: true },
            'R5': { id: 'R5', label: 'VAGO', sublabel: 'MEMBRO', color: 'white', active: false },
          };
          setSlots(defaultSlots);
          setDoc(doc(db, "dashboard", "slots"), defaultSlots).catch(() => {});
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Slots Error:", error);
        setDbError(true);
        setLoading(false); // Libera a tela mesmo com erro
      }
    );

    const unsubImages = onSnapshot(doc(db, "dashboard", "images"), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCenterTableImage(data.hub || null);
          if (data.hero) onUpdateHero(data.hero);
        }
      },
      (error) => console.error("Firebase Images Error:", error)
    );

    return () => { unsubSlots(); unsubImages(); };
  }, []);

  const handleUpdateSlot = async (id: string, field: keyof DispositivoSlot, value: any) => {
    const newSlots = { ...slots, [id]: { ...slots[id], [field]: value } };
    setSlots(newSlots);
    try {
      await setDoc(doc(db, "dashboard", "slots"), newSlots);
    } catch (e) {
      alert("ERRO DE PERMISSÃO: Verifique as regras do Firebase Firestore.");
    }
  };

  const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  const monthEvents = useMemo(() => MOCK_EVENTS.filter(e => {
    const eventDate = new Date(e.date + 'T12:00:00'); 
    return eventDate.getFullYear() === 2026 && eventDate.getMonth() === currentMonthIndex;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [currentMonthIndex]);

  const getEventTitle = (event: ClubEvent) => {
    if (event.type === 'VISITA' && event.location !== 'X') return `VISITA: ${event.location}`;
    return event.title;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-12 h-12 border-4 border-mc-red border-t-transparent animate-spin mb-4"></div>
      <span className="font-mono text-xs font-black uppercase tracking-widest">Sincronizando Comando...</span>
    </div>
  );

  return (
    <div className="space-y-10 md:space-y-16 pb-20">
      {dbError && (
        <div className="bg-mc-yellow border-4 border-black p-2 text-center animate-bounce">
          <span className="font-mono text-[10px] font-black uppercase">⚠️ ERRO DE PERMISSÃO FIREBASE - VERIFIQUE AS REGRAS DO BANCO</span>
        </div>
      )}

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
            <div className={`w-40 h-40 md:w-72 md:h-72 bg-black border-4 border-white shadow-brutal-red overflow-hidden relative group ${isAdmin ? 'cursor-pointer' : ''}`}>
              {heroImage ? <img src={heroImage} className="w-full h-full object-contain" /> : <div className="h-full flex items-center justify-center p-4 text-center text-white font-mono text-[10px] uppercase">Upload Hero</div>}
            </div>
          </div>
        </div>
      </div>

      {/* DISPOSITIVO DE ATA */}
      <div className="space-y-6">
        <SectionTitle title="DISPOSITIVO DE ATA" subtitle="MESA ADMINISTRATIVA" />
        <div className="max-w-5xl mx-auto bg-black border-4 border-white p-4 md:p-10 shadow-brutal-red relative">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="invisible"></div>
              {slots['T1'] && <SlotBox slot={slots['T1']} onEdit={setEditingSlotId} isAdmin={isAdmin} />}
              <div className="invisible"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-stretch">
              <div className="flex flex-col gap-2">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map(id => slots[id] && <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} />)}
              </div>
              <div className="bg-mc-gray border-4 border-mc-red flex items-center justify-center min-h-[120px] md:min-h-[250px]">
                {centerTableImage ? <img src={centerTableImage} className="w-full h-full object-contain" /> : <span className="text-white opacity-20 font-mono text-xs font-black">HUB CENTRAL</span>}
              </div>
              <div className="flex flex-col gap-2">
                {['R1', 'R2', 'R3', 'R4', 'R5'].map(id => slots[id] && <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} />)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="invisible"></div>
              {slots['B1'] && <SlotBox slot={slots['B1']} onEdit={setEditingSlotId} isAdmin={isAdmin} />}
              <div className="invisible"></div>
            </div>
        </div>
      </div>

      {editingSlotId && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-mc-gray border-4 border-mc-red p-5 max-w-sm w-full shadow-brutal-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-2xl text-white uppercase mb-6">EDITAR CADEIRA</h3>
            <div className="space-y-4">
              <input className="w-full bg-black border-2 border-mc-red p-3 text-white font-mono" value={slots[editingSlotId].label} onChange={(e) => handleUpdateSlot(editingSlotId, 'label', e.target.value)} placeholder="NOME" />
              <input className="w-full bg-black border-2 border-mc-red p-3 text-white font-mono" value={slots[editingSlotId].sublabel} onChange={(e) => handleUpdateSlot(editingSlotId, 'sublabel', e.target.value)} placeholder="CARGO" />
              <button onClick={() => setEditingSlotId(null)} className="w-full bg-white text-black font-display text-2xl py-3">FECHAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
