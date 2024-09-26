// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../admin/Category';
import authSliceReducer from "../user/auth"
import cartSlicereducer from "../user/Cart"
import addressSlice from "../user/address"
import productSlice from "../user/getProduct"
import ordersSlice from "../user/getordres"
const store = configureStore({
  reducer: {
    categories: categoryReducer,
    auth:authSliceReducer,
    cart:cartSlicereducer,
    address:addressSlice,
    products:productSlice,
    orders:ordersSlice
  }
});

export default store;
