import React, { useState, useEffect } from 'react';
import { Plus, Users, CheckSquare, Clock, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import TaskCreationModal from './TaskCreationModal';
import AdminTaskList from './AdminTaskList';
import AdminStats from './AdminStats';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">Access Denied</div>
        <p className="text-gray-500">You don't have admin privileges</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tasks', label: 'Manage Tasks', icon: CheckSquare },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats />;
      case 'tasks':
        return <AdminTaskList />;
      case 'users':
        return (
          <Card variant="cyber">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">User management coming soon</p>
            </div>
          </Card>
        );
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage tasks, users, and monitor platform activity</p>
        </div>
        <Button
          variant="cyber"
          onClick={() => setShowTaskModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Task Creation Modal */}
      {showTaskModal && (
        <TaskCreationModal
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={() => {
            setShowTaskModal(false);
            // Refresh data if needed
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;