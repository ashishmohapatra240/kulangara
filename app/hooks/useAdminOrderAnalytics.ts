import { useQuery } from "@tanstack/react-query";
import adminService from "@/app/services/admin.service";
import { IOrderAnalytics, IAnalyticsFilters } from "@/app/types/admin.type";

interface IOrderAnalyticsApiResponse {
    totalRevenue?: number;
    totalOrders?: number;
    averageOrderValue?: number;
    statusDistribution?: Array<{ status: string; count: number }>;
    paymentAnalytics?: {
        methodDistribution?: Array<{ method: string; count: number }>;
    };
    topProducts?: Array<{
        productId?: string;
        productDetails?: {
            id?: string;
            name?: string;
        };
        quantity?: number;
        revenue?: number;
    }>;
    locationAnalytics?: {
        topCities?: Array<{ city?: string; orders?: number; revenue?: number }>;
    };
    growthAnalytics?: {
        revenueGrowth?: number;
        orderGrowth?: number;
        previousPeriodRevenue?: number;
        previousPeriodOrders?: number;
    };
    customerAnalytics?: {
        totalCustomers?: number;
        repeatCustomers?: number;
        customerLifetimeValue?: number;
    };
}

function adaptOrderAnalytics(apiData: IOrderAnalyticsApiResponse): IOrderAnalytics {
    // Ensure all required status keys are present
    const statusKeys = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];
    const statusObj: {
        pending: number;
        confirmed: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    } = {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
    };
    (apiData.statusDistribution || []).forEach((s: { status: string; count: number }) => {
        const key = (s.status || '').toLowerCase().trim();
        if (statusKeys.includes(key)) {
            (statusObj as Record<string, number>)[key] = s.count || 0;
        }
        else if (key && s.count > 0 && process.env["NODE_ENV"] === 'development') {
            console.warn(`Unmapped order status: ${key} with count: ${s.count}`);
        }
    });

    const paymentObj: { razorpay: number; cod: number } = {
        razorpay: 0,
        cod: 0,
    };
    (apiData.paymentAnalytics?.methodDistribution || []).forEach((m: { method: string; count: number }) => {
        const key = (m.method || '').toLowerCase().trim();
        
        // Map various payment methods to simplified categories
        if (key === 'razorpay' || key === 'card' || key === 'upi' || key === 'netbanking' || key === 'wallet') {
            paymentObj.razorpay += m.count || 0;
        } else if (key === 'cod' || key === 'cash_on_delivery') {
            paymentObj.cod += m.count || 0;
        }
        // Log unmapped payment methods for debugging
        else if (key && m.count > 0 && process.env["NODE_ENV"] === 'development') {
            console.warn(`Unmapped payment method: ${key} with count: ${m.count}`);
        }
    });

    // Adapt topProducts
    const topProducts = (apiData.topProducts || []).map((p: { 
        productId?: string; 
        productDetails?: { 
            id?: string; 
            name?: string; 
        }; 
        quantity?: number; 
        revenue?: number 
    }) => ({
        id: p.productId || p.productDetails?.id || 'unknown',
        name: p.productDetails?.name || "Unknown Product",
        orders: p.quantity || 0,
        revenue: p.revenue || 0,
    }));

    // Adapt location analytics
    const topCities = (apiData.locationAnalytics?.topCities || []).map((c: { city?: string; orders?: number; revenue?: number }) => ({
        city: c.city || "Unknown City",
        orders: c.orders || 0,
        revenue: c.revenue || 0,
    }));

    return {
        revenue: {
            total: apiData.totalRevenue || 0,
            daily: [], // Adapt dailyOrders if needed
            growth: apiData.growthAnalytics?.revenueGrowth || 0,
        },
        orders: {
            total: apiData.totalOrders || 0,
            daily: [], // Adapt dailyOrders if needed
            growth: apiData.growthAnalytics?.orderGrowth || 0,
        },
        aov: {
            current: apiData.averageOrderValue || 0,
            previous: apiData.growthAnalytics?.previousPeriodRevenue && apiData.growthAnalytics?.previousPeriodOrders
                ? apiData.growthAnalytics.previousPeriodRevenue / apiData.growthAnalytics.previousPeriodOrders
                : 0,
            growth: (() => {
                const current = apiData.averageOrderValue || 0;
                const previous = apiData.growthAnalytics?.previousPeriodRevenue && apiData.growthAnalytics?.previousPeriodOrders
                    ? apiData.growthAnalytics.previousPeriodRevenue / apiData.growthAnalytics.previousPeriodOrders
                    : 0;
                return previous > 0 ? ((current - previous) / previous) * 100 : 0;
            })(),
        },
        statusDistribution: statusObj,
        paymentAnalytics: {
            methodDistribution: paymentObj,
            successRate: 0, // Not provided
        },
        customerAnalytics: {
            newCustomers: apiData.customerAnalytics?.totalCustomers || 0,
            returningCustomers: apiData.customerAnalytics?.repeatCustomers || 0,
            averageOrderValue: apiData.customerAnalytics?.customerLifetimeValue || 0,
        },
        locationAnalytics: {
            topCities,
        },
        growthAnalytics: {
            revenueGrowth: apiData.growthAnalytics?.revenueGrowth || 0,
            orderGrowth: apiData.growthAnalytics?.orderGrowth || 0,
            customerGrowth: 0, // Not provided
        },
        topProducts,
    };
}

export function useAdminOrderAnalytics(filters?: IAnalyticsFilters) {
    const query = useQuery<IOrderAnalyticsApiResponse>({
        queryKey: ["admin-order-analytics", filters],
        queryFn: async () => {
            const response = await adminService.getOrderAnalytics(filters);
            return response as IOrderAnalyticsApiResponse;
        },
        staleTime: 5 * 60 * 1000,
    });

    const adaptedData = query.data ? adaptOrderAnalytics(query.data) : undefined;

    return {
        ...query,
        data: adaptedData,
    };
}