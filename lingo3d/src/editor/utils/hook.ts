import { GetGlobalState, SetGlobalState } from "@lincode/reactivity"
import { useState, useEffect } from "preact/hooks"

type UseGlobalState<T> = () => readonly [T, SetGlobalState<T>]

export default <T>(setGlobalState: SetGlobalState<T>, getGlobalState: GetGlobalState<T>) => {
    const useGlobalState: UseGlobalState<T> = () => {
        const [state, setState] = useState(() => getGlobalState())

        useEffect(() => {
            const handle = getGlobalState(setState)
            
            return () => {
                handle.cancel()
            }
        }, [])

        return <const>[state, setGlobalState]
    }
    return useGlobalState
}