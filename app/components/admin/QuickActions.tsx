"use client";

import { FiMail, FiUsers, FiBarChart, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Access frequently used admin functions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleSendEmail}
            variant="outline"
            className="h-auto py-4 justify-start"
          >
            <FiMail className="w-5 h-5 mr-3" />
            Send Email
          </Button>

          <Button
            onClick={handleViewUsers}
            variant="outline"
            className="h-auto py-4 justify-start"
          >
            <FiUsers className="w-5 h-5 mr-3" />
            View Users
          </Button>

          <Button
            onClick={handleViewAnalytics}
            variant="outline"
            className="h-auto py-4 justify-start"
          >
            <FiBarChart className="w-5 h-5 mr-3" />
            View Analytics
          </Button>

          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="h-auto py-4 justify-start"
          >
            <FiRefreshCw className={`w-5 h-5 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
