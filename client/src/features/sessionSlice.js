import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3333/api/sessions/';

const getAuthHeader = (thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

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
            const response = await axios.get(API_URL + `range?startDate=${startDate}&endDate=${endDate}`, config);
            return response.data;
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
        sessions: [], 
        rangedSessions: [],
        isLoading: false,
        isRangeLoading: false,
        isSuccess: false,
        isError: false,
        message: '',
        rangeError: '', 
    },
    reducers: {
        reset: (state) => {
            state.sessions = [];
            state.isLoading = false;
            state.isRangeLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.rangeError = '';
        },
        resetSessions: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.sessions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createDailySessions.pending, (state) => { state.isLoading = true; })
            .addCase(createDailySessions.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; })
            .addCase(createDailySessions.rejected, (state, action) => { state.isLoading = false; state.isError = true; })
            .addCase(getSessionsByDate.pending, (state) => { state.isLoading = true; })
            .addCase(getSessionsByDate.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.sessions = action.payload.sessions; })
            .addCase(getSessionsByDate.rejected, (state, action) => { state.isLoading = false; state.isError = true; })
            .addCase(updateSessionStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSessionStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
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
            .addCase(updateSessionTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSessionTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
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
            .addCase(updateSpecialNote.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSpecialNote.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
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
            .addCase(getSessionsByRange.pending, (state) => {
                state.isRangeLoading = true;
                state.rangeError = '';
            })
            .addCase(getSessionsByRange.fulfilled, (state, action) => {
                state.isRangeLoading = false;
                state.rangedSessions = action.payload.sessions;
            })
            .addCase(getSessionsByRange.rejected, (state, action) => {
                state.isRangeLoading = false;
                state.rangeError = action.payload;
                state.rangedSessions = [];
            });
    },
});


export const { reset, resetSessions } = sessionSlice.actions;
export default sessionSlice.reducer;
