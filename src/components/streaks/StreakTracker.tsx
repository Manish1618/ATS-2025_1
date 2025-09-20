import React from 'react';
import { Flame, Clock, Trophy, Target } from 'lucide-react';
import { useStreaks } from '../../hooks/useStreaks';
import Card from '../ui/Card';

const StreakTracker: React.FC = () => {
  const { streakData, loading } = useStreaks();

  if (loading) {
    return (
      <Card variant="cyber" className="animate-pulse">
        <div className="h-32 bg-gray-700 rounded"></div>
      </Card>
    );
  }

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return 'Streak expired';
    const wholeHours = Math.floor(hours);
    const minutes = Math.floor((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Streak Tracker</h2>
        <p className="text-gray-400">Complete tasks daily to maintain your streak</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Streak */}
        <Card variant="cyber" className={`border-orange-500/30 ${streakData.isStreakActive ? 'shadow-orange-500/20' : 'opacity-75'}`}>
          <div className="text-center space-y-4">
            <div className="bg-orange-500/20 p-4 rounded-full w-fit mx-auto">
              <Flame className={`h-8 w-8 ${streakData.isStreakActive ? 'text-orange-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-4xl font-bold text-orange-400">{streakData.currentStreak}</p>
              <p className="text-gray-400 text-sm">
                {streakData.currentStreak === 1 ? 'day' : 'days'}
              </p>
            </div>
            {streakData.isStreakActive && (
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-400">
                    {formatTimeRemaining(streakData.timeUntilReset)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Longest Streak */}
        <Card variant="cyber" className="border-purple-500/30">
          <div className="text-center space-y-4">
            <div className="bg-purple-500/20 p-4 rounded-full w-fit mx-auto">
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Longest Streak</p>
              <p className="text-4xl font-bold text-purple-400">{streakData.longestStreak}</p>
              <p className="text-gray-400 text-sm">
                {streakData.longestStreak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Streak Rules */}
      <Card variant="cyber">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-cyan-400" />
            How Streaks Work
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
              <p>Complete at least one task every 24 hours to maintain your streak</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
              <p>Your streak timer resets after completing a task</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
              <p>Missing the 24-hour window will reset your current streak to 0</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
              <p>Longer streaks unlock special rewards and achievements</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StreakTracker;