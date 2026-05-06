import { useState, useEffect } from "react"
import { Navigate, Outlet, useNavigate } from "react-router"

export function PriveRoute() {
    const [isOk, setIsOk] = useState(false)
    let token = localStorage.getItem('token')
    let navigate = useNavigate()

    function checkAuth() {
        if (token) {
            setIsOk(true)
            navigate('/')
        } else {
            setIsOk(false)
            navigate('/login')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return isOk ? <Outlet /> : <Navigate to='/login' />
}