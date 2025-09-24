export interface IDashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    today: number;
    aov: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    lowStockProducts: number;
    pendingOrders: number;
  };
}

export interface IOrderAnalytics {
  revenue: {
    total: number;
    daily: Array<{
      date: string;
      amount: number;
    }>;
    growth: number;
  };
  orders: {
    total: number;
    daily: Array<{
      date: string;
      count: number;
    }>;
    growth: number;
  };
  aov: {
    current: number;
    previous: number;
    growth: number;
  };
  statusDistribution: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  paymentAnalytics: {
    methodDistribution: {
      razorpay: number;
      cod: number;
    };
    successRate: number;
  };
  customerAnalytics: {
    newCustomers: number;
    returningCustomers: number;
    averageOrderValue: number;
  };
  locationAnalytics: {
    topCities: Array<{
      city: string;
      orders: number;
      revenue: number;
    }>;
  };
  growthAnalytics: {
    revenueGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
}

export interface IUserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: Array<{
    date: string;
    count: number;
  }>;
  userGrowth: number;
  roleDistribution: {
    customer: number;
    admin: number;
    superAdmin: number;
    deliveryPartner: number;
  };
}

export interface IActivityLog {
  id: string;
  type: 'order' | 'user' | 'product' | 'system';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface IActivityFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  event?: string;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'DELIVERY_PARTNER';
  isActive: boolean;
  phone?: string;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface IUserListResponse {
  data: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IUserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface IEmailData {
  to: string[];
  subject: string;
  body: string;
  template?: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  previewText?: string;
}

export interface IEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface IAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
  event?: string;
  page?: number;
  limit?: number;
}