import store, { increase, decrease } from "@lincode/reactivity"

const [setEditorCount, getEditorCount] = store(0)
export { getEditorCount }

export const increaseEditorCount = increase(setEditorCount, getEditorCount)
export const decreaseEditorCount = decrease(setEditorCount, getEditorCount)
