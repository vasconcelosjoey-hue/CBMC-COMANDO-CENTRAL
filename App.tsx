
import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [currentUser, setCurrentUser] = useState<Member>(members[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [heroImage, setHeroImage] = useState<string | null>(null);
  
  // Controle de autenticação por área específica
  const [authenticatedAreas, setAuthenticatedAreas] = useState<Set<string>>(new Set());
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const handleUpdatePhoto = (memberId: string, newPhotoUrl: string) => {
    const updatedMembers = members.map(m => 
      m.id === memberId ? { ...m, photoUrl: newPhotoUrl } : m
    );
    setMembers(updatedMembers);
    
    if (currentUser.id === memberId) {
      setCurrentUser({ ...currentUser, photoUrl: newPhotoUrl });
    }
  };

  const handleTabChange = (tab: string) => {
    const restrictedTabs = ['presidency', 'payments', 'annual-checklist'];
    
    // Verifica se a aba é restrita e se já foi autenticada nesta sessão
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

  const backToDashboard = () => handleTabChange('dashboard');
  const backToPresidency = () => handleTabChange('presidency');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <Dashboard 
          heroImage={heroImage} 
          onUpdateHero={setHeroImage} 
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
      default: return (
        <Dashboard 
          heroImage={heroImage} 
          onUpdateHero={setHeroImage} 
          userRole={currentUser.role} 
        />
      );
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
        userRole={currentUser.role} 
        userPhoto={currentUser.photoUrl}
      >
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
