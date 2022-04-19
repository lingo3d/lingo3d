import { Cancellable } from "@lincode/promiselikes"
import { loop } from "lingo3d"
import { spring, SpringOptions } from "popmotion"
import { Ref, ref, watchEffect } from "vue"
import usePrevious from "./usePrevious"
import useValue from "./useValue"

type Options = SpringOptions & {
    from?: number
    to: number | Ref<number>
    step?: (value: number) => void
    delay?: number
}

export default (o: Options | number | Ref<number>) => {
    const { to, from = to, step, delay, ...options } = typeof o === "number" || "value" in o ? ({ to: o } as Options) : o
    const reactive = useValue({ from, step })
    const r = ref({})
    const rOld = usePrevious(r)
    reactive.restart = () => r.value = {}

    watchEffect(onCleanUp => {
        const handle = new Cancellable()
        //@ts-ignore
        const toVal = typeof to === "number" ? to : to.value

        ;(async () => {
            await new Promise(resolve => setTimeout(resolve, delay))
            if (handle.done) return

            const anim = spring({ from: rOld === r ? reactive.get() : from, to: toVal, ...options })
            const time = Date.now()

            handle.watch(loop(() => {
                const { value, done } = anim.next(Date.now() - time)
                reactive.set(value)
                if (done) {
                    handle.cancel()
                    return
                }
            }))
        })()
        onCleanUp(() => {
            handle.cancel()
        })
    })

    return reactive as any
}