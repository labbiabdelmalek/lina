// frontend/src/api.js
import axios from "axios";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""),
  withCredentials: true
});

// 🔧 مهم: إلا كان الطلب فيه FormData نحيد أي Content-Type
api.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormData && config.headers) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }
  return config;
});

export default api;
