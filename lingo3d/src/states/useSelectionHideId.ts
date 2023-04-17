import store, { add, remove, clear } from "@lincode/reactivity"

const [setSelectionHideId, getSelectionHideId] = store([new Set<string>()])
export { getSelectionHideId }
export const addSelectionHideId = add(setSelectionHideId, getSelectionHideId)
export const removeSelectionHideId = remove(
    setSelectionHideId,
    getSelectionHideId
)
export const clearSelectionHideId = clear(
    setSelectionHideId,
    getSelectionHideId
)
