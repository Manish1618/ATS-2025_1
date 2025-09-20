import React from 'react';
import { CheckCircle, Clock, Zap, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  isCompleting?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, isCompleting = false }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'legendary': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      case 'legendary': return 4;
      default: return 1;
    }
  };

  return (
    <Card variant="cyber" className="hover:scale-105 transition-transform duration-200">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
          </div>
          
          {task.is_completed && (
            <div className="ml-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full border text-xs font-medium capitalize ${getDifficultyColor(task.difficulty)}`}>
            <div className="flex items-center space-x-1">
              <span>{task.difficulty}</span>
              <div className="flex">
                {Array.from({ length: getDifficultyStars(task.difficulty) }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-cyan-400" />
              <span className="text-cyan-400 text-xs font-semibold">+{task.token_reward}</span>
            </div>
          </div>

          <div className="bg-gray-500/20 px-3 py-1 rounded-full border border-gray-500/30">
            <span className="text-gray-400 text-xs capitalize">{task.category}</span>
          </div>
        </div>

        {task.requirements && task.requirements.length > 0 && (
          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
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

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {task.is_completed 
                ? `Completed ${new Date(task.completion_time!).toLocaleDateString()}`
                : `Added ${new Date(task.created_at).toLocaleDateString()}`
              }
            </span>
          </div>
          
          {!task.is_completed && (
            <Button
              variant="cyber"
              size="sm"
              onClick={() => onComplete(task.id)}
              isLoading={isCompleting}
            >
              Complete Task
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;