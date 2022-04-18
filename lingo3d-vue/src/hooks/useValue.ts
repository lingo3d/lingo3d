import { GetGlobalState } from "@lincode/reactivity"
import { watchEffect } from "vue"
import AnimReactive from "./utils/AnimReactive"

type Options = {
    from: number | GetGlobalState<number>
    step?: (value: number) => void
    map?: (value: number) => number
}

export default (o: Options) => {
    const value = typeof o?.from === "function" ? o.from() : o?.from ?? 0
    const reactive = new AnimReactive(o?.map?.(value) ?? value)

    watchEffect(onCleanUp => {
        if (typeof o?.from !== "function") return

        const { map } = o
        if (map) {
            const handle = o.from(v => reactive.set(map(v)))

            return onCleanUp(() => {
                handle.cancel()
            })
        }
        const handle = o.from(reactive.set)

        onCleanUp(() => {
            handle.cancel()
        })
    })

    watchEffect(onCleanUp => {
        const step = o?.step
        if (!step) return

        const handle = reactive.get(step)

        onCleanUp(() => {
            handle.cancel()
        })
    })

    return reactive
}