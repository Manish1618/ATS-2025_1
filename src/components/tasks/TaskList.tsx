import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import TaskCard from './TaskCard';
import Button from '../ui/Button';
import type { Task } from '../../types';

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const { updateTokenBalance } = useUserProfile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completingTask, setCompletingTask] = useState<string | null>(null);

  const categories = ['all', 'development', 'social', 'learning', 'gaming', 'community'];

  useEffect(() => {
    fetchTasks();
  }, [user]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, selectedCategory]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      // Fetch all available tasks
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch completed tasks for this user
      const { data: userTasks } = await supabase
        .from('user_tasks')
        .select('task_id, completed_at')
        .eq('user_id', user.id);

      const completedTaskIds = new Set(userTasks?.map(ut => ut.task_id) || []);

      // Mark tasks as completed
      const tasksWithCompletion = allTasks?.map(task => ({
        ...task,
        is_completed: completedTaskIds.has(task.id),
        completion_time: userTasks?.find(ut => ut.task_id === task.id)?.completed_at,
      })) || [];

      setTasks(tasksWithCompletion);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user) return;

    setCompletingTask(taskId);

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Mark task as completed
      const { error: taskError } = await supabase
        .from('user_tasks')
        .insert({
          user_id: user.id,
          task_id: taskId,
          tokens_earned: task.token_reward,
          completed_at: new Date().toISOString(),
        });

      if (taskError) throw taskError;

      // Add transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'earned',
          amount: task.token_reward,
          description: `Completed task: ${task.title}`,
        });

      // Update user's token balance
      await updateTokenBalance(task.token_reward, 'add');

      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, is_completed: true, completion_time: new Date().toISOString() }
          : t
      ));

    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setCompletingTask(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 h-48 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Task Center</h2>
          <p className="text-gray-400">Complete tasks to earn tokens and gain experience</p>
        </div>
        <Button variant="cyber">
          <Plus className="h-4 w-4 mr-2" />
          Suggest Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleCompleteTask}
            isCompleting={completingTask === task.id}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No tasks found</div>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Check back later for new challenges'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;