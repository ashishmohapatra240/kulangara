import axios from 'axios';
import { queryClient } from '../lib/queryClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loop: don't retry if the request was to the refresh endpoint
        // or if already retried, or if on login/register page
        const isAuthPage = typeof window !== 'undefined' && (
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/register')
        );

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/v1/auth/refresh') &&
            !isAuthPage
        ) {
            originalRequest._retry = true;

            try {
                const response = await axiosInstance.post('/api/v1/auth/refresh');
                // Update the auth state in React Query
                if (response.data?.user) {
                    if (queryClient) {
                        queryClient.setQueryData(['user'], response.data.user);
                    }
                }
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (queryClient) {
                    queryClient.setQueryData(['user'], null);
                }
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;