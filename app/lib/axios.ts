import axios from 'axios';
import { queryClient } from './queryClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Public axios instance for unauthenticated/public API calls
export const publicAxios = axios.create({
    baseURL: API_URL,
    withCredentials: false,
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

        const requestUrl = typeof originalRequest?.url === 'string' ? originalRequest.url : '';
        const public401SafePaths = ['/api/v1/products'];
        const isPublicPath = public401SafePaths.some((p) => requestUrl.startsWith(p));

        const isAuthPage = typeof window !== 'undefined' && (
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/register')
        );

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/v1/auth/refresh') &&
            !isAuthPage &&
            !isPublicPath
        ) {
            originalRequest._retry = true;

            try {
                const response = await axiosInstance.post('/api/v1/auth/refresh');

                const refreshedUser = response.data?.data?.user ?? response.data?.user ?? null;
                if (refreshedUser && queryClient) {
                    queryClient.setQueryData(['user'], refreshedUser);
                }
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (queryClient) {
                    queryClient.setQueryData(['user'], null);
                }
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname + window.location.search;
                    const isAdminArea = window.location.pathname.startsWith('/admin');
                    const target = isAdminArea ? `/admin/login` : `/login`;
                    const sep = target.includes('?') ? '&' : '?';
                    window.location.href = `${target}${currentPath ? `${sep}next=${encodeURIComponent(currentPath)}` : ''}`;
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;