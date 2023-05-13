import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { setEditorCamera } from "./useEditorCamera"
import { getEditorCount } from "./useEditorCount"
import { setWorldPlay } from "./useWorldPlay"
import { editorBehaviorPtr } from "../pointers/editorBehaviorPtr"

export const [setEditorBehavior, getEditorBehavior] = store(false)

getEditorCount((count) => setEditorBehavior(!!count))

getEditorBehavior((val) => (editorBehaviorPtr[0] = val))

createEffect(() => {
    if (!editorBehaviorPtr[0]) return

    setEditorCamera(mainCamera)
    setWorldPlay(false)

    return () => {
        setEditorCamera(undefined)
        setWorldPlay(true)
    }
}, [getEditorBehavior])
