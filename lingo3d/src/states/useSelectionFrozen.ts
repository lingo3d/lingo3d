import store from "@lincode/reactivity"
import MeshItem from "../display/core/MeshItem"

const [setSelectionFrozen, getSelectionFrozen] = store([new Set<MeshItem>])
export { getSelectionFrozen }

export const addSelectionFrozen = (item: MeshItem) => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.add(item)
    setSelectionFrozen([frozenSet])
}

export const clearSelectionFrozen = () => {
    const [frozenSet] = getSelectionFrozen()
    frozenSet.clear()
    setSelectionFrozen([frozenSet])
}