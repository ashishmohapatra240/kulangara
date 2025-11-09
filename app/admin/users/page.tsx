"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { IUser, IUserFilters } from "@/app/types/admin.type";
import { FiSearch, FiUserCheck, FiUserX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from "@/app/hooks/useAdminUserManagement";
import { Card, CardContent } from "@/app/components/ui/card";

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
        return "bg-black text-white";
      case "INACTIVE":
        return "bg-white text-black border border-black";
      case "SUSPENDED":
        return "bg-white text-black border border-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-black text-white";
      case "ADMIN":
        return "bg-gray-800 text-white";
      case "DELIVERY_PARTNER":
        return "bg-gray-600 text-white";
      case "CUSTOMER":
        return "bg-white text-black border border-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-base font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center pt-4 sm:pt-6 mb-6 pb-4 border-b">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {usersError && (
          <Card className="border-destructive mb-6">
            <CardContent className="p-4 sm:p-6">
              <p className="text-destructive font-semibold text-sm">Error loading users. Please try refreshing.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6 sm:space-y-8 pb-8">
          {/* Filters */}
          <div className="bg-white border-2 border-black p-8">
            <h2 className="text-2xl font-bold mb-8 tracking-tight">FILTERS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">SEARCH</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="SEARCH BY NAME OR EMAIL"
                    className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none font-medium placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">ROLE</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium"
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
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">STATUS</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium"
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
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">LIMIT</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium"
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
                  className="w-full px-4 py-3 bg-black text-white border-2 border-black font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border-2 border-black overflow-hidden">
            <div className="px-8 py-6 border-b-2 border-black bg-white">
              <h2 className="text-2xl font-bold text-black tracking-tight">USERS</h2>
              {usersData && usersData.meta && (
                <p className="text-sm font-medium text-black mt-2 tracking-wide">
                  SHOWING {((usersData?.meta?.page ?? 1) - 1) * (usersData?.meta?.limit ?? 10) + 1} TO {Math.min((usersData?.meta?.page ?? 1) * (usersData?.meta?.limit ?? 10), usersData?.meta?.total ?? 0)} OF {usersData?.meta?.total ?? 0} USERS
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => {
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