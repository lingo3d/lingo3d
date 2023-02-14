import { useEffect, useRef } from "preact/hooks"

const stop = (e: Event) => e.stopPropagation()

export default <T extends HTMLElement | SVGSVGElement = HTMLDivElement>() => {
    const elRef = useRef<T>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        el.addEventListener("mousedown", stop)
        el.addEventListener("pointerdown", stop)
        el.addEventListener("touchstart", stop)
        el.addEventListener("keydown", stop)

        return () => {
            el.removeEventListener("mousedown", stop)
            el.removeEventListener("pointerdown", stop)
            el.removeEventListener("touchstart", stop)
            el.removeEventListener("keydown", stop)
        }
    }, [])

    return elRef
}
