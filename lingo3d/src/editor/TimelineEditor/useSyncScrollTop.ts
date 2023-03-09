import { useEffect, useRef } from "preact/hooks"
import { signal } from "@preact/signals"

const timelineScrollTopSignal = signal(0)

export default () => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const cb = () => (timelineScrollTopSignal.value = el.scrollTop)
        el.addEventListener("scroll", cb)
        const unsubscribe = timelineScrollTopSignal.subscribe(
            (scrollTop) => (el.scrollTop = scrollTop)
        )
        return () => {
            el.removeEventListener("scroll", cb)
            unsubscribe()
        }
    }, [])

    return ref
}
