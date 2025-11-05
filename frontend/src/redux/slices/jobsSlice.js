import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axiosInstance";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await API.get("/jobs/");
  return res.data;
});

export const fetchRecommendations = createAsyncThunk("jobs/fetchRecommendations", async (_, thunkAPI) => {
  const userId = thunkAPI.getState().auth.user?.id;
  const res = await API.get(`/ai/recommend/?user_id=${userId || ""}`);
  return res.data;
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState: { items: [], recs: [], status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchJobs.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(fetchRecommendations.fulfilled, (s, a) => { s.recs = a.payload; });
  },
});

export default jobsSlice.reducer;
