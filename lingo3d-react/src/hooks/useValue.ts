import { useMemoOnce } from "@lincode/hooks"
import store, { GetGlobalState } from "@lincode/reactivity"
import { useLayoutEffect } from "react"

type Options = {
    from?: number | GetGlobalState<number>
    step?: (value: number) => void
    map?: (value: number) => number
}

export default (o?: Options) => {
    const [setValue, getValue] = useMemoOnce(() => {
        const value = typeof o?.from === "function" ? o.from() : o?.from ?? 0
        return store(o?.map?.(value) ?? value)
    })

    useLayoutEffect(() => {
        if (typeof o?.from !== "function") return

        const { map } = o
        if (map) {
            const handle = o.from(v => setValue(map(v)))

            return () => {
                handle.cancel()
            }
        }
        const handle = o.from(setValue)

        return () => {
            handle.cancel()
        }
    }, [])

    useLayoutEffect(() => {
        const step = o?.step
        if (!step) return

        const handle = getValue(step)

        return () => {
            handle.cancel()
        }
    }, [])

    return <const>[getValue as any, setValue]
}