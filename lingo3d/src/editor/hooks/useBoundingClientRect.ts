import { useState, useLayoutEffect, useRef } from "preact/hooks"

const zeroRect = new DOMRect()

export default () => {
    const ref = useRef<HTMLDivElement>(null)
    const [bounds, setBounds] = useState(zeroRect)

    useLayoutEffect(() => {
        const div = ref.current
        if (!div) return

        const resizeObserver = new ResizeObserver(() =>
            setBounds(div.getBoundingClientRect())
        )
        resizeObserver.observe(div)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return <const>[ref, bounds]
}
