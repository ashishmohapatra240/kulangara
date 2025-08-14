"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { IUser, IUserFilters } from "@/app/types/admin.type";
import { FiSearch, FiEdit, FiEye, FiUserCheck, FiUserX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from "@/app/hooks/useAdminUserManagement";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

const ROLES = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "DELIVERY_PARTNER", label: "Delivery Partner" },
];

const STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

export default function UsersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [filters, setFilters] = useState<IUserFilters>({
    page: 1,
    limit: 10,
    role: "",
    status: "",
    search: "",
  });

  // Fetch users using the new hook
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useAdminUsers(filters);

  // Mutations using the new hooks
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();

  // Show error toast if fetching users fails
  useEffect(() => {
    if (usersError) {
      toast.error(usersError.message || "Failed to load users");
    }
  }, [usersError]);

  // Map users from usersData.data
  const users = (usersData?.data || []).map((user: IUser) => ({
    ...user,
    status: user.isActive ? "ACTIVE" : "INACTIVE",
  }));

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/admin/login");
      } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleFilterChange = (key: keyof IUserFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRoleUpdate = (userId: string, role: string) => {
    if (user?.role !== "SUPER_ADMIN") {
      toast.error("Only Super Admins can update user roles");
      return;
    }
    updateRoleMutation.mutate({ userId, role });
  };

  // Map status to isActive for update
  const handleStatusUpdate = (userId: string, status: string) => {
    updateStatusMutation.mutate({ userId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "INACTIVE":
        return "text-gray-600 bg-gray-100";
      case "SUSPENDED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "text-purple-600 bg-purple-100";
      case "ADMIN":
        return "text-blue-600 bg-blue-100";
      case "DELIVERY_PARTNER":
        return "text-orange-600 bg-orange-100";
      case "CUSTOMER":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AdminLayout>
      <div className="pt-30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal">User Management</h1>
        </div>

        {usersError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-0">
            <p className="text-red-800">Error loading users. Please try refreshing.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-0 p-6">
            <h2 className="text-lg font-medium mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Search by name or email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFilters({
                      page: 1,
                      limit: 10,
                      role: "",
                      status: "",
                      search: "",
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-0 hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Users</h2>
              {usersData && usersData.meta && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing {((usersData?.meta?.page ?? 1) - 1) * (usersData?.meta?.limit ?? 10) + 1} to {Math.min((usersData?.meta?.page ?? 1) * (usersData?.meta?.limit ?? 10), usersData?.meta?.total ?? 0)} of {usersData?.meta?.total ?? 0} users
                </p>
              )}
            </div>

            {usersLoading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => {
                        // Use status field directly
                        const status = userItem.status;
                        return (
                          <tr key={userItem.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-0 bg-gray-300 flex items-center justify-center">
                                    <FiUserCheck className="h-6 w-6 text-gray-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {userItem.firstName} {userItem.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{userItem.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={userItem.role}
                                onChange={(e) => handleRoleUpdate(userItem.id, e.target.value)}
                                disabled={user?.role !== "SUPER_ADMIN"}
                                className={`text-sm px-2 py-1 rounded-0 font-medium ${getRoleColor(
                                  userItem.role
                                )} ${user?.role !== "SUPER_ADMIN" ? "cursor-not-allowed" : ""}`}
                              >
                                {ROLES.map((role) => (
                                  <option key={role.value} value={role.value}>
                                    {role.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={status}
                                onChange={(e) => handleStatusUpdate(userItem.id, e.target.value)}
                                className={`text-sm px-2 py-1 rounded-0 font-medium ${getStatusColor(status)}`}
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="SUSPENDED">Suspended</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(userItem.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => router.push(`/admin/users/${userItem.id}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => router.push(`/admin/users/${userItem.id}/edit`)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {usersData?.meta?.totalPages && usersData?.meta?.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {usersData?.meta?.page} of {usersData?.meta?.totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange((usersData?.meta?.page ?? 2) - 1)}
                          disabled={usersData?.meta?.page === 1}
                          className="px-3 py-1 border border-gray-300 rounded-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange((usersData?.meta?.page ?? 0) + 1)}
                          disabled={usersData?.meta?.page === usersData?.meta?.totalPages}
                          className="px-3 py-1 border border-gray-300 rounded-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 text-center">
                <FiUserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 