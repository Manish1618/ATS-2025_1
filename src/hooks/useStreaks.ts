import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { differenceInHours, startOfDay, addDays } from 'date-fns';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastTaskDate: Date | null;
  timeUntilReset: number; // hours remaining
  isStreakActive: boolean;
}

export const useStreaks = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastTaskDate: null,
    timeUntilReset: 24,
    isStreakActive: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStreakData();
      const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchStreakData = async () => {
    if (!user) return;

    try {
      // Get user's completed tasks ordered by completion date
      const { data: completedTasks } = await supabase
        .from('user_tasks')
        .select('completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (!completedTasks || completedTasks.length === 0) {
        setLoading(false);
        return;
      }

      const taskDates = completedTasks.map(task => new Date(task.completed_at));
      const lastTaskDate = taskDates[0];
      const currentStreak = calculateCurrentStreak(taskDates);
      const longestStreak = calculateLongestStreak(taskDates);
      const hoursUntilReset = 24 - differenceInHours(new Date(), lastTaskDate);
      const isStreakActive = hoursUntilReset > 0;

      setStreakData({
        currentStreak,
        longestStreak,
        lastTaskDate,
        timeUntilReset: Math.max(0, hoursUntilReset),
        isStreakActive,
      });
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = (taskDates: Date[]): number => {
    if (taskDates.length === 0) return 0;

    let streak = 0;
    let currentDate = startOfDay(new Date());

    for (const taskDate of taskDates) {
      const taskDay = startOfDay(taskDate);
      
      if (taskDay.getTime() === currentDate.getTime()) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else if (taskDay.getTime() === addDays(currentDate, -1).getTime()) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (taskDates: Date[]): number => {
    if (taskDates.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;
    
    const uniqueDays = Array.from(new Set(
      taskDates.map(date => startOfDay(date).getTime())
    )).sort((a, b) => b - a);

    for (let i = 1; i < uniqueDays.length; i++) {
      const currentDay = new Date(uniqueDays[i]);
      const previousDay = new Date(uniqueDays[i - 1]);
      
      if (differenceInHours(previousDay, currentDay) === 24) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  };

  const updateTimeUntilReset = () => {
    if (streakData.lastTaskDate) {
      const hoursUntilReset = 24 - differenceInHours(new Date(), streakData.lastTaskDate);
      setStreakData(prev => ({
        ...prev,
        timeUntilReset: Math.max(0, hoursUntilReset),
        isStreakActive: hoursUntilReset > 0,
      }));
    }
  };

  return {
    streakData,
    loading,
    refreshStreaks: fetchStreakData,
  };
};