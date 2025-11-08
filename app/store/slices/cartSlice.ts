import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import cartService from '../../services/cart.service';
import { ICartState, IAddToCartRequest, IUpdateCartItemRequest, ICartItem, ICartResponse } from '../../types/cart.type';
import { RootState } from '..';
import { AxiosError } from 'axios';
import { getErrorMessage } from '../../lib/utils';

// Initial state
const initialState: ICartState = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    total: 0,
    loading: false,
    error: null,
};

// Utility to compute cart totals consistently
function applyCartTotals(state: ICartState, items: ICartItem[], shipping?: number) {
    state.items = items;
    state.totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    state.subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    state.shipping = typeof shipping === 'number' ? shipping : state.shipping || 0;
    state.total = state.subtotal + state.shipping;
}

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartService.getCart();
            return response; // ICartResponse
        } catch (error: unknown) {
            // Don't treat 401/403 as errors - just return empty cart
            if (error instanceof AxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
                return {
                    success: true,
                    message: 'Please log in to view your cart',
                    data: {
                        items: [],
                        totalItems: 0,
                        subtotal: 0,
                        shipping: 0,
                        total: 0
                    }
                };
            }
            const errorMessage = error instanceof AxiosError ? getErrorMessage(error) : 'Failed to fetch cart';
            return rejectWithValue(errorMessage);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (data: IAddToCartRequest, { rejectWithValue }) => {
        try {
            const response = await cartService.addToCart(data);
            return response; // ICartResponse
        } catch (error: unknown) {
            const errorMessage = error instanceof AxiosError ? getErrorMessage(error) : 'Failed to add item to cart';
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, data }: { itemId: string; data: IUpdateCartItemRequest }, { rejectWithValue }) => {
        try {
            const response = await cartService.updateCartItem(itemId, data);
            return response; // ICartResponse
        } catch (error: unknown) {
            const errorMessage = error instanceof AxiosError ? getErrorMessage(error) : 'Failed to update cart item';
            return rejectWithValue(errorMessage);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId: string, { rejectWithValue }) => {
        try {
            const response = await cartService.removeFromCart(itemId);
            return response; // ICartResponse
        } catch (error: unknown) {
            const errorMessage = error instanceof AxiosError ? getErrorMessage(error) : 'Failed to remove item from cart';
            return rejectWithValue(errorMessage);
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartService.clearCart();
            return response; // ICartResponse
        } catch (error: unknown) {
            const errorMessage = error instanceof AxiosError ? getErrorMessage(error) : 'Failed to clear cart';
            return rejectWithValue(errorMessage);
        }
    }
);

export const handleAddToCart = createAsyncThunk(
    'cart/handleAddToCart',
    async (data: IAddToCartRequest, { getState, dispatch }) => {
        const state = getState() as RootState;
        const existingItem = state.cart.items.find(item => item.product.id === data.productId);

        if (existingItem) {
            const newQuantity = existingItem.quantity + (data.quantity || 1);
            await dispatch(updateCartItem({
                itemId: existingItem.id,
                data: { quantity: newQuantity }
            }));
        } else {
            await dispatch(addToCart(data));
        }
    }
);

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Local actions for immediate UI updates
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        // Optimistic updates
        incrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                item.quantity += 1;
                // Recalculate totals
                state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                state.total = state.subtotal + state.shipping;
            }
        },
        decrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                // Recalculate totals
                state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                state.total = state.subtotal + state.shipping;
            }
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: ICartState) => {
            state.loading = true;
            state.error = null;
        };

        const handleRejected = (state: ICartState, action: { payload: unknown; }) => {
            state.loading = false;
            state.error = (action.payload as string) || 'An unknown error occurred';
        };

        // This is the only thunk that should update the cart data state
        builder
            .addCase(fetchCart.pending, handlePending)
            .addCase(fetchCart.fulfilled, (state, action) => {
                // Validate payload structure before using
                const payload = action.payload as ICartResponse;
                if (payload && typeof payload === 'object' && payload.data) {
                    const items = Array.isArray(payload.data.items) ? payload.data.items : [];
                    applyCartTotals(state, items, payload.data.shipping);
                }
                state.loading = false;
            })
            .addCase(fetchCart.rejected, handleRejected);

        // Add optimistic updates for addToCart
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const payload = action.payload as ICartResponse;
                if (payload && typeof payload === 'object' && payload.data) {
                    const items = Array.isArray(payload.data.items) ? payload.data.items : [];
                    applyCartTotals(state, items, payload.data.shipping);
                }
                state.loading = false;
            })
            .addCase(addToCart.rejected, handleRejected);

        // Add optimistic updates for updateCartItem
        builder
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                const payload = action.payload as ICartResponse;
                if (payload && typeof payload === 'object' && payload.data) {
                    const items = Array.isArray(payload.data.items) ? payload.data.items : [];
                    applyCartTotals(state, items, payload.data.shipping);
                }
                state.loading = false;
            })
            .addCase(updateCartItem.rejected, handleRejected);

        builder
            .addCase(removeFromCart.pending, handlePending)
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const payload = action.payload as ICartResponse;
                if (payload && typeof payload === 'object' && payload.data) {
                    const items = Array.isArray(payload.data.items) ? payload.data.items : [];
                    applyCartTotals(state, items, payload.data.shipping);
                }
                state.loading = false;
            })
            .addCase(removeFromCart.rejected, handleRejected);

        // Clear cart can be an exception where we optimistically clear the state
        builder
            .addCase(clearCart.pending, handlePending)
            .addCase(clearCart.fulfilled, (state, action) => {
                const payload = action.payload as ICartResponse;
                if (payload && typeof payload === 'object' && payload.data) {
                    const items = Array.isArray(payload.data.items) ? payload.data.items : [];
                    applyCartTotals(state, items, payload.data.shipping);
                }
                state.loading = false;
            })
            .addCase(clearCart.rejected, handleRejected);
    },
});

export const {
    setLoading,
    clearError,
    incrementQuantity,
    decrementQuantity
} = cartSlice.actions;

export default cartSlice.reducer;