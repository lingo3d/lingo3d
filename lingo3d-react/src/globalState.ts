import { useState, useEffect } from "react"
import { store as reactiveStore, GetGlobalState } from "@lincode/reactivity"

const hook =
  <T>(getGlobalState: GetGlobalState<T>) =>
  () => {
    const [state, setState] = useState(() => getGlobalState())

    useEffect(() => {
      const handle = getGlobalState(setState)

      return () => {
        handle.cancel()
      }
    }, [])

    return state
  }

export default <T>(data: T) => {
  const [setGlobalState, getGlobalState] = reactiveStore(data)
  const useGlobalState = hook(getGlobalState)
  return <const>[useGlobalState, setGlobalState, getGlobalState]
}
