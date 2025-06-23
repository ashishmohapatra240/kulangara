import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { AuthResponse } from '../types/auth.type';
import { getErrorMessage } from '../lib/utils';

type User = AuthResponse['user'] | null;

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: user, isLoading: isLoadingUser } = useQuery<User>({
        queryKey: ['user'],
        queryFn: async (): Promise<User> => {
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
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data.user);
            toast.success('Login successful!');
            router.push('/');
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
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        forgotPassword: forgotPasswordMutation.mutate,
        isAuthenticated: !!user,
    };
};