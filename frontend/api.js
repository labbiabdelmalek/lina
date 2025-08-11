// frontend/src/api.js
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://lina-beg1.onrender.com'
    : 'http://localhost:5000';
