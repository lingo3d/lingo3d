import { last, omit } from "@lincode/utils"
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

export default (pane?: Pane, cameraFolder?: FolderApi) => {
    const cameraStack = useSyncState(getCameraStack)
    const camera = last(cameraStack)!
    const cameraList = useSyncState(getCameraList)

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
                setSecondaryCamera(val === 0 ? undefined : cameraList[val])
            },
            get split() {
                return getSplitView()
            },
            set split(val) {
                setSplitView(val)
            }
        }

        const mainCameraName = "editor camera"
        const options: Record<string, number> = {}
        let i = 0
        for (const cam of cameraList) {
            options[
                i === 0 ? mainCameraName : getComponentName(getManager(cam))
            ] = i
            ++i
        }
        const input0 = cameraFolder.add(
            pane.addInput(cameraSettings, "camera", { options })
        )
        const input1 = cameraFolder.add(
            pane.addInput(cameraSettings, "secondary", {
                options: {
                    none: 0,
                    ...omit(options, mainCameraName)
                }
            })
        )
        const input2 = cameraFolder.add(pane.addInput(cameraSettings, "split"))

        return () => {
            input0.dispose()
            input1.dispose()
            input2.dispose()
        }
    }, [pane, cameraFolder, cameraList, camera])
}
