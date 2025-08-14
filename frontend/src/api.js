// frontend/src/api.js
import axios from "axios";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""),
  withCredentials: true
});

// إذا كان FormData، نحيد Content-Type باش يتحدد بوحدو
api.interceptors.request.use((config) => {
  const isFD = typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFD && config.headers) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }
  return config;
});

export default api;
