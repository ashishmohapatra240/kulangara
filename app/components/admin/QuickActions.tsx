"use client";

import { FiMail, FiUsers, FiBarChart, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const QuickActions = ({ onRefresh, isRefreshing }: QuickActionsProps) => {
  const router = useRouter();

  const handleSendEmail = () => {
    router.push('/admin/email');
  };

  const handleViewUsers = () => {
    router.push('/admin/users');
  };

  const handleViewAnalytics = () => {
    router.push('/admin/analytics');
  };

  return (
    <div className="bg-white border-2 border-black p-8">
      <h2 className="text-2xl font-bold mb-8 tracking-tight">QUICK ACTIONS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={handleSendEmail}
          className="flex items-center p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group"
        >
          <FiMail className="w-6 h-6 text-black group-hover:text-white mr-4" />
          <span className="font-bold text-sm tracking-widest">SEND EMAIL</span>
        </button>

        <button
          onClick={handleViewUsers}
          className="flex items-center p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group"
        >
          <FiUsers className="w-6 h-6 text-black group-hover:text-white mr-4" />
          <span className="font-bold text-sm tracking-widest">VIEW USERS</span>
        </button>

        <button
          onClick={handleViewAnalytics}
          className="flex items-center p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group"
        >
          <FiBarChart className="w-6 h-6 text-black group-hover:text-white mr-4" />
          <span className="font-bold text-sm tracking-widest">VIEW ANALYTICS</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center p-6 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <FiRefreshCw className={`w-6 h-6 text-black group-hover:text-white mr-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="font-bold text-sm tracking-widest">REFRESH DATA</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions; 