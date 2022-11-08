import store from "@lincode/reactivity"
import { getEditorModeComputed } from "./useEditorModeComputed"

export const [setEditorPlay, getEditorPlay] = store(
    getEditorModeComputed() === "play"
)
getEditorModeComputed((mode) => setEditorPlay(mode === "play"))
