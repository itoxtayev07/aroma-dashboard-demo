import { Routes, Route } from "react-router"

import { Layout } from "./Layout/Layout"
import { CopyrightSection } from "./components"
import { Login } from "./pages/Login/Login"

export function App() {
  return <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
      </Route>
    </Routes>
  </>
}
