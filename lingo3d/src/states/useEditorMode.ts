import store from "@lincode/reactivity"

export type EditorMode =
    | "translate"
    | "rotate"
    | "scale"
    | "select"
    | "mesh"
    | "curve"
    | "joint"

export const [setEditorMode, getEditorMode] = store<EditorMode>("translate")
