import React, { useState, useEffect } from 'react';
import { Trophy, Target, Calendar, Award } from 'lucide-react';
import Card from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  completedTasks: number;
  tokensEarned: number;
  streakDays: number;
  achievements: number;
}

const StatsGrid: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    completedTasks: 0,
    tokensEarned: 0,
    streakDays: 7,
    achievements: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch completed tasks count
        const { count: tasksCount } = await supabase
          .from('user_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);

        // Fetch total tokens earned from transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'earned');

        const totalEarned = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

        setStats(prev => ({
          ...prev,
          completedTasks: tasksCount || 0,
          tokensEarned: totalEarned,
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statItems = [
    {
      label: 'Tasks Completed',
      value: stats.completedTasks,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
    },
    {
      label: 'Tokens Earned',
      value: stats.tokensEarned,
      icon: Target,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
    },
    {
      label: 'Streak Days',
      value: stats.streakDays,
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Achievements',
      value: stats.achievements,
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} variant="cyber" className="animate-pulse">
            <div className="h-20 bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} variant="cyber" className={`${stat.borderColor} hover:scale-105 transition-transform duration-200 cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.borderColor} border p-3 rounded-full`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;