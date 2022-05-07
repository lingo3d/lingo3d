import { containerBounds } from "../../engine/renderLoop/renderSetup"
import { getCamera } from "../../states/useCamera"
import { getPickingMode } from "../../states/usePickingMode"
import { vector3 } from "./reusables"

export default (ev: { clientX: number, clientY: number }, forceMouse?: boolean) => {
    const rect = containerBounds[0]
    const clientX = ev.clientX - rect.x
    const clientY = ev.clientY - rect.y

    if (getPickingMode() === "camera" && !forceMouse)
        return { x: 0, y: 0, z: 0, clientX, clientY, xNorm: 0, yNorm: 0 }

    const xNorm = (clientX / rect.width) * 2 - 1
    const yNorm = -(clientY / rect.height) * 2 + 1

    const camera = getCamera()
    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)
    vector3.sub(camera.position).normalize()
    const { x, y, z } = camera.position.clone().add(vector3.multiplyScalar(5))

    return { x, y, z, clientX, clientY, xNorm, yNorm }
}