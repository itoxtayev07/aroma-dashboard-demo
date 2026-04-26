import { Outlet } from "react-router"
import { CopyrightSection } from "../components/CopyrightSection/CopyrightSection"

export function Layout() {
    return <>
        <Outlet />
        <CopyrightSection />
    </>
}


// <section className="pages-wrap w-full max-w-full min-h-full flex flex-col gap-[52px]">
// </section>