import { CM2M } from "../../globals"
import { getCameraRendered } from "../../states/useCameraRendered"
import getWorldPosition from "./getWorldPosition"
import normalizeClientPosition from "./normalizeClientPosition"
import { vector3 } from "./reusables"
import { vec2Point } from "./vec2Point"

export default (clientX: number, clientY: number, distance = 500) => {
    const [xNorm, yNorm] = normalizeClientPosition(clientX, clientY)

    const camera = getCameraRendered()
    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)

    const cameraPosition = getWorldPosition(camera)
    vector3.sub(cameraPosition).normalize()
    const vec = cameraPosition.add(vector3.multiplyScalar(distance * CM2M))
    return vec2Point(vec)
}
