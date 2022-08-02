import store from "@lincode/reactivity"

export const [setEditorMounted, getEditorMounted] = store(0)

export const increaseEditorMounted = () =>
    setEditorMounted(getEditorMounted() + 1)
export const decreaseEditorMounted = () =>
    setEditorMounted(getEditorMounted() - 1)
