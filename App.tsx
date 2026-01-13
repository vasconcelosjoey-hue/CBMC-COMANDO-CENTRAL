
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Role, Member } from './types.ts';
import { MOCK_MEMBERS } from './constants.ts';
import Layout from './components/Layout.tsx';
import Dashboard from './views/Dashboard.tsx';
import Announcements from './views/Announcements.tsx';
import Members from './views/Members.tsx';
import Payments from './views/Payments.tsx';
import Calendar from './views/Calendar.tsx';
import Archive from './views/Archive.tsx';
import Checklists from './views/Checklists.tsx';
import Presidency from './views/Presidency.tsx';
import AnnualChecklist from './views/AnnualChecklist.tsx';
import LoginView from './views/LoginView.tsx';
import { db } from './firebase.ts';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Member>(MOCK_MEMBERS[2]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authenticatedAreas, setAuthenticatedAreas] = useState<Set<string>>(new Set());
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ==========================================
  // CONFIGURAÇÃO DE ÁUDIO (CBMC RADIO)
  // ==========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // COLE O LINK DO SEU MP3 DO FIREBASE ABAIXO:
  const AUDIO_URL = "https://firebasestorage.googleapis.com/v0/b/cbmc-comando-central.firebasestorage.app/o/SUA_MUSICA.mp3?alt=media";

  const toggleAudio = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Erro ao tocar: O navegador exige um clique antes.", err);
            alert("Clique em 'LIGAR SOM' para iniciar a rádio CBMC!");
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const sortMembers = useCallback((list: Member[]) => {
    return [...list].sort((a, b) => {
      const getPriority = (m: Member) => {
        if (m.name === 'JAKÃO') return 1;
        if (m.name === 'MOCO') return 2;
        const num = parseInt(m.cumbraId);
        if (!isNaN(num)) return 3;
        if (m.cumbraId.startsWith('F4-')) return 4;
        return 5;
      };
      const pA = getPriority(a);
      const pB = getPriority(b);
      if (pA !== pB) return pA - pB;
      if (pA === 3) return parseInt(b.cumbraId) - parseInt(a.cumbraId);
      if (pA === 4) {
        const nA = parseInt(a.cumbraId.split('-')[1]);
        const nB = parseInt(b.cumbraId.split('-')[1]);
        return nA - nB;
      }
      return a.name.localeCompare(b.name);
    });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "members_data", "current"), (docSnap) => {
      if (docSnap.exists()) {
        setMembers(docSnap.data().list || []);
      } else {
        const sortedMock = sortMembers(MOCK_MEMBERS);
        setMembers(sortedMock);
        setDoc(doc(db, "members_data", "current"), { list: sortedMock });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [sortMembers]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "dashboard", "images"), (docSnap) => {
      if (docSnap.exists()) {
        setHeroImage(docSnap.data().hero || null);
      }
    });
    return () => unsub();
  }, []);

  const handleUpdateHero = async (url: string | null) => {
    try {
      await setDoc(doc(db, "dashboard", "images"), { hero: url }, { merge: true });
    } catch (e) {
      console.error("Erro ao atualizar Brasão:", e);
    }
  };

  const handleUpdatePhoto = async (memberId: string, newPhotoUrl: string) => {
    const updatedMembers = members.map(m => m.id === memberId ? { ...m, photoUrl: newPhotoUrl } : m);
    try {
      await setDoc(doc(db, "members_data", "current"), { list: updatedMembers });
    } catch (e) {
      console.error("Erro ao sincronizar foto:", e);
    }
  };

  const handleUpdateRoster = async (newList: Member[]) => {
    setMembers(newList);
    try {
      await setDoc(doc(db, "members_data", "current"), { list: newList });
    } catch (e) {
      console.error("Erro ao salvar nova ordem de rodízio:", e);
    }
  };

  const handleTabChange = (tab: string) => {
    const restrictedTabs = ['presidency', 'payments', 'annual-checklist'];
    if (restrictedTabs.includes(tab) && !authenticatedAreas.has(tab)) {
      setPendingTab(tab);
    } else {
      setActiveTab(tab);
      setPendingTab(null);
    }
  };

  const onLoginSuccess = (area: string) => {
    setAuthenticatedAreas(prev => new Set(prev).add(area));
    setActiveTab(area);
    setPendingTab(null);
  };

  const handleLogout = () => {
    setAuthenticatedAreas(new Set());
    setActiveTab('dashboard');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-mc-red border-t-transparent animate-spin mb-4"></div>
      <span className="font-mono text-mc-red font-black tracking-[0.3em] uppercase">Sincronizando Comando Central...</span>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <Dashboard 
          members={members} 
          heroImage={heroImage} 
          onUpdateHero={handleUpdateHero} 
          onUpdateRoster={handleUpdateRoster}
          userRole={currentUser.role} 
          onBack={handleLogout} 
        />
      );
      case 'presidency': return <Presidency userRole={currentUser.role} onBack={() => setActiveTab('dashboard')} onNavigateToAnnualChecklist={() => handleTabChange('annual-checklist')} />;
      case 'annual-checklist': return <AnnualChecklist members={members} userRole={currentUser.role} onBack={() => setActiveTab('presidency')} />;
      case 'announcements': return <Announcements userRole={currentUser.role} onBack={() => setActiveTab('dashboard')} />;
      case 'members': return <Members userRole={currentUser.role} currentUserId={currentUser.id} members={members} onUpdatePhoto={handleUpdatePhoto} onBack={() => setActiveTab('dashboard')} />;
      case 'payments': return <Payments userRole={currentUser.role} members={members} onBack={() => setActiveTab('dashboard')} />;
      case 'checklists': return <Checklists onBack={() => setActiveTab('dashboard')} />;
      case 'calendar': return <Calendar onBack={() => setActiveTab('dashboard')} />;
      case 'archive': return <Archive onBack={() => setActiveTab('dashboard')} />;
      default: return <Dashboard members={members} heroImage={heroImage} onUpdateHero={handleUpdateHero} onUpdateRoster={handleUpdateRoster} userRole={currentUser.role} onBack={handleLogout} />;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_URL} loop />

      {/* BOTÃO DE RÁDIO CBMC */}
      <button 
        onClick={toggleAudio}
        className={`fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[110] border-4 p-3 shadow-brutal-white active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 group ${
          isPlaying ? 'bg-mc-green border-black' : 'bg-black border-mc-red'
        }`}
      >
        <div className="flex flex-col items-end">
          <span className={`font-mono text-[9px] font-black uppercase tracking-widest hidden group-hover:block ${isPlaying ? 'text-black' : 'text-white'}`}>
            {isPlaying ? 'DESLIGAR ÁUDIO' : 'ATIVAR ÁUDIO'}
          </span>
          <span className={`font-mono text-[7px] font-bold uppercase opacity-60 hidden group-hover:block ${isPlaying ? 'text-black' : 'text-mc-red'}`}>
            OFFICIAL CBMC RADIO
          </span>
        </div>
        <span className="text-2xl">{isPlaying ? '🔊' : '🔇'}</span>
        {isPlaying && (
          <div className="flex gap-0.5 items-end h-5 pb-1">
             <div className="w-1 bg-black animate-bounce" style={{animationDuration: '0.4s', height: '60%'}}></div>
             <div className="w-1 bg-black animate-bounce" style={{animationDuration: '0.7s', height: '100%'}}></div>
             <div className="w-1 bg-black animate-bounce" style={{animationDuration: '0.5s', height: '80%'}}></div>
             <div className="w-1 bg-black animate-bounce" style={{animationDuration: '0.9s', height: '40%'}}></div>
          </div>
        )}
      </button>

      {pendingTab && (
        <LoginView 
          targetArea={pendingTab} 
          onSuccess={() => onLoginSuccess(pendingTab)} 
          onCancel={() => setPendingTab(null)} 
        />
      )}
      <Layout 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        onUpdateProfilePhoto={(url) => handleUpdatePhoto(currentUser.id, url)}
        onLogout={handleLogout}
        userRole={currentUser.role} 
        userPhoto={members.find(m => m.id === currentUser.id)?.photoUrl}
      >
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
