import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { queryClient } from './queryClient';

const API_URL = process.env["NEXT_PUBLIC_API_URL"] || 'http://localhost:3000';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[API Config] Using backend URL:', API_URL);
}

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout
});

// Public axios instance for unauthenticated/public API calls
export const publicAxios = axios.create({
    baseURL: API_URL,
    withCredentials: false,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors and retry logic
axiosInstance.interceptors.response.use(
    (response) => {
        // Log request ID for debugging (if available)
        const requestId = response.headers['x-request-id'] || response.headers['X-Request-ID'];
        if (requestId && typeof requestId === 'string' && process.env.NODE_ENV === 'development') {
            console.log(`[Request ID] ${requestId} - ${response.config.method?.toUpperCase()} ${response.config.url}`);
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _rateLimitRetry?: boolean };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = typeof originalRequest.url === 'string' ? originalRequest.url : '';
        const public401SafePaths = ['/api/v1/products'];
        const isPublicPath = public401SafePaths.some((p) => requestUrl.startsWith(p));

        const isAuthPage = typeof window !== 'undefined' && (
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/register')
        );

        // Log request ID for debugging (if available)
        if (error.response?.headers) {
            const requestId = error.response.headers['x-request-id'] || error.response.headers['X-Request-ID'];
            if (requestId && typeof requestId === 'string' && process.env.NODE_ENV === 'development') {
                console.error(`[Request ID] ${requestId} - Error: ${error.response.status} ${error.response.statusText}`);
            }
        }

        // Log network errors for debugging
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message === 'Network Error') {
            console.error('Network Error Details:', {
                url: originalRequest.url,
                method: originalRequest.method,
                baseURL: API_URL,
                fullURL: `${API_URL}${originalRequest.url}`,
                code: error.code,
                message: error.message,
            });
        }

        // Handle rate limiting (429 Too Many Requests)
        if (error.response?.status === 429 && !originalRequest._rateLimitRetry) {
            originalRequest._rateLimitRetry = true;
            
            const retryAfter = error.response.headers['retry-after'] || error.response.headers['Retry-After'];
            const retryAfterSeconds = retryAfter ? parseInt(String(retryAfter), 10) : 5;

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));

            // Retry the request
            return axiosInstance(originalRequest);
        }

        // Handle 401 Unauthorized (token refresh)
        // Skip for auth endpoints (login, register, google, refresh) to avoid infinite loops
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/api/v1/auth/refresh') &&
            !originalRequest.url?.includes('/api/v1/auth/google') &&
            !originalRequest.url?.includes('/api/v1/auth/login') &&
            !originalRequest.url?.includes('/api/v1/auth/register') &&
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