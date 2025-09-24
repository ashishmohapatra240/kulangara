import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import stockService, { ICartValidationItem, ICartValidationResponse } from '../services/stock.service';
import { ICartItem } from '../types/cart.type';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../lib/utils';
import { AxiosError } from 'axios';

export const useCartValidation = () => {
  const [validationResult, setValidationResult] = useState<ICartValidationResponse | null>(null);
  const mutationRef = useRef<ReturnType<typeof useMutation<ICartValidationResponse, AxiosError, ICartItem[]>> | null>(null);

  const validateCartMutation = useMutation({
    mutationFn: async (cartItems: ICartItem[]) => {
      const items: ICartValidationItem[] = cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }));
      
      return await stockService.validateCart(items);
    },
    onSuccess: (result) => {
      setValidationResult(result);
      if (!result.available) {
        toast.error(result.message);
      }
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
      setValidationResult({
        success: false,
        available: false,
        message: 'Unable to validate cart. Please try again.'
      });
    }
  });

  // Keep a stable reference to the mutation
  useEffect(() => {
    mutationRef.current = validateCartMutation;
  }, [validateCartMutation]);

  const validateCart = useCallback(async (cartItems: ICartItem[]): Promise<boolean> => {
    try {
      if (!mutationRef.current) return false;
      const result = await mutationRef.current.mutateAsync(cartItems);
      return result.available;
    } catch {
      return false;
    }
  }, []);

  const clearValidationResult = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validateCart,
    validationResult,
    clearValidationResult,
    isValidating: validateCartMutation.isPending,
    error: validateCartMutation.error
  };
};

export const useStockInfo = (productIds: string[]) => {
  return useQuery({
    queryKey: ['stock-info', productIds],
    queryFn: async () => {
      if (productIds.length === 0) return { success: true, message: '', data: { products: [] } };
      return await stockService.getStockInfo(productIds);
    },
    enabled: productIds.length > 0,
    staleTime: 30000, 
    refetchInterval: 60000,
  });
};

export const useSingleProductStock = (productId: string) => {
  return useQuery({
    queryKey: ['product-stock', productId],
    queryFn: async () => {
      return await stockService.getSingleProductStock(productId);
    },
    enabled: !!productId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useAvailabilityCheck = () => {
  return useMutation({
    mutationFn: async ({ productId, quantity, variantId }: { 
      productId: string; 
      quantity: number; 
      variantId?: string; 
    }) => {
      return await stockService.checkAvailability(productId, quantity, variantId);
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    }
  });
};
