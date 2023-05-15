import { useEffect, useRef } from "preact/hooks"
import { stopPropagation } from "../utils/stopPropagation"
import { CLICK_TIME } from "../../globals"

export default (cb?: (e: MouseEvent) => void) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el || !cb) return

        stopPropagation(el)

        let downTime = 0
        let downX = 0
        let downY = 0

        const handleMouseDown = (e: MouseEvent) => {
            downTime = Date.now()
            downX = e.clientX
            downY = e.clientY
        }
        const handleMouseUp = (e: MouseEvent) => {
            const upTime = Date.now()

            const deltaTime = upTime - downTime
            const deltaX = Math.abs(e.clientX - downX)
            const deltaY = Math.abs(e.clientY - downY)

            downTime = upTime
            downX = e.clientX
            downY = e.clientY

            deltaTime < CLICK_TIME && deltaX < 5 && deltaY < 5 && cb(e)
        }
        el.addEventListener("mousedown", handleMouseDown)
        el.addEventListener("mouseup", handleMouseUp)

        return () => {
            el.removeEventListener("mousedown", handleMouseDown)
            el.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    return elRef
}
