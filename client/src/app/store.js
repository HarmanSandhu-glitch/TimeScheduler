// client/src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import taskReducer from '../features/taskSlice';
import sessionReducer from '../features/sessionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        sessions: sessionReducer,
    },
});