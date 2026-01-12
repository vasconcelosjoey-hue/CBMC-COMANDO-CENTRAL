
import React, { useState, useRef } from 'react';
import { Card, SectionTitle, Badge, BackButton } from '../components/UI';
import { Member, Role } from '../types';

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
  
  const sortedMembers = [...members].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const selectedMember = members.find(m => m.id === selectedMemberId);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {!selectedMemberId ? (
        <>
          <BackButton onClick={onBack} />
          <SectionTitle title="RELAÇÃO EFETIVO" subtitle="Antiguidade e Postos" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedMembers.map(member => (
              <div 
                key={member.id} 
                className="bg-mc-gray border-2 border-white p-3 cursor-pointer hover:bg-mc-red hover:translate-x-1 hover:-translate-y-1 hover:shadow-brutal-white transition-all group"
                onClick={() => setSelectedMemberId(member.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-black text-white font-mono font-black text-[10px] border-2 border-mc-red">
                    {member.cumbraId}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-3xl text-white group-hover:text-black leading-none">{member.name}</h4>
                    <p className="text-[9px] text-mc-red font-mono font-black uppercase tracking-widest mt-0.5 group-hover:text-white">
                      {member.role}
                    </p>
                  </div>
                  <Badge color={member.status === 'Ativo' ? 'green' : 'gray'}>{member.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <BackButton onClick={() => setSelectedMemberId(null)} label="VOLTAR À LISTAGEM" />
          
          <Card className="relative overflow-hidden p-0 bg-white" shadowColor="red">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-6 bg-black flex flex-col items-center border-b-4 md:border-b-0 md:border-r-4 border-mc-red">
                <div className="relative group mb-4">
                  <div className="w-40 h-40 border-4 border-mc-red overflow-hidden bg-mc-gray shadow-brutal-red">
                    <img src={selectedMember?.photoUrl} className="w-full h-full object-cover grayscale" />
                  </div>
                  {selectedMember?.id === currentUserId && (
                    <button 
                      onClick={triggerFileInput}
                      className="absolute inset-0 bg-mc-red/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white font-black p-4 transition-opacity border-4 border-white mb-0"
                    >
                      <span className="text-[10px] uppercase tracking-widest text-center">Alterar Foto</span>
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
                
                <h2 className="text-5xl font-display text-white text-center leading-none">{selectedMember?.name}</h2>
                <p className="text-mc-red font-mono font-black uppercase text-[10px] tracking-widest mt-2">ID {selectedMember?.cumbraId}</p>
              </div>

              <div className="p-6 col-span-2 space-y-6">
                <div>
                  <h3 className="text-mc-red font-black text-[9px] uppercase tracking-[0.3em] mb-4">CADASTRO CBMC</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border-l-2 border-black pl-3">
                      <span className="text-gray-400 block text-[9px] uppercase font-black font-mono">NOME COMPLETO</span>
                      <span className="text-black font-display text-2xl leading-none">{selectedMember?.fullName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-l-2 border-black pl-3">
                        <span className="text-gray-400 block text-[9px] uppercase font-black font-mono">POSTO</span>
                        <span className="text-black font-display text-3xl leading-none">{selectedMember?.role}</span>
                        </div>
                        <div className="border-l-2 border-black pl-3">
                        <span className="text-gray-400 block text-[9px] uppercase font-black font-mono">DATA INGRESSO</span>
                        <span className="text-black font-display text-3xl leading-none">{selectedMember?.joinDate}</span>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-black/10 pb-1 font-mono">REGISTRO HISTÓRICO</h4>
                  <div className="space-y-1">
                    {selectedMember?.roleHistory.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 bg-black/5 p-1.5 font-mono text-xs font-bold text-black border-l-2 border-mc-red uppercase">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Members;
