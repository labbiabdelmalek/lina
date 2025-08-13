// frontend/src/api.js
import axios from "axios";

// 🟢 CRA كيقرا غير REACT_APP_*
export const API_URL =
  process.env.REACT_APP_API_URL       // من Render
  || "http://localhost:5000";         // لوكال

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""), // نحيد / فالنهاية باش ماندوزوش //
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export default api;
