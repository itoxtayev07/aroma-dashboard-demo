import { Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import { Layout } from "./Layout/Layout"
import { PriveRoute } from "./components"
import { Login, Banners, Notifications, NotFound } from "./pages"

export function App() {
  return <>
    <ToastContainer />
    <Routes>
      <Route element={<PriveRoute />}>
        <Route element={<Layout />}>
          <Route path='/' element={<Banners />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
}
