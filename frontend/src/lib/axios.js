import axios from "axios"

// export const axiosInstance = axios.create({
//     baseURL:import.meta.env.VITE_BACKEND_URL,
//     withCredentials:true//browser ke cookies ko bhi bhejna (like JWT token)
// })

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // keep this if you're still trying cookies
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});
