import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './LoginReducer';

export const store = configureStore({
    reducer: {
        loginState: loginReducer,
    },
});
