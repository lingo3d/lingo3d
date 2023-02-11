import { useEffect, useRef } from "preact/hooks"

type Pan = {
    onPanStart?: () => void
    onPan?: () => void
    onPanEnd?: () => void
}

export default ({ onPanStart, onPanEnd, onPan }: Pan = {}) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const handleStart = (e: MouseEvent) => {
            e.stopPropagation()
            onPanStart?.()
        }
        const handleEnd = (e: MouseEvent) => {
            e.stopPropagation()
            onPanEnd?.()
        }
        el.addEventListener("mousedown", handleStart)
        document.addEventListener("mouseup", handleEnd)
        return () => {
            el.removeEventListener("mousedown", handleStart)
            document.removeEventListener("mouseup", handleEnd)
        }
    }, [onPanStart, onPanEnd])

    return elRef
}
