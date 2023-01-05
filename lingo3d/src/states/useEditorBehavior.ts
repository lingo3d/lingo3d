import store, { createEffect } from "@lincode/reactivity"
import { appendableRoot } from "../api/core/collections"
import settings from "../api/settings"
import Setup from "../display/Setup"
import mainCamera from "../engine/mainCamera"
import { onLoadFile } from "../events/onLoadFile"
import { setEditorCamera } from "./useEditorCamera"
import { getEditorCount } from "./useEditorCount"
import { setOrbitControls } from "./useOrbitControls"
import { setWorldPlay } from "./useWorldPlay"

export const [setEditorBehavior, getEditorBehavior] = store(false)

getEditorCount((count) => setEditorBehavior(!!count))

createEffect(() => {
    if (!getEditorBehavior()) return

    setEditorCamera(mainCamera)
    setOrbitControls(true)
    setWorldPlay(false)

    settings.gridHelper = ![...appendableRoot].some(
        (item) => !(item instanceof Setup)
    )
    const handle = onLoadFile(() => (settings.gridHelper = false))

    return () => {
        setEditorCamera(undefined)
        setOrbitControls(false)
        settings.gridHelper = false
        setWorldPlay(true)

        handle.cancel()
    }
}, [getEditorBehavior])
