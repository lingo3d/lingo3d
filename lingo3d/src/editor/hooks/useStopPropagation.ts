import { useEffect, useRef } from "preact/hooks"
import { handleBlur } from "../../engine/hotkeys"
import { DEBUG } from "../../globals"

const stop = (e: Event) => e.stopPropagation()
const stopPrevent = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()
}

export default <T extends HTMLElement | SVGSVGElement = HTMLDivElement>() => {
    const elRef = useRef<T>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        el.addEventListener("mousedown", handleBlur)
        el.addEventListener("click", stop)
        !DEBUG && el.addEventListener("contextmenu", stopPrevent)
        el.addEventListener("pointerdown", stop)
        el.addEventListener("touchstart", stop)
        el.addEventListener("keydown", stop)

        return () => {
            el.removeEventListener("mousedown", handleBlur)
            el.removeEventListener("click", stop)
            el.removeEventListener("contextmenu", stopPrevent)
            el.removeEventListener("pointerdown", stop)
            el.removeEventListener("touchstart", stop)
            el.removeEventListener("keydown", stop)
        }
    }, [])

    return elRef
}
