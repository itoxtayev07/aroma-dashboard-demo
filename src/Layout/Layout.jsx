import { Outlet } from "react-router"
import { Menu, Header, CopyrightSection } from "../components"

export function Layout() {
    return <>
        <Menu />
        <section className="pages-wrap w-full max-w-full h-full flex flex-col scroll-auto overflow-y-auto">
            <Header />
            <Outlet />
            <CopyrightSection />
        </section>
    </>
}

