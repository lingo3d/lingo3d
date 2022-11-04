import store, { createEffect } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshItem from "../display/core/MeshItem"
import { onSceneGraphChange } from "../events/onSceneGraphChange"

export const [setSelectionFocus, getSelectionFocus] = store<
    WeakSet<MeshItem> | undefined
>(undefined)

createEffect(() => {
    const focus = getSelectionFocus()
    if (!focus) return

    const handle = onSceneGraphChange(() => {
        //mark
    })
    return () => {
        handle.cancel()
    }
}, [getSelectionFocus])

export const traverseSelectionFocus = (target: Appendable) => {
    const set = new WeakSet<Appendable>()
    set.add(target)
    target.traverse((child) => set.add(child))
    setSelectionFocus(set)
}
