import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users/`;

const getAuthHeader = ({ getState }) => {
    const token = getState()?.auth?.token;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'signup', userData);
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

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (otpData, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'verify-otp', otpData);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
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

export const signin = createAsyncThunk(
    'auth/signin',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'signin', userData);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
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

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
});

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ userId, userData }, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const updates = { ...userData };
            if (!updates.userPassword || updates.userPassword === '') {
                delete updates.userPassword;
            }

            const response = await axios.put(API_URL + `update/${userId}`, updates, config);
            if (response.data.success && response.data.user) {
                const updatedUser = {
                    id: response.data.user._id,
                    name: response.data.user.userName,
                    email: response.data.user.userEmail
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return { ...response.data, updatedUser };
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
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: '',
        isUpdateLoading: false,
        isUpdateSuccess: false,
        isUpdateError: false,
        updateMessage: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.isUpdateLoading = false;
            state.isUpdateSuccess = false;
            state.isUpdateError = false;
            state.updateMessage = '';
        },
        resetUpdateStatus: (state) => {
            state.isUpdateLoading = false;
            state.isUpdateSuccess = false;
            state.isUpdateError = false;
            state.updateMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user; state.token = action.payload.token; state.message = action.payload.message;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; state.user = null; state.token = null;
            })
            .addCase(signin.pending, (state) => {
                state.isLoading = true;

            })
            .addCase(signin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user; state.token = action.payload.token; state.message = action.payload.message;
            })
            .addCase(signin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; state.user = null; state.token = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null; state.token = null; state.isSuccess = false;
                state.message = '';
            })
            .addCase(updateUser.pending, (state) => {
                state.isUpdateLoading = true;
                state.isUpdateSuccess = false;
                state.isUpdateError = false;
                state.updateMessage = '';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isUpdateLoading = false;
                state.isUpdateSuccess = true;
                state.updateMessage = action.payload.message || 'Profile updated successfully!';
                if (action.payload.updatedUser) {
                    state.user = action.payload.updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isUpdateLoading = false;
                state.isUpdateError = true;
                state.updateMessage = action.payload;
            });
    },
});

export const { reset, resetUpdateStatus } = authSlice.actions;
export default authSlice.reducer;