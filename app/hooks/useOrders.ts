import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import orderService from "@/app/services/order.service";
import { getErrorMessage } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { useEffect } from "react";


// Fetch all orders
export function useOrders() {
    const query = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await orderService.getUserOrders();
            if (response.status === "success") {
                return response.data.data;
            } else {
                throw new Error(response.message || "Failed to load orders");
            }
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
    useEffect(() => {
        if (query.error) {
            toast.error(getErrorMessage(query.error as AxiosError));
        }
    }, [query.error]);
    return query;
}

// Fetch a single order by ID
export function useOrder(orderId: string) {
    const query = useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const response = await orderService.getOrder(orderId);
            if (response.status === "success" || response.success) {
                return response.data.order;
            } else {
                throw new Error(response.message || "Failed to get order");
            }
        },
        enabled: !!orderId,
        staleTime: 1000 * 60 * 2,
    });
    useEffect(() => {
        if (query.error) {
            toast.error(getErrorMessage(query.error as AxiosError));
        }
    }, [query.error]);
    return query;
}

// Track a specific order
export function useTrackOrder(orderId: string) {
    const query = useQuery({
        queryKey: ["order", orderId, "tracking"],
        queryFn: async () => {
            const response = await orderService.trackOrder(orderId);
            if (response.status === "success") {
                return response.data.history || [];
            }
            throw new Error("Failed to track order");
        },
        enabled: !!orderId,
        staleTime: 1000 * 60 * 2,
    });
    useEffect(() => {
        if (query.error) {
            toast.error(getErrorMessage(query.error as AxiosError));
        }
    }, [query.error]);
    return query;
}

// Cancel order mutation
export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderId: string) => {
            const response = await orderService.cancelOrder(orderId);
            if (response.status === "success" || response.success) {
                return response.data;
            } else {
                throw new Error(response.message || "Failed to cancel order");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order cancelled successfully!");
        },
        onError: (error: Error | AxiosError) => {
            toast.error(getErrorMessage(error as AxiosError));
        },
    });
}