import { useEffect, useRef } from "preact/hooks"
import { timelineScrollTopSignal } from "../../states/useTimelineScrollTop"

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
