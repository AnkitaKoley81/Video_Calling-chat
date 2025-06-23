import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true//browser ke cookies ko bhi bhejna (like JWT token)
})