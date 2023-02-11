import { useEffect, useRef } from "preact/hooks"

export default (onStart: () => void, onEnd: () => void) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const handleStart = (e: MouseEvent) => {
            e.stopPropagation()
            onStart()
        }
        const handleEnd = (e: MouseEvent) => {
            e.stopPropagation()
            onEnd()
        }
        el.addEventListener("mousedown", handleStart)
        document.addEventListener("mouseup", handleEnd)
        return () => {
            el.removeEventListener("mousedown", handleStart)
            document.removeEventListener("mouseup", handleEnd)
        }
    }, [])

    return elRef
}
