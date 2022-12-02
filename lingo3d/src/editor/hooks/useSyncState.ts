import { GetGlobalState } from "@lincode/reactivity"
import { useCallback, useSyncExternalStore } from "preact/compat"

export default <T>(getGlobalState: GetGlobalState<T>) =>
    useSyncExternalStore(
        useCallback((notify) => {
            const handle = getGlobalState(notify)
            return () => {
                handle.cancel()
            }
        }, []),
        useCallback(() => getGlobalState(), [])
    )
