import { useQuery } from "@tanstack/react-query";
import adminService from "@/app/services/admin.service";
import { IOrderAnalytics, IAnalyticsFilters } from "@/app/types/admin.type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptOrderAnalytics(apiData: any): IOrderAnalytics {
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
        const key = (s.status || '').toLowerCase();
        if (statusKeys.includes(key)) {
            (statusObj as Record<string, number>)[key] = s.count || 0;
        }
    });

    // Ensure all required payment method keys are present
    const paymentKeys = ["card", "upi", "cod"];
    const paymentObj: { card: number; upi: number; cod: number } = {
        card: 0,
        upi: 0,
        cod: 0,
    };
    (apiData.paymentAnalytics?.methodDistribution || []).forEach((m: { method: string; count: number }) => {
        const key = (m.method || '').toLowerCase();
        if (paymentKeys.includes(key)) {
            (paymentObj as Record<string, number>)[key] = m.count || 0;
        }
    });

    // Adapt topProducts
    const topProducts = (apiData.topProducts || []).map((p: { productId?: string; productDetails?: { id?: string; name?: string; image?: string }; quantity?: number; revenue?: number }) => ({
        id: p.productId || p.productDetails?.id,
        name: p.productDetails?.name || "Unknown Product",
        orders: p.quantity || 0,
        revenue: p.revenue || 0,
        image: p.productDetails?.image || "/images/placeholder.jpg",
    }));

    // Adapt location analytics
    const topCities = (apiData.locationAnalytics?.topCities || []).map((c: { city: string; orders: number; revenue: number }) => ({
        city: c.city,
        orders: c.orders,
        revenue: c.revenue,
    }));

    return {
        revenue: {
            total: apiData.totalRevenue,
            daily: [], // Adapt dailyOrders if needed
            growth: apiData.growthAnalytics?.revenueGrowth,
        },
        orders: {
            total: apiData.totalOrders,
            daily: [], // Adapt dailyOrders if needed
            growth: apiData.growthAnalytics?.orderGrowth,
        },
        aov: {
            current: apiData.averageOrderValue,
            previous: apiData.growthAnalytics?.previousPeriodRevenue
                ? apiData.growthAnalytics.previousPeriodRevenue / apiData.growthAnalytics.previousPeriodOrders
                : 0,
            growth: 0, // Calculate if needed
        },
        statusDistribution: statusObj,
        paymentAnalytics: {
            methodDistribution: paymentObj,
            successRate: 0, // Not provided
        },
        customerAnalytics: {
            newCustomers: apiData.customerAnalytics?.totalCustomers,
            returningCustomers: apiData.customerAnalytics?.repeatCustomers,
            averageOrderValue: apiData.customerAnalytics?.customerLifetimeValue,
        },
        locationAnalytics: {
            topCities,
        },
        growthAnalytics: {
            revenueGrowth: apiData.growthAnalytics?.revenueGrowth,
            orderGrowth: apiData.growthAnalytics?.orderGrowth,
            customerGrowth: 0, // Not provided
        },
        topProducts,
    };
}

export function useAdminOrderAnalytics(filters?: IAnalyticsFilters) {
    const query = useQuery({
        queryKey: ["admin-order-analytics", filters],
        queryFn: () => adminService.getOrderAnalytics(filters),
        staleTime: 5 * 60 * 1000,
    });

    const adaptedData = query.data ? adaptOrderAnalytics(query.data) : undefined;

    return {
        ...query,
        data: adaptedData,
    };
}