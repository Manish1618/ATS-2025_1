import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';

interface AdminStatsData {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  tokensDistributed: number;
  activeUsers: number;
}

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    tokensDistributed: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total tasks
      const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      // Get completed tasks
      const { count: completedTasks } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true });

      // Get tokens distributed
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'earned');

      const tokensDistributed = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Get active users (users who completed tasks in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeUserTasks } = await supabase
        .from('user_tasks')
        .select('user_id')
        .gte('completed_at', sevenDaysAgo.toISOString());

      const activeUsers = new Set(activeUserTasks?.map(ut => ut.user_id) || []).size;

      setStats({
        totalUsers: totalUsers || 0,
        totalTasks: totalTasks || 0,
        completedTasks: completedTasks || 0,
        tokensDistributed,
        activeUsers,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Completed Tasks',
      value: stats.completedTasks,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      label: 'Tokens Distributed',
      value: stats.tokensDistributed,
      icon: Zap,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} variant="cyber" className={`${stat.borderColor}`}>
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

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="cyber">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Platform Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Users (7 days)</span>
                <span className="text-green-400 font-semibold">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-cyan-400 font-semibold">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Tokens per Task</span>
                <span className="text-purple-400 font-semibold">
                  {stats.completedTasks > 0 ? Math.round(stats.tokensDistributed / stats.completedTasks) : 0}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="cyber">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="text-white font-medium">Export User Data</div>
                <div className="text-gray-400 text-sm">Download user activity report</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="text-white font-medium">Task Analytics</div>
                <div className="text-gray-400 text-sm">View detailed task performance</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="text-white font-medium">Token Distribution</div>
                <div className="text-gray-400 text-sm">Manage token rewards</div>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;