
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
       setUser: (state, action) => {
    console.log('Action Payload:', action.payload); // Add this line to see what's being passed
    state.user = action.payload;
    state.isAuthenticated = !!action.payload;
    if (action.payload) {
        console.log('Saving user to localStorage:', action.payload); // Debug storage
        localStorage.setItem("user", JSON.stringify(action.payload));
    } else {
        localStorage.removeItem("user");
    }
},

        logout: (state) => {

            
             document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path="/"'
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;