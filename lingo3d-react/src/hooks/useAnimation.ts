import { animate, AnimationOptions } from "popmotion"
import { useLayoutEffect } from "react"
import useValue from "./useValue"

type Options = AnimationOptions<number> & {
    from: number
    to: number | Array<number>
    duration?: number
    stopped?: boolean
    step?: (value: number) => void
}

export default ({ from, to, duration = 1000, stopped, step, ...options }: Options): any => {
    const [getValue, setValue] = useValue({ from, step })

    useLayoutEffect(() => {
        if (stopped) return
        const anim = animate({ from: getValue(), to, duration, ...options, onUpdate: setValue })

        return () => {
            anim.stop()
        }
    }, [to, stopped])

    return getValue
}