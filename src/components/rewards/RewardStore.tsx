import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Star, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Reward } from '../../types';

const RewardStore: React.FC = () => {
  const { user } = useAuth();
  const { profile, updateTokenBalance } = useUserProfile();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'upgrade', 'cosmetic', 'utility', 'exclusive'];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_available', true)
        .order('token_cost', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (reward: Reward) => {
    if (!user || !profile) return;
    
    if (profile.token_balance < reward.token_cost) {
      alert('Insufficient tokens!');
      return;
    }

    setPurchasing(reward.id);

    try {
      // Deduct tokens
      const { error: balanceError } = await updateTokenBalance(reward.token_cost, 'subtract');
      if (balanceError) throw balanceError;

      // Add transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'spent',
          amount: reward.token_cost,
          description: `Purchased: ${reward.name}`,
        });

      alert(`Successfully purchased ${reward.name}!`);
    } catch (error) {
      console.error('Error purchasing reward:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'rare': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'epic': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRarityStars = (rarity: string) => {
    switch (rarity) {
      case 'common': return 1;
      case 'rare': return 2;
      case 'epic': return 3;
      case 'legendary': return 4;
      default: return 1;
    }
  };

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

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
          <h2 className="text-2xl font-bold text-white mb-2">Reward Store</h2>
          <p className="text-gray-400">Exchange your tokens for exclusive rewards and upgrades</p>
        </div>
        {profile && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">{profile.token_balance.toLocaleString()}</span>
              <span className="text-gray-400">tokens</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <Card key={reward.id} variant="cyber" className="hover:scale-105 transition-transform duration-200">
            <div className="space-y-4">
              {reward.image_url ? (
                <img 
                  src={reward.image_url} 
                  alt={reward.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-500" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-white">{reward.name}</h3>
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium capitalize ${getRarityColor(reward.rarity)}`}>
                    <div className="flex items-center space-x-1">
                      <span>{reward.rarity}</span>
                      <div className="flex">
                        {Array.from({ length: getRarityStars(reward.rarity) }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">{reward.description}</p>

                <div className="bg-gray-500/20 px-3 py-1 rounded-full border border-gray-500/30 w-fit">
                  <span className="text-gray-400 text-xs capitalize">{reward.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span className="text-cyan-400 font-semibold">{reward.token_cost.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button
                  variant="cyber"
                  size="sm"
                  onClick={() => handlePurchase(reward)}
                  isLoading={purchasing === reward.id}
                  disabled={!profile || profile.token_balance < reward.token_cost}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {!profile || profile.token_balance < reward.token_cost ? 'Insufficient' : 'Purchase'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No rewards available</div>
          <p className="text-gray-500">Check back later for new rewards</p>
        </div>
      )}
    </div>
  );
};

export default RewardStore;