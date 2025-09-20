/*
  # Seed sample data

  1. Sample Tasks
    - Add various tasks across different categories and difficulties
    
  2. Sample Rewards
    - Add rewards across different categories and rarities
*/

-- Insert sample tasks
INSERT INTO public.tasks (title, description, token_reward, difficulty, category, requirements) VALUES
  ('Complete Your Profile', 'Fill out your profile information including username and avatar', 50, 'easy', 'social', ARRAY['Set username', 'Upload avatar']),
  ('First Code Commit', 'Make your first code contribution to any project', 100, 'medium', 'development', ARRAY['Create repository', 'Make commit']),
  ('Join Community Discord', 'Connect with other developers in our Discord server', 25, 'easy', 'community', ARRAY['Discord account']),
  ('Complete Tutorial Series', 'Finish the beginner development tutorial series', 200, 'medium', 'learning', ARRAY['Basic programming knowledge']),
  ('Win 5 Games', 'Achieve 5 victories in any supported game mode', 150, 'medium', 'gaming', ARRAY['Game account']),
  ('Code Review Master', 'Successfully review and approve 10 pull requests', 300, 'hard', 'development', ARRAY['GitHub account', 'Code review experience']),
  ('Community Helper', 'Help 20 community members with their questions', 250, 'hard', 'community', ARRAY['Active community participation']),
  ('Algorithm Challenge', 'Solve 50 algorithm problems on coding platforms', 500, 'legendary', 'learning', ARRAY['Strong programming skills']),
  ('Tournament Champion', 'Win a community gaming tournament', 1000, 'legendary', 'gaming', ARRAY['Advanced gaming skills']),
  ('Open Source Contributor', 'Contribute to 5 different open source projects', 750, 'legendary', 'development', ARRAY['GitHub account', 'Programming expertise'])
ON CONFLICT DO NOTHING;

-- Insert sample rewards
INSERT INTO public.rewards (name, description, token_cost, category, rarity, image_url) VALUES
  ('Profile Badge: Newcomer', 'Show everyone you''re new to the community', 100, 'cosmetic', 'common', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('XP Boost (24h)', 'Double experience points for 24 hours', 200, 'utility', 'common', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Custom Username Color', 'Change your username color in chat', 300, 'cosmetic', 'rare', 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Priority Support', 'Get priority customer support for 30 days', 500, 'utility', 'rare', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Exclusive Avatar Frame', 'Rare animated avatar frame', 750, 'cosmetic', 'epic', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Token Multiplier (7d)', 'Earn 50% more tokens for a week', 1000, 'upgrade', 'epic', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('VIP Status (30d)', 'Access to VIP-only features and channels', 1500, 'exclusive', 'legendary', 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Golden Profile Theme', 'Exclusive golden profile theme', 2000, 'cosmetic', 'legendary', 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Permanent XP Boost', 'Permanent 25% experience point bonus', 5000, 'upgrade', 'legendary', 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Founder''s Badge', 'Ultra-rare badge for early supporters', 10000, 'exclusive', 'legendary', 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT DO NOTHING;