import { Point3d } from "@lincode/math"
import { scaleDown } from "../../engine/constants"
import { containerBounds } from "../../engine/renderLoop/renderSetup"
import { LingoMouseEvent } from "../../interface/IMouse"
import { getCameraPointerLock } from "../../states/useCameraPointerLock"
import { getCameraRendered } from "../../states/useCameraRendered"
import getWorldPosition from "./getWorldPosition"
import { vector3 } from "./reusables"
import { vec2Point } from "./vec2Point"

export default (ev: { clientX: number; clientY: number }) => {
    const rect = containerBounds[0]
    const clientX = ev.clientX - rect.x
    const clientY = ev.clientY - rect.y

    const distance = 500

    if (getCameraPointerLock())
        return new LingoMouseEvent(
            clientX,
            clientY,
            0,
            0,
            new Point3d(0, 0, 0),
            distance
        )

    const xNorm = (clientX / rect.width) * 2 - 1
    const yNorm = -(clientY / rect.height) * 2 + 1

    const camera = getCameraRendered()
    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)

    const cameraPosition = getWorldPosition(camera)
    vector3.sub(cameraPosition).normalize()
    const vec = cameraPosition.add(vector3.multiplyScalar(distance * scaleDown))

    return new LingoMouseEvent(
        clientX,
        clientY,
        xNorm,
        yNorm,
        vec2Point(vec),
        distance
    )
}
