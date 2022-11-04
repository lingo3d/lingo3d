import store, { createEffect } from "@lincode/reactivity"
import { debounceTrailing } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import { onDispose } from "../events/onDispose"

export const [setSelectionFocus, getSelectionFocus] = store<
    Set<Appendable> | undefined
>(undefined)

const tryResetSelectionFocus = debounceTrailing(() => {
    const focus = getSelectionFocus()
    focus && focus.size === 0 && setSelectionFocus(undefined)
})

createEffect(() => {
    const focus = getSelectionFocus()
    if (!focus) return

    const handle = onDispose((item) => {
        if (!focus.has(item)) return
        focus.delete(item)
        tryResetSelectionFocus()
    })
    return () => {
        handle.cancel()
    }
}, [getSelectionFocus])

export const traverseSelectionFocus = (target: Appendable) => {
    const set = new Set<Appendable>()
    set.add(target)
    target.traverse((child) => set.add(child))
    setSelectionFocus(set)
}
