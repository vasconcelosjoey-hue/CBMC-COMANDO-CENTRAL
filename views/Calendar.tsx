
import React, { useState, useMemo } from 'react';
import { SectionTitle, Badge, BackButton } from '../components/UI';
import { MOCK_EVENTS } from '../constants';
import { ClubEvent } from '../types';

interface CalendarProps {
  onBack: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  
  const monthEvents = useMemo(() => {
    return MOCK_EVENTS.filter(e => {
        const eventDate = new Date(e.date + 'T00:00:00');
        return eventDate.getMonth() === currentMonth;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [currentMonth]);

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return weekDays[date.getDay()];
  };

  const getEventTitle = (event: ClubEvent) => {
    if (event.type === 'VISITA' && event.location !== 'X') {
      return `VISITA: ${event.location}`;
    }
    return event.title;
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <SectionTitle title="CALENDÁRIO 2026" subtitle="Escala Institucional de Operações" />

      <div className="flex justify-between items-center bg-mc-red border-4 border-white p-3 shadow-brutal-white mb-6">
        <button onClick={() => setCurrentMonth(prev => prev > 0 ? prev - 1 : 11)} className="text-white font-black hover:scale-125 transition-transform text-4xl leading-none px-4">‹</button>
        <span className="text-white font-display text-4xl md:text-6xl tracking-[0.2em] leading-none uppercase">{months[currentMonth]}</span>
        <button onClick={() => setCurrentMonth(prev => prev < 11 ? prev + 1 : 0)} className="text-white font-black hover:scale-125 transition-transform text-4xl leading-none px-4">›</button>
      </div>

      <div className="space-y-3">
        {monthEvents.length > 0 ? (
          monthEvents.map((event) => (
            <div key={event.id} className="bg-mc-gray border-2 border-mc-red flex items-center gap-4 p-2 md:p-3 shadow-brutal-red relative group hover:bg-zinc-900 transition-all">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-mc-red border-2 border-white flex flex-col items-center justify-center shadow-[2px_2px_0px_#fff]">
                <span className="text-[10px] md:text-xs font-black font-mono text-white leading-none mb-1 border-b border-white/30 w-full text-center pb-0.5 uppercase">
                  {getDayOfWeek(event.date)}
                </span>
                <span className="text-2xl md:text-4xl font-black font-mono text-white leading-none">
                  {event.date.split('-')[2]}
                </span>
                <span className="text-[10px] md:text-xs font-black font-mono text-white leading-none mt-1 uppercase">
                  {months[currentMonth].substring(0, 3)}
                </span>
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 overflow-hidden">
                <div className="flex flex-col">
                  <h4 className="text-mc-red font-display text-3xl md:text-5xl leading-none uppercase tracking-widest truncate group-hover:text-white transition-colors">
                    {getEventTitle(event)}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="bg-mc-red text-white px-1.5 py-0.5 border border-white text-[8px] md:text-[10px] font-black font-mono uppercase">
                      {event.type}
                    </div>
                    <span className="text-gray-500 font-mono text-[10px] md:text-xs font-black uppercase tracking-widest truncate">
                      {event.type !== 'VISITA' && event.location !== 'X' ? event.location : ''}
                    </span>
                  </div>
                </div>

                <div className="text-left md:text-right flex flex-col justify-center">
                  <span className="text-[8px] font-mono font-black text-mc-red/50 uppercase tracking-widest">DIRETRIZ:</span>
                  <span className="text-white font-mono text-[10px] md:text-sm font-black uppercase tracking-tighter">
                    {event.responsible}
                  </span>
                </div>
              </div>

              {event.isOfficial && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-mc-red animate-pulse"></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 border-4 border-dashed border-mc-red/20 text-center">
            <p className="font-mono text-xs font-black text-mc-red uppercase tracking-[0.5em] opacity-40 italic">
              ZONA DE SILÊNCIO: SEM OPERAÇÕES REGISTRADAS
            </p>
          </div>
        )}
      </div>

      <div className="bg-mc-yellow border-4 border-black p-4 shadow-brutal-red mt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 bg-mc-red border-2 border-black rotate-45"></div>
            <h4 className="text-black font-display font-black text-3xl uppercase tracking-widest">DIRETRIZ INSTITUCIONAL</h4>
          </div>
          <p className="text-black font-mono text-[10px] md:text-xs font-black leading-tight uppercase tracking-wider">
            AVISO: O NÃO COMPARECIMENTO EM DATAS OFICIAIS SEM JUSTIFICATIVA PRÉVIA ACARRETARÁ EM SANÇÕES PREVISTAS NO REGIMENTO INTERNO.
          </p>
      </div>
    </div>
  );
};

export default Calendar;
