import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { setEditorCamera } from "./useEditorCamera"
import { getEditorCount } from "./useEditorCount"
import { setWorldPlay } from "./useWorldPlay"

export const [setEditorBehavior, getEditorBehavior] = store(false)

getEditorCount((count) => setEditorBehavior(!!count))

createEffect(() => {
    if (!getEditorBehavior()) return

    setEditorCamera(mainCamera)
    setWorldPlay(false)

    return () => {
        setEditorCamera(undefined)
        setWorldPlay(true)
    }
}, [getEditorBehavior])
