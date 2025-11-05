import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import AdminPanel from "./pages/AdminPanel";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { fetchMe } from "./redux/slices/authSlice";

function AppInner() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/jobs/:id" element={<JobDetails/>} />
      <Route path="/admin" element={<AdminPanel/>} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInner/>
      </BrowserRouter>
    </Provider>
  );
}
