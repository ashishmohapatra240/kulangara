import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '../services/profile.service';
import {
  IProfileUpdateRequest,
  IChangePasswordRequest,
  IProfile,
  IAddressCreateRequest,
  IAddressUpdateRequest
} from '../types/profile.type';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { getErrorMessage } from '../lib/utils';

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
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await ProfileService.getAddresses();
      return response.data;
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
    addresses: addressesData?.addresses || [],
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