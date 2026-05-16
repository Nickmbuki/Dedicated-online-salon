import axios from "axios";

const resolveApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined" && window.location.hostname.includes("frontend-production.up.railway.app")) {
    return `${window.location.protocol}//${window.location.hostname.replace("frontend-production", "backend-production")}/api`;
  }

  return "http://localhost:4000/api";
};

export const api = axios.create({
  baseURL: resolveApiUrl(),
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("elegant_beauty_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
