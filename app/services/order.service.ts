import axiosInstance from '../lib/axios';
import { IOrderRequest, IOrderResponse, IOrderListResponse, IOrderTrackingServiceResponse } from '../types/order.type';

const orderService = {
    // Create a new order
    createOrder: async (data: IOrderRequest): Promise<IOrderResponse> => {
        const response = await axiosInstance.post('/api/v1/orders', data);
        return response.data;
    },

    // Get order by ID
    getOrder: async (orderId: string): Promise<IOrderResponse> => {
        const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
        return response.data;
    },

    // Cancel order
    cancelOrder: async (orderId: string): Promise<IOrderResponse> => {
        const response = await axiosInstance.post(`/api/v1/orders/${orderId}/cancel`);
        return response.data;
    },

    // Track order
    trackOrder: async (orderId: string): Promise<IOrderTrackingServiceResponse> => {
        const response = await axiosInstance.get(`/api/v1/orders/${orderId}/track`);
        return response.data;
    },

    // Get user orders (for customers)
    getUserOrders: async (): Promise<IOrderListResponse> => {
        const response = await axiosInstance.get('/api/v1/orders/list');
        return response.data;
    },

    // Get all orders (for admin)
    getAllOrders: async (): Promise<IOrderListResponse> => {
        const response = await axiosInstance.get('/api/v1/orders/admin/list');
        return response.data;
    },

    // Update order status (for admin)
    updateOrderStatus: async (orderId: string, status: string): Promise<IOrderResponse> => {
        const response = await axiosInstance.put(`/api/v1/orders/admin/${orderId}/status`, { status });
        return response.data;
    }
};

export default orderService;