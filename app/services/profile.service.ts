import axiosInstance from '../lib/axios';
import { IProfileResponse, IProfileUpdateRequest, IChangePasswordRequest, IChangePasswordResponse, IAddressResponse, IAddressCreateRequest, IAddressUpdateRequest, ISingleAddressResponse } from '../types/profile.type';

// Admin: List users
const listUsers = async (search?: string) => {
    const response = await axiosInstance.get('/api/v1/admin/users', {
        params: search ? { search } : undefined,
    });
    return response.data;
};

// Admin: Update user role
const updateUserRole = async (userId: string, role: string) => {
    const response = await axiosInstance.put(`/api/v1/admin/users/${userId}/role`, { role });
    return response.data;
};

// Admin: Update user status
const updateUserStatus = async (userId: string, status: string) => {
    const response = await axiosInstance.put(`/api/v1/admin/users/${userId}/status`, { status });
    return response.data;
};

// Admin: Send email
const sendAdminEmail = async (data: {
    subject: string;
    to: string[];
    body: string;
    buttonText?: string;
    buttonUrl?: string;
    previewText?: string;
    footerText?: string;
}) => {
    const response = await axiosInstance.post('/api/v1/admin/emails/send', data);
    return response.data;
};

export const ProfileService = {
    getProfile: async (): Promise<IProfileResponse> => {
        const response = await axiosInstance.get('/api/v1/users/profile');
        return response.data;
    },

    updateProfile: async (data: IProfileUpdateRequest): Promise<IProfileResponse> => {
        const response = await axiosInstance.put('/api/v1/users/profile', data);
        return response.data;
    },

    changePassword: async (data: IChangePasswordRequest): Promise<IChangePasswordResponse> => {
        const response = await axiosInstance.post('/api/v1/users/change-password', data);
        return response.data;
    },

    deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete('/api/v1/users/account');
        return response.data;
    },

    getAddresses: async (): Promise<IAddressResponse> => {
        const response = await axiosInstance.get('/api/v1/users/addresses');
        return response.data;
    },

    createAddress: async (data: IAddressCreateRequest): Promise<IAddressResponse> => {
        const response = await axiosInstance.post('/api/v1/users/addresses', data);
        return response.data;
    },

    updateAddress: async (id: string, data: Omit<IAddressUpdateRequest, 'id'>): Promise<IAddressResponse> => {
        const response = await axiosInstance.put(`/api/v1/users/addresses/${id}`, data);
        return response.data;
    },

    deleteAddress: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete(`/api/v1/users/addresses/${id}`);
        return response.data;
    },

    setDefaultAddress: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.put(`/api/v1/users/addresses/${id}/default`);
        return response.data;
    },

    getAddressById: async (id: string): Promise<ISingleAddressResponse> => {
        const response = await axiosInstance.get(`/api/v1/users/addresses/${id}`);
        return response.data;
    },

    listUsers,
    updateUserRole,
    updateUserStatus,
    sendAdminEmail,
};