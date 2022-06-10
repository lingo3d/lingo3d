import store from "@lincode/reactivity"
import MeshItem from "../display/core/MeshItem"
import { emitSelectionFrozen } from "../events/onSelectionFrozen"

export const [setSelectionFrozen, getSelectionFrozen] = store([new Set<MeshItem>])

export const addSelectionFrozen = (item: MeshItem) => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.add(item)
    setSelectionFrozen([frozenSet])
    emitSelectionFrozen()
}

export const clearSelectionFrozen = () => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.clear()
    setSelectionFrozen([frozenSet])
    emitSelectionFrozen()
}