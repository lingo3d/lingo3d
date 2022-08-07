import { animate, AnimationOptions } from "popmotion"
import { ref, Ref, watchEffect } from "vue"
import useValue from "./useValue"

type ToVal = number | Array<number>

type Options = AnimationOptions<number> & {
  from: number
  to: ToVal | Ref<ToVal>
  duration?: number
  stopped?: boolean | Ref<boolean>
  step?: (value: number) => void
}

export default ({
  from,
  to,
  duration = 1000,
  stopped,
  step,
  ...options
}: Options) => {
  const reactive = useValue({ from, step })
  const r = ref({})
  let rOld = r
  reactive.restart = () => (r.value = {})

  watchEffect((onCleanUp) => {
    if (typeof stopped === "boolean" ? stopped : stopped?.value) return

    //@ts-ignore
    const toVal = typeof to === "number" || Array.isArray(to) ? to : to.value

    const anim = animate({
      from: rOld === r ? reactive.get() : from,
      to: toVal,
      duration,
      ...options,
      onUpdate: reactive.set
    })

    onCleanUp(() => {
      anim.stop()
    })
  })
  return reactive as any
}
