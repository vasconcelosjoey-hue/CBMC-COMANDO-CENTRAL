
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

  // FUNÇÃO DE ORDENAÇÃO INSTITUCIONAL OFICIAL
  const sortMembers = useCallback((list: Member[]) => {
    return [...list].sort((a, b) => {
      const getPriority = (m: Member) => {
        if (m.cumbraId.startsWith('F4-')) return 1; // Fundadores
        const num = parseInt(m.cumbraId);
        if (!isNaN(num)) return 2; // Efetivos Numéricos
        return 3; // Prósperos (Moco e Jakão)
      };

      const pA = getPriority(a);
      const pB = getPriority(b);

      if (pA !== pB) return pA - pB;

      // Ordem interna para Fundadores (F4-01, F4-02...)
      if (pA === 1) {
        const numA = parseInt(a.cumbraId.split('-')[1]);
        const numB = parseInt(b.cumbraId.split('-')[1]);
        return numA - numB;
      }

      // Ordem interna para Efetivos (numérica: 10, 11, 12...)
      if (pA === 2) {
        return parseInt(a.cumbraId) - parseInt(b.cumbraId);
      }

      // Ordem específica para Prósperos: MOCO depois JAKÃO
      if (a.name === 'MOCO') return -1;
      if (b.name === 'MOCO') return 1;
      if (a.name === 'JAKÃO') return 1;
      if (b.name === 'JAKÃO') return -1;
      
      return a.name.localeCompare(b.name);
    });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "members_data", "current"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().list || MOCK_MEMBERS;
        setMembers(sortMembers(data));
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
      console.error("Erro ao atualizar Brasão na nuvem:", e);
    }
  };

  const handleUpdatePhoto = async (memberId: string, newPhotoUrl: string) => {
    const updatedMembers = members.map(m => m.id === memberId ? { ...m, photoUrl: newPhotoUrl } : m);
    const sorted = sortMembers(updatedMembers);
    try {
      await setDoc(doc(db, "members_data", "current"), { list: sorted });
    } catch (e) {
      console.error("Erro ao sincronizar foto de perfil:", e);
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
      case 'dashboard': return <Dashboard heroImage={heroImage} onUpdateHero={handleUpdateHero} userRole={currentUser.role} onBack={handleLogout} />;
      case 'presidency': return <Presidency userRole={currentUser.role} onBack={() => setActiveTab('dashboard')} onNavigateToAnnualChecklist={() => handleTabChange('annual-checklist')} />;
      case 'annual-checklist': return <AnnualChecklist members={members} userRole={currentUser.role} onBack={() => setActiveTab('presidency')} />;
      case 'announcements': return <Announcements userRole={currentUser.role} onBack={() => setActiveTab('dashboard')} />;
      case 'members': return <Members userRole={currentUser.role} currentUserId={currentUser.id} members={members} onUpdatePhoto={handleUpdatePhoto} onBack={() => setActiveTab('dashboard')} />;
      case 'payments': return <Payments userRole={currentUser.role} members={members} onBack={() => setActiveTab('dashboard')} />;
      case 'checklists': return <Checklists onBack={() => setActiveTab('dashboard')} />;
      case 'calendar': return <Calendar onBack={() => setActiveTab('dashboard')} />;
      case 'archive': return <Archive onBack={() => setActiveTab('dashboard')} />;
      default: return <Dashboard heroImage={heroImage} onUpdateHero={handleUpdateHero} userRole={currentUser.role} onBack={handleLogout} />;
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
