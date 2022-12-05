import { last } from "@lincode/utils"
import { useLayoutEffect } from "preact/hooks"
import { FolderApi, Pane } from "../TweakPane/tweakpane"
import getComponentName from "../utils/getComponentName"
import useSyncState from "../hooks/useSyncState"
import { getCameraList } from "../../states/useCameraList"
import { getCameraStack } from "../../states/useCameraStack"
import { getManager } from "../../api/utils/manager"
import Camera from "../../display/cameras/Camera"

export default (pane?: Pane, cameraFolder?: FolderApi) => {
    const cameraStack = useSyncState(getCameraStack)
    const camera = last(cameraStack)!
    const cameraList = useSyncState(getCameraList)

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const mainCameraName = "editor camera"

        const options = cameraList.reduce<Record<string, any>>(
            (acc, cam, i) => {
                acc[
                    i === 0 ? mainCameraName : getComponentName(getManager(cam))
                ] = i
                return acc
            },
            {}
        )
        const cameraInput = pane.addInput(
            { camera: cameraList.indexOf(camera) },
            "camera",
            { options }
        )
        cameraFolder.add(cameraInput)
        cameraInput.on("change", ({ value }: any) => {
            getManager<Camera>(cameraList[value]).active = true
        })

        const splitViewInput = pane.addInput(
            { "split view": false },
            "split view"
        )
        cameraFolder.add(splitViewInput)
        splitViewInput.on("change", ({ value }: any) => {
            console.log(value)
        })

        return () => {
            cameraInput.dispose()
            splitViewInput.dispose()
        }
    }, [pane, cameraFolder, cameraList, camera])
}
