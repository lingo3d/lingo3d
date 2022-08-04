import store from "@lincode/reactivity"
import { getEditorMode } from "./useEditorMode"

const [setEditing, getEditing] = store(false)
export { getEditing }

getEditorMode((mode) => setEditing(mode !== "play"))
