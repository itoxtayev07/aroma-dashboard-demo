import { Link } from "react-router"

export function NotFound() {
    return <section className="not-fount-sect w-full max-w-full h-full flex items-center justify-center">
        <div className="w-full max-w-[520px] h-full p-[32px_16px] flex flex-col items-center justify-center">
            <h1 className="h-[178px] text-center flex items-center justify-center text-[160px] mb-[8px] font-bold text-[#b79f7c] opacity-[.9]">404</h1>
            <h3 className="text-[32px] text-[#364a63] text-center font-bold mb-[8px] pb-[16px]">Oops! Why you’re here?</h3>
            <p className="text-[16px] mb-[16px] text-[#526484] text-center">We are very sorry for inconvenience. It looks like you’re try to access a page that either has been deleted or never existed.</p>
            <Link className="mt-[12px] p-[11px_24px] bg-[#b79f7c] text-center rounded-[5px] text-[15px] text-[#FFF] font-bold transition-[.15s] hover:bg-[#9c8769]" to="/">Back To Home</Link>
        </div>
    </section>
}
