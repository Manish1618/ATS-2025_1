import React from 'react';
import { Calendar, Zap, Trophy, Target } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import ProfileCard from '../profile/ProfileCard';
import StatsGrid from './StatsGrid';
import Card from '../ui/Card';

const Dashboard: React.FC = () => {
  const { profile } = useUserProfile();

  const quickActions = [
    {
      title: 'Complete Tasks',
      description: 'Earn tokens by completing daily challenges',
      icon: Target,
      color: 'from-cyan-500 to-blue-600',
      action: () => console.log('Navigate to tasks'),
    },
    {
      title: 'Redeem Rewards',
      description: 'Exchange tokens for exclusive items',
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      action: () => console.log('Navigate to rewards'),
    },
    {
      title: 'Check Wallet',
      description: 'View transaction history and balance',
      icon: Zap,
      color: 'from-green-500 to-teal-600',
      action: () => console.log('Navigate to wallet'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome back, <span className="text-cyan-400">{profile?.username}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Your digital reward journey continues. Complete tasks, earn tokens, and unlock exclusive rewards in the cyber realm.
        </p>
      </div>

      {/* Profile Overview */}
      <ProfileCard />

      {/* Stats Grid */}
      <StatsGrid />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                variant="cyber"
                className="hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Activity Feed */}
      <Card variant="cyber">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Account created successfully</span>
              </div>
              <span className="text-gray-500 text-sm">Today</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">Welcome bonus: +100 tokens</span>
              </div>
              <span className="text-gray-500 text-sm">Today</span>
            </div>

            <div className="text-center py-6 text-gray-500">
              <p>Complete your first task to see more activity</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;