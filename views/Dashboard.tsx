
import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { SectionTitle } from '../components/UI.tsx';
import { Role, Member, MemberStatus, PaymentStatus } from '../types.ts';
import { db } from '../firebase.ts';
import { doc, onSnapshot, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import * as htmlToImage from 'html-to-image';

interface DispositivoSlot {
  id: string; 
  label: string;
  sublabel: string;
  color: 'red' | 'white';
  active: boolean;
}

interface ChecklistDay {
  day: number;
  date: string;
  weekday: string;
  memberId: string | null;
  memberName: string;
}

interface FixedChecklistRow {
  period: string;
  fixed: string;
  pps: string;
}

interface CalendarEvent {
  day: string;
  weekday: string;
  type: string;
  title: string;
  location: string;
  highlight?: boolean;
}

interface MonthCalendar {
  name: string;
  events: CalendarEvent[];
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

const DEFAULT_FIXED_CHECKLIST: FixedChecklistRow[] = [
  { period: 'DIAS 1 A 7', fixed: 'BACON', pps: 'MOCO+JAKÃO' },
  { period: 'DIAS 8 A 14', fixed: 'DRÁKULA', pps: 'MOCO+JAKÃO' },
  { period: 'DIAS 15 A 21', fixed: 'MESTRE', pps: 'MOCO+JAKÃO' },
  { period: 'DIAS 22 A 31', fixed: 'KATATAU', pps: 'MOCO+JAKÃO' },
];

const DEFAULT_ANNUAL_CALENDAR: MonthCalendar[] = [
  {
    name: "JANEIRO",
    events: [
      { day: "10", weekday: "SÁB", type: "DIA INTEIRO", title: "REUNIÃO DE ATA", location: "SEDE CBMC" },
      { day: "16", weekday: "SEX", type: "ANIVERSÁRIO", title: "JAKÃO", location: "X", highlight: true },
      { day: "18", weekday: "DOM", type: "DIA INTEIRO", title: "CAFÉ NA ESTRADA", location: "X" },
      { day: "26", weekday: "SEG", type: "ANIVERSÁRIO", title: "JOHNNY", location: "X", highlight: true },
      { day: "30", weekday: "SEX", type: "DIA INTEIRO", title: "GIRO - NOTURNO", location: "X" },
      { day: "31", weekday: "SÁB", type: "DIA INTEIRO", title: "VISITA AO CUMPADRE", location: "SEDE CBMC" },
    ]
  },
  {
    name: "FEVEREIRO",
    events: [
      { day: "1", weekday: "DOM", type: "DIA INTEIRO", title: "MANUTENÇÃO GERAL", location: "SEDE CBMC" },
      { day: "14", weekday: "SÁB", type: "DIA INTEIRO", title: "REUNIÃO DE ATA", location: "SEDE CBMC" },
      { day: "15", weekday: "DOM", type: "DIA INTEIRO", title: "CAFÉ NA ESTRADA", location: "X" },
      { day: "27", weekday: "SEX", type: "GIRO - NOTURNO", title: "GIRO - NOTURNO", location: "X" },
      { day: "27", weekday: "SEX", type: "ANIVERSÁRIO", title: "ZANGGADO", location: "X", highlight: true },
      { day: "28", weekday: "SÁB", type: "DIA INTEIRO", title: "VISITA AO CUMPADRE", location: "DRÁKULA" },
    ]
  },
  {
    name: "MARÇO",
    events: [
      { day: "14", weekday: "SÁB", type: "DIA INTEIRO", title: "REUNIÃO DE ATA", location: "SEDE CBMC" },
      { day: "15", weekday: "DOM", type: "ANIVERSÁRIO", title: "BACON", location: "X", highlight: true },
      { day: "15", weekday: "DOM", type: "DIA INTEIRO", title: "CAFÉ NA ESTRADA", location: "X" },
      { day: "17", weekday: "TER", type: "ANIVERSÁRIO", title: "JONAS", location: "X", highlight: true },
      { day: "23", weekday: "SEG", type: "ANIVERSÁRIO", title: "KUARENTA", location: "X", highlight: true },
      { day: "27", weekday: "SEX", type: "DIA INTEIRO", title: "GIRO - NOTURNO", location: "X" },
      { day: "28", weekday: "SÁB", type: "DIA INTEIRO", title: "VISITA AO CUMPADRE", location: "MARCÃO" },
    ]
  }
];

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
  const [checklistData, setChecklistData] = useState<ChecklistDay[]>([]);
  const [fixedChecklistData, setFixedChecklistData] = useState<FixedChecklistRow[]>(DEFAULT_FIXED_CHECKLIST);
  const [annualCalendar, setAnnualCalendar] = useState<MonthCalendar[]>(DEFAULT_ANNUAL_CALENDAR);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [draggedSlotId, setDraggedSlotId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispositivoRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const fixedChecklistRef = useRef<HTMLDivElement>(null);
  const annualCalendarRef = useRef<HTMLDivElement>(null);
  
  const isAdmin = [Role.PRESIDENTE, Role.VICE_PRESIDENTE, Role.SECRETARIO, Role.SARGENTO_ARMAS].includes(userRole);
  const monthsList = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const weekdays = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

  const checklistDocId = useMemo(() => `maintenance_${viewMonth}_${viewYear}`, [viewMonth, viewYear]);

  // CARREGAR CHECKLIST PERSISTIDO
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "maintenance", checklistDocId), (docSnap) => {
      if (docSnap.exists()) {
        setChecklistData(docSnap.data().daily || []);
      } else {
        setChecklistData([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [checklistDocId]);

  // CARREGAR CHECKLIST FIXO
  useEffect(() => {
    const unsubFixed = onSnapshot(doc(db, "maintenance", "fixed_roster"), (docSnap) => {
      if (docSnap.exists()) {
        setFixedChecklistData(docSnap.data().rows || DEFAULT_FIXED_CHECKLIST);
      } else {
        setDoc(doc(db, "maintenance", "fixed_roster"), { rows: DEFAULT_FIXED_CHECKLIST });
      }
    });
    return () => unsubFixed();
  }, []);

  // CARREGAR CALENDÁRIO ANUAL
  useEffect(() => {
    const unsubCalendar = onSnapshot(doc(db, "maintenance", "annual_calendar_2026"), (docSnap) => {
      if (docSnap.exists()) {
        setAnnualCalendar(docSnap.data().months || DEFAULT_ANNUAL_CALENDAR);
      } else {
        setDoc(doc(db, "maintenance", "annual_calendar_2026"), { months: DEFAULT_ANNUAL_CALENDAR });
      }
    });
    return () => unsubCalendar();
  }, []);

  useEffect(() => {
    const unsubSlots = onSnapshot(doc(db, "dashboard", "slots"), (docSnap) => {
      if (docSnap.exists()) setSlots(docSnap.data() as Record<string, DispositivoSlot>);
      else setDoc(doc(db, "dashboard", "slots"), DEFAULT_SLOTS_DATA);
    });
    return () => unsubSlots();
  }, []);

  // GERAR ESCALA INTELIGENTE (SEQUENCIAL)
  const generateChecklist = async () => {
    setLoading(true);
    const activeRotationMembers = members.filter(m => m.rosterActive !== false);
    if (!activeRotationMembers.length) return;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    
    // Tentar descobrir quem foi o último do mês anterior para manter a ordem
    let startIndex = 0;
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const prevDoc = await getDoc(doc(db, "maintenance", `maintenance_${prevMonth}_${prevYear}`));
    
    if (prevDoc.exists()) {
      const lastDayMemberId = prevDoc.data().daily.slice(-1)[0]?.memberId;
      const lastIdx = activeRotationMembers.findIndex(m => m.id === lastDayMemberId);
      if (lastIdx !== -1) startIndex = (lastIdx + 1) % activeRotationMembers.length;
    }

    const newDaily = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateObj = new Date(viewYear, viewMonth, day);
      const mIdx = (startIndex + i) % activeRotationMembers.length;
      const m = activeRotationMembers[mIdx];
      return {
        day,
        date: `${day.toString().padStart(2, '0')}/${(viewMonth + 1).toString().padStart(2, '0')}/${viewYear}`,
        weekday: weekdays[dateObj.getDay()],
        memberId: m.id,
        memberName: m.role === Role.PROSPERO ? `PRÓSPERO ${m.name}` : `${m.cumbraId} ${m.name}`
      };
    });

    try {
      await setDoc(doc(db, "maintenance", checklistDocId), { 
        daily: newDaily,
        month: monthsList[viewMonth],
        year: viewYear
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // AÇÕES INDIVIDUAIS NA TABELA
  const handleDayMemberChange = async (dayIndex: number, newMemberId: string | null) => {
    if (!isAdmin) return;
    const newData = [...checklistData];
    const member = members.find(m => m.id === newMemberId);
    
    newData[dayIndex] = {
      ...newData[dayIndex],
      memberId: newMemberId,
      memberName: member ? (member.role === Role.PROSPERO ? `PRÓSPERO ${member.name}` : `${member.cumbraId} ${member.name}`) : "VAGO"
    };

    setChecklistData(newData);
    try {
      await setDoc(doc(db, "maintenance", checklistDocId), { daily: newData }, { merge: true });
    } catch (e) { console.error(e); }
  };

  const updateFixedChecklist = async (index: number, field: keyof FixedChecklistRow, value: string) => {
    if (!isAdmin) return;
    const newData = [...fixedChecklistData];
    newData[index] = { ...newData[index], [field]: value.toUpperCase() };
    setFixedChecklistData(newData);
    try {
      await setDoc(doc(db, "maintenance", "fixed_roster"), { rows: newData });
    } catch (e) { console.error(e); }
  };

  const updateAnnualCalendar = async (monthIdx: number, eventIdx: number, field: keyof CalendarEvent, value: string) => {
    if (!isAdmin) return;
    const newCalendar = [...annualCalendar];
    newCalendar[monthIdx].events[eventIdx] = { 
      ...newCalendar[monthIdx].events[eventIdx], 
      [field]: field === 'highlight' ? value : value.toUpperCase() 
    };
    setAnnualCalendar(newCalendar);
    try {
      await setDoc(doc(db, "maintenance", "annual_calendar_2026"), { months: newCalendar });
    } catch (e) { console.error(e); }
  };

  const toggleDayOff = (dayIndex: number) => {
    const isOff = checklistData[dayIndex].memberId === null;
    handleDayMemberChange(dayIndex, isOff ? members[0].id : null);
  };

  // DRAG & DROP NA TABELA (SWAP DE MEMBROS)
  const handleRowDragStart = (idx: number) => setDraggedRowIndex(idx);
  const handleRowDrop = async (targetIdx: number) => {
    if (draggedRowIndex === null || draggedRowIndex === targetIdx) return;
    const newData = [...checklistData];
    
    const tempId = newData[draggedRowIndex].memberId;
    const tempName = newData[draggedRowIndex].memberName;
    
    newData[draggedRowIndex].memberId = newData[targetIdx].memberId;
    newData[draggedRowIndex].memberName = newData[targetIdx].memberName;
    
    newData[targetIdx].memberId = tempId;
    newData[targetIdx].memberName = tempName;

    setChecklistData(newData);
    setDraggedRowIndex(null);
    try {
      await setDoc(doc(db, "maintenance", checklistDocId), { daily: newData }, { merge: true });
    } catch (e) { console.error(e); }
  };

  // ADICIONAR NOVO AO SISTEMA
  const addNewMemberToSystem = () => {
    if (!newMemberName.trim()) return;
    const newMember: Member = {
      id: `custom_${Date.now()}`,
      name: newMemberName.toUpperCase(),
      cumbraId: newMemberId.trim() || '-',
      fullName: newMemberName.toUpperCase(),
      role: newMemberId.startsWith('F4') ? Role.SARGENTO_ARMAS : (newMemberId === '-' ? Role.PROSPERO : Role.MEMBRO),
      roleHistory: [],
      joinDate: new Date().toLocaleDateString(),
      status: newMemberId === '-' ? MemberStatus.PROSPERO : MemberStatus.ATIVO,
      paymentStatus: PaymentStatus.PAGO,
      rosterActive: true
    };
    onUpdateRoster([...members, newMember]);
    setNewMemberName('');
    setNewMemberId('');
    setShowAddMember(false);
  };

  const handleUpdateSlot = async (id: string, field: keyof DispositivoSlot, value: any) => {
    const newSlots = { ...slots, [id]: { ...slots[id], [field]: value } };
    setSlots(newSlots);
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
      <span className="font-mono text-xs font-black uppercase tracking-widest">Sincronizando Banco...</span>
    </div>
  );

  return (
    <div className="space-y-10 md:space-y-20 pb-20">
      {/* HERO SECTION COMPACTADO */}
      <div className="relative bg-mc-red border-4 border-white shadow-brutal-white min-h-[220px] md:min-h-[300px] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
           <span className="font-display text-[20vw] text-white leading-none">CBMC</span>
        </div>
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 py-4 md:py-6">
          <div className="text-center md:text-left flex-1 order-2 md:order-1">
            <h1 className="text-2xl sm:text-4xl md:text-[5vw] font-display text-white leading-[0.9] uppercase tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              CUMPADRES<br/><span className="text-white">DO BRASIL</span>
            </h1>
            <div className="mt-3 md:mt-4 bg-black inline-block px-3 py-1 border-2 border-white shadow-brutal-red">
               <span className="text-white font-mono text-[7px] md:text-xs font-black uppercase tracking-[0.4em]">COMANDO CENTRAL</span>
            </div>
          </div>
          <div className="w-full md:w-auto flex justify-center order-1 md:order-2">
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
              className={`w-32 h-32 md:w-56 md:h-56 bg-black border-4 border-white shadow-brutal-red overflow-hidden relative group ${isAdmin ? 'cursor-pointer' : ''}`}
            >
              {heroImage ? (
                <img src={heroImage} className="w-full h-full object-contain" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 border-2 border-mc-red mb-2 flex items-center justify-center opacity-20">
                    <span className="text-mc-red text-3xl">⚓</span>
                  </div>
                  <span className="text-white font-mono text-[8px] uppercase opacity-20 tracking-widest">Brasão Oficial</span>
                </div>
              )}
            </div>
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
              {slots['T1'] && <SlotBox slot={slots['T1']} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={(id) => setDraggedSlotId(id)} onDrop={(id) => {
                if (!draggedSlotId || draggedSlotId === id) return;
                const newSlots = {...slots};
                const temp = {...newSlots[draggedSlotId]};
                newSlots[draggedSlotId] = {...newSlots[id], id: draggedSlotId};
                newSlots[id] = {...temp, id};
                setSlots(newSlots);
                setDoc(doc(db, "dashboard", "slots"), newSlots);
              }} />}
              <div className="invisible"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-stretch">
              <div className="flex flex-col gap-2">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map(id => slots[id] && <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={(id) => setDraggedSlotId(id)} onDrop={(id) => {
                if (!draggedSlotId || draggedSlotId === id) return;
                const newSlots = {...slots};
                const temp = {...newSlots[draggedSlotId]};
                newSlots[draggedSlotId] = {...newSlots[id], id: draggedSlotId};
                newSlots[id] = {...temp, id};
                setSlots(newSlots);
                setDoc(doc(db, "dashboard", "slots"), newSlots);
              }} />)}
              </div>
              <div className="bg-mc-gray border-4 border-mc-red flex flex-col items-center justify-center min-h-[150px] md:min-h-[350px] relative overflow-hidden">
                <div className="z-20 p-2 transform -rotate-90 flex flex-col items-center justify-center text-center">
                  <span className="text-mc-red font-display text-4xl md:text-[5vw] block leading-none font-black tracking-tighter drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]">CBMC</span>
                  <div className="h-1 bg-mc-red w-32 md:w-56 my-2"></div>
                  <span className="text-white font-mono text-[8px] md:text-[10px] uppercase font-black tracking-[0.4em] opacity-80 whitespace-nowrap">MESA DE COMANDO</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {['R1', 'R2', 'R3', 'R4', 'R5'].map(id => slots[id] && <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={(id) => setDraggedSlotId(id)} onDrop={(id) => {
                if (!draggedSlotId || draggedSlotId === id) return;
                const newSlots = {...slots};
                const temp = {...newSlots[draggedSlotId]};
                newSlots[draggedSlotId] = {...newSlots[id], id: draggedSlotId};
                newSlots[id] = {...temp, id};
                setSlots(newSlots);
                setDoc(doc(db, "dashboard", "slots"), newSlots);
              }} />)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="invisible"></div>
              {slots['B1'] && <SlotBox slot={slots['B1']} onEdit={setEditingSlotId} isAdmin={isAdmin} onDragStart={(id) => setDraggedSlotId(id)} onDrop={(id) => {
                if (!draggedSlotId || draggedSlotId === id) return;
                const newSlots = {...slots};
                const temp = {...newSlots[draggedSlotId]};
                newSlots[draggedSlotId] = {...newSlots[id], id: draggedSlotId};
                newSlots[id] = {...temp, id};
                setSlots(newSlots);
                setDoc(doc(db, "dashboard", "slots"), newSlots);
              }} />}
              <div className="invisible"></div>
            </div>
        </div>
      </div>

      {/* CHECKLIST DIÁRIO */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
             <div className="bg-mc-red border-4 border-black px-8 py-3 mb-2 shadow-brutal-red w-full text-center md:text-left">
                <h2 className="text-4xl font-display text-black uppercase tracking-widest leading-none">CHECKLIST DIÁRIO</h2>
             </div>
             <div className="flex flex-wrap items-center gap-2">
                <div className="bg-white border-2 border-black px-4 py-1 flex items-center gap-4">
                    <button onClick={() => navigateMonth(-1)} className="text-mc-red hover:scale-125 transition-transform font-black text-xl">◀</button>
                    <span className="text-black font-mono font-black text-xs uppercase tracking-[0.3em] min-w-[150px] text-center">
                        {monthsList[viewMonth]} / {viewYear}
                    </span>
                    <button onClick={() => navigateMonth(1)} className="text-mc-red hover:scale-125 transition-transform font-black text-xl">▶</button>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={generateChecklist} className="bg-mc-green border-2 border-black px-4 py-1.5 font-mono text-[10px] font-black uppercase shadow-brutal-green hover:bg-black hover:text-mc-green transition-all">
                        {checklistData.length ? 'RECICLAR ESCALA' : 'GERAR ESCALA'}
                    </button>
                    <button onClick={() => setShowAddMember(true)} className="bg-mc-yellow border-2 border-black px-4 py-1.5 font-mono text-[10px] font-black uppercase shadow-brutal-small hover:bg-black hover:text-mc-yellow transition-all">
                        + NOVO MEMBRO
                    </button>
                  </div>
                )}
             </div>
          </div>
          <button onClick={() => exportAsImage(checklistRef, 'checklist-diario')} className="bg-black text-white font-mono text-[10px] font-black p-4 border-2 border-mc-red shadow-brutal-small mb-1">📸 EXPORTAR JPG</button>
        </div>

        <div ref={checklistRef} className="max-w-5xl mx-auto border-4 border-black bg-white shadow-document overflow-hidden">
             <div className="bg-mc-red text-white p-4 flex justify-between items-center border-b-4 border-black">
                <span className="font-display text-2xl tracking-widest uppercase">CHECKLIST DIÁRIO OFICIAL</span>
                <span className="font-mono text-xs font-black uppercase">{monthsList[viewMonth]} / {viewYear}</span>
             </div>
             <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-black text-white font-mono text-[10px] uppercase">
                         <th className="p-3 border-r border-white/10 w-24 text-center">DATA</th>
                         <th className="p-3 border-r border-white/10 w-32">DIA</th>
                         <th className="p-3">CUMPADRE RESPONSÁVEL</th>
                         {isAdmin && <th className="p-3 text-right">AÇÕES</th>}
                      </tr>
                   </thead>
                   <tbody>
                      {checklistData.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 4 : 3} className="p-20 text-center font-mono text-xs font-black uppercase opacity-20">Aguardando geração da escala...</td>
                        </tr>
                      ) : (
                        checklistData.map((row, idx) => (
                           <tr 
                              key={`${checklistDocId}-${row.day}`}
                              draggable={isAdmin}
                              onDragStart={() => handleRowDragStart(idx)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleRowDrop(idx)}
                              className={`border-b border-black/5 group cursor-move transition-colors ${
                                  row.day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear()
                                  ? 'bg-mc-yellow/40' 
                                  : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                           >
                              <td className="p-3 text-center font-mono text-[12px] md:text-sm text-black border-r border-black/5 font-bold">{row.date}</td>
                              <td className="p-3 font-mono text-[10px] text-black border-r border-black/5 font-black uppercase opacity-60">{row.weekday}</td>
                              <td className="p-3 font-mono font-black text-[14px] md:text-lg uppercase flex items-center gap-3">
                                 <span className="opacity-20 group-hover:opacity-100 transition-opacity">⠿</span>
                                 <select 
                                   disabled={!isAdmin}
                                   className={`bg-transparent border-none font-mono font-black uppercase outline-none focus:bg-mc-yellow appearance-none cursor-pointer p-1 rounded ${!row.memberId ? 'text-mc-red opacity-50' : 'text-black'}`}
                                   value={row.memberId || ''}
                                   onChange={(e) => handleDayMemberChange(idx, e.target.value || null)}
                                 >
                                   <option value="">VAGO</option>
                                   {members.map(m => (
                                     <option key={m.id} value={m.id}>
                                       {m.role === Role.PROSPERO ? `PRÓSPERO ${m.name}` : `${m.cumbraId} ${m.name}`}
                                     </option>
                                   ))}
                                 </select>
                              </td>
                              {isAdmin && (
                                  <td className="p-3 text-right">
                                      <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                              onClick={() => toggleDayOff(idx)}
                                              className={`border-2 border-black p-1 px-2 text-[10px] font-black shadow-[1px_1px_0px_#000] ${
                                                  row.memberId ? 'bg-mc-red text-white' : 'bg-mc-green text-black'
                                              }`}
                                          >
                                              {row.memberId ? 'OFF' : 'ON'}
                                          </button>
                                      </div>
                                  </td>
                              )}
                           </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
      </div>

      {/* CHECKLIST SEMANAL FIXO */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
             <div className="bg-mc-red border-4 border-black px-8 py-3 mb-2 shadow-brutal-red w-full text-center md:text-left">
                <h2 className="text-4xl font-display text-black uppercase tracking-widest leading-none">ESCALA FIXA</h2>
             </div>
          </div>
          <button onClick={() => exportAsImage(fixedChecklistRef, 'checklist-fixo')} className="bg-black text-white font-mono text-[10px] font-black p-4 border-2 border-mc-red shadow-brutal-small mb-1">📸 EXPORTAR JPG</button>
        </div>

        <div ref={fixedChecklistRef} className="max-w-5xl mx-auto border-4 border-black bg-white shadow-document overflow-hidden">
          <div className="bg-mc-red text-white p-5 text-center border-b-4 border-black">
            <span className="font-display text-4xl md:text-5xl tracking-[0.1em] uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">ESCALA DE MANUTENÇÃO - FIXA</span>
          </div>
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white font-mono text-[14px] uppercase border-b-2 border-white/20">
                  <th className="p-4 border-r border-white/20 w-1/3 text-center tracking-widest">DIAS</th>
                  <th className="p-4 border-r border-white/20 w-1/3 text-center tracking-widest">FIXO</th>
                  <th className="p-4 w-1/3 text-center tracking-widest">PPs</th>
                </tr>
              </thead>
              <tbody>
                {fixedChecklistData.map((row, idx) => (
                  <tr key={idx} className={`border-b-2 border-black group transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}>
                    <td className="p-5 text-center font-display text-3xl md:text-5xl text-black border-r-2 border-black font-black uppercase tracking-tighter">
                      {row.period}
                    </td>
                    <td className="p-5 text-center border-r-2 border-black">
                      <input 
                        disabled={!isAdmin}
                        className="w-full bg-transparent border-none text-center font-display text-3xl md:text-5xl text-black font-normal uppercase outline-none focus:bg-mc-yellow transition-colors"
                        value={row.fixed}
                        onChange={(e) => updateFixedChecklist(idx, 'fixed', e.target.value)}
                      />
                    </td>
                    <td className="p-5 text-center">
                      <input 
                        disabled={!isAdmin}
                        className="w-full bg-transparent border-none text-center font-display text-3xl md:text-5xl text-black font-normal uppercase outline-none focus:bg-mc-yellow transition-colors"
                        value={row.pps}
                        onChange={(e) => updateFixedChecklist(idx, 'pps', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CALENDÁRIO ANUAL 2026 - NOVO PADRÃO GRID 3 COLUNAS */}
      <div className="space-y-6 mt-16 md:mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
             <div className="bg-mc-black border-4 border-mc-red px-8 py-3 mb-2 shadow-brutal-red w-full text-center md:text-left">
                <h2 className="text-4xl font-display text-white uppercase tracking-widest leading-none">CALENDÁRIO 2026</h2>
             </div>
          </div>
          <button onClick={() => exportAsImage(annualCalendarRef, 'calendario-2026')} className="bg-black text-white font-mono text-[10px] font-black p-4 border-2 border-mc-red shadow-brutal-small mb-1">📸 EXPORTAR CALENDÁRIO</button>
        </div>

        <div ref={annualCalendarRef} className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
          {annualCalendar.map((month, monthIdx) => (
            <div key={month.name} className="border-4 border-black bg-white shadow-document flex flex-col">
              <div className="bg-zinc-500 text-black p-3 text-center border-b-2 border-black">
                <span className="font-display text-3xl md:text-4xl tracking-widest uppercase font-black">{month.name}</span>
              </div>
              <div className="w-full">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-black text-white font-mono text-[10px] md:text-[12px] uppercase">
                      <th className="p-2 border-r border-white/20 w-[18%] text-center">DIA</th>
                      <th className="p-2 border-r border-white/20 w-[12%] text-center">SEM</th>
                      <th className="p-2 border-r border-white/20 w-[22%] text-center">TIPO</th>
                      <th className="p-2 border-r border-white/20 w-[30%] text-center">EVENTO</th>
                      <th className="p-2 w-[18%] text-center">LOCAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {month.events.map((event, eventIdx) => (
                      <tr key={eventIdx} className={`border-b-2 border-black h-12 transition-colors ${event.highlight ? 'bg-zinc-300' : 'bg-white'}`}>
                        <td className="p-1 border-r-2 border-black text-center">
                          <input disabled={!isAdmin} className="w-full bg-transparent border-none text-center font-display text-xl md:text-2xl text-black font-black uppercase outline-none" value={event.day} onChange={(e) => updateAnnualCalendar(monthIdx, eventIdx, 'day', e.target.value)} />
                        </td>
                        <td className="p-1 border-r-2 border-black text-center">
                          <input disabled={!isAdmin} className="w-full bg-transparent border-none text-center font-mono text-[10px] md:text-xs text-black font-black uppercase outline-none" value={event.weekday} onChange={(e) => updateAnnualCalendar(monthIdx, eventIdx, 'weekday', e.target.value)} />
                        </td>
                        <td className="p-1 border-r-2 border-black text-center">
                          <input disabled={!isAdmin} className="w-full bg-transparent border-none text-center font-mono text-[9px] md:text-[10px] text-black font-black uppercase outline-none" value={event.type} onChange={(e) => updateAnnualCalendar(monthIdx, eventIdx, 'type', e.target.value)} />
                        </td>
                        <td className="p-1 border-r-2 border-black text-center">
                          <input disabled={!isAdmin} className="w-full bg-transparent border-none text-center font-display text-lg md:text-xl text-black font-black uppercase outline-none" value={event.title} onChange={(e) => updateAnnualCalendar(monthIdx, eventIdx, 'title', e.target.value)} />
                        </td>
                        <td className="p-1 text-center">
                          <input disabled={!isAdmin} className="w-full bg-transparent border-none text-center font-mono text-[9px] md:text-[10px] text-black font-black uppercase outline-none" value={event.location} onChange={(e) => updateAnnualCalendar(monthIdx, eventIdx, 'location', e.target.value)} />
                        </td>
                      </tr>
                    ))}
                    {/* Linhas vazias para manter o grid alinhado */}
                    {Array.from({ length: Math.max(0, 7 - month.events.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b-2 border-black h-12 bg-white">
                        <td className="border-r-2 border-black"></td>
                        <td className="border-r-2 border-black"></td>
                        <td className="border-r-2 border-black"></td>
                        <td className="border-r-2 border-black"></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL ADICIONAR/EDITAR MEMBRO */}
      {(showAddMember || editingMember) && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-mc-red p-6 max-w-sm w-full shadow-brutal-white">
            <h3 className="font-display text-3xl text-black uppercase mb-6 border-b-2 border-black pb-2">
                {editingMember ? 'AJUSTAR CUMPADRE' : 'NOVO RECRUTA'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[9px] font-black uppercase opacity-40">APELIDO / NOME</label>
                <input autoFocus className="w-full bg-zinc-100 border-2 border-black p-3 text-black font-mono uppercase outline-none focus:bg-white" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="EX: TROVÃO" />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[9px] font-black uppercase opacity-40">NÚMERO / ID (F4-XX OU XX OU -)</label>
                <input className="w-full bg-zinc-100 border-2 border-black p-3 text-black font-mono uppercase outline-none focus:bg-white" value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} placeholder="EX: 26" />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                    onClick={addNewMemberToSystem} 
                    className="flex-1 bg-mc-red text-white font-display text-2xl py-2 border-2 border-black shadow-brutal-small active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    {editingMember ? 'ATUALIZAR' : 'ADICIONAR'}
                </button>
                <button onClick={() => { setShowAddMember(false); setEditingMember(null); }} className="flex-1 bg-black text-white font-mono text-xs py-2 border-2 border-white">CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
