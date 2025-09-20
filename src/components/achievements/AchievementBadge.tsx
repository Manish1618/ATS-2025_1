import React from 'react';
import { Achievement } from '../../hooks/useAchievements';
import Card from '../ui/Card';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl',
  };

  const cardClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <Card 
      variant="cyber" 
      className={`${cardClasses[size]} ${
        achievement.earned 
          ? 'border-yellow-500/50 shadow-yellow-500/20' 
          : 'border-gray-600/30 opacity-50'
      } hover:scale-105 transition-transform duration-200`}
    >
      <div className="text-center space-y-2">
        <div className={`${sizeClasses[size]} mx-auto flex items-center justify-center rounded-full ${
          achievement.earned 
            ? 'bg-yellow-500/20 border-2 border-yellow-500/50' 
            : 'bg-gray-700/50 border-2 border-gray-600/30'
        }`}>
          <span>{achievement.icon}</span>
        </div>
        <div>
          <h4 className={`font-semibold ${achievement.earned ? 'text-yellow-400' : 'text-gray-500'} ${
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          }`}>
            {achievement.name}
          </h4>
          <p className={`text-gray-400 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}>
            {achievement.description}
          </p>
          {achievement.earned && achievement.earnedAt && (
            <p className="text-xs text-cyan-400 mt-1">
              Earned {new Date(achievement.earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AchievementBadge;