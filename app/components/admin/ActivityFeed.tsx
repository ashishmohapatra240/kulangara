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
        return <FiUser className="w-5 h-5 text-black" />;
      case 'order':
        return <FiShoppingCart className="w-5 h-5 text-black" />;
      case 'product':
        return <FiPackage className="w-5 h-5 text-black" />;
      case 'system':
        return <FiSettings className="w-5 h-5 text-black" />;
      default:
        return <FiClock className="w-5 h-5 text-black" />;
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
      <div className="bg-white border-2 border-black p-8">
        <h2 className="text-2xl font-bold mb-8 tracking-tight">RECENT ACTIVITY</h2>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 py-4 border-b border-gray-200 animate-pulse">
              <div className="w-6 h-6 bg-gray-300"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-300 mb-2"></div>
                <div className="w-48 h-3 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white border-2 border-black p-8">
        <h2 className="text-2xl font-bold mb-8 tracking-tight">RECENT ACTIVITY</h2>
        <div className="text-center py-12">
          <FiClock className="w-16 h-16 text-black mx-auto mb-6" />
          <p className="text-gray-600 font-medium tracking-wide">NO RECENT ACTIVITY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black p-8">
      <h2 className="text-2xl font-bold mb-8 tracking-tight">RECENT ACTIVITY</h2>
      <div className="space-y-0">
        {activities.slice(0, 10).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex-shrink-0 mt-1 p-2 border border-black">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black mb-1 tracking-wide">
                {activity.action.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {activity.description}
              </p>
              {activity.userName && (
                <p className="text-xs text-gray-500 font-medium tracking-widest">
                  BY {activity.userName.toUpperCase()}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-gray-500 font-bold tracking-widest">
                {formatTimestamp(activity.timestamp).toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed; 