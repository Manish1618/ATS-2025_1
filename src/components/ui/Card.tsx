import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'cyber' | 'glow';
}

const Card: React.FC<CardProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-800 border-gray-700',
    cyber: 'bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30 shadow-lg shadow-cyan-500/10',
    glow: 'bg-gray-800 border-purple-500/50 shadow-lg shadow-purple-500/20',
  };

  return (
    <div className={cn('border rounded-xl p-6 backdrop-blur-sm', variants[variant], className)}>
      {children}
    </div>
  );
};

export default Card;