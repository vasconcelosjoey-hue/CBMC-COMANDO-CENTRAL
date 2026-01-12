
import React, { useState, useEffect } from 'react';
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

const STORAGE_KEYS = {
  MEMBERS: 'cbmc_members_data_v1',
  AUTH: 'cbmc_authenticated_areas_v1',
  HERO: 'cbmc_hero_image_v1'
};

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : MOCK_MEMBERS;
    } catch {
      return MOCK_MEMBERS;
    }
  });

  const [heroImage, setHeroImage] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.HERO);
  });

  const [currentUser, setCurrentUser] = useState<Member>(members[2]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [authenticatedAreas, setAuthenticatedAreas] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  const [pendingTab, setPendingTab] = useState<string | null>(null);

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
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, photoUrl: newPhotoUrl } : m));
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
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

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
