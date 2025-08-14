import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '../services/profile.service';
import {
  IProfileUpdateRequest,
  IChangePasswordRequest,
  IProfile,
  IAddress,
  IAddressCreateRequest,
  IAddressUpdateRequest,
  IAddressResponse
} from '../types/profile.type';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { getErrorMessage } from '../lib/utils';
import { useEffect } from 'react';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const { data: profile, isLoading, error } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await ProfileService.getProfile();
      return response.data;
    },
  });

  const {
    data: addressesData,
    isLoading: isLoadingAddresses,
    error: addressesError
  } = useQuery<IAddress[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response: IAddressResponse = await ProfileService.getAddresses();
      // Normalize to return just the array of addresses regardless of server envelope shape
      return response.data?.addresses ?? [];
    },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: IProfileUpdateRequest) => ProfileService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['profile'], response.data);
      toast.success('Profile updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: IChangePasswordRequest) => ProfileService.changePassword(data),
    onSuccess: () => {
      setIsChangePasswordModalOpen(false);
      toast.success('Password changed successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => ProfileService.deleteAccount(),
    onSuccess: () => {
      setIsDeleteAccountModalOpen(false);
      toast.success('Account deleted successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: createAddress, isPending: isCreatingAddress } = useMutation({
    mutationFn: (data: IAddressCreateRequest) => ProfileService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: updateAddress, isPending: isUpdatingAddress } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IAddressUpdateRequest }) =>
      ProfileService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: deleteAddress, isPending: isDeletingAddress } = useMutation({
    mutationFn: (id: string) => ProfileService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useMutation({
    mutationFn: (id: string) => ProfileService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleUpdateProfile = useCallback((data: IProfileUpdateRequest) => {
    updateProfile(data);
  }, [updateProfile]);

  const handleChangePassword = useCallback((data: IChangePasswordRequest) => {
    changePassword(data);
  }, [changePassword]);

  const handleDeleteAccount = useCallback(() => {
    deleteAccount();
  }, [deleteAccount]);

  const handleCreateAddress = useCallback((data: IAddressCreateRequest) => {
    createAddress(data);
  }, [createAddress]);

  const handleUpdateAddress = useCallback((id: string, data: IAddressUpdateRequest) => {
    updateAddress({ id, data });
  }, [updateAddress]);

  const handleDeleteAddress = useCallback((id: string) => {
    deleteAddress(id);
  }, [deleteAddress]);

  const handleSetDefaultAddress = useCallback((id: string) => {
    setDefaultAddress(id);
  }, [setDefaultAddress]);

  return {
    profile,
    addresses: addressesData || [],
    isLoading,
    isLoadingAddresses,
    error,
    addressesError,
    isUpdating,
    isChangingPassword,
    isDeleting,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSettingDefault,
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    isDeleteAccountModalOpen,
    setIsDeleteAccountModalOpen,
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteAccount,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  };
};

// Fetch all users (admin)
export function useAdminUsers(search?: string) {
  const query = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      const response = await ProfileService.listUsers(search);
      if (response.status === "success") {
        return response.data.data;
      } else {
        throw new Error(response.message || "Failed to load users");
      }
    },
    staleTime: 1000 * 60 * 2,
  });
  useEffect(() => {
    if (query.error) {
      toast.error(getErrorMessage(query.error as AxiosError));
    }
  }, [query.error]);
  return query;
}

// Update user role (admin)
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await ProfileService.updateUserRole(userId, role);
      if (response.status === "success" || response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update user role");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated successfully!");
    },
    onError: (error: Error | AxiosError) => {
      toast.error(getErrorMessage(error as AxiosError));
    },
  });
}

// Update user status (admin)
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const response = await ProfileService.updateUserStatus(userId, status);
      if (response.status === "success" || response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update user status");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated successfully!");
    },
    onError: (error: Error | AxiosError) => {
      toast.error(getErrorMessage(error as AxiosError));
    },
  });
}

// Send admin email
export function useSendAdminEmail() {
  return useMutation({
    mutationFn: ProfileService.sendAdminEmail,
    onSuccess: () => {
      toast.success("Email sent successfully!");
    },
    onError: (error: Error | AxiosError) => {
      toast.error(getErrorMessage(error as AxiosError));
    },
  });
}