
import React, { useState, useRef, useEffect } from 'react';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpdateProfilePhoto: (url: string) => void;
  onLogout: () => void;
  userRole: Role;
  userPhoto?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onUpdateProfilePhoto,
  onLogout,
  userRole, 
  userPhoto
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [brasiliaTime, setBrasiliaTime] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { 
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setBrasiliaTime(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'INÍCIO', icon: '01', smIcon: '🏠' },
    { id: 'members', label: 'EFETIVO', icon: '02', smIcon: '🏍️' },
    { id: 'presidency', label: 'COMANDO', icon: '03', smIcon: '⚖️' },
    { id: 'payments', label: 'TESOURARIA', icon: '04', smIcon: '💰' },
  ];

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-mono text-black">
      {/* HEADER FIXO */}
      <header className="fixed top-0 left-0 right-0 bg-mc-black border-b-4 border-mc-red z-[60] h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfileFileChange} />
          <div className="relative">
            <div className="absolute inset-0 bg-mc-red translate-x-1 translate-y-1"></div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black font-display text-2xl overflow-hidden cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all z-10"
            >
              {userPhoto ? <img src={userPhoto} alt="User" className="w-full h-full object-cover" /> : <span className="text-black font-black">CB</span>}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl md:text-4xl text-white leading-none tracking-[0.2em] uppercase truncate">
              COMANDO CENTRAL
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-mc-red border-2 border-white p-2 text-white shadow-brutal-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ml-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={3} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>

      {/* DRAWER LATERAL (DESKTOP E ALTERNATIVO) */}
      <div className={`fixed inset-0 bg-mc-red/20 backdrop-invert z-[70] transition-all duration-200 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`absolute right-0 top-0 h-full w-full md:w-[450px] bg-mc-black border-l-4 border-white p-6 md:p-10 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-12 pt-16 border-b-2 border-white pb-6 text-white">
            <p className="text-mc-red text-[12px] font-black tracking-[0.4em] mb-2 font-mono uppercase">COMANDO GERAL</p>
            <p className="text-white font-display text-5xl uppercase leading-none tracking-widest">MENU TÁTICO</p>
          </div>
          
          <nav className="space-y-4 pb-20">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-4 border-2 transition-all group shadow-brutal-small ${
                  activeTab === item.id 
                    ? 'bg-mc-red border-white text-white translate-x-2' 
                    : 'bg-mc-black border-mc-red text-mc-red hover:bg-mc-red/10 hover:border-white hover:text-white'
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] md:text-[12px] font-black font-mono opacity-80">[{item.icon}]</span>
                  <span className="font-display text-4xl tracking-widest leading-none">{item.label}</span>
                </div>
                <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 mt-16 pb-32 md:pb-24 px-4 pt-6 md:px-12 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* FOOTER STATUS (DESKTOP) */}
      <footer className="hidden md:flex bg-black border-t-4 border-mc-red p-4 flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-mc-green rounded-full animate-pulse"></div>
           <span className="text-white font-mono text-[10px] uppercase font-black tracking-widest">SERVER CLOUD ATIVO</span>
        </div>
        <div className="bg-mc-red px-4 py-1 border-2 border-white shadow-brutal-white">
           <span className="text-white font-mono text-xs font-black">HORÁRIO BRASÍLIA: {brasiliaTime}</span>
        </div>
        <div className="text-gray-600 font-mono text-[10px] uppercase">
          CBMC ADMIN v4.5.0
        </div>
      </footer>

      {/* MOBILE APP NAV BAR (O MENU QUE VOCÊ PRECISA) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-mc-black border-t-4 border-mc-red z-[100] h-20 flex items-center justify-around px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all active:scale-95 ${
              activeTab === item.id 
                ? 'text-mc-red font-black border-b-4 border-mc-red mb-[-4px] bg-mc-red/5' 
                : 'text-white opacity-60'
            }`}
          >
            <span className="text-2xl">{item.smIcon}</span>
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.1em]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
