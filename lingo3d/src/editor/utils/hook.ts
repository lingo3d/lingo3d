import { GetGlobalState, SetGlobalState } from "@lincode/reactivity"
import useSyncState from "../hooks/useSyncState"

export default <T>(
        setGlobalState: SetGlobalState<T>,
        getGlobalState: GetGlobalState<T>
    ) =>
    () =>
        <const>[useSyncState(getGlobalState), setGlobalState]
