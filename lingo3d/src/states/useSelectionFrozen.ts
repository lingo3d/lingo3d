import store, { add, remove, createEffect, clear } from "@lincode/reactivity"
import { selectionFrozenSet } from "../collections/selectionFrozenSet"
import {
    addDisposeCollectionStateSystem,
    deleteDisposeCollectionStateSystem
} from "../systems/eventSystems/disposeCollectionStateSystem"

const [setSelectionFrozen, getSelectionFrozen] = store([selectionFrozenSet])
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
const deleteSelectionFrozen = remove(setSelectionFrozen, getSelectionFrozen)

createEffect(() => {
    if (!selectionFrozenSet.size) return
    addDisposeCollectionStateSystem(selectionFrozenSet, {
        deleteState: deleteSelectionFrozen
    })
    return () => {
        deleteDisposeCollectionStateSystem(selectionFrozenSet)
    }
}, [getSelectionFrozen])
