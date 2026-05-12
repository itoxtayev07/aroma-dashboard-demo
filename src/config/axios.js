import axios from "axios";

const isDev = import.meta.env.DEV

export const api = axios.create({
    baseURL: isDev ? "/api" : "https://api.aroma.localhost.uz",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const login = async (username, password) => {
    const response = await api.post("/admin/login", { username, password })
    return response.data
}