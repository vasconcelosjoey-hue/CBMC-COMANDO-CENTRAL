
import React from 'react';
import { Card, SectionTitle, Badge, BackButton } from '../components/UI';
import { Member, Role, PaymentStatus } from '../types';

interface PaymentsProps {
  userRole: Role;
  members: Member[];
  onBack: () => void;
}

const Payments: React.FC<PaymentsProps> = ({ userRole, members, onBack }) => {
  const isFinanceAdmin = [Role.TESOUREIRO, Role.PRESIDENTE, Role.VICE_PRESIDENTE].includes(userRole);
  const totalRevenue = members.length * 150;
  const currentRevenue = members.filter(m => m.paymentStatus === PaymentStatus.PAGO).length * 150;
  const deficit = totalRevenue - currentRevenue;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <SectionTitle title="TESOURARIA CB" subtitle="Controle de Mensalidades" />

      <Card className="bg-white border-black" shadowColor="red">
        <h3 className="text-[9px] font-black text-mc-red uppercase tracking-[0.4em] mb-4">FECHAMENTO INSTITUCIONAL</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-mc-yellow border-4 border-black p-4 shadow-brutal-red">
            <span className="text-black font-display text-7xl block leading-none">R${currentRevenue.toLocaleString()}</span>
            <span className="block text-[8px] text-black font-black uppercase mt-2 font-mono tracking-widest">FUNDOS CONFIRMADOS</span>
          </div>
          <div className="bg-black border-4 border-mc-red p-4 shadow-brutal-white">
            <span className="text-white font-display text-7xl block leading-none">R${deficit.toLocaleString()}</span>
            <span className="block text-[8px] text-mc-red font-black uppercase mt-2 font-mono tracking-widest">PENDENCIAS EM ABERTO</span>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <h3 className="text-[9px] font-black text-white uppercase tracking-[0.3em] bg-mc-red inline-block px-2 py-1 mb-2">LISTA DE PAGAMENTO</h3>
        <div className="space-y-1.5">
          {members.map(member => (
            <div key={member.id} className="bg-mc-gray border-2 border-white p-2.5 flex justify-between items-center hover:bg-white transition-colors group">
              <div className="flex flex-col">
                <span className="text-white font-display text-3xl font-normal group-hover:text-black leading-none">{member.name}</span>
                <span className="text-[8px] text-mc-red font-mono font-black uppercase group-hover:text-mc-red tracking-wider mt-0.5">{member.role}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge color={member.paymentStatus === PaymentStatus.PAGO ? 'green' : 'red'}>
                  {member.paymentStatus}
                </Badge>
                {isFinanceAdmin && (
                  <button className="bg-mc-red text-white font-black text-[9px] px-2 py-1 border-2 border-white hover:bg-black transition-all">
                    UPD
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
