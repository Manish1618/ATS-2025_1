import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import Card from '../ui/Card';
import type { Transaction } from '../../types';

const WalletOverview: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'spent': return <ArrowDownLeft className="h-4 w-4 text-red-400" />;
      case 'exchanged': return <Activity className="h-4 w-4 text-blue-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-400';
      case 'spent': return 'text-red-400';
      case 'exchanged': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-800 h-48 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Token Wallet</h2>
          <p className="text-gray-400">Manage your digital token portfolio</p>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="cyber" className="border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Current Balance</p>
              <p className="text-3xl font-bold text-cyan-400 mt-1">
                {profile?.token_balance.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-cyan-500/20 border border-cyan-500/30 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </Card>

        <Card variant="cyber" className="border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Earned</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {totalEarned.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card variant="cyber" className="border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                {totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-full">
              <ArrowDownLeft className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card variant="cyber">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No transactions yet</p>
              <p className="text-gray-500 text-sm">Complete tasks to start earning tokens</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-800 rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'earned' ? '+' : '-'}{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WalletOverview;