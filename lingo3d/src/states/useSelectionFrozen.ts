import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { emitSelectionRecompute } from "../events/onSelectionRecompute"

export const [setSelectionFrozen, getSelectionFrozen] = store([
    new Set<Appendable>()
])

export const addSelectionFrozen = (item: Appendable) => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.add(item)
    setSelectionFrozen([frozenSet])
    emitSelectionRecompute()
}

export const clearSelectionFrozen = () => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.clear()
    setSelectionFrozen([frozenSet])
    emitSelectionRecompute()
}
