// src/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // now points to Vercel backend

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (data) => api.post("/api/auth/register", data);
export const loginUser = (data) => api.post("/api/auth/login", data);
export const getStaffList = () => api.get("/api/staff");
// ... other endpoints

export default api;
