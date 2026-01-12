
import React, { useState, useRef, useMemo } from 'react';
import { SectionTitle, Badge, BackButton } from '../components/UI';
import { Member, Role, MemberStatus } from '../types';

interface MembersProps {
  userRole: Role;
  currentUserId: string;
  members: Member[];
  onUpdatePhoto: (memberId: string, photoUrl: string) => void;
  onBack: () => void;
}

const Members: React.FC<MembersProps> = ({ userRole, currentUserId, members, onUpdatePhoto, onBack }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ORDENAÇÃO INSTITUCIONAL: PRESIDENTE -> VICE -> CARGOS -> NÚMEROS -> PRÓSPEROS (JAKÃO POR ÚLTIMO)
  const institutionalMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const rolePriority: Record<string, number> = {
        [Role.PRESIDENTE]: 1,
        [Role.VICE_PRESIDENTE]: 2,
        [Role.TESOUREIRO]: 3,
        [Role.PREFEITO]: 4,
        [Role.SECRETARIO]: 5,
        [Role.SARGENTO_ARMAS]: 6,
        [Role.CAPITAO_ESTRADA]: 7,
        [Role.MEMBRO]: 8,
        [Role.PROSPERO]: 9
      };

      const pA = rolePriority[a.role] || 10;
      const pB = rolePriority[b.role] || 10;

      if (pA !== pB) return pA - pB;

      // Se ambos são Membros, ordenar por CumbraId (Geralmente decrescente por antiguidade em alguns contextos, ou crescente)
      // O usuário pediu Perverso (F4-03) primeiro e Jakão (Próspero) último.
      // Para números normais, manteremos a ordem de antiguidade.
      const idA = parseInt(a.cumbraId);
      const idB = parseInt(b.cumbraId);
      
      if (!isNaN(idA) && !isNaN(idB)) return idB - idA; // Ex: 25, 24, 23...
      
      return a.cumbraId.localeCompare(b.cumbraId);
    });
  }, [members]);

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const activeCount = members.filter(m => m.status === MemberStatus.ATIVO).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedMemberId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePhoto(selectedMemberId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFullDisplayName = (m: Member) => {
    if (m.role === Role.PROSPERO) return `PRÓSPERO ${m.name}`;
    return `${m.cumbraId} ${m.name}`;
  };

  return (
    <div className="space-y-6">
      {!selectedMemberId ? (
        <>
          <BackButton onClick={onBack} />
          
          <div className="relative mb-12 flex flex-col items-center">
            <div className="bg-mc-red border-4 border-black px-10 py-4 shadow-[8px_8px_0px_#000] mb-4">
               <h1 className="text-4xl md:text-7xl font-display text-black font-black uppercase tracking-widest leading-none">RELAÇÃO EFETIVO</h1>
            </div>
            <div className="bg-white border-2 border-black px-6 py-1 mb-6">
               <span className="text-black font-mono font-black text-xs md:text-sm uppercase tracking-[0.4em]">ANTIGUIDADE E POSTOS</span>
            </div>
            
            <div className="bg-mc-black border-4 border-mc-green px-6 py-2 shadow-brutal-green">
              <span className="text-mc-green font-mono text-xs md:text-sm font-black uppercase tracking-widest">
                TOTAL DE EFETIVOS ATIVOS: {activeCount.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {institutionalMembers.map(member => (
              <div 
                key={member.id} 
                onClick={() => setSelectedMemberId(member.id)}
                className="bg-mc-gray border-2 border-zinc-800 p-4 flex items-center justify-between group cursor-pointer hover:border-mc-red hover:bg-zinc-900 transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-black border-2 border-mc-red shrink-0 overflow-hidden shadow-[2px_2px_0px_#ff0000]">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-mono text-[10px] uppercase opacity-20">CB</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-display text-2xl md:text-5xl text-white group-hover:text-mc-red leading-none uppercase tracking-tighter transition-colors">
                      {getFullDisplayName(member)}
                    </h4>
                    <span className="text-[10px] md:text-xs text-mc-red font-mono font-black uppercase tracking-widest mt-1">
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="bg-mc-green px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-black font-mono font-black text-[10px] uppercase">{member.status === MemberStatus.ATIVO ? 'ATIVO' : member.status.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <BackButton onClick={() => setSelectedMemberId(null)} label="VOLTAR À LISTAGEM" />
          
          <div className="bg-white border-4 border-black shadow-document overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-10 bg-black flex flex-col items-center border-b-4 md:border-b-0 md:border-r-4 border-mc-red">
                <div className="relative group mb-6">
                  <div className="w-48 h-48 md:w-64 md:h-64 border-4 border-mc-red overflow-hidden bg-mc-gray shadow-brutal-red">
                    <img src={selectedMember?.photoUrl} className="w-full h-full object-cover" />
                  </div>
                  {selectedMember?.id === currentUserId && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-mc-red/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white font-black p-4 transition-opacity border-4 border-white"
                    >
                      <span className="text-xs uppercase tracking-widest text-center">ALTERAR FOTO</span>
                    </button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                
                <h2 className="text-5xl md:text-7xl font-display text-white text-center leading-none uppercase tracking-tighter">
                  {selectedMember?.name}
                </h2>
                <div className="mt-6 px-6 py-2 bg-mc-red border-2 border-white shadow-brutal-white">
                  <span className="text-white font-mono font-black uppercase text-xl tracking-widest">
                    {selectedMember?.cumbraId}
                  </span>
                </div>
              </div>

              <div className="p-10 col-span-2 space-y-10">
                <div>
                  <h3 className="text-mc-red font-black text-xs uppercase tracking-[0.4em] mb-6 border-b-2 border-black pb-2">FICHA DE COMANDO</h3>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="border-l-4 border-mc-red pl-5">
                      <span className="text-gray-400 block text-[10px] uppercase font-black font-mono tracking-widest">NOME CIVIL</span>
                      <span className="text-black font-display text-3xl md:text-5xl leading-none uppercase">{selectedMember?.fullName}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border-l-4 border-mc-red pl-5">
                          <span className="text-gray-400 block text-[10px] uppercase font-black font-mono tracking-widest">POSTO OFICIAL</span>
                          <span className="text-black font-display text-4xl md:text-5xl leading-none uppercase">{selectedMember?.role}</span>
                        </div>
                        <div className="border-l-4 border-mc-red pl-5">
                          <span className="text-gray-400 block text-[10px] uppercase font-black font-mono tracking-widest">DATA DE INGRESSO</span>
                          <span className="text-black font-display text-4xl md:text-5xl leading-none">{selectedMember?.joinDate}</span>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-black/10 pb-2 font-mono">HISTÓRICO OPERACIONAL</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember?.roleHistory.map((h, i) => (
                      <div key={i} className="bg-mc-black text-white px-4 py-2 font-mono text-[10px] font-black uppercase border-2 border-mc-red shadow-brutal-small">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!selectedMemberId && <p className="text-center text-gray-400 text-[10px] font-mono font-black uppercase tracking-[0.5em] mt-12 mb-20 opacity-30">CUMPADRES DO BRASIL - MOTORCYCLE CLUB</p>}
    </div>
  );
};

export default Members;
