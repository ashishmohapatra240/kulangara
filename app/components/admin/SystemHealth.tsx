"use client";

import { IDashboardStats } from "@/app/types/admin.type";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface SystemHealthProps {
  stats: IDashboardStats;
  isLoading?: boolean;
}

const SystemHealth = ({ stats, isLoading }: SystemHealthProps) => {
  const getStatusIcon = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <FiAlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "critical":
        return <FiXCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FiActivity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "All systems operational";
      case "warning":
        return "Some issues detected";
      case "critical":
        return "Critical issues detected";
      default:
        return "Status unknown";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

    return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">System Health</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Monitor system metrics and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Status */}
        {stats.systemHealth && (
          <div className="flex items-center gap-3 p-4 mb-6 border rounded-md bg-muted/20">
            {getStatusIcon(stats.systemHealth.status)}
            <div>
              <h3 className="font-semibold">System Status</h3>
              <p className="text-sm text-muted-foreground">{getStatusText(stats.systemHealth.status)}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium">Low Stock Products</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {stats.products?.lowStock ?? 0}
              </span>
              {(stats.products?.lowStock ?? 0) > 10 && (
                <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium">Out of Stock Products</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {stats.products?.outOfStock ?? 0}
              </span>
              {(stats.products?.outOfStock ?? 0) > 5 && (
                <FiXCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium">Pending Orders</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {stats.orders?.pending ?? 0}
              </span>
              {(stats.orders?.pending ?? 0) > 20 && (
                <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">Active Users</span>
            <span className="text-lg font-bold">
              {stats.users?.active ?? 0}
            </span>
          </div>
        </div>

        {/* Recommendations */}
        {((stats.products?.lowStock ?? 0) > 10 ||
          (stats.products?.outOfStock ?? 0) > 5 ||
          (stats.orders?.pending ?? 0) > 20) && (
          <div className="mt-6 p-4 border rounded-md bg-muted/20">
            <h4 className="font-semibold mb-3">
              Recommendations
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              {(stats.products?.lowStock ?? 0) > 10 && (
                <li>• Restock products with low inventory</li>
              )}
              {(stats.products?.outOfStock ?? 0) > 5 && (
                <li>• Reorder out-of-stock items</li>
              )}
              {(stats.orders?.pending ?? 0) > 20 && (
                <li>• Process pending orders promptly</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
