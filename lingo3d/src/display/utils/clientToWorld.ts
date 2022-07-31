import { scaleDown } from "../../engine/constants"
import { containerBounds } from "../../engine/renderLoop/renderSetup"
import { getCameraRendered } from "../../states/useCameraRendered"
import getWorldPosition from "./getWorldPosition"
import { vector3 } from "./reusables"
import { vec2Point } from "./vec2Point"

export default (clientX: number, clientY: number, distance = 500) => {
    const rect = containerBounds[0]
    clientX -= rect.x
    clientY -= rect.y

    const xNorm = (clientX / rect.width) * 2 - 1
    const yNorm = -(clientY / rect.height) * 2 + 1

    const camera = getCameraRendered()
    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)

    const cameraPosition = getWorldPosition(camera)
    vector3.sub(cameraPosition).normalize()
    const vec = cameraPosition.add(vector3.multiplyScalar(distance * scaleDown))

    return vec2Point(vec)
}
