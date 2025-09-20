import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Users, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Task } from '../../types';

interface AdminTask extends Task {
  completion_count: number;
  is_expired: boolean;
}

const AdminTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksData) {
        // Get completion counts for each task
        const tasksWithCounts = await Promise.all(
          tasksData.map(async (task) => {
            const { count } = await supabase
              .from('user_tasks')
              .select('*', { count: 'exact', head: true })
              .eq('task_id', task.id);

            const isExpired = task.deadline ? new Date(task.deadline) < new Date() : false;

            return {
              ...task,
              completion_count: count || 0,
              is_expired: isExpired,
            };
          })
        );

        setTasks(tasksWithCounts);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-orange-400 bg-orange-500/20';
      case 'legendary': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 h-32 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id} variant="cyber" className={task.is_expired ? 'opacity-75' : ''}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty}
                  </span>
                  {task.is_expired && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                      Expired
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-cyan-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>{task.completion_count} completed</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <span>+{task.token_reward} tokens</span>
                  </div>
                  {task.participation_cap && (
                    <div className="flex items-center space-x-1 text-purple-400">
                      <Users className="h-4 w-4" />
                      <span>{task.completion_count}/{task.participation_cap}</span>
                    </div>
                  )}
                  {task.deadline && (
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {task.requirements && task.requirements.length > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {task.requirements.map((req, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No tasks created yet</div>
          <p className="text-gray-500">Create your first task to get started</p>
        </div>
      )}
    </div>
  );
};

export default AdminTaskList;