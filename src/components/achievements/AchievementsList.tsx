import React from 'react';
import { Award, Star } from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import AchievementBadge from './AchievementBadge';
import Card from '../ui/Card';

const AchievementsList: React.FC = () => {
  const { achievements, loading } = useAchievements();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-800 h-48 rounded-xl"></div>
      </div>
    );
  }

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearned = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Achievements</h2>
        <p className="text-gray-400">Unlock badges by completing milestones</p>
      </div>

      {/* Stats */}
      <Card variant="cyber" className="border-yellow-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 font-semibold text-lg">
                {earnedAchievements.length} / {achievements.length}
              </p>
              <p className="text-gray-400 text-sm">Achievements Unlocked</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${
                  i < Math.floor((earnedAchievements.length / achievements.length) * 5)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`} 
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Earned Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedAchievements.map(achievement => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Unearned Achievements */}
      {unearned.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Available Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unearned.map(achievement => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;