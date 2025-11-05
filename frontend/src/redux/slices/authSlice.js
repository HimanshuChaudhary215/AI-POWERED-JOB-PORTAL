import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axiosInstance";

export const login = createAsyncThunk("auth/login", async ({ username, password }) => {
  const res = await API.post("/users/login/", { username, password });
  localStorage.setItem("access_token", res.data.access);
  return res.data;
});

export const register = createAsyncThunk("auth/register", async (payload) => {
  const res = await API.post("/users/register/", payload);
  return res.data;
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const res = await API.get("/users/me/");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("access_token") || null, status: "idle", error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (s, a) => { s.token = a.payload.access; s.status = "succeeded"; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.error = a.error.message; s.status = "failed"; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
