import store, { createEffect } from "@lincode/reactivity"
import { setContainerSize } from "./useContainerSize"
import { setViewportSize } from "./useViewportSize"

export const [setFillWindow, getFillWindow] = store(false)

createEffect(() => {
    if (!getFillWindow()) return

    const cb = () => {
        setViewportSize([window.innerWidth, window.innerHeight])
        setContainerSize([window.innerWidth, window.innerHeight])
    }
    cb()
    window.addEventListener("resize", cb)

    return () => {
        window.removeEventListener("resize", cb)
    }
}, [getFillWindow])