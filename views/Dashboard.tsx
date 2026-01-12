
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { SectionTitle } from '../components/UI';
import { MOCK_MEMBERS, MOCK_ANNOUNCEMENTS, MOCK_EVENTS } from '../constants';
import { Role, ClubEvent } from '../types';

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

const STORAGE_KEYS = {
  SLOTS: 'cbmc_dashboard_slots_v1',
  CENTER_IMAGE: 'cbmc_center_image_v1'
};

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
          title="Editar Informações"
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
        {slot.active ? slot.sublabel : ''}
      </span>
    )}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ heroImage, onUpdateHero, userRole }) => {
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth()); 
  const heroInputRef = useRef<HTMLInputElement>(null);
  const centerImageInputRef = useRef<HTMLInputElement>(null);
  
  const [centerTableImage, setCenterTableImage] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CENTER_IMAGE);
  });
  
  const isAdmin = [Role.PRESIDENTE, Role.VICE_PRESIDENTE, Role.SECRETARIO, Role.SARGENTO_ARMAS].includes(userRole);

  const [slots, setSlots] = useState<Record<string, DispositivoSlot>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    if (saved) return JSON.parse(saved);
    return {
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
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  }, [slots]);

  const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  const monthEvents = useMemo(() => MOCK_EVENTS.filter(e => {
    const eventDate = new Date(e.date + 'T12:00:00'); // Usar meio-dia para evitar problemas de fuso
    return eventDate.getFullYear() === 2026 && eventDate.getMonth() === currentMonthIndex;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [currentMonthIndex]);

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return weekDays[date.getDay()];
  };

  const handleUpdateSlot = (id: string, field: keyof DispositivoSlot, value: any) => {
    setSlots(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const toggleSlotColor = (id: string) => {
    setSlots(prev => ({
      ...prev,
      [id]: { ...prev[id], color: prev[id].color === 'red' ? 'white' : 'red' }
    }));
  };

  const handleCenterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setCenterTableImage(url);
        localStorage.setItem(STORAGE_KEYS.CENTER_IMAGE, url);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split(' ');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day} ${month} ${year}`;
  };

  const getEventTitle = (event: ClubEvent) => {
    if (event.type === 'VISITA' && event.location !== 'X') {
      return `VISITA: ${event.location}`;
    }
    return event.title;
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-20">
      {/* HERO SECTION */}
      <div className="relative bg-mc-red border-4 border-white shadow-brutal-white min-h-[300px] md:min-h-[450px] overflow-hidden mb-8 md:mb-12 flex items-center">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
           <span className="font-display text-[30vw] md:text-[25vw] text-white leading-none select-none">CBMC</span>
        </div>

        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 py-8 md:py-10">
          <div className="text-center md:text-left flex-1 order-2 md:order-1">
            <h1 className="text-3xl sm:text-5xl md:text-[6vw] lg:text-[7vw] font-display text-white leading-[0.9] uppercase tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              CUMPADRES<br/><span className="text-white">DO BRASIL</span>
            </h1>
            <div className="mt-4 md:mt-6 bg-black inline-block px-3 py-1 md:px-4 md:py-1 border-2 border-white shadow-brutal-red">
               <span className="text-white font-mono text-[8px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">COMANDO CENTRAL INSTITUCIONAL</span>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:justify-end order-1 md:order-2">
            <div 
              onClick={() => isAdmin && heroInputRef.current?.click()}
              className={`w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-black border-4 border-white shadow-brutal-red overflow-hidden relative group ${isAdmin ? 'cursor-pointer' : ''}`}
            >
              {heroImage ? (
                <img src={heroImage} alt="Destaque CBMC" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center border-2 border-dashed border-mc-red/30">
                   <span className="text-mc-red text-4xl md:text-6xl mb-2 md:mb-4">⇪</span>
                   <span className="text-white font-mono text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-tight">
                     CLIQUE PARA<br/>UPLOAD DESTAQUE
                   </span>
                </div>
              )}
              
              {isAdmin && (
                <div className="absolute inset-0 bg-mc-red/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity border-4 border-white m-1 md:m-2">
                   <span className="text-white font-mono font-black text-[10px] md:text-[12px] uppercase tracking-widest text-center">
                     [ ALTERAR FOTO ]
                   </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <input 
          type="file" 
          ref={heroInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onUpdateHero(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      {/* MURAL DE AVISOS */}
      <div className="w-full space-y-4 md:space-y-6 px-2 md:px-0">
        <SectionTitle title="MURAL DE AVISOS" subtitle="COMUNICADOS OFICIAIS" />
        <div className="max-w-3xl mx-auto w-full grid grid-cols-1 gap-4 md:gap-6 px-2 md:px-4">
          {MOCK_ANNOUNCEMENTS.map(ann => (
            <div key={ann.id} className="bg-mc-gray border-2 border-white p-4 md:p-6 shadow-brutal-red relative group">
              <div className="mb-3 md:mb-4 border-b border-mc-red/30 pb-2 text-center">
                 <h4 className="font-display text-xl md:text-3xl text-white leading-none uppercase tracking-widest">
                   {ann.title}
                 </h4>
              </div>
              <p className="text-white font-mono text-[10px] md:text-sm leading-relaxed italic uppercase tracking-wide text-center mb-4 md:mb-6">
                "{ann.content}"
              </p>
              <div className="flex justify-between items-end border-t border-mc-red/20 pt-3 md:pt-4">
                <div className="text-left">
                   <span className="text-mc-red text-[7px] md:text-[8px] font-black uppercase block mb-1 font-mono">PROT</span>
                   <span className="text-white font-mono text-[8px] md:text-[10px] font-black uppercase tracking-widest">{formatDateBR(ann.date)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-mc-red text-[7px] md:text-[8px] font-black uppercase mb-1 font-mono tracking-widest">AUTOR</span>
                  <span className="text-white font-display text-xl md:text-3xl uppercase leading-none tracking-widest">{ann.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISPOSITIVO DE ATA */}
      <div className="space-y-4 md:space-y-6 px-1">
        <SectionTitle title="DISPOSITIVO DE ATA" subtitle="MESA ADMINISTRATIVA" />
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-black border-4 border-white p-2 sm:p-4 md:p-10 shadow-brutal-red relative">
            
            {/* Top Row */}
            <div className="grid grid-cols-3 gap-1 md:gap-2 mb-2 md:mb-4">
              <div className="invisible"></div>
              <SlotBox slot={slots['T1']} onEdit={setEditingSlotId} isAdmin={isAdmin} />
              <div className="invisible"></div>
            </div>

            {/* Center Content */}
            <div className="grid grid-cols-3 gap-1.5 md:gap-4 items-stretch">
              <div className="flex flex-col gap-1.5 md:gap-2">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map(id => (
                  <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} />
                ))}
              </div>

              <div className="bg-mc-gray border-2 md:border-4 border-mc-red relative group/center overflow-hidden flex items-center justify-center min-h-[120px] md:min-h-[250px]">
                {centerTableImage ? (
                  <img src={centerTableImage} className="w-full h-full object-cover grayscale opacity-50 group-hover/center:opacity-100 transition-opacity" />
                ) : (
                  <div className="flex flex-col items-center opacity-10">
                    <img src="https://static.wixstatic.com/media/893a7d_8c3093952d4b4a15998df6718d7486e8~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/LOGO%20CBMC.png" className="w-16 md:w-32 invert" />
                    <span className="font-mono text-[6px] md:text-[8px] mt-2 font-black uppercase">ÁREA RESTRITA</span>
                  </div>
                )}
                
                {isAdmin && (
                  <button 
                    onClick={() => centerImageInputRef.current?.click()}
                    className="absolute inset-0 bg-mc-red/80 opacity-0 group-hover/center:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer border-2 border-white m-1"
                  >
                    <span className="bg-white text-black px-1.5 py-0.5 font-mono font-black text-[7px] md:text-[9px] uppercase shadow-brutal-small">[ HUB ]</span>
                  </button>
                )}
                <input type="file" ref={centerImageInputRef} className="hidden" accept="image/*" onChange={handleCenterImageUpload} />
              </div>

              <div className="flex flex-col gap-1.5 md:gap-2">
                {['R1', 'R2', 'R3', 'R4', 'R5'].map(id => (
                  <SlotBox key={id} slot={slots[id]} onEdit={setEditingSlotId} isAdmin={isAdmin} />
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-1 md:gap-2 mt-2 md:mt-4">
              <div className="invisible"></div>
              <SlotBox slot={slots['B1']} onEdit={setEditingSlotId} isAdmin={isAdmin} />
              <div className="invisible"></div>
            </div>

          </div>

          {editingSlotId && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
              <div className="bg-mc-gray border-4 border-mc-red p-5 max-w-sm w-full shadow-brutal-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display text-2xl text-white uppercase tracking-widest leading-none">EDITAR CADEIRA</h3>
                  <button onClick={() => setEditingSlotId(null)} className="text-mc-red font-black text-2xl p-2">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-mc-red font-mono text-[8px] font-black uppercase mb-1 tracking-widest">IDENTIFICAÇÃO</label>
                    <input 
                      className="w-full bg-black border-2 border-mc-red p-3 text-white font-mono uppercase focus:border-white outline-none text-sm" 
                      value={slots[editingSlotId].label} 
                      onChange={(e) => handleUpdateSlot(editingSlotId, 'label', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-mc-red font-mono text-[8px] font-black uppercase mb-1 tracking-widest">POSTO / CARGO</label>
                    <input 
                      className="w-full bg-black border-2 border-mc-red p-3 text-white font-mono uppercase focus:border-white outline-none text-sm" 
                      value={slots[editingSlotId].sublabel} 
                      onChange={(e) => handleUpdateSlot(editingSlotId, 'sublabel', e.target.value)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => toggleSlotColor(editingSlotId)}
                      className={`w-full border-2 p-3 font-mono font-black text-[9px] uppercase shadow-brutal-small ${slots[editingSlotId].color === 'red' ? 'bg-mc-red text-white border-white' : 'bg-white text-black border-black'}`}
                    >
                      COR: {slots[editingSlotId].color === 'red' ? 'OFICIAL' : 'MEMBRO'}
                    </button>
                    <button 
                      onClick={() => handleUpdateSlot(editingSlotId, 'active', !slots[editingSlotId].active)}
                      className={`w-full border-2 p-3 font-mono font-black text-[9px] uppercase shadow-brutal-small ${slots[editingSlotId].active ? 'bg-mc-green text-black border-black' : 'bg-gray-800 text-gray-500 border-gray-600'}`}
                    >
                      {slots[editingSlotId].active ? 'OCUPADO' : 'VAGO'}
                    </button>
                  </div>

                  <button 
                    onClick={() => setEditingSlotId(null)} 
                    className="w-full bg-white text-black font-display text-3xl py-3 shadow-brutal-red hover:bg-mc-red hover:text-white transition-all uppercase"
                  >
                    GRAVAR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CALENDÁRIO 2026 */}
      <div className="w-full space-y-6 px-2 md:px-4">
        <SectionTitle title="CALENDÁRIO 2026" subtitle="ESCALA OPERACIONAL" />
        <div className="max-w-4xl mx-auto bg-mc-gray border-2 border-white p-3 md:p-4 shadow-brutal-white">
          <div className="flex items-center justify-between gap-2 md:gap-4 mb-4 md:mb-6 bg-mc-red/10 border-2 border-mc-red p-2">
            <button onClick={() => setCurrentMonthIndex(prev => prev === 0 ? 11 : prev - 1)} className="bg-mc-red text-white w-8 h-8 flex items-center justify-center font-black text-xl shadow-brutal-small">‹</button>
            <span className="text-white font-display text-2xl md:text-5xl uppercase tracking-widest truncate">{months[currentMonthIndex]}</span>
            <button onClick={() => setCurrentMonthIndex(prev => prev === 11 ? 0 : prev + 1)} className="bg-mc-red text-white w-8 h-8 flex items-center justify-center font-black text-xl shadow-brutal-small">›</button>
          </div>
          
          <div className="space-y-3">
            {monthEvents.length > 0 ? monthEvents.map(event => (
              <div key={event.id} className="bg-black border-2 border-mc-red flex items-center gap-3 md:gap-4 p-1.5 md:p-2 group hover:bg-mc-red/10 transition-all shadow-brutal-small">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-mc-red border-2 border-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[6px] md:text-[8px] font-mono font-black text-white border-b border-white/20 w-full text-center pb-0.5 uppercase">{getDayOfWeek(event.date)}</span>
                  <span className="text-lg md:text-2xl font-black font-mono text-white leading-none mt-0.5">{event.date.split('-')[2]}</span>
                  <span className="text-[6px] md:text-[8px] font-mono font-black text-white uppercase">{months[currentMonthIndex].substring(0, 3)}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-white font-display text-xl md:text-3xl leading-none uppercase truncate tracking-widest">{getEventTitle(event)}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-mc-red text-white px-1.5 py-0.5 border border-white text-[7px] md:text-[8px] font-mono font-black uppercase">{event.type}</div>
                    <span className="text-[8px] md:text-[10px] font-mono text-gray-500 uppercase font-black truncate tracking-widest italic">{event.responsible}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-10 md:py-16 border-2 border-dashed border-white/10 text-center opacity-30">
                <p className="font-mono text-[9px] md:text-[11px] font-black text-white uppercase tracking-[0.3em]">SILÊNCIO OPERACIONAL</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
