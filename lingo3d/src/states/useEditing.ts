import store from "@lincode/reactivity"
import { getEditorMode } from "./useEditorMode"

export const [setEditing, getEditing] = store(false)

getEditorMode((mode) => setEditing(mode !== "play"))
