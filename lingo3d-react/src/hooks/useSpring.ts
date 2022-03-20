import { spring, SpringOptions } from "popmotion"
import { useLayoutEffect, useState } from "react"
import { loop } from "lingo3d"
import { Cancellable } from "@lincode/promiselikes"
import useValue from "./useValue"
import { usePrevious } from "@lincode/hooks"

type Options = SpringOptions & {
    from?: number
    to: number
    step?: (value: number) => void
    delay?: number
}

export default (o: Options | number): any => {
    const { to, from = to, step, delay, ...options } = typeof o === "number" ? ({ to: o } as Options) : o
    const reactive = useValue({ from, step })
    const [r, render] = useState({})
    const rOld = usePrevious(r)
    reactive.restart = () => render({})

    useLayoutEffect(() => {
        const handle = new Cancellable()

        ;(async () => {
            await new Promise(resolve => setTimeout(resolve, delay))
            if (handle.done) return

            const anim = spring({ from: rOld === r ? reactive.get() : from, to, ...options })
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
        return () => {
            handle.cancel()
        }
    }, [to, r])

    return reactive
}