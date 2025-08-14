// frontend/src/api.js
import axios from "axios";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""),
  withCredentials: true
});

// إذا كان الطلب فيه FormData خليه يضبط Content-Type تلقائياً (مع boundary)
api.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormData) {
    // نحيد أي Content-Type راه Axios غادي يحددو بوحدو
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
});

export default api;
