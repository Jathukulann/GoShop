import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Initial state
const initialState = {
  cart: {
    items: [],
    subtotal: 0,
    totalItems: 0,
  },
  sessionId: localStorage.getItem('sessionId') || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, thunkAPI) => {
    try {
      const { sessionId } = thunkAPI.getState().cart;
      const response = await api.post('/cart', {
        ...cartData,
        sessionId,
      });

      // Save sessionId if it's a guest cart
      if (response.data.cart.sessionId) {
        localStorage.setItem('sessionId', response.data.cart.sessionId);
      }

      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cart
export const getCart = createAsyncThunk('cart/getCart', async (_, thunkAPI) => {
  try {
    const { sessionId } = thunkAPI.getState().cart;
    const response = await api.get('/cart', {
      params: sessionId ? { sessionId } : {},
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const { sessionId } = thunkAPI.getState().cart;
      const response = await api.put(`/cart/${itemId}`, {
        quantity,
        sessionId,
      });
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from cart
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, thunkAPI) => {
    try {
      const { sessionId } = thunkAPI.getState().cart;
      const response = await api.delete(`/cart/${itemId}`, {
        params: sessionId ? { sessionId } : {},
      });
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const { sessionId } = thunkAPI.getState().cart;
    const response = await api.delete('/cart', {
      params: sessionId ? { sessionId } : {},
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Merge cart on login
export const mergeCart = createAsyncThunk('cart/mergeCart', async (_, thunkAPI) => {
  try {
    const { sessionId } = thunkAPI.getState().cart;
    if (!sessionId) {
      return thunkAPI.rejectWithValue('No guest cart to merge');
    }
    const response = await api.post('/cart/merge', { sessionId });
    localStorage.removeItem('sessionId');
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCartState: (state) => {
      state.cart = {
        items: [],
        subtotal: 0,
        totalItems: 0,
      };
      state.sessionId = null;
      localStorage.removeItem('sessionId');
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.cart;
        if (action.payload.cart.sessionId) {
          state.sessionId = action.payload.cart.sessionId;
        }
        state.message = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.cart;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.cart;
        state.message = action.payload.message;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove cart item
      .addCase(removeCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.cart;
        state.message = action.payload.message;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.cart;
        state.message = action.payload.message;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.cart;
        state.sessionId = null;
        state.message = action.payload.message;
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
