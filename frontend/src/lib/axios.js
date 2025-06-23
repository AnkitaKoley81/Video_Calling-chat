import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true//browser ke cookies ko bhi bhejna (like JWT token)
})