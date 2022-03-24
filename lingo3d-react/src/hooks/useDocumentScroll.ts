import { useLayoutEffect, useState } from "react"

export default () => {
    const [scroll, setScroll] = useState([window.scrollX, window.scrollY])

    useLayoutEffect(() => {
        const cb = () => setScroll([window.scrollX, window.scrollY])
        document.addEventListener("scroll", cb, { passive: true })
        return () => {
            document.removeEventListener("scroll", cb)
        }
    }, [])

    return scroll
}