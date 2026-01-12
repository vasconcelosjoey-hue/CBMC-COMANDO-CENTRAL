
import React, { useState } from 'react';

interface LoginViewProps {
  onSuccess: () => void;
  onCancel: () => void;
  targetArea: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onCancel, targetArea }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Senhas específicas conforme solicitado
    const PASSWORDS: Record<string, string> = {
      'presidency': 'cbmcpres2008',
      'annual-checklist': 'cbmcpres2008',
      'payments': 'cbmcteou2008'
    };

    const expectedKey = PASSWORDS[targetArea] || 'CBMC2026';

    if (key === expectedKey) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setKey('');
    }
  };

  const getAreaName = () => {
    switch(targetArea) {
      case 'presidency': return 'GABINETE DA PRESIDÊNCIA';
      case 'payments': return 'TESOURARIA (FINANCEIRO)';
      case 'annual-checklist': return 'FREQUÊNCIA ANUAL';
      default: return 'ÁREA RESTRITA';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background Decorativo - Padrão de segurança claro */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex flex-wrap gap-10 p-10 select-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="text-black font-display text-4xl rotate-12 whitespace-nowrap">ACESSO RESTRITO CBMC</span>
        ))}
      </div>

      <div className={`w-full max-w-md bg-white border-[6px] border-black p-8 md:p-10 shadow-[12px_12px_0px_#ff0000] relative transition-transform ${error ? 'animate-bounce' : ''}`}>
        <div className="text-center mb-10">
          <div className="inline-block bg-mc-red text-white w-20 h-20 flex items-center justify-center border-4 border-black mb-6 shadow-[4px_4px_0px_#000] -rotate-3">
            <span className="font-display text-7xl leading-none font-bold">!</span>
          </div>
          
          <h2 className="text-black font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-4">
            ACESSO<br/>RESTRITO
          </h2>
          
          <div className="bg-black text-white px-4 py-2 inline-block">
            <p className="font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              {getAreaName()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-black font-mono text-[10px] font-black uppercase tracking-[0.3em] text-center">
              INSIRA A CHAVE DE COMANDO
            </label>
            <input 
              type="password"
              autoFocus
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-gray-50 border-4 border-black p-5 text-black font-mono text-center text-3xl focus:bg-mc-yellow/10 focus:border-mc-red outline-none transition-all placeholder:opacity-10"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-mc-red text-white p-3 border-2 border-black animate-pulse text-center">
              <p className="font-mono text-xs font-black uppercase">
                [ ACESSO NEGADO ]
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              className="w-full bg-mc-red text-white font-display text-4xl py-5 border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase active:bg-black"
            >
              AUTENTICAR
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full text-gray-400 font-mono text-[10px] font-black py-2 uppercase hover:text-mc-red transition-all tracking-widest"
            >
              ← ABORTAR OPERAÇÃO
            </button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t-2 border-black/10 text-center">
          <p className="text-black font-mono text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-tight opacity-40 italic">
            "A DISCIPLINA É A ALMA DE UM EXÉRCITO. TORNA GRANDES OS PEQUENOS CONTINGENTES E PROPORCIONA O SUCESSO AOS FRACOS."
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
