import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"

export const [setSelectionTarget, getSelectionTarget] = store<
    Appendable | undefined
>(undefined)

import { createEffect } from "@lincode/reactivity"
import { onSceneGraphChange } from "../events/onSceneGraphChange"

export const onSelectionTargetDisposed = (cb: () => void) => {
    createEffect(() => {
        const target = getSelectionTarget()
        if (!target) return

        const handle = onSceneGraphChange(() => {
            target.done && cb()
        })
        return () => {
            handle.cancel()
        }
    }, [getSelectionTarget])
}
