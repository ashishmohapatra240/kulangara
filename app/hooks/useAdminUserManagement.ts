import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/admin.service';
import { IUserFilters } from '../types/admin.type';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export function useAdminUsers(filters: IUserFilters) {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminService.getUsers(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      adminService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
}