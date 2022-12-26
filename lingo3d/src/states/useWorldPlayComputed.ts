import store from "@lincode/reactivity"
import { getEditorModeComputed } from "./useEditorModeComputed"

const [setWorldPlayComputed, getWorldPlayComputed] = store(true)
export { getWorldPlayComputed }

getEditorModeComputed((mode) => setWorldPlayComputed(mode === "play"))
