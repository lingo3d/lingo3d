import store from "@lincode/reactivity"

type Mode = "translate" | "rotate" | "scale" | "select" | "play"

export const [setEditorMode, getEditorMode] = store<Mode>("play")
