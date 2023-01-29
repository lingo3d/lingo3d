import store, { assign } from "@lincode/reactivity"

const [setEditorPresets, getEditorPresets] = store<Record<string, boolean>>({})
export { getEditorPresets }
export const assignEditorPresets = assign(setEditorPresets, getEditorPresets)
