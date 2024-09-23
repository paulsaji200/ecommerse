import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';


export const addAddressAsync = createAsyncThunk(
  'address/addAddressAsync',
  async ({formData}, { rejectWithValue }) => {
    console.log(formData)
    try {
      const response = api.post("/user/addaddress",{data:formData},{withCredentials:true});
      return response.data;  // Return new address
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const updateAddressAsync = createAsyncThunk(
  'address/updateAddressAsync',
  async ({ addressId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/updateaddress/${addressId}`, updatedData, { withCredentials: true });
      return { addressId, updatedData };  // Return updated address data to update state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Thunk for deleting an address
export const deleteAddressAsync = createAsyncThunk(
  'address/deleteAddressAsync',
  async (addressId, { rejectWithValue }) => {
    try {
      await api.delete(`/user/deleteaddress/${addressId}`, { withCredentials: true });
      return addressId;  
    } catch (error) {
    
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);


export const getAddressAsync = createAsyncThunk(
  'address/getAddressAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/getaddresses', { withCredentials: true });
      return response.data;  // Return list of addresses
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],  // Store list of addresses
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get addresses
      .addCase(getAddressAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAddressAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;  // Update state with fetched addresses
      })
      .addCase(getAddressAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add new address
      .addCase(addAddressAsync.fulfilled, (state, action) => {
        state.addresses.push(action.payload);  // Add new address to the list
      })
      .addCase(addAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update address
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        const { addressId, updatedData } = action.payload;
        const existingAddress = state.addresses.find(addr => addr._id === addressId);
        if (existingAddress) {
          Object.assign(existingAddress, updatedData);  // Update the existing address with new data
        }
      })
      .addCase(updateAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete address
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        const addressId = action.payload;
        state.addresses = state.addresses.filter(addr => addr._id !== addressId);  // Remove the deleted address from state
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
