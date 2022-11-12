import { useEffect, useRef } from "preact/hooks"
import { useScrollLeft } from "./states"

export default () => {
    const ref = useRef<HTMLDivElement>(null)
    const [scrollLeft, setScrollLeft] = useScrollLeft()

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const handleScroll = () => setScrollLeft(el.scrollLeft)
        el.addEventListener("scroll", handleScroll)

        return () => {
            el.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        const el = ref.current
        if (el) el.scrollLeft = scrollLeft
    }, [scrollLeft])

    return ref
}
