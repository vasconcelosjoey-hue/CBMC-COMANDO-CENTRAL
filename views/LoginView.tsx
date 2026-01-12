
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface LoginViewProps {
  onSuccess: () => void;
  onCancel: () => void;
  targetArea: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onCancel, targetArea }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      // Busca as chaves oficiais no Firestore
      const docRef = doc(db, "config", "acesso");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let expectedKey = "";

        // Define qual senha validar baseado na área
        if (targetArea === 'payments') {
          expectedKey = data.tesouraria;
        } else {
          // presidency e annual-checklist usam a chave da presidência
          expectedKey = data.presidencia;
        }

        if (key === expectedKey) {
          onSuccess();
        } else {
          throw new Error("Chave inválida");
        }
      } else {
        console.error("Configuração de acesso não encontrada no Firebase.");
        // Fallback de segurança caso o banco falhe
        if (key === 'CBMC2026') onSuccess();
        else throw new Error("Erro de banco");
      }
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 800);
      setKey('');
    } finally {
      setLoading(false);
    }
  };

  const getAreaName = () => {
    switch(targetArea) {
      case 'presidency': return 'GABINETE DA PRESIDÊNCIA';
      case 'payments': return 'TESOURARIA (FINANCEIRO)';
      case 'annual-checklist': return 'CONTROLE DE FREQUÊNCIA ANUAL';
      default: return 'ÁREA RESTRITA';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center p-4">
      {/* Marcas d'água de segurança */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden flex flex-wrap gap-12 p-10 select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="text-black font-display text-5xl rotate-12 whitespace-nowrap font-bold">RESTRITO CBMC</span>
        ))}
      </div>

      <div className={`w-full max-w-md bg-white border-[6px] border-black p-8 md:p-10 shadow-[16px_16px_0px_#ff0000] relative transition-all duration-300 ${error ? 'translate-x-2 bg-red-50' : ''}`}>
        <div className="text-center mb-8">
          <div className="inline-block bg-mc-red text-white w-24 h-24 flex items-center justify-center border-4 border-black mb-6 shadow-[6px_6px_0px_#000] -rotate-2">
            <span className="font-display text-8xl leading-none font-black italic">!</span>
          </div>
          
          <h2 className="text-black font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4 font-bold">
            ACESSO<br/>RESTRITO
          </h2>
          
          <div className="bg-black text-white px-4 py-2 inline-block">
            <p className="font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
              {getAreaName()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-black font-mono text-[10px] font-black uppercase tracking-[0.4em] text-center opacity-60">
              CHAVE DE COMANDO EXIGIDA
            </label>
            <input 
              type="password"
              autoFocus
              disabled={loading}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-gray-100 border-4 border-black p-5 text-black font-mono text-center text-3xl focus:bg-white focus:border-mc-red outline-none transition-all placeholder:opacity-10 shadow-inner disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-mc-red text-white p-3 border-4 border-black text-center shadow-[4px_4px_0px_#000]">
              <p className="font-mono text-xs font-black uppercase">
                [ ACESSO NEGADO ]
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-mc-red text-white font-display text-4xl py-5 border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all uppercase active:bg-black font-bold disabled:bg-zinc-800"
            >
              {loading ? 'VALIDANDO...' : 'DESBLOQUEAR'}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full text-zinc-400 font-mono text-[10px] font-black py-2 uppercase hover:text-black transition-all tracking-[0.2em] border-t-2 border-black/5 mt-4"
            >
              ← CANCELAR OPERAÇÃO
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t-4 border-black/5 text-center">
          <p className="text-black font-mono text-[9px] font-bold uppercase tracking-widest leading-tight opacity-30 italic">
            "SÓ O QUE É DE DIREITO PERMANECE."
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
