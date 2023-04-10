import store, { createEffect } from "@lincode/reactivity"
import { onDispose } from "../events/onDispose"
import DummyIK from "../display/DummyIK"

export const [setDummyIK, getDummyIK] = store<DummyIK | undefined>(undefined)

createEffect(() => {
    const dummyIK = getDummyIK()
    if (!dummyIK) return

    const handle = onDispose(
        (item) => item === dummyIK && setDummyIK(undefined)
    )
    return () => {
        handle.cancel()
    }
}, [getDummyIK])
