import { CM2M } from "../../globals"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import getWorldPosition from "../../memo/getWorldPosition"
import normalizeCanvasPosition from "./normalizeCanvasPosition"
import { vector3 } from "./reusables"
import { vec2Point } from "./vec2Point"

export default (canvasX: number, canvasY: number, distance = 500) => {
    const [xNorm, yNorm] = normalizeCanvasPosition(canvasX, canvasY)

    const [camera] = cameraRenderedPtr
    const cameraPosition = getWorldPosition(camera)

    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)
    vector3.sub(cameraPosition).normalize()

    return vec2Point(
        cameraPosition.add(vector3.multiplyScalar(distance * CM2M))
    )
}
