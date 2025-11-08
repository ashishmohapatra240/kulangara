"use client";

import { IActivityLog } from '@/app/types/admin.type';
import { FiClock, FiUser, FiShoppingCart, FiPackage, FiSettings } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface ActivityFeedProps {
  activities: IActivityLog[];
  isLoading?: boolean;
}

const ActivityFeed = ({ activities, isLoading }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <FiUser className="w-4 h-4" />;
      case 'order':
        return <FiShoppingCart className="w-4 h-4" />;
      case 'product':
        return <FiPackage className="w-4 h-4" />;
      case 'system':
        return <FiSettings className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b last:border-b-0">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Monitor recent actions and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FiClock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Monitor recent actions and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 py-4 border-b last:border-b-0"
            >
              <div className="flex-shrink-0 mt-1 p-2 border rounded">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1">
                  {activity.action}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                {activity.userName && (
                  <p className="text-xs text-muted-foreground">
                    by {activity.userName}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
