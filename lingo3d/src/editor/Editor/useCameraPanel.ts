import { useLayoutEffect } from "preact/hooks"
import { FolderApi, Pane } from "../TweakPane/tweakpane"
import getComponentName from "../utils/getComponentName"
import useSyncState from "../hooks/useSyncState"
import { getCameraList } from "../../states/useCameraList"
import { getManager } from "../../api/utils/manager"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import { setEditorCamera } from "../../states/useEditorCamera"
import { getCameraComputed } from "../../states/useCameraComputed"

export default (pane?: Pane, cameraFolder?: FolderApi) => {
    const camera = useSyncState(getCameraComputed)
    const cameraList = useSyncState(getCameraList)
    const splitView = useSyncState(getSplitView)

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const cameraSettings = {
            get camera() {
                return cameraList.indexOf(camera)
            },
            set camera(val) {
                setEditorCamera(cameraList[val])
            },
            get split() {
                return splitView
            },
            set split(val) {
                setSplitView(val)
            }
        }

        const options: Record<string, number> = {}
        let i = 0
        for (const cam of cameraList)
            options[getComponentName(getManager(cam))] = i++

        const cameraInput = cameraFolder.add(
            pane.addInput(cameraSettings, "camera", { options })
        )
        const splitInput = cameraFolder.add(
            pane.addInput(cameraSettings, "split")
        )

        return () => {
            cameraInput.dispose()
            splitInput.dispose()
        }
    }, [pane, cameraFolder, cameraList, camera, splitView])
}
