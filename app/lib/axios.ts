import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env["NEXT_PUBLIC_API_URL"] || 'http://localhost:3000';

let queryClientInstance: any = null;

export const setQueryClientForAxios = (client: any) => {
    queryClientInstance = client;
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[API Config] Using backend URL:', API_URL);
}

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000,
});

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

axiosInstance.interceptors.response.use(
    (response) => {
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

        if (error.response?.headers) {
            const requestId = error.response.headers['x-request-id'] || error.response.headers['X-Request-ID'];
            if (requestId && typeof requestId === 'string' && process.env.NODE_ENV === 'development') {
                console.error(`[Request ID] ${requestId} - Error: ${error.response.status} ${error.response.statusText}`);
            }
        }

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

        if (error.response?.status === 429 && !originalRequest._rateLimitRetry) {
            originalRequest._rateLimitRetry = true;
            
            const retryAfter = error.response.headers['retry-after'] || error.response.headers['Retry-After'];
            const retryAfterSeconds = retryAfter ? parseInt(String(retryAfter), 10) : 5;

            await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));

            return axiosInstance(originalRequest);
        }

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
                if (refreshedUser && queryClientInstance) {
                    queryClientInstance.setQueryData(['user'], refreshedUser);
                }
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (queryClientInstance) {
                    queryClientInstance.setQueryData(['user'], null);
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