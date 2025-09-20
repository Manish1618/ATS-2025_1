import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                email: user.email,
                username: user.user_metadata?.username || user.email?.split('@')[0],
                token_balance: 100, // Starting tokens
                level: 1,
                experience_points: 0,
              })
              .select()
              .single();

            if (createError) throw createError;
            setProfile(newProfile);
          } else {
            throw error;
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateTokenBalance = async (amount: number, operation: 'add' | 'subtract' = 'add') => {
    if (!profile) return;

    const newBalance = operation === 'add' 
      ? profile.token_balance + amount 
      : Math.max(0, profile.token_balance - amount);

    const { error } = await supabase
      .from('user_profiles')
      .update({ token_balance: newBalance })
      .eq('id', profile.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, token_balance: newBalance } : prev);
    }

    return { error };
  };

  return { 
    profile, 
    loading, 
    error, 
    updateTokenBalance,
    refresh: () => {
      setLoading(true);
      fetchProfile();
    }
  };
};