import { useEffect, useRef } from "preact/hooks"
import { handleBlur } from "../../engine/hotkeys"

const stop = (e: Event) => e.stopPropagation()

export default <T extends HTMLElement | SVGSVGElement = HTMLDivElement>() => {
    const elRef = useRef<T>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        el.addEventListener("mousedown", handleBlur)
        el.addEventListener("pointerdown", stop)
        el.addEventListener("touchstart", stop)
        el.addEventListener("keydown", stop)

        return () => {
            el.removeEventListener("mousedown", handleBlur)
            el.removeEventListener("pointerdown", stop)
            el.removeEventListener("touchstart", stop)
            el.removeEventListener("keydown", stop)
        }
    }, [])

    return elRef
}
