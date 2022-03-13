import { spring, SpringOptions } from "popmotion"
import { useLayoutEffect } from "react"
import { loop } from "lingo3d"
import { Cancellable } from "@lincode/promiselikes"
import useValue from "./useValue"

type Options = SpringOptions & {
    from?: number
    to: number
    step?: (value: number) => void
    delay?: number
}

export default (o: Options | number): any => {
    const { to, from = to, step, delay, ...options } = typeof o === "number" ? ({ to: o } as Options) : o

    const [getValue, setValue] = useValue({ from, step })

    useLayoutEffect(() => {
        const handle = new Cancellable()

        ;(async () => {
            await new Promise(resolve => setTimeout(resolve, delay))
            if (handle.done) return

            const anim = spring({ from: getValue(), to, ...options })
            const time = Date.now()

            handle.watch(loop(() => {
                const { value, done } = anim.next(Date.now() - time)
                setValue(value)
                if (done) {
                    handle.cancel()
                    return
                }
            }))
        })()
        return () => {
            handle.cancel()
        }
    }, [to])

    return getValue
}