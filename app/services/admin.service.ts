import axiosInstance from '../lib/axios';
import {
  IDashboardStats,
  IOrderAnalytics,
  IUserAnalytics,
  IActivityLog,
  IActivityFilters,
  IUserListResponse,
  IUserFilters,
  IEmailData,
  IAnalyticsFilters
} from '../types/admin.type';

const adminService = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<IDashboardStats> => {
    const response = await axiosInstance.get('/api/v1/admin/dashboard');
    return response.data.data;
  },

  // Order Analytics
  getOrderAnalytics: async (filters?: IAnalyticsFilters): Promise<IOrderAnalytics> => {
    const response = await axiosInstance.get('/api/v1/admin/analytics/orders', { params: filters });
    return response.data.data;
  },

  // User Analytics
  getUserAnalytics: async (filters?: IAnalyticsFilters): Promise<IUserAnalytics> => {
    const response = await axiosInstance.get('/api/v1/admin/analytics', {
      params: { ...filters, type: 'user' }
    });
    return response.data.data;
  },

  // Activity Log
  getActivityLog: async (filters?: IActivityFilters): Promise<{ data: IActivityLog[]; meta: Record<string, unknown> }> => {
    const response = await axiosInstance.get('/api/v1/admin/analytics', { params: filters });
    return response.data.data;
  },

  // User Management
  getUsers: async (filters?: IUserFilters): Promise<IUserListResponse> => {
    const response = await axiosInstance.get('/api/v1/admin/users', { params: filters });
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  },

  updateUserRole: async (userId: string, role: string): Promise<void> => {
    await axiosInstance.put(`/api/v1/admin/users/${userId}/role`, { role });
  },

  updateUserStatus: async (userId: string, status: string): Promise<void> => {
    await axiosInstance.put(`/api/v1/admin/users/${userId}/status`, { status });
  },

  // Email Management
  sendEmail: async (emailData: IEmailData): Promise<void> => {
    await axiosInstance.post('/api/v1/admin/emails/send', emailData);
  },

  // Analytics with caching
  getAnalytics: async (filters?: IAnalyticsFilters): Promise<Record<string, unknown>> => {
    const response = await axiosInstance.get('/api/v1/admin/analytics', { params: filters });
    return response.data.data;
  },
};

export default adminService; 