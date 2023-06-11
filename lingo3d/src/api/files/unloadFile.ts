import { appendableRoot } from "../../collections/appendableRoot"
import { resetMainCameraManager } from "../../engine/mainCameraManager"
import { setFileCurrent } from "../../states/useFileCurrent"

export const unloadFile = () => {
    for (const child of appendableRoot) !child.$disableUnload && child.dispose()
    resetMainCameraManager()
    setFileCurrent(undefined)
}
