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
    <div className="bg-white border border-gray-200 rounded-0 p-6">
      <h2 className="text-xl font-normal mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleSendEmail}
          className="flex items-center justify-center p-4 border border-gray-200 rounded-0 hover:bg-gray-50 transition-colors"
        >
          <FiMail className="w-5 h-5 text-blue-600 mr-3" />
          <span className="font-medium">Send Email</span>
        </button>

        <button
          onClick={handleViewUsers}
          className="flex items-center justify-center p-4 border border-gray-200 rounded-0 hover:bg-gray-50 transition-colors"
        >
          <FiUsers className="w-5 h-5 text-green-600 mr-3" />
          <span className="font-medium">View Users</span>
        </button>

        <button
          onClick={handleViewAnalytics}
          className="flex items-center justify-center p-4 border border-gray-200 rounded-0 hover:bg-gray-50 transition-colors"
        >
          <FiBarChart className="w-5 h-5 text-purple-600 mr-3" />
          <span className="font-medium">View Analytics</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center p-4 border border-gray-200 rounded-0 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={`w-5 h-5 text-orange-600 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="font-medium">Refresh Data</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions; 