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
        return <FiCheckCircle className="w-6 h-6 text-black" />;
      case "warning":
        return <FiAlertTriangle className="w-6 h-6 text-black" />;
      case "critical":
        return <FiXCircle className="w-6 h-6 text-black" />;
      default:
        return <FiActivity className="w-6 h-6 text-black" />;
    }
  };

  const getStatusBorder = (status: "healthy" | "warning" | "critical") => {
    return "border-2 border-black";
  };

  const getStatusText = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "ALL SYSTEMS OPERATIONAL";
      case "warning":
        return "SOME ISSUES DETECTED";
      case "critical":
        return "CRITICAL ISSUES DETECTED";
      default:
        return "STATUS UNKNOWN";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-black p-8">
        <h2 className="text-2xl font-bold mb-8 tracking-tight">SYSTEM HEALTH</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-6 h-6 bg-gray-300"></div>
            <div className="w-40 h-5 bg-gray-300"></div>
          </div>
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-300"></div>
            <div className="w-3/4 h-4 bg-gray-300"></div>
            <div className="w-1/2 h-4 bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="bg-white border-2 border-black p-8">
      <h2 className="text-2xl font-bold mb-8 tracking-tight">SYSTEM HEALTH</h2>
      
      {/* Overall Status */}
      {stats.systemHealth && (
        <div
          className={`flex items-center space-x-4 p-6 ${getStatusBorder(
            stats.systemHealth.status
          )} mb-8 bg-white`}
        >
          {getStatusIcon(stats.systemHealth.status)}
          <div>
            <h3 className="font-bold text-black tracking-wide">SYSTEM STATUS</h3>
            <p className="text-sm font-medium text-gray-600 tracking-widest">{getStatusText(stats.systemHealth.status)}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-sm font-bold text-black tracking-widest">LOW STOCK PRODUCTS</span>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-black">
              {stats.products?.lowStock ?? 0}
            </span>
            {(stats.products?.lowStock ?? 0) > 10 && (
              <FiAlertTriangle className="w-5 h-5 text-black" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-sm font-bold text-black tracking-widest">OUT OF STOCK PRODUCTS</span>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-black">
              {stats.products?.outOfStock ?? 0}
            </span>
            {(stats.products?.outOfStock ?? 0) > 5 && (
              <FiXCircle className="w-5 h-5 text-black" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-sm font-bold text-black tracking-widest">PENDING ORDERS</span>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-black">
              {stats.orders?.pending ?? 0}
            </span>
            {(stats.orders?.pending ?? 0) > 20 && (
              <FiAlertTriangle className="w-5 h-5 text-black" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-bold text-black tracking-widest">ACTIVE USERS</span>
          <span className="text-lg font-bold text-black">
            {stats.users?.active ?? 0}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {((stats.products?.lowStock ?? 0) > 10 ||
        (stats.products?.outOfStock ?? 0) > 5 ||
        (stats.orders?.pending ?? 0) > 20) && (
        <div className="mt-8 p-6 border-2 border-black bg-white">
          <h4 className="text-lg font-bold text-black mb-4 tracking-tight">
            RECOMMENDATIONS
          </h4>
          <ul className="text-sm text-black space-y-2 font-medium">
            {(stats.products?.lowStock ?? 0) > 10 && (
              <li className="tracking-wide">• RESTOCK PRODUCTS WITH LOW INVENTORY</li>
            )}
            {(stats.products?.outOfStock ?? 0) > 5 && (
              <li className="tracking-wide">• REORDER OUT-OF-STOCK ITEMS</li>
            )}
            {(stats.orders?.pending ?? 0) > 20 && (
              <li className="tracking-wide">• PROCESS PENDING ORDERS PROMPTLY</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
