"use client";

import { IDashboardStats } from "@/app/types/admin.type";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";

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
        return <FiActivity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <h2 className="text-xl font-normal mb-4">System Health</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded-0"></div>
            <div className="w-32 h-4 bg-gray-200 rounded-0"></div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-3 bg-gray-200 rounded-0"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded-0"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded-0"></div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="bg-white border border-gray-200 rounded-0 p-6">
      <h2 className="text-xl font-normal mb-4">System Health</h2>
      
      {/* Overall Status */}
      {stats.systemHealth && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-0 border ${getStatusColor(
            stats.systemHealth.status
          )} mb-6`}
        >
          {getStatusIcon(stats.systemHealth.status)}
          <div>
            <h3 className="font-medium">System Status</h3>
            <p className="text-sm">{getStatusText(stats.systemHealth.status)}</p>
          </div>
        </div>
      )}

      {/* Health Indicators */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Low Stock Products</span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                (stats.products?.lowStock ?? 0) > 10
                  ? "text-red-600"
                  : (stats.products?.lowStock ?? 0) > 5
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {stats.products?.lowStock ?? 0}
            </span>
            {(stats.products?.lowStock ?? 0) > 10 && (
              <FiAlertTriangle className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Out of Stock Products</span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                (stats.products?.outOfStock ?? 0) > 5
                  ? "text-red-600"
                  : (stats.products?.outOfStock ?? 0) > 0
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {stats.products?.outOfStock ?? 0}
            </span>
            {(stats.products?.outOfStock ?? 0) > 5 && (
              <FiXCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pending Orders</span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                (stats.orders?.pending ?? 0) > 20
                  ? "text-red-600"
                  : (stats.orders?.pending ?? 0) > 10
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {stats.orders?.pending ?? 0}
            </span>
            {(stats.orders?.pending ?? 0) > 20 && (
              <FiAlertTriangle className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Users</span>
          <span className="text-sm font-medium text-green-600">
            {stats.users?.active ?? 0}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {((stats.products?.lowStock ?? 0) > 10 ||
        (stats.products?.outOfStock ?? 0) > 5 ||
        (stats.orders?.pending ?? 0) > 20) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-0">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Recommendations
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
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
    </div>
  );
};

export default SystemHealth;
