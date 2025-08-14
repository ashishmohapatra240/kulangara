"use client";

import { IActivityLog } from '@/app/types/admin.type';
import { FiClock, FiUser, FiShoppingCart, FiPackage, FiSettings } from 'react-icons/fi';

interface ActivityFeedProps {
  activities: IActivityLog[];
  isLoading?: boolean;
}

const ActivityFeed = ({ activities, isLoading }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <FiUser className="w-4 h-4 text-blue-600" />;
      case 'order':
        return <FiShoppingCart className="w-4 h-4 text-green-600" />;
      case 'product':
        return <FiPackage className="w-4 h-4 text-orange-600" />;
      case 'system':
        return <FiSettings className="w-4 h-4 text-purple-600" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-50 border-blue-200';
      case 'order':
        return 'bg-green-50 border-green-200';
      case 'product':
        return 'bg-orange-50 border-orange-200';
      case 'system':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <h2 className="text-xl font-normal mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-0"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-200 rounded-0 mb-2"></div>
                <div className="w-48 h-3 bg-gray-200 rounded-0"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <h2 className="text-xl font-normal mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-0 p-6">
      <h2 className="text-xl font-normal mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 p-3 rounded-0 border ${getActivityColor(activity.type)}`}
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.action}
              </p>
              <p className="text-sm text-gray-600">
                {activity.description}
              </p>
              {activity.userName && (
                <p className="text-xs text-gray-500">
                  by {activity.userName}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-gray-500">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed; 