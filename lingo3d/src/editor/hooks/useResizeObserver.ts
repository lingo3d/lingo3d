import { useState, useLayoutEffect, useRef } from "preact/hooks"

export default (cb?: (width: number, height: number) => void) => {
    const ref = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0
    })

    useLayoutEffect(() => {
        const div = ref.current
        if (!div) return

        const resizeObserver = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = div
            cb?.(clientWidth, clientHeight)
            setSize({ width: clientWidth, height: clientHeight })
        })
        resizeObserver.observe(div)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return <const>[ref, size]
}
