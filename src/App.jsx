import { Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import { Layout } from "./Layout/Layout"
import { PriveRoute } from "./components"
import {
  Login,
  Home,
  ProfileInfo,
  Banners,
  BannerView,
  BannerAdd,
  BannerEdit,
  Notifications,
  NotificationAdd,
  NotificationEdit,
  NotificationView,
  NotFound
} from "./pages"

export function App() {
  return <>
    <ToastContainer />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PriveRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile-info" element={<ProfileInfo />} />
          <Route path='/banners' element={<Banners />} />
          <Route path='/banners/view/:id' element={<BannerView />} />
          <Route path='/banners/add' element={<BannerAdd />} />
          <Route path='/banners/edit/:id' element={<BannerEdit />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/add" element={<NotificationAdd />} />
          <Route path="/notifications/edit" element={<NotificationEdit />} />
          <Route path="/notifications/view" element={<NotificationView />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
}
