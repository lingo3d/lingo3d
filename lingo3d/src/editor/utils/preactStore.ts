import store, { GetGlobalState, SetGlobalState } from "@lincode/reactivity"
import useSyncState from "../hooks/useSyncState"

const hook =
    <T>(setGlobalState: SetGlobalState<T>, getGlobalState: GetGlobalState<T>) =>
    () =>
        <const>[useSyncState(getGlobalState), setGlobalState]

export default <T>(val: T) => {
    const [setter, getter] = store(val)
    return <const>[hook(setter, getter), setter, getter]
}
