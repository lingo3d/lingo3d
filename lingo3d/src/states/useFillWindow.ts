import store, { createEffect } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { setResolution } from "./useResolution"
import { setViewportSize } from "./useViewportSize"

export const [setFillWindow, getFillWindow] = store(false)

createEffect(() => {
    if (!getFillWindow()) return

    const cb = () => {
        setViewportSize([window.innerWidth, window.innerHeight])
        setResolution([window.innerWidth, window.innerHeight])
    }
    cb()
    
    const cbDebounced = debounce(cb, 100, "trailing")
    window.addEventListener("resize", cbDebounced)

    return () => {
        window.removeEventListener("resize", cbDebounced)
    }
}, [getFillWindow])