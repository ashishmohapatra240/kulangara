import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    handleAddToCart,
    incrementQuantity,
    decrementQuantity,
    clearError
} from '../store/slices/cartSlice';
import { IAddToCartRequest, IUpdateCartItemRequest } from '../types/cart.type';
import { toast } from 'react-hot-toast';

// Hook to get cart state
export const useCart = () => {
    const dispatch = useAppDispatch();
    const cart = useAppSelector((state) => state.cart);

    // Fetch cart on mount
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    return cart;
};

// Hook to add item to cart with enhanced error handling
export const useAddToCart = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.cart);

    const addItemToCart = async (data: IAddToCartRequest) => {
        try {
            await dispatch(handleAddToCart(data)).unwrap();
            toast.success('Item added to cart successfully!');
        } catch (error) {
            const errorMessage = error as string;
            
            // Handle specific stock errors
            if (errorMessage?.includes('Insufficient stock') || 
                errorMessage?.includes('out of stock') ||
                errorMessage?.includes('not available')) {
                toast.error('This item is no longer available in the requested quantity.');
            } else if (errorMessage?.includes('Product not found')) {
                toast.error('This product is no longer available.');
            } else {
                toast.error(errorMessage || 'Failed to add item to cart');
            }
            
            throw error; // Re-throw for component handling
        }
    };

    return { addItemToCart, loading };
};

// Hook to update cart item
export const useUpdateCartItem = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.cart);

    const updateItem = async (itemId: string, data: IUpdateCartItemRequest) => {
        try {
            await dispatch(updateCartItem({ itemId, data })).unwrap();
            toast.success('Cart updated successfully!');
        } catch (error) {
            toast.error(error as string || 'Failed to update cart item');
        }
    };

    return { updateItem, loading };
};

// Hook to remove item from cart
export const useRemoveFromCart = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.cart);

    const removeItem = async (itemId: string) => {
        try {
            await dispatch(removeFromCart(itemId)).unwrap();
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error(error as string || 'Failed to remove item from cart');
        }
    };

    return { removeItem, loading };
};

// Hook to clear cart
export const useClearCart = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.cart);

    const clearAllItems = async () => {
        try {
            await dispatch(clearCart()).unwrap();
            toast.success('Cart cleared successfully');
        } catch (error) {
            toast.error(error as string || 'Failed to clear cart');
        }
    };

    return { clearAllItems, loading };
};

// Hook for optimistic updates (immediate UI feedback)
export const useOptimisticCart = () => {
    const dispatch = useAppDispatch();

    const increment = (itemId: string) => {
        dispatch(incrementQuantity(itemId));
    };

    const decrement = (itemId: string) => {
        dispatch(decrementQuantity(itemId));
    };

    const clearErrorState = () => {
        dispatch(clearError());
    };

    return { increment, decrement, clearErrorState };
};

// Hook to get cart summary
export const useCartSummary = () => {
    const { items, totalItems, subtotal, shipping, total } = useAppSelector((state) => state.cart);

    return {
        items,
        totalItems,
        subtotal,
        shipping,
        total,
        isEmpty: items.length === 0,
    };
};