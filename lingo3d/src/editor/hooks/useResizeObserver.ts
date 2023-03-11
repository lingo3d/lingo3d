import { useState, useLayoutEffect, useRef } from "preact/hooks"

export default (cb?: () => void) => {
    const ref = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0
    })

    useLayoutEffect(() => {
        const div = ref.current
        if (!div) return

        const resizeObserver = new ResizeObserver(() => {
            setSize({ width: div.offsetWidth, height: div.offsetHeight })
            cb?.()
        })
        resizeObserver.observe(div)

        return () => {
            resizeObserver.disconnect()
        }
    }, [cb])

    return <const>[ref, size]
}
