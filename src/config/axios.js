import axios from "axios";

const isDev = import.meta.env.DEV || import.meta.env.MODE === "production";

export const api = axios.create({
    baseURL: isDev ? "/api" : "https://api.aroma.localhost.uz",
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const login = async (username, password) => {
    const response = await api.post("/admin/login", { username, password })
    console.log("Login response:", response.data)
    console.log("Token:", localStorage.getItem("token"))
    return response.data
}