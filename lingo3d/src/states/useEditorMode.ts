import store from "@lincode/reactivity"

export type EditorMode =
    | "translate"
    | "rotate"
    | "scale"
    | "select"
    | "mesh"
    | "curve"

export const [setEditorMode, getEditorMode] = store<EditorMode>("translate")
