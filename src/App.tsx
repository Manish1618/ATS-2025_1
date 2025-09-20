import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import { AdminProvider } from './contexts/AdminContext';
import AuthForm from './components/auth/AuthForm';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import ProfileCard from './components/profile/ProfileCard';
import TaskList from './components/tasks/TaskList';
import RewardStore from './components/rewards/RewardStore';
import WalletOverview from './components/wallet/WalletOverview';
import StreakTracker from './components/streaks/StreakTracker';
import AchievementsList from './components/achievements/AchievementsList';
import AdminDashboard from './components/admin/AdminDashboard';
import { useAdmin } from './contexts/AdminContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user) {
      setActiveTab('dashboard');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
            <ProfileCard />
          </div>
        );
      case 'tasks':
        return <TaskList />;
      case 'rewards':
        return <RewardStore />;
      case 'wallet':
        return <WalletOverview />;
      case 'streaks':
        return <StreakTracker />;
      case 'achievements':
        return <AchievementsList />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <AdminProvider>
          <AppContent />
        </AdminProvider>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;