import { Navigate, Outlet } from "react-router"

export function PriveRoute() {
    const token = localStorage.getItem('token')
    return token ? <Outlet /> : <Navigate to='/login' />
}