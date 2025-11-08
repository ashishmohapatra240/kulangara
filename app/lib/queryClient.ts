import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - increased from 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes cache time (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false, // Prevent unnecessary refetches
            refetchOnMount: false, // Only refetch if data is stale
        },
        mutations: {
            retry: 0, // Don't retry mutations by default
        },
    },
});