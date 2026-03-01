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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";

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
        <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-black">
          <h1 className="text-4xl font-bold tracking-tight">USER MANAGEMENT</h1>
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
              <div className="p-12 text-center">
                <p className="text-black font-bold tracking-wide">LOADING USERS...</p>
              </div>
            ) : users.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-black hover:bg-black">
                      <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                        USER
                      </TableHead>
                      <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                        ROLE
                      </TableHead>
                      <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                        STATUS
                      </TableHead>
                      <TableHead className="px-8 py-4 text-white font-bold tracking-widest">
                        JOINED
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem, index) => {
                      const status = userItem.status;
                      return (
                        <TableRow
                          key={userItem.id}
                          className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <TableCell className="px-8 py-5 border-r border-gray-200">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0">
                                <FiUserCheck className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-black">
                                  {userItem.firstName} {userItem.lastName}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{userItem.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-8 py-5 border-r border-gray-200">
                            <select
                              value={userItem.role}
                              onChange={(e) => handleRoleUpdate(userItem.id, e.target.value)}
                              disabled={user?.role !== "SUPER_ADMIN"}
                              className={`text-xs px-3 py-1.5 font-bold tracking-widest border-2 border-black focus:outline-none ${getRoleColor(userItem.role)} ${user?.role !== "SUPER_ADMIN" ? "cursor-not-allowed opacity-70" : ""}`}
                            >
                              {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell className="px-8 py-5 border-r border-gray-200">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className={
                                  status === "ACTIVE"
                                    ? "bg-black text-white border-black rounded-none tracking-widest text-xs font-bold"
                                    : status === "SUSPENDED"
                                    ? "bg-white text-black border-black rounded-none tracking-widest text-xs font-bold"
                                    : "bg-white text-black border-black rounded-none tracking-widest text-xs font-bold"
                                }
                              >
                                {status}
                              </Badge>
                              <select
                                value={status}
                                onChange={(e) => handleStatusUpdate(userItem.id, e.target.value)}
                                className="text-xs px-2 py-1 border-2 border-black font-bold tracking-widest focus:outline-none"
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="SUSPENDED">Suspended</option>
                              </select>
                            </div>
                          </TableCell>
                          <TableCell className="px-8 py-5 text-sm text-gray-600">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {usersData?.meta?.totalPages && usersData?.meta?.totalPages > 1 && (
                  <div className="px-8 py-5 border-t-2 border-black flex items-center justify-between">
                    <p className="text-sm font-medium text-black tracking-wide">
                      PAGE {usersData?.meta?.page} OF {usersData?.meta?.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange((usersData?.meta?.page ?? 2) - 1)}
                        disabled={usersData?.meta?.page === 1}
                        className="px-4 py-2 border-2 border-black text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        PREVIOUS
                      </button>
                      <button
                        onClick={() => handlePageChange((usersData?.meta?.page ?? 0) + 1)}
                        disabled={usersData?.meta?.page === usersData?.meta?.totalPages}
                        className="px-4 py-2 border-2 border-black text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <FiUserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium tracking-wide">NO USERS FOUND</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 