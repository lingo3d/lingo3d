import store from "@lincode/reactivity"

export type Mode = "translate" | "rotate" | "scale" | "select"

export const [setEditorMode, getEditorMode] = store<Mode>("translate")
