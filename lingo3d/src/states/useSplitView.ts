import store, { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { getManager } from "../api/utils/manager"
import Camera from "../display/cameras/Camera"
import mainCamera from "../engine/mainCamera"
import mainOrbitCamera from "../engine/mainOrbitCamera"
import { getCameraList } from "./useCameraList"
import { getSecondaryCamera, setSecondaryCamera } from "./useSecondaryCamera"

export const [setSplitView, getSplitView] = store(false)

createEffect(() => {
    if (!getSplitView()) return

    const cameraList = getCameraList()
    let secondaryCam = last(cameraList)!
    if (secondaryCam === mainCamera && cameraList.length > 1)
        secondaryCam = last(cameraList, -2)!

    setSecondaryCamera(secondaryCam)
    mainOrbitCamera.active = true

    return () => {
        setSecondaryCamera(undefined)
        getManager<Camera>(getSecondaryCamera() ?? secondaryCam).active = true
    }
}, [getSplitView])
