
import React, { useState, useEffect } from 'react';
import { Role, Member } from './types';
import { MOCK_MEMBERS } from './constants';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Announcements from './views/Announcements';
import Members from './views/Members';
import Payments from './views/Payments';
import Calendar from './views/Calendar';
import Archive from './views/Archive';
import Checklists from './views/Checklists';
import Presidency from './views/Presidency';
import AnnualChecklist from './views/AnnualChecklist';
import LoginView from './views/LoginView';

const STORAGE_KEYS = {
  MEMBERS: 'cbmc_members_data_v1',
  AUTH: 'cbmc_authenticated_areas_v1',
  HERO: 'cbmc_hero_image_v1'
};

const App: React.FC = () => {
  // Inicialização com persistência
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : MOCK_MEMBERS;
  });

  const [heroImage, setHeroImage] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.HERO);
  });

  const [currentUser, setCurrentUser] = useState<Member>(members[2]); // Default: Perverso (Presidente) para fins de demo
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [authenticatedAreas, setAuthenticatedAreas] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  // Sincronizar dados quando mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(Array.from(authenticatedAreas)));
  }, [authenticatedAreas]);

  const handleUpdateHero = (url: string | null) => {
    setHeroImage(url);
    if (url) localStorage.setItem(STORAGE_KEYS.HERO, url);
    else localStorage.removeItem(STORAGE_KEYS.HERO);
  };

  const handleUpdatePhoto = (memberId: string, newPhotoUrl: string) => {
    setMembers(prev => {
      const updated = prev.map(m => m.id === memberId ? { ...m, photoUrl: newPhotoUrl } : m);
      return updated;
    });
    
    if (currentUser.id === memberId) {
      setCurrentUser(prev => ({ ...prev, photoUrl: newPhotoUrl }));
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
    setAuthenticatedAreas(prev => {
      const next = new Set(prev).add(area);
      return next;
    });
    setActiveTab(area);
    setPendingTab(null);
  };

  const handleLogout = () => {
    setAuthenticatedAreas(new Set());
    setActiveTab('dashboard');
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const backToDashboard = () => handleTabChange('dashboard');
  const backToPresidency = () => handleTabChange('presidency');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <Dashboard 
          heroImage={heroImage} 
          onUpdateHero={handleUpdateHero} 
          userRole={currentUser.role} 
        />
      );
      case 'presidency': return (
        <Presidency 
          userRole={currentUser.role} 
          onBack={backToDashboard} 
          onNavigateToAnnualChecklist={() => handleTabChange('annual-checklist')}
        />
      );
      case 'annual-checklist': return <AnnualChecklist members={members} userRole={currentUser.role} onBack={backToPresidency} />;
      case 'announcements': return <Announcements userRole={currentUser.role} onBack={backToDashboard} />;
      case 'members': return (
        <Members 
          userRole={currentUser.role} 
          currentUserId={currentUser.id}
          members={members}
          onUpdatePhoto={handleUpdatePhoto}
          onBack={backToDashboard}
        />
      );
      case 'payments': return <Payments userRole={currentUser.role} members={members} onBack={backToDashboard} />;
      case 'checklists': return <Checklists onBack={backToDashboard} />;
      case 'calendar': return <Calendar onBack={backToDashboard} />;
      case 'archive': return <Archive onBack={backToDashboard} />;
      default: return <Dashboard heroImage={heroImage} onUpdateHero={handleUpdateHero} userRole={currentUser.role} />;
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
