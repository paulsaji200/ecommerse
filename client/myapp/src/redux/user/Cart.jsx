import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Thunk for adding an item to the cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product, { rejectWithValue }) => {
    try {
      console.log(product)
      const response = await api.post('/user/addtocart', { productData: product }, { withCredentials: true });
        getCartAsync();
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);


export const addQuantity = createAsyncThunk(
  'cart/addQuantity',
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/cartupdate/${product_id}`, { quantity }, { withCredentials: true });
      return { product_id, quantity }; // Return product_id and quantity to update the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for deleting an item from the cart
export const deleteCartAsync = createAsyncThunk(
  "cart/deleteCartAsync",
  async (product_id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/deletecart/${product_id}`, { withCredentials: true });
      return product_id; // Return product_id to remove from state
    } catch (error) {
      return rejectWithValue(error.response.data || 'Something went wrong');
    }
  }
);

// Thunk for fetching the cart data
export const getCartAsync = createAsyncThunk(
  'cart/getCartAsync',
  async (_, { rejectWithValue }) => {  
    try {
      const response = await api.get('/user/getcart', { withCredentials: true });
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; 
        state.cart = action.payload; 
        console.log(state.cart)
      })
      .addCase(getCartAsync.rejected, (state, action) => {
        state.status = 'failed'; 
        state.error = action.payload;
      })

      // Add Quantity
      .addCase(addQuantity.fulfilled, (state, action) => {
        const { product_id, quantity } = action.payload;
        const product = state.cart?.products?.find(product => product.productId._id === product_id);
        if (product) {
          product.quantity = quantity; // Update quantity in state
        }
      })
      .addCase(addQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Cart Item
      .addCase(deleteCartAsync.fulfilled, (state, action) => {
        const productId = action.payload;
        state.cart.products = state.cart.products.filter(product => product.productId._id !== productId); 
      })
      .addCase(deleteCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
