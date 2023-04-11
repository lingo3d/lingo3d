import { useEffect, useRef } from "preact/hooks"
import { stopPropagation } from "../utils/stopPropagation"

export default (cb?: (e: MouseEvent) => void) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el || !cb) return

        stopPropagation(el)

        el.addEventListener("mousedown", cb)

        return () => {
            el.removeEventListener("mousedown", cb)
        }
    }, [])

    return elRef
}
