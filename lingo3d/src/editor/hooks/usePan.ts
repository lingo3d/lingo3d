import { useEffect, useRef } from "preact/hooks"
import { stopPropagation } from "../utils/stopPropagation"

export type PanEvent = {
    clientX: number
    clientY: number
    deltaX: number
    deltaY: number
    currentTarget: HTMLDivElement
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

        stopPropagation(el)

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
            panning = true
            const evt = {
                clientX: (clientX = e.clientX),
                clientY: (clientY = e.clientY),
                deltaX: 0,
                deltaY: 0,
                currentTarget: el
            }
            onPanStart?.(evt)
            onPan?.(evt)
        }
        const handleUp = (e: MouseEvent) => {
            if (!panning) return
            panning = false
            const [deltaX, deltaY] = delta(e)
            const evt = {
                clientX,
                clientY,
                deltaX,
                deltaY,
                currentTarget: el
            }
            onPan?.(evt)
            onPanEnd?.(evt)
        }
        const handleMove = (e: MouseEvent) => {
            if (!panning) return
            const [deltaX, deltaY] = delta(e)
            onPan?.({
                clientX,
                clientY,
                deltaX,
                deltaY,
                currentTarget: el
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
