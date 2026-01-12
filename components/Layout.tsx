
import React, { useState, useRef } from 'react';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpdateProfilePhoto: (url: string) => void;
  userRole: Role;
  userPhoto?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onUpdateProfilePhoto, 
  userRole, 
  userPhoto
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'PÁGINA INICIAL', icon: '01', smIcon: '🏠' },
    { id: 'presidency', label: 'PRESIDÊNCIA', icon: '02', smIcon: '⚖️' },
    { id: 'members', label: 'EFETIVO', icon: '03', smIcon: '🏍️' },
    { id: 'announcements', label: 'INFORMES', icon: '04', smIcon: '📢' },
    { id: 'payments', label: 'TESOURARIA', icon: '05', smIcon: '💰' },
    { id: 'checklists', label: 'CHECKLISTS', icon: '06', smIcon: '📋' },
    { id: 'calendar', label: 'AGENDA', icon: '07', smIcon: '📅' },
    { id: 'archive', label: 'ACERVO', icon: '08', smIcon: '📁' },
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

  const mobileNavItems = [
    menuItems[0], // Dashboard
    menuItems[1], // Presidency
    menuItems[2], // Efetivo
    menuItems[3], // Announcements
    menuItems[4], // Payments
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-mono text-black">
      <header className="fixed top-0 left-0 right-0 bg-mc-black border-b-4 border-mc-red z-50 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfileFileChange} />
          <div className="relative">
            <div className="absolute inset-0 bg-mc-red translate-x-1 translate-y-1"></div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black font-display text-2xl overflow-hidden cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all z-10"
            >
              {userPhoto ? <img src={userPhoto} alt="User" className="w-full h-full object-cover grayscale" /> : <span className="text-black font-black">CB</span>}
            </div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-display text-[18px] md:text-[34px] text-white leading-none tracking-widest uppercase truncate">
              CUMPADRES DO BRASIL - <span className="text-mc-red">COMANDO CENTRAL</span>
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

      <div className={`fixed inset-0 bg-mc-red/20 backdrop-invert z-40 transition-all duration-200 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`absolute right-0 top-0 h-full w-full md:w-[450px] bg-mc-black border-l-4 border-white p-6 md:p-10 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-12 pt-16 border-b-2 border-white pb-6 text-white">
            <p className="text-mc-red text-[12px] font-black tracking-[0.4em] mb-2 font-mono uppercase">AUTH LEVEL</p>
            <p className="text-white font-display text-5xl uppercase leading-none tracking-widest">{userRole}</p>
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

          <div className="sticky bottom-0 bg-mc-black pt-4 pb-6 border-t-2 border-white mt-8">
            <button className="w-full py-5 border-4 border-mc-red bg-mc-black text-mc-red font-display text-3xl hover:bg-mc-red hover:text-white transition-all uppercase shadow-brutal-white active:shadow-none active:translate-x-1 active:translate-y-1">
              LOGOUT SESSION
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 mt-16 pb-24 px-4 pt-6 md:px-12 max-w-6xl mx-auto w-full">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-mc-black border-t-4 border-mc-red z-50 h-16 grid grid-cols-5 md:hidden">
        {mobileNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === item.id 
                ? 'bg-mc-red text-white' 
                : 'text-mc-red hover:bg-mc-red/10'
            }`}
          >
            <span className="text-lg">{item.smIcon}</span>
            <span className="font-display text-[10px] mt-0.5 tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      <footer className="hidden md:flex fixed bottom-0 left-0 right-0 h-8 bg-mc-red border-t-2 border-white z-50 px-4 items-center justify-between overflow-hidden">
        <div className="flex items-center gap-4">
          <span className="text-black text-[10px] font-black tracking-widest uppercase truncate animate-pulse">STATUS: CUMPADRES DO BRASIL // CONNECTED</span>
        </div>
        <span className="text-black text-[10px] font-black">CBMC CORE v3</span>
      </footer>
    </div>
  );
};

export default Layout;
