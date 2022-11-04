import store, { createEffect } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { onDispose } from "../events/onDispose"

export const [setSelectionFrozen, getSelectionFrozen] = store([
    new Set<Appendable>()
])

export const addSelectionFrozen = (item: Appendable) => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.add(item)
    setSelectionFrozen([frozenSet])
}

export const removeSelectionFrozen = (item: Appendable) => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.delete(item)
    setSelectionFrozen([frozenSet])
}

export const clearSelectionFrozen = () => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.clear()
    setSelectionFrozen([frozenSet])
}

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
