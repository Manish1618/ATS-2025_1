import React from 'react';
import { 
  Home, 
  User, 
  CheckSquare, 
  ShoppingCart, 
  Wallet, 
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'rewards', label: 'Store', icon: ShoppingCart },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Token<span className="text-cyan-400">Rewards</span>
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {profile && (
            <div className="hidden sm:flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">
                {profile.token_balance.toLocaleString()}
              </span>
            </div>
          )}
          
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:block">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;