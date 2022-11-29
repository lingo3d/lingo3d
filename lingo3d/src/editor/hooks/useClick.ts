import { useEffect, useRef } from "preact/hooks"

export default (cb?: (e: MouseEvent) => void) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el || !cb) return

        let downTime = 0
        let downX = 0
        let downY = 0

        const handleMouseDown = (e: MouseEvent) => {
            e.stopPropagation()

            downTime = Date.now()
            downX = e.clientX
            downY = e.clientY
        }
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation()

            const upTime = Date.now()

            const deltaTime = upTime - downTime
            const deltaX = Math.abs(e.clientX - downX)
            const deltaY = Math.abs(e.clientY - downY)

            downTime = upTime
            downX = e.clientX
            downY = e.clientY

            deltaTime < 300 && deltaX < 5 && deltaY < 5 && cb(e)
        }
        const handleClick = (e: MouseEvent) => {
            e.stopPropagation()
        }
        el.addEventListener("mousedown", handleMouseDown)
        el.addEventListener("mouseup", handleMouseUp)
        el.addEventListener("click", handleClick)

        return () => {
            el.removeEventListener("mousedown", handleMouseDown)
            el.removeEventListener("mouseup", handleMouseUp)
            el.removeEventListener("click", handleClick)
        }
    }, [])

    return elRef
}
