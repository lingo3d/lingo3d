import { useRef, useLayoutEffect } from "react"

export default (effect: () => any, deps: Array<any>) => {
  const effectRef = useRef(effect)
  const depsRef = useRef<Array<any>>()
  const cleanUpRef = useRef<() => void>()

  useLayoutEffect(() => {
    let shouldRun = false

    if (!depsRef.current) shouldRun = true
    else
      for (let i = 0; i < depsRef.current.length; i++)
        if (depsRef.current[i] !== deps[i]) shouldRun = true

    depsRef.current = deps

    if (!shouldRun) return

    cleanUpRef.current?.()
    cleanUpRef.current = effectRef.current()
  })
}
