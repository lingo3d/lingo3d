import store, { createEffect } from "@lincode/reactivity"
import settings from "../api/settings"
import mainCamera from "../engine/mainCamera"
import { onLoadFile } from "../events/onLoadFile"
import { setEditorCamera } from "./useEditorCamera"
import { setOrbitControls } from "./useOrbitControls"
import { setWorldPlay } from "./useWorldPlay"

export const [setEditorMounted, getEditorMounted] = store(false)

createEffect(() => {
    if (!getEditorMounted()) return

    setEditorCamera(mainCamera)
    setOrbitControls(true)
    setWorldPlay(false)

    settings.gridHelper = true
    const handle = onLoadFile(() => (settings.gridHelper = false))

    return () => {
        setEditorCamera(undefined)
        setOrbitControls(false)
        settings.gridHelper = false
        setWorldPlay(true)

        handle.cancel()
    }
}, [getEditorMounted])
