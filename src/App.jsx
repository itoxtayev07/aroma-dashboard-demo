import { Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import { Layout } from "./Layout/Layout"
import { PriveRoute } from "./components"
import { Login, Home, Notifications, NotificationAdd, NotFound } from "./pages"
import { Banners, BannerView, BannerAdd, BannerEdit } from './pages/Banners'

export function App() {
  return <>
    <ToastContainer />
    <Routes>
      <Route element={<PriveRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path='/banners' element={<Banners />} />
          <Route path='/banners/view/:id' element={<BannerView />} />
          <Route path='/banners/add' element={<BannerAdd />} />
          <Route path='/banners/edit/:id' element={<BannerEdit />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/add" element={<NotificationAdd />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
}
