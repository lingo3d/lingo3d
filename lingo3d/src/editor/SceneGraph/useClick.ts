import { useEffect, useState } from "preact/hooks"

export default (cb: (e: MouseEvent) => void) => {
    const [el, setEl] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!el) return

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

            deltaTime < 300 && deltaX < 5 && deltaY < 5 && cb(e)
        }
        el.addEventListener("mousedown", handleMouseDown)
        el.addEventListener("mouseup", handleMouseUp)

        return () => {
            el.removeEventListener("mousedown", handleMouseDown)
            el.removeEventListener("mouseup", handleMouseUp)
        }
    }, [el])

    return setEl
}