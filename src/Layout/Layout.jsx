import { Outlet } from "react-router"
import { Menu, Header, CopyrightSection } from "../components"

export function Layout() {
    return <>
        <Menu />
        <section className="pages-wrap w-full max-w-full h-full flex flex-col">
            <Header />
            <Outlet />
            <CopyrightSection />
        </section>
    </>
}

