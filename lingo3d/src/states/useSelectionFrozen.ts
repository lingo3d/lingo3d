import store, { add, remove, createEffect, clear } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { onDispose } from "../events/onDispose"

const [setSelectionFrozen, getSelectionFrozen] = store([new Set<Appendable>()])
export { getSelectionFrozen }
export const addSelectionFrozen = add(setSelectionFrozen, getSelectionFrozen)
export const removeSelectionFrozen = remove(
    setSelectionFrozen,
    getSelectionFrozen
)
export const clearSelectionFrozen = clear(
    setSelectionFrozen,
    getSelectionFrozen
)

createEffect(() => {
    const [frozenSet] = getSelectionFrozen()
    if (!frozenSet.size) return

    const handle = onDispose((item) => {
        if (!frozenSet.has(item)) return
        frozenSet.delete(item)
        setSelectionFrozen([frozenSet])
    })
    return () => {
        handle.cancel()
    }
}, [getSelectionFrozen])
