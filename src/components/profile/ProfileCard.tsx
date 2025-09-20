import React from 'react';
import { User, Crown, Zap, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { useUserProfile } from '../../hooks/useUserProfile';

const ProfileCard: React.FC = () => {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <Card variant="cyber" className="animate-pulse">
        <div className="h-32 bg-gray-700 rounded"></div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card variant="cyber">
        <div className="text-center text-gray-400">
          Profile not found
        </div>
      </Card>
    );
  }

  return (
    <Card variant="cyber" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-600/5"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
            <Crown className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Level {profile.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Token Balance</p>
                <p className="text-2xl font-bold text-cyan-400">{profile.token_balance.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Experience</p>
                <p className="text-2xl font-bold text-purple-400">{profile.experience_points.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress to Level {profile.level + 1}</span>
            <span className="text-sm text-cyan-400">
              {profile.experience_points % 1000}/1000 XP
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(profile.experience_points % 1000) / 10}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;