import axiosInstance from './axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

// Configure axios to include credentials
axiosInstance.defaults.withCredentials = true;

const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await axiosInstance.post(`/api/v1/auth/login`, credentials);
        return response.data.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await axiosInstance.post(`/api/v1/auth/register`, credentials);
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post(`/api/v1/auth/logout`);
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await axiosInstance.post(`/api/v1/auth/refresh`);
        return response.data.data;
    },

    forgotPassword: async (email: string): Promise<void> => {
        await axiosInstance.post(`/api/v1/auth/forgot-password`, { email });
    },

    resetPassword: async (token: string, password: string, newPassword: string): Promise<void> => {
        await axiosInstance.post(`/api/v1/auth/reset-password`, { token, password, newPassword });
    },

    verifyEmail: async (token: string): Promise<void> => {
        await axiosInstance.post(`/api/v1/auth/verify-email/${token}`);
    },

    resendVerification: async (email: string): Promise<void> => {
        await axiosInstance.post(`/api/v1/auth/resend-verification`, { email });
    },
};

export default authService;