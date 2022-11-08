import store from "@lincode/reactivity"
import { getEditorModeComputed } from "./useEditorModeComputed"

export const [setEditorCurve, getEditorCurve] = store(
    getEditorModeComputed() === "curve"
)
getEditorModeComputed((mode) => setEditorCurve(mode === "curve"))
