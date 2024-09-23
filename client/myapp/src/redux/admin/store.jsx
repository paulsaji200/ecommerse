// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../admin/Category';
import authSliceReducer from "../user/auth"
import cartSlicereducer from "../user/Cart"
import addressSlice from "../user/address"
const store = configureStore({
  reducer: {
    categories: categoryReducer,
    auth:authSliceReducer,
    cart:cartSlicereducer,
    address:addressSlice
  }
});

export default store;
