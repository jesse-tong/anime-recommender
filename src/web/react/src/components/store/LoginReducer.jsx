import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: false,
    username: '',
}

export const loginSlice = createSlice({
    name: 'loginState',
    initialState,
    reducers: {
        login: (state, action) => {
            state.authenticated = true;
            state.username = action.payload;
        },
        logout: (state) => {
            state.authenticated = false;
            state.username = '';
        }
    }
})

export const { login, logout } = loginSlice.actions
export default loginSlice.reducer