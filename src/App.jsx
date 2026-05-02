import { Routes, Route } from "react-router"

import { Layout } from "./Layout/Layout"
import { Login, Banners, NotFound } from "./pages"

export function App() {
  return <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path='/' element={<Banners />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
}
