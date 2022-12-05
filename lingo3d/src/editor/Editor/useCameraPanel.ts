import { last } from "@lincode/utils"
import { useLayoutEffect } from "preact/hooks"
import { FolderApi, Pane } from "../TweakPane/tweakpane"
import mainCamera from "../../engine/mainCamera"
import {
    getSecondaryCamera,
    setSecondaryCamera
} from "../../states/useSecondaryCamera"
import getComponentName from "../utils/getComponentName"
import useSyncState from "../hooks/useSyncState"
import { getCameraList } from "../../states/useCameraList"
import { getCameraStack } from "../../states/useCameraStack"
import { getManager } from "../../api/utils/manager"
import Camera from "../../display/cameras/Camera"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import { Cancellable } from "@lincode/promiselikes"

export default (pane?: Pane, cameraFolder?: FolderApi) => {
    const cameraStack = useSyncState(getCameraStack)
    const camera = last(cameraStack)!
    const cameraList = useSyncState(getCameraList)
    const splitView = useSyncState(getSplitView)

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const cameraSettings = {
            get camera() {
                return cameraList.indexOf(camera)
            },
            set camera(val) {
                getManager<Camera>(cameraList[val]).active = true
            },
            get secondary() {
                return cameraList.indexOf(getSecondaryCamera() ?? mainCamera)
            },
            set secondary(val) {
                setSecondaryCamera(cameraList[val])
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
        const handle = new Cancellable()
        if (splitView) {
            const secondaryInput = cameraFolder.add(
                pane.addInput(cameraSettings, "secondary", { options })
            )
            handle.then(() => secondaryInput.dispose())
        }
        return () => {
            cameraInput.dispose()
            splitInput.dispose()
            handle.cancel()
        }
    }, [pane, cameraFolder, cameraList, camera, splitView])
}
