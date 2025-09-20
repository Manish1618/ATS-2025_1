import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  adminUsers: string[];
  checkAdminStatus: (email: string) => boolean;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Define admin users (in production, this should come from database)
const ADMIN_EMAILS = [
  'admin@tokenrewards.com',
  'manager@tokenrewards.com',
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [adminUsers] = useState<string[]>(ADMIN_EMAILS);

  const checkAdminStatus = (email: string) => {
    return adminUsers.includes(email.toLowerCase());
  };

  const isAdmin = user ? checkAdminStatus(user.email || '') : false;

  const value = {
    isAdmin,
    adminUsers,
    checkAdminStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};