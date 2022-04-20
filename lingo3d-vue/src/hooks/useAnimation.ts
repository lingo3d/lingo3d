import { AnimationOptions } from "popmotion"
import { Ref } from "vue"

type ToVal = number | Array<number>

//@ts-ignore
interface Options extends AnimationOptions<number> {
    from: number
    to: ToVal | Ref<ToVal>
    duration?: number
    stopped?: boolean
    step?: (value: number) => void
}

export default ({ from, to, duration = 1000, stopped, step, ...options }: Options) => {
    
}