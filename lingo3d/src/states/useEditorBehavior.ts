import store, { createEffect } from "@lincode/reactivity"
import { appendableRoot } from "../api/core/collections"
import settings from "../api/settings"
import mainCamera from "../engine/mainCamera"
import { onLoadFile } from "../events/onLoadFile"
import { setEditorCamera } from "./useEditorCamera"
import { getEditorCount } from "./useEditorCount"
import { setWorldPlay } from "./useWorldPlay"

export const [setEditorBehavior, getEditorBehavior] = store(false)

getEditorCount((count) => setEditorBehavior(!!count))

createEffect(() => {
    if (!getEditorBehavior()) return

    setEditorCamera(mainCamera)
    setWorldPlay(false)

    settings.grid = ![...appendableRoot].some((item) => {
        const { componentName } = item
        return componentName !== "setup" && componentName !== "defaultSkyLight"
    })
    const handle = onLoadFile(() => (settings.grid = false))

    return () => {
        setEditorCamera(undefined)
        settings.grid = false
        setWorldPlay(true)
        handle.cancel()
    }
}, [getEditorBehavior])
