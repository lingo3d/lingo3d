import { GetGlobalState } from "@lincode/reactivity"
import { useLayoutEffect, useMemo } from "react"
import AnimReactive from "./utils/AnimReactive"

type Options = {
  from?: number | GetGlobalState<number>
  step?: (value: number) => void
  map?: (value: number) => number
}

export default (o?: Options) => {
  const reactive = useMemo(() => {
    const value = typeof o?.from === "function" ? o.from() : o?.from ?? 0
    return new AnimReactive(o?.map?.(value) ?? value)
  }, [])

  useLayoutEffect(() => {
    if (typeof o?.from !== "function") return

    const { map } = o
    if (map) {
      const handle = o.from((v) => reactive.set(map(v)))

      return () => {
        handle.cancel()
      }
    }
    const handle = o.from(reactive.set)

    return () => {
      handle.cancel()
    }
  }, [])

  useLayoutEffect(() => {
    const step = o?.step
    if (!step) return

    const handle = reactive.get(step)

    return () => {
      handle.cancel()
    }
  }, [])

  return reactive
}
