import axiosInstance from '../lib/axios';

export interface IStockInfo {
  productId: string;
  variantId?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
}

export interface ICartValidationItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface ICartValidationResponse {
  success: boolean;
  available: boolean;
  message: string;
  data?: {
    validItems: ICartValidationItem[];
    invalidItems: Array<{
      productId: string;
      variantId?: string;
      requestedQuantity: number;
      availableQuantity: number;
      message: string;
    }>;
  };
}

export interface IStockInfoResponse {
  success: boolean;
  message: string;
  data: {
    products: IStockInfo[];
  };
}

const stockService = {
  // Validate cart items for stock availability
  validateCart: async (items: ICartValidationItem[]): Promise<ICartValidationResponse> => {
    const response = await axiosInstance.post('/api/v1/stock/validate-cart', {
      items
    });
    return response.data;
  },

  // Get stock information for multiple products
  getStockInfo: async (productIds: string[]): Promise<IStockInfoResponse> => {
    const response = await axiosInstance.get('/api/v1/stock/info', {
      params: { productIds: productIds.join(',') }
    });
    return response.data;
  },

  // Get stock information for a single product
  getSingleProductStock: async (productId: string): Promise<IStockInfo> => {
    const response = await axiosInstance.get(`/api/v1/stock/info/${productId}`);
    return response.data.data;
  },

  // Check if specific quantity is available for a product/variant
  checkAvailability: async (productId: string, quantity: number, variantId?: string): Promise<{
    available: boolean;
    availableQuantity: number;
    message: string;
  }> => {
    const response = await axiosInstance.post('/api/v1/stock/check-availability', {
      productId,
      variantId,
      quantity
    });
    return response.data;
  }
};

export default stockService;
