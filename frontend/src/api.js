// frontend/src/api.js
import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://lina-beg1.onrender.com" // backend على Render
    : "http://localhost:5000";         // backend local

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // باش الكوكيز ديال JWT تمشي وتجي
  headers: { "Content-Type": "application/json" }
});

export default api;
