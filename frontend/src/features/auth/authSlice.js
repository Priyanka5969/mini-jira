import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/register", data);
    // Store token in localStorage as fallback if cookies are blocked
    if (res.data.token) {
      localStorage.setItem('authToken', res.data.token);
    }
    return res.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data);
    // Store token in localStorage as fallback if cookies are blocked
    if (res.data.token) {
      localStorage.setItem('authToken', res.data.token);
    }
    return res.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.get("/auth/logout");
  // Clear token from localStorage
  localStorage.removeItem('authToken');
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        // Only clear user if it's a 401 (unauthorized), not network errors
        // This prevents clearing user when backend is just down
        if (action.error?.response?.status === 401) {
          state.user = null;
          localStorage.removeItem('authToken');
        }
        // For network errors, keep the user (they might be logged in via cookies)
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default authSlice.reducer;
