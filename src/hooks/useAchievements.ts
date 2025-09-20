import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'tasks_completed' | 'streak_days' | 'tokens_earned' | 'special';
  earned: boolean;
  earnedAt?: string;
}

const ACHIEVEMENTS: Omit<Achievement, 'earned' | 'earnedAt'>[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to the platform!',
    icon: '🎉',
    requirement: 0,
    type: 'special',
  },
  {
    id: 'task_master_10',
    name: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '🏆',
    requirement: 10,
    type: 'tasks_completed',
  },
  {
    id: 'task_champion_25',
    name: 'Task Champion',
    description: 'Complete 25 tasks',
    icon: '👑',
    requirement: 25,
    type: 'tasks_completed',
  },
  {
    id: 'streak_warrior_7',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: 7,
    type: 'streak_days',
  },
  {
    id: 'token_collector_1000',
    name: 'Token Collector',
    description: 'Earn 1000 tokens',
    icon: '💰',
    requirement: 1000,
    type: 'tokens_earned',
  },
];

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAchievements();
    }
  }, [user]);

  const checkAchievements = async () => {
    if (!user) return;

    try {
      // Get user stats
      const { count: tasksCompleted } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'earned');

      const tokensEarned = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Get existing achievements from database
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      const earnedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

      // Check each achievement
      const updatedAchievements = await Promise.all(
        ACHIEVEMENTS.map(async (achievement) => {
          const isEarned = earnedAchievementIds.has(achievement.id);
          let shouldEarn = false;

          switch (achievement.type) {
            case 'special':
              shouldEarn = true; // Newcomer badge for everyone
              break;
            case 'tasks_completed':
              shouldEarn = (tasksCompleted || 0) >= achievement.requirement;
              break;
            case 'tokens_earned':
              shouldEarn = tokensEarned >= achievement.requirement;
              break;
            case 'streak_days':
              // This would need streak calculation - simplified for now
              shouldEarn = false;
              break;
          }

          // Award new achievements
          if (shouldEarn && !isEarned) {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: achievement.id,
                earned_at: new Date().toISOString(),
              });
          }

          const earnedData = userAchievements?.find(ua => ua.achievement_id === achievement.id);

          return {
            ...achievement,
            earned: shouldEarn,
            earnedAt: earnedData?.earned_at,
          };
        })
      );

      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error checking achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    achievements,
    loading,
    refreshAchievements: checkAchievements,
  };
};