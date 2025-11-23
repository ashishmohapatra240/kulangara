import axiosInstance from '../lib/axios';
import { ILoginCredentials, IRegisterCredentials, IAuthResponse } from '../types/auth.type';

const authService = {
    login: async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
        const response = await axiosInstance.post(`/api/v1/auth/login`, credentials);
        return response.data.data;
    },

    register: async (credentials: IRegisterCredentials): Promise<IAuthResponse> => {
        const response = await axiosInstance.post(`/api/v1/auth/register`, credentials);
        return response.data.data;
    },

    googleAuth: async (token: string): Promise<IAuthResponse> => {
        try {
            const response = await axiosInstance.post(`/api/v1/auth/google`, { token });
            
            console.log('Backend response:', response.data);
            
            // Handle different response formats
            // Expected: { success: true, data: { user: {...}, token: "..." } }
            // Or: { data: { user: {...}, token: "..." } }
            // Or: { user: {...}, token: "..." }
            if (response.data?.data?.user) {
                return response.data.data;
            }
            if (response.data?.user) {
                return response.data;
            }
            
            // If backend returns just { token }, this is an error
            // The backend should return user data along with the token
            console.error('Backend returned incomplete response. Expected user data but got:', response.data);
            throw new Error('Backend response missing user data. Expected format: { data: { user: {...}, token: "..." } }');
        } catch (error: unknown) {
            console.error('Google auth error:', error);
            
            // Provide more helpful error messages
            if (error && typeof error === 'object' && 'code' in error && (error.code === 'ERR_NETWORK' || (error as { message?: string }).message === 'Network Error')) {
                const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || 'http://localhost:3000';
                throw new Error(`Cannot connect to backend at ${apiUrl}/api/v1/auth/google. Please check if the backend server is running and accessible.`);
            }
            
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. The backend server may be slow or unresponsive.');
            }
            
            if (error && typeof error === 'object' && 'response' in error) {
                // Backend responded with an error
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
                const status = axiosError.response?.status;
                const message = axiosError.response?.data?.message || (error instanceof Error ? error.message : 'Unknown error');
                throw new Error(`Backend error (${status}): ${message}`);
            }
            
            if (error instanceof Error) {
                throw error;
            }
            
            throw new Error('Failed to authenticate with Google. Please try again.');
        }
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post(`/api/v1/auth/logout`);
    },

    refreshToken: async (): Promise<IAuthResponse> => {
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