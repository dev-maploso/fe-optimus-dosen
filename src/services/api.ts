import axios from "axios";

export const api = axios.create({
  // baseURL: "https://optimus.mahadalyploso.com/api/v1",
   baseURL: "http://localhost:8000/api/v1"
});

// Ambil token langsung dari localStorage saja
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
