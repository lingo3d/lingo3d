import { useLayoutEffect } from "preact/hooks"
import settings from "../../api/settings"
import mainCamera from "../../engine/mainCamera"
import { onLoadFile } from "../../events/onLoadFile"
import { setEditorCamera } from "../../states/useEditorCamera"
import { setEditorMounted } from "../../states/useEditorMounted"
import { setOrbitControls } from "../../states/useOrbitControls"
import { setWorldPlay } from "../../states/useWorldPlay"

export default () => {
    useLayoutEffect(() => {
        setEditorCamera(mainCamera)
        setOrbitControls(true)
        setEditorMounted(true)
        setWorldPlay(false)

        settings.gridHelper = true
        const handle = onLoadFile(() => (settings.gridHelper = false))

        return () => {
            setEditorCamera(undefined)
            setOrbitControls(false)
            settings.gridHelper = false
            setEditorMounted(false)
            setWorldPlay(true)

            handle.cancel()
        }
    }, [])
}
