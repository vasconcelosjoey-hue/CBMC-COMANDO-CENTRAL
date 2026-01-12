
import React, { useState, useEffect, useCallback } from 'react';
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

  // FUNÇÃO DE ORDENAÇÃO REVERSA: JAKÃO (1º) -> MOCO -> NÚMEROS (MAIOR P/ MENOR) -> F4 (DESCRESCENTE) -> PERVERSO (ÚLTIMO)
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

      // Se ambos são numéricos, ordenar do MAIOR para o MENOR
      if (pA === 3) {
        return parseInt(b.cumbraId) - parseInt(a.cumbraId);
      }

      // Se ambos são F4, seguir a lógica de 01, 02 até Perverso ser o último (03)
      if (pA === 4) {
        const nA = parseInt(a.cumbraId.split('-')[1]);
        const nB = parseInt(b.cumbraId.split('-')[1]);
        // F4-01, F4-02, F4-03 (Perverso é 03)
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
