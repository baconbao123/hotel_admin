import axios from "axios";
import Cookies from "js-cookie";

export const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
});

$axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith("/admin")) {
        Cookies.remove("token");
        window.location.href = "/401";
      }
    } else if (error.response && error.response.status === 403) {
      window.location.href = "/403";
    }
    return Promise.reject(error);
  }
);
