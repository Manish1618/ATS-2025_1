export interface User {
  id: string;
  email: string;
  username?: string;
  token_balance: number;
  level: number;
  experience_points: number;
  created_at: string;
  avatar_url?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  token_reward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  category: string;
  deadline?: string;
  participation_cap?: number;
  requirements?: string[];
  is_completed?: boolean;
  completion_time?: string;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  token_cost: number;
  category: 'upgrade' | 'cosmetic' | 'utility' | 'exclusive';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image_url?: string;
  is_available: boolean;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_at?: string;
  tokens_earned: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'earned' | 'spent' | 'exchanged';
  amount: number;
  description: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}