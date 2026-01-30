import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const registerUser = createAsyncThunk("auth/register", async (data) => {
  const res = await api.post("/auth/register", data);
  // Store token in localStorage as fallback if cookies are blocked
  if (res.data.token) {
    localStorage.setItem('authToken', res.data.token);
  }
  return res.data.user;
});

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const res = await api.post("/auth/login", data);
  // Store token in localStorage as fallback if cookies are blocked
  if (res.data.token) {
    localStorage.setItem('authToken', res.data.token);
  }
  return res.data.user;
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
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default authSlice.reducer;
