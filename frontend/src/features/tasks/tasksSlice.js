import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// fetch tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (search = "") => {
    const res = await api.get(`/tasks?search=${search}`);
    return res.data;
  }
);

// create task
export const createTask = createAsyncThunk("tasks/create", async (data) => {
  const res = await api.post("/tasks", data);
  return res.data;
});

// update task
export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
});

// delete task
export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

export const fetchStats = createAsyncThunk(
    "tasks/stats",
    async () => {
      const res = await api.get("/tasks/stats");
      return res.data;
    }
  );
  
  export const fetchLast7Days = createAsyncThunk(
    "tasks/last7days",
    async () => {
      const res = await api.get("/tasks/last7days");
      return res.data;
    }
  );

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    stats: { new: 0, inprogress: 0, completed: 0 },
    last7days: []
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchLast7Days.fulfilled, (state, action) => {
        state.last7days = action.payload;
      });
  }
});

export default tasksSlice.reducer;
