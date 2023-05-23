import store, { createEffect } from "@lincode/reactivity"
import { getEditorModeComputed } from "./useEditorModeComputed"
import { getEditorRuntime } from "./useEditorRuntime"

const [setWorldPlayComputed, getWorldPlayComputed] = store(true)
export { getWorldPlayComputed }

createEffect(() => {
    setWorldPlayComputed(
        getEditorModeComputed() === "play" && !getEditorRuntime()
    )
}, [getEditorModeComputed, getEditorRuntime])
