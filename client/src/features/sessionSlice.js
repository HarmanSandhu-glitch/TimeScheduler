import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3333/api/sessions/';

// Helper function to get auth header
const getAuthHeader = (thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

// Create daily sessions
export const createDailySessions = createAsyncThunk(
    'sessions/createDaily',
    async (sessionDateData, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const response = await axios.post(API_URL + 'create-daily', sessionDateData, config);
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

// Get sessions by date
export const getSessionsByDate = createAsyncThunk(
    'sessions/getByDate',
    async (date, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const response = await axios.get(API_URL + `date/${date}`, config);
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

// Get sessions by status
export const getSessionsByStatus = createAsyncThunk(
    'sessions/getByStatus',
    async (status, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const response = await axios.get(API_URL + `status/${status}`, config);
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

// Update session status
export const updateSessionStatus = createAsyncThunk(
    'sessions/updateStatus',
    async ({ sessionId, status }, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const response = await axios.put(API_URL + `${sessionId}/status`, { status }, config);
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

// Update session task
export const updateSessionTask = createAsyncThunk(
    'sessions/updateTask',
    async ({ sessionId, taskId }, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const response = await axios.put(API_URL + `${sessionId}/task`, { taskId }, config);
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

// Update special note
export const updateSpecialNote = createAsyncThunk(
    'sessions/updateNote',
    async ({ sessionId, note }, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            const response = await axios.put(API_URL + `${sessionId}/note`, { note }, config);
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

export const getSessionsByRange = createAsyncThunk(
    'sessions/getByRange',
    async ({ startDate, endDate }, thunkAPI) => {
        try {
            const config = getAuthHeader(thunkAPI);
            // Pass dates as query parameters
            const response = await axios.get(API_URL + `range?startDate=${startDate}&endDate=${endDate}`, config);
            return response.data; // Expects { success: true, sessions: [...] }
        } catch (error) {
            const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
const sessionSlice = createSlice({
    name: 'sessions',
    initialState: {
        sessions: [], // Holds sessions for the current day view
        rangedSessions: [], // Holds sessions for the weekly/monthly charts
        isLoading: false,
        isRangeLoading: false, // Separate loading state for range fetching
        isSuccess: false,
        isError: false,
        message: '',
        rangeError: '', // Separate error message for range fetching
    },
    reducers: {
        reset: (state) => {
            // Reset everything *except* maybe rangedSessions if you want to keep them cached
            state.sessions = [];
            // state.rangedSessions = []; // Optionally reset this too
            state.isLoading = false;
            state.isRangeLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.rangeError = '';
        },
        // Keep resetSessions if you still need it specifically
        resetSessions: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            // Maybe reset daily sessions here?
            state.sessions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Existing cases for createDaily, getByDate, updates ---
            .addCase(createDailySessions.pending, (state) => { state.isLoading = true; })
            .addCase(createDailySessions.fulfilled, (state, action) => { /* ... */ state.isLoading = false; state.isSuccess = true; /* ... */ })
            .addCase(createDailySessions.rejected, (state, action) => { /* ... */ state.isLoading = false; state.isError = true; /* ... */ })
            .addCase(getSessionsByDate.pending, (state) => { state.isLoading = true; })
            .addCase(getSessionsByDate.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.sessions = action.payload.sessions; })
            .addCase(getSessionsByDate.rejected, (state, action) => { /* ... */ state.isLoading = false; state.isError = true; /* ... */ })
            // ... cases for updateStatus, updateTask, updateNote ...
            .addCase(updateSessionStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSessionStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update in both arrays if the session exists there
                state.sessions = state.sessions.map((session) => 
                    session._id === action.payload.session._id ? action.payload.session : session
                );
                state.rangedSessions = state.rangedSessions.map((session) => 
                    session._id === action.payload.session._id ? action.payload.session : session
                );
            })
            .addCase(updateSessionStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update session task cases
            .addCase(updateSessionTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSessionTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update the session in the state immediately
                state.sessions = state.sessions.map((session) => 
                    session._id === action.payload.session._id ? action.payload.session : session
                );
                state.rangedSessions = state.rangedSessions.map((session) => 
                    session._id === action.payload.session._id ? action.payload.session : session
                );
            })
            .addCase(updateSessionTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update special note cases
            .addCase(updateSpecialNote.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSpecialNote.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update the session in the state immediately
                state.sessions = state.sessions.map((session) => 
                    session._id === action.payload.session._id ? action.payload.session : session
                );
                state.rangedSessions = state.rangedSessions.map((session) => 
                    session._id === action.payload.session._id ? action.payload.session : session
                );
            })
            .addCase(updateSpecialNote.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // --- NEW Cases for getSessionsByRange ---
            .addCase(getSessionsByRange.pending, (state) => {
                state.isRangeLoading = true;
                state.rangeError = '';
            })
            .addCase(getSessionsByRange.fulfilled, (state, action) => {
                state.isRangeLoading = false;
                state.rangedSessions = action.payload.sessions; // Store fetched range data
            })
            .addCase(getSessionsByRange.rejected, (state, action) => {
                state.isRangeLoading = false;
                state.rangeError = action.payload;
                state.rangedSessions = []; // Clear on error
            });
    },
});


export const { reset, resetSessions } = sessionSlice.actions;
export default sessionSlice.reducer;