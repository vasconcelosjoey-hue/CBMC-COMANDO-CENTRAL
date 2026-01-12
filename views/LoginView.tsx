
import React, { useState } from 'react';
import { db } from '../firebase.ts';
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
  const [showRepairGuide, setShowRepairGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      const docRef = doc(db, "config", "acesso");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let expectedKey = targetArea === 'payments' ? data.tesouraria : data.presidencia;

        if (key === expectedKey) {
          onSuccess();
        } else {
          throw new Error("Chave inválida");
        }
      } else {
        // Fallback Master Key
        if (key === 'CBMC2026') onSuccess();
        else throw new Error("Acesso negado");
      }
    } catch (err: any) {
      // Fallback de emergência local para garantir que o clube não fique travado
      if (key === 'CBMC2026') {
        onSuccess();
      } else {
        setError(true);
        if (err.code === 'permission-denied') setShowRepairGuide(true);
        setTimeout(() => setError(false), 800);
        setKey('');
      }
    } finally {
      setLoading(false);
    }
  };

  const rulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md my-auto">
        {showRepairGuide ? (
          <div className="bg-black border-[6px] border-mc-red p-6 shadow-[12px_12px_0px_#000] animate-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-mc-red font-display text-3xl uppercase mb-4 leading-none font-bold">🛠️ DIAGNÓSTICO DO BANCO</h3>
            <p className="text-white font-mono text-[10px] uppercase mb-4 opacity-70">
              O FIREBASE BLOQUEOU O ACESSO. COPIE AS REGRAS ABAIXO E COLE NA ABA "RULES" DO SEU FIRESTORE NO CONSOLE DO GOOGLE.
            </p>
            <div className="bg-zinc-900 p-4 border-2 border-zinc-700 font-mono text-[10px] text-mc-green overflow-x-auto whitespace-pre mb-6 select-all">
              {rulesCode}
            </div>
            <button 
              onClick={() => setShowRepairGuide(false)}
              className="w-full bg-mc-red text-white font-display text-2xl py-3 border-2 border-white shadow-brutal-white uppercase font-bold"
            >
              ENTENDI, VOLTAR
            </button>
          </div>
        ) : (
          <div className={`bg-white border-[6px] border-black p-8 md:p-10 shadow-[16px_16px_0px_#ff0000] relative transition-all duration-300 ${error ? 'translate-x-2 bg-red-50' : ''}`}>
            <div className="text-center mb-8">
              <div className="inline-block bg-mc-red text-white w-20 h-20 flex items-center justify-center border-4 border-black mb-6 shadow-[6px_6px_0px_#000] -rotate-2">
                <span className="font-display text-7xl leading-none font-black italic">!</span>
              </div>
              <h2 className="text-black font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-4 font-bold">
                ACESSO<br/>RESTRITO
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-black font-mono text-[9px] font-black uppercase tracking-[0.4em] text-center opacity-60">
                  CHAVE DE COMANDO EXIGIDA
                </label>
                <input 
                  type="password"
                  autoFocus
                  disabled={loading}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black p-4 text-black font-mono text-center text-3xl focus:bg-white focus:border-mc-red outline-none transition-all placeholder:opacity-10 shadow-inner disabled:opacity-50"
                  placeholder="••••"
                />
              </div>

              {error && (
                <div className="bg-mc-red text-white p-3 border-4 border-black text-center shadow-[4px_4px_0px_#000] animate-pulse">
                  <p className="font-mono text-xs font-black uppercase tracking-widest">
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
                  className="w-full text-zinc-400 font-mono text-[9px] font-black py-2 uppercase hover:text-black transition-all tracking-[0.2em] border-t-2 border-black/5 mt-4"
                >
                  ← ABORTAR OPERAÇÃO
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;
