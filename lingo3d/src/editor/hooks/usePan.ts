import { useEffect, useRef } from "preact/hooks"

type PanEvent = {
    x: number
    y: number
    deltaX: number
    deltaY: number
}

type Pan = {
    onPanStart?: (e: PanEvent) => void
    onPanEnd?: (e: PanEvent) => void
    onPan?: (e: PanEvent) => void
}

export default ({ onPanStart, onPanEnd, onPan }: Pan = {}) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        let panning = false
        let clientX = 0
        let clientY = 0
        const delta = (e: MouseEvent) => {
            const deltaX = e.clientX - clientX
            const deltaY = e.clientY - clientY
            clientX = e.clientX
            clientY = e.clientY
            return [deltaX, deltaY]
        }
        const handleDown = (e: MouseEvent) => {
            e.stopPropagation()
            panning = true
            clientX = e.clientX
            clientY = e.clientY
            const evt = {
                x: e.clientX,
                y: e.clientY,
                deltaX: 0,
                deltaY: 0
            }
            onPanStart?.(evt)
            onPan?.(evt)
        }
        const handleUp = (e: MouseEvent) => {
            if (!panning) return
            panning = false
            const [deltaX, deltaY] = delta(e)
            const evt = {
                x: e.clientX,
                y: e.clientY,
                deltaX,
                deltaY
            }
            onPan?.(evt)
            onPanEnd?.(evt)
        }
        const handleMove = (e: MouseEvent) => {
            if (!panning) return
            const [deltaX, deltaY] = delta(e)
            onPan?.({
                x: e.clientX,
                y: e.clientY,
                deltaX,
                deltaY
            })
        }

        el.addEventListener("mousedown", handleDown)
        document.addEventListener("mouseup", handleUp)
        document.addEventListener("mousemove", handleMove)
        return () => {
            el.removeEventListener("mousedown", handleDown)
            document.removeEventListener("mouseup", handleUp)
            document.removeEventListener("mousemove", handleMove)
        }
    }, [])

    return elRef
}
