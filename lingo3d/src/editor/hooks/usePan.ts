import { useEffect, useRef } from "preact/hooks"

export default (onStart: () => void, onEnd: () => void) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        el.addEventListener("mousedown", onStart)
        document.addEventListener("mouseup", onEnd)
        return () => {
            el.removeEventListener("mousedown", onStart)
            document.removeEventListener("mouseup", onEnd)
        }
    }, [])

    return elRef
}
