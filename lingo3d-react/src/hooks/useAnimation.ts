import { usePrevious } from "@lincode/hooks"
import { animate, AnimationOptions } from "popmotion"
import { useLayoutEffect, useState } from "react"
import useValue from "./useValue"

type Options = AnimationOptions<number> & {
  from: number
  to: number | Array<number>
  duration?: number
  stopped?: boolean
  step?: (value: number) => void
}

export default ({
  from,
  to,
  duration = 1000,
  stopped,
  step,
  ...options
}: Options): any => {
  const reactive = useValue({ from, step })
  const [r, render] = useState({})
  const rOld = usePrevious(r)
  reactive.restart = () => render({})

  useLayoutEffect(() => {
    if (stopped) return
    const anim = animate({
      from: rOld === r ? reactive.get() : from,
      to,
      duration,
      ...options,
      onUpdate: reactive.set
    })
    return () => {
      anim.stop()
    }
  }, [to, stopped, r])

  return reactive
}
