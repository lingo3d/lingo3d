import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"

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
