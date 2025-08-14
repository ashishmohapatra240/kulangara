import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { IAuthResponse } from '../types/auth.type';
import { getErrorMessage } from '../lib/utils';

type IUser = IAuthResponse['user'] | null;

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const cachedUser = queryClient.getQueryData<IUser>(['user']);
    const { data: user, isLoading: isLoadingUser } = useQuery<IUser>({
        queryKey: ['user'],
        queryFn: async (): Promise<IUser> => {
            try {
                const response = await authService.refreshToken();
                return response.user || null;
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 401) {
                    queryClient.setQueryData(['user'], null);
                    return null;
                }
                return null;
            }
        },
        enabled: !cachedUser,
        initialData: cachedUser,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data.user);
            toast.success('Login successful!');
            // Avoid overriding admin-specific redirects; only push if not on admin login pages
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
                router.push('/');
            }
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data.user);
            toast.success('Registration successful!');
            router.push('/');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success('Logged out successfully');
            router.push('/login');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: () => {
            toast.success('Password reset instructions sent to your email');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });

    return {
        user,
        isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        forgotPassword: forgotPasswordMutation.mutate,
        forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
        forgotPasswordLoading: forgotPasswordMutation.isPending,
        isAuthenticated: !!user,
    };
};